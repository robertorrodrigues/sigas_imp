import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SignatureModal = ({ isOpen, onClose, personType, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    const metadata = {
      w: canvas.width,
      h: canvas.height,
      createdAt: new Date().toISOString(),
    };
    onSave(signatureData, metadata);
    clearSignature();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Assinatura {personType === 'tecnico' ? 'do Técnico' : 'do Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Assine na área abaixo usando o mouse ou touchpad:
          </p>

          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 border-dashed border-white/30 rounded-lg bg-black/30 cursor-crosshair w-full"
          />

          <div className="flex gap-3">
            <Button
              onClick={clearSignature}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Limpar
            </Button>
            <Button
              onClick={saveSignature}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Confirmar
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignatureModal;
