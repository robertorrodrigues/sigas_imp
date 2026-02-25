
// src/components/ValidationDetails.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, XCircle, MessageSquare, Download, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { generateInspectionReport } from '../utils/generateInspectionReport'; 


const safeText = (v) => {
  if (v == null) return '—';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (typeof v === 'object') {
    if (v.nome) return String(v.nome);
    if (v.name) return String(v.name);
    try {
      return JSON.stringify(v);
    } catch {
      return '—';
    }
  }
  return '—';
};

const ValidationDetails = ({ validation, onClose }) => {
  const [comment, setComment] = useState(validation?.parecer || "");
  const [saving, setSaving] = useState(false);


  const [photoModalUrl, setPhotoModalUrl] = useState(null);

// 🔽 NOVOS ESTADOS PARA O CHECKLIST
  const [checklistItems, setChecklistItems] = useState([]);
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [checklistErr, setChecklistErr] = useState(null);

  // Helper para ordenar item_id "1.1", "1.2", "2.1" corretamente
  const compareItemId = (a, b) => {
    const pa = String(a?.item_id || '').split('.').map(Number);
    const pb = String(b?.item_id || '').split('.').map(Number);
    return (pa[0] - pb[0]) || ((pa[1] || 0) - (pb[1] || 0));
  };

    // Classe de cor para o resultado
  const resultadoClass = (resultado) => {
    const r = (resultado || '').toLowerCase();
    if (r === 'conforme') return 'text-green-400';
    if (r.includes('não conforme') || r.includes('nao conforme')) return 'text-yellow-400'; // segue seu mock
    if (r.includes('não se aplica') || r.includes('nao se aplica')) return 'text-gray-400';
    return 'text-gray-300';
  };

  // 🔽 BUSCA DINÂMICA DOS ITENS DO CHECKLIST
  useEffect(() => {
    if (!validation?.osId) return;
    let cancelled = false;

    const fetchChecklist = async () => {
      try {
        setLoadingChecklist(true);
        setChecklistErr(null);

        const { data, error } = await supabase
          .from('checklist')
          .select('item_id, descricao, resultado, observacao, foto_url')
          .eq('os_id', validation.osId)
          .order('item_id', { ascending: true }); // tenta ordenar no SQL

        if (error) throw error;

        // Segurança extra: ordena também no cliente por "1.1", "1.2", "2.1", etc.
        const sorted = (data ?? []).slice().sort(compareItemId);
        if (!cancelled) setChecklistItems(sorted);
      } catch (e) {
        if (!cancelled) {
          setChecklistErr(e?.message ?? 'Falha ao carregar checklist');
          toast({
            title: 'Erro ao carregar checklist',
            description: e?.message ?? '—',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelled) setLoadingChecklist(false);
      }
    };

    fetchChecklist();
    return () => { cancelled = true; };
  }, [validation?.osId]);

  const handleAction = async (action) => {
    const resultado = action === "approve" ? "Apto" : "Não apto";

    try {
      setSaving(true);

      // pega usuário logado
      const { data: userData } = await supabase.auth.getUser();
      const validatedBy = userData?.user?.id ?? null;

      // - Resultado Array no supabase - 'Apto', 'Apto com restrições', 'Não apto'

      const { error: validacaoError } = await supabase
        .from("validacoes")
        .update({
          resultado,                 // grava o resultado
          parecer: comment.trim(),  // grava o parecer
          status: resultado === "Apto" ? "aprovada" : "rejeitada",
          data_validacao: new Date().toISOString(),
          validador_id: validatedBy
        })
        .eq("id", validation.id);

      if (validacaoError) throw validacaoError;

      // 2) Se Apto → encerra a OS
      if (resultado === "Apto") {
        const { error: osError } = await supabase
          .from("ordem_servico")
          .update({
            status: "encerrado"
            //data_encerramento: new Date().toISOString() // opcional se tiver essa coluna
          })
          .eq("id", validation.osId);

        if (osError) throw osError;
      }

      // 3) Busca o cliente_id da OS (necessário para atualizar o pedido)
  const { data: osRow, error: osFetchError } = await supabase
    .from("ordem_servico")
    .select("cliente_id")
    .eq("id", validation.osId)
    .single();

  if (osFetchError) throw osFetchError;
  if (!osRow?.cliente_id) {
    throw new Error("ordem_servico não possui cliente_id para mapear o pedido.");
  }

  // 4) Atualiza o pedido cujo id = cliente_id da OS
  const { error: pedidoError } = await supabase
    .from("pedidos") 
    .update({
      status: "concluido",
    })
    .eq("id", osRow.cliente_id);

  if (pedidoError) throw pedidoError;


      toast({
        title: `Inspeção ${resultado}!`,
        description: `OS ${validation.osId} foi marcada como ${resultado}.` + (resultado === "Apto" ? " Status da OS: encerrado." : "")
      });

      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao salvar",
        description: err?.message ?? "Falha inesperada.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  
const handleDownloadReport = async () => {
  try {
    // Monte os dados do cabeçalho com o que já existe no componente
    const header = {
      numeroOS: validation?.numero ?? validation?.osId ?? '—',
      nomeCliente: validation?.cliente ?? '—',
      nomeTecnico: validation?.tecnico ?? '—',
      dataConclusao: validation?.dataConclusao ?? null,
    };

    // Você pode deixar a logo no Supabase Storage ou usar um dataURL/base64
    // Exemplo: bucket "assets", arquivo "logo.png" com acesso público
    // const { data } = supabase.storage.from('assets').getPublicUrl('logo.png');
    // const logoUrl = data.publicUrl;
    const logoUrl = '/images/logoSigas.png'; // ajuste conforme necessário

    await generateInspectionReport({
      logoUrl,
      header,
      checklist: checklistItems || [],
    });
  } catch (e) {
    console.error(e);
    toast({
      title: 'Falha ao gerar PDF',
      description: e?.message ?? 'Erro inesperado ao gerar o relatório.',
      variant: 'destructive',
    });
  }
};


  const handleViewPhotos = () => {
    const qty = Array.isArray(validation?.fotos) ? validation.fotos.length : 0;
    if (qty > 0) {
      // Aqui você pode abrir outro modal/galeria. Por enquanto, apenas feedback.
      toast({
        title: `Há ${qty} foto(s) anexada(s).`,
        description: 'Posso implementar uma galeria com zoom/preview no próximo passo.',
      });
    } else {
      toast({
        title: 'Nenhuma foto anexada a esta inspeção.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      
        {photoModalUrl && (
          <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 max-w-3xl w-full">
              
              {/* Botão Fechar */}
              <button
                onClick={() => setPhotoModalUrl(null)}
                className="absolute top-2 right-2 text-white hover:text-red-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Imagem */}
              <img
                src={photoModalUrl}
                alt="Foto do checklist"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />

            </div>
          </div>
        )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Revisão de Inspeção</h2>
            <p className="text-gray-300">
              {safeText(validation?.numero)} - {safeText(validation?.cliente)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Técnico</label>
              <p className="text-white">{safeText(validation?.tecnico)}</p>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Data Conclusão
              </label>
              <p className="text-white">
                {validation?.dataConclusao
                  ? new Date(validation.dataConclusao).toLocaleDateString('pt-BR')
                  : '—'}
              </p>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Resultado</label>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  validation?.resultado === 'Apto'
                    ? 'bg-green-500/20 text-green-300'
                    : validation?.resultado === 'Apto com restrições'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {safeText(validation?.resultado)}
              </span>
            </div>
          </div>

          
    {/* Checklist Review (dinâmico) */}
  <div className="bg-white/5 rounded-xl p-4">
   <h4 className="text-white font-semibold mb-3">Revisão do Checklist</h4>

  {loadingChecklist && (
    <p className="text-gray-400 text-sm">Carregando itens…</p>
  )}

  {checklistErr && (
    <p className="text-red-300 text-sm">{checklistErr}</p>
  )}

  {!loadingChecklist && !checklistErr && (
    <div className="space-y-2 text-sm">
      {checklistItems.map((it) => (
        <div key={it.item_id}>
          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
            <span className="text-white">
              {`${it.item_id} - ${it.descricao || ''}`}
            </span>

            <div className="flex items-center gap-3">
              {/* Resultado com cor dinâmica */}
              <span className={resultadoClass(it.resultado)}>
                {it.resultado || '—'}
              </span>

              {/* Indicador de foto (opcional) */}
              {it.foto_url && (             
                    <button
                      type="button"
                      onClick={() => setPhotoModalUrl(it.foto_url)}
                      className="text-xs text-blue-300 underline hover:text-blue-200"
                      title="Ver foto"
                    >
                      Foto
                    </button>
              )}
            </div>
          </div>

          {/* Observação (se houver) */}
          {it.observacao?.trim() && (
            <div className="p-2 mt-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-300">
                <strong>Observação:</strong> {it.observacao}
              </p>
            </div>
          )}
        </div>
      ))}

      {checklistItems.length === 0 && (
        <p className="text-gray-400">Nenhum item encontrado para esta OS.</p>
      )}
    </div>
  )}
</div>


          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={saving}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório
            </Button>
            {/* <Button
              onClick={handleViewPhotos}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={saving}
            >
              <Camera className="w-4 h-4 mr-2" />
              Ver Fotos ({Array.isArray(validation?.fotos) ? validation.fotos.length : 0})
            </Button> */}
          </div>

          {/* Validation Form */}
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">Parecer Técnico</h4>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adicionar comentários ou justificativa para rejeição..."
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={saving}
            >
              Fechar
            </Button>
            <Button
              onClick={() => handleAction('reject')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              disabled={saving}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
            <Button
              onClick={() => handleAction('approve')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={saving}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>

  );
};

export default ValidationDetails;
