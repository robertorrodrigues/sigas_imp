import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, UserCheck, UserX, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import TechnicianList from '@/components/TechnicianList';
import TechnicianForm from '@/components/TechnicianForm';
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
} from "@/components/ui/alert-dialog";

const Tecnicos = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTecnico, setEditingTecnico] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTecnicos = async () => {
    setLoading(true);
    let query = supabase.from('tecnico').select('*');

    if (filterStatus !== 'todos') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query.order('nome', { ascending: true });

    if (error) {
      toast({ title: 'Erro ao buscar técnicos', description: error.message, variant: 'destructive' });
      setTecnicos([]);
    } else {
      setTecnicos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTecnicos();
  }, [filterStatus]);

  const handleSaveTecnico = async (formData) => {
    try {
      if (editingTecnico?.id) {
        // Atualizar técnico
        const { error } = await supabase
          .from('tecnico')
          .update({
            nome: formData.nome,
            cpf: formData.cpf,
            email: formData.email,
            telefone: formData.telefone,
            especialidade: formData.especialidade,
            crea_numero: formData.crea_numero,
            crea_uf: formData.uf,
            crea_validade: formData.crea_validade,
            status: formData.status,
            data_atualizacao: new Date().toISOString(),
          })
          .eq('id', editingTecnico.id);

        if (error) {
          toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Técnico atualizado com sucesso!' });
          setShowForm(false);
          setEditingTecnico(null);
          await fetchTecnicos();
        }
      } else {
        // Criar novo técnico
        const { error } = await supabase
          .from('tecnico')
          .insert([{
            nome: formData.nome,
            cpf: formData.cpf.replace(/\D/g, ''), // remove ., -, espaço etc.
            email: formData.email,
            telefone: formData.telefone,
            especialidade: formData.especialidade,
            crea_numero: formData.crea_numero,
            crea_uf: formData.uf,
            crea_validade: formData.crea_validade,
            status: 'ativo',
            data_admissao: new Date().toISOString().split('T')[0],
            criado_por: user?.id,
          }]);

        if (error) {
          toast({ title: 'Erro ao criar técnico', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Técnico cadastrado com sucesso!' });
          setShowForm(false);
          setEditingTecnico(null);
          await fetchTecnicos();
        }
      }
    } catch (err) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeleteTecnico = async (tecnicoId) => {
    const { error } = await supabase.from('tecnico').delete().eq('id', tecnicoId);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Técnico removido' });
      await fetchTecnicos();
    }
  };

  const stats = {
    total: tecnicos.length,
    ativos: tecnicos.filter(t => t.status === 'ativo').length,
    credenciaisvencendo: tecnicos.filter(t => {
      if (!t.crea_validade) return false;
      const vencimento = new Date(t.crea_validade);
      const hoje = new Date();
      const dias = Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));
      return dias > 0 && dias <= 30;
    }).length,
  };

  const filteredTecnicos = tecnicos.filter(tecnico =>
    tecnico.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tecnico.cpf?.includes(searchTerm) ||
    tecnico.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Técnicos</h1>
          <p className="text-gray-300 mt-2">Gerencie a equipe técnica e credenciais</p>
        </div>
        <Button
          onClick={() => {
            setEditingTecnico(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Técnico
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total de Técnicos</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Ativos</p>
              <p className="text-2xl font-bold text-white">{stats.ativos}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Credenciais Vencendo</p>
              <p className="text-2xl font-bold text-white">{stats.credenciaisvencendo}</p>
            </div>
            <UserX className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Taxa de Atividade</p>
              <p className="text-2xl font-bold text-white">{stats.total > 0 ? ((stats.ativos / stats.total) * 100).toFixed(0) : 0}%</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Técnicos Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CPF</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Especialidade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CREA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && (
                <tr><td colSpan="7" className="px-6 py-4 text-gray-400">Carregando...</td></tr>
              )}
              {!loading && filteredTecnicos.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-4 text-gray-400">Nenhum técnico encontrado</td></tr>
              )}
              {filteredTecnicos.map(tecnico => (
                <tr key={tecnico.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{tecnico.nome}</td>
                  <td className="px-6 py-4 text-gray-300">{tecnico.cpf}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{tecnico.email}</td>
                  <td className="px-6 py-4 text-gray-300">{tecnico.especialidade || '—'}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {tecnico.crea_numero ? `${tecnico.crea_numero}/${tecnico.crea_uf}` : '—'}
                    {tecnico.crea_validade && (
                      <span className={`ml-2 text-xs ${
                        new Date(tecnico.crea_validade) < new Date() ? 'text-red-400' :
                        new Date(tecnico.crea_validade) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        ({new Date(tecnico.crea_validade).toLocaleDateString()})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tecnico.status === 'ativo' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {tecnico.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTecnico(tecnico);
                          setShowForm(true);
                        }}
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
                            <AlertDialogTitle>Deletar Técnico?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTecnico(tecnico.id)} className="bg-red-600">Deletar</AlertDialogAction>
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

      {/* Modal */}
      {showForm && (
        <TechnicianForm 
          tecnico={editingTecnico}
          onClose={() => {
            setShowForm(false);
            setEditingTecnico(null);
          }}
          onSubmit={handleSaveTecnico}
        />
      )}
    </div>
  );
};

export default Tecnicos;