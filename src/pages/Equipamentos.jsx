import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Equipamentos = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ patrimonio: '', nome: '', validade_anos: '', status: 'disponivel' });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('novo') === 'true') {
      handleOpenForm();
    }
  }, [location.search]);

  const resolveCompanyId = async () => {
    const fromUser = user?.user_metadata?.xid_empresa ?? user?.xid_empresa ?? null;

    if (fromUser) return fromUser;
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('xid_empresa')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('Não foi possível resolver xid_empresa do perfil do usuário.', error);
      return null;
    }

    return data?.xid_empresa ?? null;
  };

  const fetchEquipamentos = async () => {
    setLoading(true);

    const resolvedCompanyId = await resolveCompanyId();
    let query = supabase
      .from('equipamentos')
      .select('*')
      .order('nome', { ascending: true });

    if (resolvedCompanyId) {
      query = query.eq('xid_empresa', resolvedCompanyId);
    }

    const { data, error } = await query;

    if (error) {
      toast({ title: 'Erro ao buscar equipamentos', description: error.message, variant: 'destructive' });
      setEquipamentos([]);
    } else {
      setEquipamentos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const resetForm = () => {
    setFormData({ patrimonio: '', nome: '', validade_anos: '', status: 'disponivel' });
    setEditingEquipamento(null);
  };

  const handleOpenForm = (equipamento = null) => {
    if (equipamento) {
      setEditingEquipamento(equipamento);
      setFormData({
        patrimonio: equipamento.patrimonio || '',
        nome: equipamento.nome || '',
        validade_anos: equipamento.validade_anos ?? '',
        status: equipamento.status || 'disponivel',
      });
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleSaveEquipamento = async (event) => {
    event.preventDefault();

    if (!formData.nome.trim()) {
      toast({ title: 'Nome obrigatório', variant: 'destructive' });
      return;
    }

    const resolvedCompanyId = await resolveCompanyId();

    const payload = {
      patrimonio: formData.patrimonio.trim() || null,
      nome: formData.nome.trim(),
      validade_anos: formData.validade_anos ? Number(formData.validade_anos) : null,
      status: formData.status || 'disponivel',
      xid_empresa: resolvedCompanyId,
    };

    if (editingEquipamento?.id) {
      let updateQuery = supabase
        .from('equipamentos')
        .update(payload)
        .eq('id', editingEquipamento.id);

      if (resolvedCompanyId) {
        updateQuery = updateQuery.eq('xid_empresa', resolvedCompanyId);
      }

      const { error } = await updateQuery;

      if (error) {
        toast({ title: 'Erro ao atualizar equipamento', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Equipamento atualizado com sucesso!' });
    } else {
      const { error } = await supabase
        .from('equipamentos')
        .insert([{ ...payload }]);

      if (error) {
        toast({ title: 'Erro ao cadastrar equipamento', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Equipamento cadastrado com sucesso!' });
    }

    setShowForm(false);
    resetForm();
    await fetchEquipamentos();
  };

  const handleDeleteEquipamento = async (equipamentoId) => {
    const resolvedCompanyId = await resolveCompanyId();

    let query = supabase.from('equipamentos').delete().eq('id', equipamentoId);

    if (resolvedCompanyId) {
      query = query.eq('xid_empresa', resolvedCompanyId);
    }

    const { error } = await query;
    if (error) {
      toast({ title: 'Erro ao deletar equipamento', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Equipamento removido com sucesso!' });
    await fetchEquipamentos();
  };

  const filteredEquipamentos = equipamentos.filter((equipamento) =>
    equipamento.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.patrimonio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Equipamentos</h1>
          <p className="text-gray-300 mt-2">Gerencie os equipamentos cadastrados com inclusão, edição, exclusão e pesquisa.</p>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Equipamento
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou patrimônio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {editingEquipamento ? 'Editar equipamento' : 'Novo equipamento'}
              </h2>
              <p className="text-gray-300 mt-1">Preencha os dados abaixo e salve para manter o cadastro atualizado.</p>
            </div>
            <Button variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>
              Cancelar
            </Button>
          </div>

          <form onSubmit={handleSaveEquipamento} className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col text-sm text-gray-300">
              Patrimônio
              <input
                value={formData.patrimonio}
                onChange={(e) => setFormData((prev) => ({ ...prev, patrimonio: e.target.value }))}
                className="mt-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 12345"
              />
            </label>
            <label className="flex flex-col text-sm text-gray-300 sm:col-span-2">
              Nome
              <input
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                className="mt-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do equipamento"
                required
              />
            </label>
            <label className="flex flex-col text-sm text-gray-300">
              Validade (anos)
              <input
                type="number"
                min="0"
                value={formData.validade_anos}
                onChange={(e) => setFormData((prev) => ({ ...prev, validade_anos: e.target.value }))}
                className="mt-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 2"
              />
            </label>
            <label className="flex flex-col text-sm text-gray-300">
              Status
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="mt-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="disponivel">Disponível</option>
                <option value="em_uso">Em uso</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </label>
            <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Salvar
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Fechar
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/5 rounded-3xl overflow-hidden border border-white/10"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Patrimônio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Validade (anos)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Alocar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-gray-400">Carregando...</td>
                </tr>
              )}
              {!loading && filteredEquipamentos.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-gray-400">Nenhum equipamento encontrado</td>
                </tr>
              )}
              {filteredEquipamentos.map((equipamento) => (
                <tr key={equipamento.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{equipamento.patrimonio || '—'}</td>
                  <td className="px-6 py-4 text-gray-300">{equipamento.nome}</td>
                  <td className="px-6 py-4 text-gray-300">{equipamento.validade_anos ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      equipamento.status === 'disponivel' ? 'bg-green-500/20 text-green-300' :
                      equipamento.status === 'em_uso' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {equipamento.status === 'disponivel' ? 'Disponível' : equipamento.status === 'em_uso' ? 'Em uso' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/equipamentos/alocacao/${equipamento.id}`)}
                      disabled={equipamento.status === 'indisponivel'}
                      className={`${equipamento.status === 'indisponivel' ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title={equipamento.status === 'indisponivel' ? 'Equipamento indisponível' : 'Abrir alocação'}
                    >
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(equipamento)}
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar equipamento?</AlertDialogTitle>
                            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEquipamento(equipamento.id)}
                              className="bg-red-600"
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Equipamentos;
