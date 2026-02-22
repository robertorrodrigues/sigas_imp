import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Play, MapPin, Calendar, User, Clock, Download, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { generateInspectionReport } from '../utils/generateInspectionReport';
import SignatureModal from './SignatureModal';

const OSList = ({ searchTerm, filterStatus, onViewOS, onStartInspection }) => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [signatureModal, setSignatureModal] = useState(false);
  const [signaturePersonType, setSignaturePersonType] = useState(null);
  const [currentOrdem, setCurrentOrdem] = useState(null);
  const [signatures, setSignatures] = useState({});

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        const { data, error } = await supabase
          .from('ordem_servico')
          .select(`
            id,
            numero,
            status,
            endereco,
            cidade,
            estado,
            data_agendada,
            data_conclusao,
            norma:norma_id(nome),
            tecnico:tecnico_id(nome),
            pedidos:cliente_id(
              cliente_nome
            )
          `);

        if (error) throw error;
        setOrdens(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      agendada: 'bg-blue-500/20 text-blue-300',
      em_andamento: 'bg-purple-500/20 text-purple-300',
      concluida: 'bg-green-500/20 text-green-300',
      validacao: 'bg-orange-500/20 text-orange-300',
      aprovada: 'bg-emerald-500/20 text-emerald-300',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const filteredOrdens = ordens.filter((ordem) => {
    const term = (searchTerm || '').toLowerCase();

    const clienteNome = ordem?.pedidos?.cliente_nome?.toLowerCase() || '';
    const idStr = String(ordem?.id || '').toLowerCase();
    const tecnicoNome = ordem?.tecnico?.nome?.toLowerCase() || '';
    const numeroStr = String(ordem?.numero || '').toLowerCase();

    const matchesSearch =
      term === '' ||
      clienteNome.includes(term) ||
      idStr.includes(term) ||
      tecnicoNome.includes(term) ||
      numeroStr.includes(term);

    const matchesStatus =
      !filterStatus || filterStatus === 'todos' || ordem.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDownloadReport = async (ordem) => {
    try {
      setSaving(true);
      setLoadingChecklist(true);

      // Buscar checklist do Supabase filtrando pela OS
      const { data: checklistData, error: checklistError } = await supabase
        .from('checklist')
        .select('item_id, descricao, resultado, observacao, foto_url')
        .eq('os_id', ordem.id)
        .order('item_id', { ascending: true });

      if (checklistError) throw checklistError;

      const header = {
        numeroOS: ordem?.numero ?? ordem?.id ?? '—',
        nomeCliente: ordem?.pedidos?.cliente_nome ?? '—',
        nomeTecnico: ordem?.tecnico?.nome ?? '—',
        dataConclusao: ordem?.data_conclusao ?? null,
        //norma: ordem?.norma?.nome ?? '—',
      };

      const logoUrl = '/images/logoSigas.png';

      const signaturesToInclude = {
        tecnico: signatures[`${ordem.id}-tecnico`] || null,
        cliente: signatures[`${ordem.id}-cliente`] || null,
      };

      await generateInspectionReport({
        logoUrl,
        header,
        checklist: checklistData || [],
        signatures: signaturesToInclude,
      });

    } catch (e) {
      console.error(e);
      alert(`Falha ao gerar PDF: ${e?.message ?? 'Erro inesperado'}`);
    } finally {
      setSaving(false);
      setLoadingChecklist(false);
    }
  };

  const handleOpenSignatureModal = (ordem, personType) => {
    setCurrentOrdem(ordem);
    setSignaturePersonType(personType);
    setSignatureModal(true);
  };

  const handleSaveSignature = async (signatureData, metadata) => {
    const key = `${currentOrdem.id}-${signaturePersonType}`;
    setSignatures((prev) => ({
      ...prev,
      [key]: signatureData,
    }));

    try {
      // Persistir assinatura na tabela `checklist` como uma linha especial
      const upsertRow = {
        os_id: currentOrdem.id,
        item_id: 'signature',
        os_numero: currentOrdem.numero ?? null,
        categoria: 'Assinaturas',
        descricao: 'Assinaturas do técnico/cliente',
        updated_at: new Date().toISOString(),
      };

      if (signaturePersonType === 'tecnico') {
        upsertRow.img_ass_tec_url = signatureData;
        upsertRow.img_ass_tec_metadata = JSON.stringify(metadata || {});
      } else {
        upsertRow.img_ass_cli_url = signatureData;
        upsertRow.img_ass_cli_metadata = JSON.stringify(metadata || {});
      }

      const { error: upsertError } = await supabase
        .from('checklist')
        .upsert(upsertRow, { onConflict: 'os_id,item_id' });

      if (upsertError) throw upsertError;

      toast({ title: 'Assinatura salva', description: 'Assinatura persistida no banco.' });
    } catch (err) {
      console.error('Erro ao salvar assinatura:', err);
      toast({ title: 'Erro', description: err?.message ?? 'Falha ao salvar assinatura', variant: 'destructive' });
    }
  };

  const getSignatureStatus = (ordem) => {
    const tecnicoKey = `${ordem.id}-tecnico`;
    const clienteKey = `${ordem.id}-cliente`;
    const hasTecnico = !!signatures[tecnicoKey];
    const hasCliente = !!signatures[clienteKey];
    return { hasTecnico, hasCliente };
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return '—';
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden p-6">
        <p className="text-white">Carregando ordens de serviço...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden p-6">
        <p className="text-red-400">Erro ao carregar ordens de serviço: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-xl font-semibold text-white">
          Ordens de Serviço ({filteredOrdens.length})
        </h3>
      </div>

      <div className="divide-y divide-white/10">
        {filteredOrdens.map((ordem, index) => (
          <motion.div
            key={ordem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-white/5 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-blue-400 font-medium">{ordem.numero}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      ordem.status
                    )}`}
                  >
                    {String(ordem.status || '').replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-300">
                    Norma - {ordem.norma?.nome ?? '48'}
                  </span>
                </div>

                <h4 className="text-white font-semibold text-lg mb-2">
                  Cliente - {ordem.pedidos?.cliente_nome ?? '—'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {ordem.endereco}, {ordem.cidade}, {ordem.estado}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {ordem.tecnico?.nome ?? '—'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(ordem.data_agendada)}
                    </div>

                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(ordem.data_agendada)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  onClick={() => onViewOS(ordem)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {ordem.status === 'concluido' && (
                  <>
                    <Button
                      onClick={() => handleOpenSignatureModal(ordem, 'tecnico')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                      title={
                        getSignatureStatus(ordem).hasTecnico
                          ? '✓ Assinado pelo Técnico'
                          : 'Assinatura do Técnico'
                      }
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      {getSignatureStatus(ordem).hasTecnico ? '✓ Técnico' : 'Técnico'}
                    </Button>

                    <Button
                      onClick={() => handleOpenSignatureModal(ordem, 'cliente')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                      title={
                        getSignatureStatus(ordem).hasCliente
                          ? '✓ Assinado pelo Cliente'
                          : 'Assinatura do Cliente'
                      }
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      {getSignatureStatus(ordem).hasCliente ? '✓ Cliente' : 'Cliente'}
                    </Button>

                    <Button
                      onClick={() => handleDownloadReport(ordem)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                      disabled={saving}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Relatório
                    </Button>
                  </>
                )}

                {(ordem.status === 'em_progresso' || ordem.status === 'pendente') && (
                  <Button
                    onClick={() => onStartInspection(ordem)}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {ordem.status === 'agendada' ? 'Iniciar' : 'Continuar'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrdens.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-400">
            Nenhuma ordem de serviço encontrada com os filtros aplicados.
          </p>
        </div>
      )}

      <SignatureModal
        isOpen={signatureModal}
        onClose={() => setSignatureModal(false)}
        personType={signaturePersonType}
        onSave={handleSaveSignature}
      />
    </div>
  );
};

export default OSList;