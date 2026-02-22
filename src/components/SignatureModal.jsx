import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Componente Canvas com suporte total a mobile (Pointer Events + dpr + foco)
function SignatureCanvas({ onReadyFocusRef, onChange }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const [isEmpty, setIsEmpty] = useState(true);

  // expõe o canvasRef para o Modal focar quando abrir
  useEffect(() => {
    if (onReadyFocusRef) onReadyFocusRef.current = canvasRef.current;
  }, [onReadyFocusRef]);

  const resizeCanvasToDPR = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const rect = wrapper.getBoundingClientRect();

    // tamanho "CSS"
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // tamanho real do buffer
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // fundo branco dentro do canvas (ótimo para PDF)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }, []);

  useLayoutEffect(() => {
    resizeCanvasToDPR();
    const onResize = () => resizeCanvasToDPR();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeCanvasToDPR]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = ('touches' in e && e.touches?.[0]) || ('changedTouches' in e && e.changedTouches?.[0]) || e;
    const x = (point.clientX ?? point.pageX) - rect.left;
    const y = (point.clientY ?? point.pageY) - rect.top;
    return { x, y };
  };

  const start = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e);
    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#111827'; // slate-900
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e);
    const { x: lx, y: ly } = lastPointRef.current;

    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
    setIsEmpty(false);
    onChange?.(false);
  };

  const end = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    isDrawingRef.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // limpar e refazer fundo branco
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setIsEmpty(true);
    onChange?.(true);
  };

  // expõe utils via propriedade do DOM se quiser acessar de fora (opcional)
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.__clearSignature = clear;
  }, []);

  return (
    <div className="w-full select-none" onContextMenu={(e) => e.preventDefault()}>
      <div
        ref={wrapperRef}
        className="w-full h-56 sm:h-64 md:h-72 border border-slate-300 rounded-lg overflow-hidden bg-white"
      >
        <canvas
          ref={canvasRef}
          // Acessibilidade + foco
          tabIndex={0}
          aria-label="Área para assinatura"
          role="img"
          // Evita scroll/zoom tocar-desenhar
          style={{ touchAction: 'none', display: 'block' }}
          className="w-full h-full"
          // Pointer events (funciona em mouse/touch/caneta)
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
          // Extra para browsers que ainda usam touch/mouse separados
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Button variant="secondary" onClick={() => canvasRef.current?.__clearSignature?.()}>
          Limpar
        </Button>
        <span className="text-xs text-slate-500">{/* dica visual */}</span>
      </div>
    </div>
  );
}

export default function SignatureModal({ isOpen, onClose, personType, onSave }) {
  const canvasFocusRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Quando abrir, focar o canvas
  useEffect(() => {
    if (isOpen) {
      // pequeno timeout ajuda no iOS após a animação do modal
      setTimeout(() => {
        canvasFocusRef.current?.focus?.();
        canvasFocusRef.current?.scrollIntoView?.({ block: 'center' });
      }, 50);
    }
  }, [isOpen]);

  const handleSave = () => {
    const canvas = canvasFocusRef.current;
    if (!canvas) return;
    // Garante PNG com fundo branco
    const dataUrl = canvas.toDataURL('image/png'); 
    const metadata = {
      at: new Date().toISOString(),
      ua: navigator.userAgent,
      w: canvas.width,
      h: canvas.height,
      personType,
    };
    onSave?.(dataUrl, metadata);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose?.() : null)}>
      {/* Backdrop claro */}
      <DialogOverlay className="bg-white/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />

      <DialogContent
        // Conteúdo com fundo branco
        className="sm:max-w-lg w-[95vw] p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
        // Foco inicial no canvas (Radix/shadcn)
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          canvasFocusRef.current?.focus?.();
        }}
      >
        <DialogHeader className="px-5 pt-4 pb-2 border-b border-slate-200 bg-slate-50">
          <DialogTitle className="text-slate-900">
            Assinatura {personType === 'tecnico' ? 'do Técnico' : 'do Cliente'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <p className="text-sm text-slate-600 mb-3">
            Assine abaixo com o dedo ou caneta. Evite gestos de rolagem dentro da área branca.
          </p>

          <SignatureCanvas
            onReadyFocusRef={canvasFocusRef}
            onChange={(empty) => setIsEmpty(empty)}
          />

          <div className="mt-5 flex items-center justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isEmpty}>
              Salvar Assinatura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
``