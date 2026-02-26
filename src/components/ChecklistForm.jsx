import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Save, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import PhotoCapture from '@/components/PhotoCapture';
import { supabase } from '@/lib/customSupabaseClient';
import { checklistItems } from '@/lib/checklistData';

const ChecklistForm = ({ os, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0); // <-- corrigido
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [currentPhotoItem, setCurrentPhotoItem] = useState(null);
  const [checklistData, setChecklistData] = useState({});
  const [photos, setPhotos] = useState({});
  const [observations, setObservations] = useState({});
  const [clienteNome, setClienteNome] = useState('');
  const [loading, setLoading] = useState(false);

  
// TIMESTAMP local (para coluna TIMESTAMP sem timezone)
 const nowLocalTimestamp = () => {
   const d = new Date();
   const pad = (n) => String(n).padStart(2, '0');
   return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} `
        + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
 };

  // Itens que queremos sincronizar com o banco
  const itemIds = [
    '1.1','1.2','1.3','1.4','1.5','1.6','1.7',
    '2.1','2.2','2.3','2.4','2.5',
    '3.1','3.2','4.1','4.2',
    '5.1','6.1','6.2','6.3',
    '7.1','8.1','9.1','9.2',
    '10.1','10.2','10.3',
    '11.1','11.2',
    '12.1','12.2','12.3',
    '13.1','14.1','14.2',
    '15.1','15.2','16.1','17.1',
    '18.1','18.2','19.1','19.2','19.3',
    '20.1','20.2','21.1',
    '22.1','22.2','22.3',
    '23.1','24.1','25.1','26.1'
  ];

  // Total de itens do checklist para calcular status de conclusão
  const TOTAL_ITEMS = 54;

  // Mapeamento entre texto no BD e opção selecionada na UI
  const dbResultadoToUI = (r) => {
    if (r === 'Conforme') return 'conforme';
    if (r === 'Não Conforme' || r === 'Não conforme') return 'nao_conforme';
    if (r === 'Não Se Aplica' || r === 'Não se Aplica' || r === 'Não se aplica') return 'nao_aplicavel';
    return undefined;
  };

  const uiResultadoToDB = (v) => {
    if (v === 'conforme') return 'Conforme';
    if (v === 'nao_conforme') return 'Não Conforme';
    if (v === 'nao_aplicavel') return 'Não Se Aplica';
    return null;
  };

  // === ⚠️ Hook no nível do componente (NÃO dentro de funções) ===
  useEffect(() => {
    let cancelado = false;

    const fetchClienteJoin = async () => {
      try {
        if (!os?.numero) return;
        setLoading(true);

        // Join: ordem_servico -> pedidos(cliente_nome)
        // Requer FK ordem_servico.cliente_id -> pedidos.id definida no Supabase
        const { data, error } = await supabase
          .from('ordem_servico')
          .select('numero, pedidos(cliente_nome)')
          .eq('numero', os.numero)
          .single(); // esperamos uma única OS pelo número

        if (error) throw error;

        toast({
            title: 'cliente',
            description: data?.pedidos?.cliente_nome || 'não encontrado',
          });

        const nome = data?.pedidos?.cliente_nome ?? '';
        if (!cancelado) setClienteNome(nome);
      } catch (err) {
        if (!cancelado) {
          setClienteNome('');
          toast({
            title: 'Erro ao buscar cliente',
            description: err?.message ?? 'Falha na consulta.',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    fetchClienteJoin();
    
    const carregarChecklistSeEmProgresso = async () => {
      try {
        if (os?.status !== 'em_progresso' || !os?.id) return;

        const { data, error } = await supabase
          .from('checklist')
          .select('os_id,item_id,resultado,observacao,foto_url,foto_metadata')
          .eq('os_id', os.id)
          .in('item_id', itemIds);

        if (error) throw error;

        const nextChecklistData = {};
        const nextObservations = {};
        const nextPhotos = {};

        (data ?? []).forEach((row) => {
          const id = row.item_id;
          if (!itemIds.includes(id)) return;

          const uiVal = dbResultadoToUI(row.resultado);
          if (uiVal) nextChecklistData[id] = uiVal;

          if (row.observacao) nextObservations[id] = row.observacao;

          if (row.foto_url) {
            let meta = undefined;
            try {
              meta = row.foto_metadata ? JSON.parse(row.foto_metadata) : undefined;
            } catch {
              meta = undefined;
            }
            nextPhotos[id] = { dataUrl: row.foto_url, metadata: meta };
          }
        });

        if (!cancelado) {
          setChecklistData((prev) => ({ ...prev, ...nextChecklistData }));
          setObservations((prev) => ({ ...prev, ...nextObservations }));
          setPhotos((prev) => ({ ...prev, ...nextPhotos }));
          toast({
            title: 'Checklist carregado',
            description: `Itens preenchidos automaticamente para OS #${os.id}.`,
          });
        }
      } catch (err) {
        if (!cancelado) {
          toast({
            title: 'Erro ao carregar checklist',
            description: err?.message ?? 'Falha ao buscar dados.',
            variant: 'destructive',
          });
        }
      }
    };

    carregarChecklistSeEmProgresso();
    return () => { cancelado = true; };
  }, [os?.id, os?.status]);

  const handleItemChange = (itemId, value) => {
    setChecklistData((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleObservationChange = (itemId, value) => {
    setObservations((prev) => ({ ...prev, [itemId]: value }));
  };

  const handlePhotoCapture = (itemId) => {
    setCurrentPhotoItem(itemId);
    setShowPhotoCapture(true);
  };

  const handlePhotoSave = (photoData) => {
    setPhotos((prev) => ({ ...prev, [currentPhotoItem]: photoData }));
    setShowPhotoCapture(false);
    setCurrentPhotoItem(null);
    toast({ title: 'Foto capturada!', description: 'Foto anexada ao item do checklist.' });
  };

  const handleSaveDraft = async () => {
    try {
      const draftEntries = [];

      checklistItems.forEach((category) => {
        category.items.forEach((item) => {
          const rawResultado = checklistData[item.id];
          const rawObs = observations[item.id];
          const photo = photos[item.id];

          const hasResultado = !!rawResultado;
          const hasObs = !!rawObs?.trim();
          const hasPhoto = !!photo;

          if (hasResultado || hasObs || hasPhoto) {
            const resultado = uiResultadoToDB(rawResultado);
            const observacao =
              rawResultado === 'conforme' || rawResultado === 'nao_aplicavel'
                ? ''
                : (typeof rawObs === 'string' ? rawObs.trim() : '');

            const foto_url = photo ? photo.dataUrl : null;
            const foto_metadata = photo ? JSON.stringify(photo.metadata ?? {}) : null;

            draftEntries.push({
              os_id: os.id,
              os_numero: os.numero, // opcional
              item_id: item.id,
              categoria: category.category,
              descricao: item.text,
              resultado,
              observacao,
              foto_url,
              foto_metadata,
              created_at: new Date().toISOString(),
            });
          }
        });
      });

      if (draftEntries.length === 0) {
        toast({
          title: 'Nenhum dado para salvar',
          description: 'Preencha algum item, observação ou foto para salvar um rascunho.'
        });
        return;
      }

      const { error: upsertError } = await supabase
        .from('checklist')
        .upsert(draftEntries, { onConflict: 'os_id,item_id' }); // exige UNIQUE(os_id,item_id)

      if (upsertError) throw upsertError;
  
      const { data: rows, count, error: countError } = await supabase
         .from('checklist')
         .select('*', { count: 'exact' })   // sem head:true
         .eq('os_id', os.id);
         //.in('item_id', itemIds);           // contagem correta


      if (countError) throw countError;

      
      const novoStatus =
      count === TOTAL_ITEMS ? 'concluido' :
      count > 0             ? 'em_progresso' :
                          null;

      if (novoStatus) {
        const updatePayload = { status: novoStatus };

        // Se for concluído, define data_conclusao como agora
        
      if (novoStatus === 'concluido') {
        updatePayload.data_conclusao = nowLocalTimestamp();
      }
        const { error: updateError } = await supabase
          .from('ordem_servico')
          .update(updatePayload)
          .eq('id', os.id);

        if (updateError) throw updateError;
      }

      toast({
        title: 'Rascunho salvo!',
        description: `Salvamos ${draftEntries.length} item(ns). Total na OS: ${count ?? 0}. ${novoStatus ? `Status: ${novoStatus}.` : ''}`
      });
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      toast({
        title: 'Erro ao salvar rascunho',
        description: error?.message ?? 'Não foi possível salvar o rascunho. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleSubmitChecklist = async () => {
    const requiredItems = checklistItems.flatMap((category) =>
      category.items.filter((item) => item.required)
    );
    const missingItems = requiredItems.filter((item) => !checklistData[item.id]);
    let flagStatusConcluido = false;

    if (missingItems.length > 0) {
      toast({
        title: 'Itens obrigatórios pendentes',
        description: `${missingItems.length} itens obrigatórios não foram preenchidos.`,
        variant: 'destructive'
      });
      return;
    } else {
      flagStatusConcluido = true;
    }

  try {
      const checklistEntries = [];

  // ... monta checklistEntries ...

  const { error: upsertError } = await supabase
    .from('checklist')
    .upsert(checklistEntries, { onConflict: 'os_id,item_id' });

  if (upsertError) throw upsertError;

  const count = checklistEntries.length;    

let novoStatus = 'em_progresso';

if (flagStatusConcluido) { novoStatus = 'concluido'; }

  
 if (novoStatus) {
   const updatePayload = { status: novoStatus };

   if (novoStatus === 'concluido') {
     updatePayload.data_conclusao = nowLocalTimestamp();
   }

   const { error: updateError } = await supabase
     .from('ordem_servico')
     .update(updatePayload)
     .eq('id', os.id);

   if (updateError) throw updateError;

   if (novoStatus === 'concluido') {
     const { error: validacaoError } = await supabase
       .from('validacoes')
       .insert({
         os_id: os.id,
         status: 'pendente',
         created_at: new Date().toISOString()
       });

     if (validacaoError) throw validacaoError;
   }
 }

  // Toast de sucesso
  toast({
    title: 'Checklist salvo!',
    description: `Itens: ${count}. Status: ${novoStatus}.`
  });

  onSubmit({
    osId: os.id,
    checklist: checklistData,
    photos,
    timestamp: new Date().toISOString()
  });
} catch (error) {
  console.error('Error saving checklist:', error);
  toast({
    title: 'Erro ao salvar',
    description: error?.message ?? 'Não foi possível salvar.',
    variant: 'destructive'
  });
}
  };

  const currentCategory = checklistItems[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900 sm:bg-black/50 sm:backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 sm:bg-white/10 sm:backdrop-blur-xl rounded-none sm:rounded-2xl p-4 sm:p-6 border-0 sm:border sm:border-white/20 w-full h-full sm:w-full sm:max-w-4xl sm:max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Checklist de Inspeção</h2>
            <p className="text-gray-300 text-sm">
            {os.numero} — Cliente: <strong>{loading ? 'Carregando...' : (clienteNome || 'não encontrado')}</strong></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Progresso</span>
            <span className="text-gray-300 text-sm">
              {currentStep + 1} de {checklistItems.length}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / checklistItems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-4 shrink-0">
          <div className="relative">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {checklistItems.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setCurrentStep(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    currentStep === index
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Category */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 mb-4 overflow-y-auto flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
            {currentCategory.category}
          </h3>

          <div className="space-y-4">
            {currentCategory.items.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-x-2 mb-2">
                      <span className="text-blue-400 font-medium">{item.id}</span>
                      {item.required && (
                        <span className="text-red-400 text-xs font-semibold">OBRIGATÓRIO</span>
                      )}
                      {item.photoRequired && (
                        <span className="text-orange-400 text-xs font-semibold">FOTO</span>
                      )}
                    </div>
                    <p className="text-white text-sm sm:text-base">{item.text}</p>
                  </div>

                  {item.photoRequired && (
                    <Button
                      onClick={() => handlePhotoCapture(item.id)}
                      size="sm"
                      variant="outline"
                      className={`shrink-0 border-white/20 text-white hover:bg-white/10 ${
                        photos[item.id] ? 'bg-green-500/20 border-green-500/40' : ''
                      }`}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      {photos[item.id] ? 'Foto OK' : 'Foto'}
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="conforme"
                        checked={checklistData[item.id] === 'conforme'}
                        onChange={(e) => handleItemChange(item.id, e.target.value)}
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-green-400 text-sm">Conforme</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="nao_conforme"
                        checked={checklistData[item.id] === 'nao_conforme'}
                        onChange={(e) => handleItemChange(item.id, e.target.value)}
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-red-400 text-sm">Não Conforme</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={item.id}
                        value="nao_aplicavel"
                        checked={checklistData[item.id] === 'nao_aplicavel'}
                        onChange={(e) => handleItemChange(item.id, e.target.value)}
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-gray-400 text-sm">N/A</span>
                    </label>
                  </div>

                  {checklistData[item.id] === 'nao_conforme' && (
                    <textarea
                      placeholder="Descreva a não conformidade..."
                      value={observations[item.id] || ''}
                      onChange={(e) => handleObservationChange(item.id, e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      rows={2}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center shrink-0">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Save className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              size="icon"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {currentStep < checklistItems.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Próximo <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitChecklist}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {showPhotoCapture && (
        <PhotoCapture
          onClose={() => setShowPhotoCapture(false)}
          onSave={handlePhotoSave}
          itemId={currentPhotoItem}
        />
      )}
    </div>
  );
};

export default ChecklistForm;
