import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Trash2, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import OSDetails from '@/components/OSDetails';
import ChecklistForm from '@/components/ChecklistForm';
import OSList from '@/components/OSList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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

const OSForm = ({ os, onSave, onCancel, tecnicos, clientes }) => {
  const [formData, setFormData] = useState(os || {
    numero: '',
    cliente_id: '',
    endereco: '',
    cidade: '',
    estado: 'SP',
    cep: '',
    tipo_inspecao: 'residencial',
    status: 'pendente',
    data_agendada: '',
    tecnico_id: '',
    descricao: '',
    observacoes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.numero || !formData.endereco || !formData.cidade || !formData.data_agendada) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <input
        type="text"
        name="numero"
        value={formData.numero}
        onChange={handleChange}
        placeholder="Número da OS"
        required
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <select
        name="cliente_id"
        value={formData.cliente_id}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione um cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>{c.cliente_nome}</option>
        ))}
      </select>

      <input
        type="text"
        name="endereco"
        value={formData.endereco}
        onChange={handleChange}
        placeholder="Endereço"
        required
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          required
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          placeholder="UF"
          maxLength="2"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="CEP"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        name="tipo_inspecao"
        value={formData.tipo_inspecao}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="residencial">Residencial</option>
        <option value="comercial">Comercial</option>
        <option value="industrial">Industrial</option>
      </select>

      <input
        type="datetime-local"
        name="data_agendada"
        value={formData.data_agendada}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="tecnico_id"
        value={formData.tecnico_id}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione um técnico</option>
        {tecnicos.map(t => (
          <option key={t.id} value={t.id}>{t.nome}</option>
        ))}
      </select>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pendente">Pendente</option>
        <option value="em_progresso">Em Progresso</option>
        <option value="concluida">Concluída</option>
        <option value="cancelada">Cancelada</option>
        <option value="encerrado">Encerrado</option>
      </select>

      <textarea
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        placeholder="Descrição"
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="observacoes"
        value={formData.observacoes}
        onChange={handleChange}
        placeholder="Observações"
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

const OrdemServico = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [osList, setOsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOS, setEditingOS] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOS, setSelectedOS] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);


  const fetchOS = async () => {
    setLoading(true);
    let query = supabase.from('ordem_servico').select('*');

    if (filterStatus !== 'todos') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query.order('data_agendada', { ascending: false });

    if (error) {
      toast({ title: 'Erro ao buscar OS', description: error.message, variant: 'destructive' });
    } else {
      setOsList(data || []);
    }
    setLoading(false);
  };

  const fetchTecnicos = async () => {
    const { data, error } = await supabase
      .from('tecnico')
      .select('id, nome')
      .eq('status', 'ativo');

    if (!error) {
      setTecnicos(data || []);
    }
  };

  const handleViewOS = (os) => {
    setSelectedOS(os);
  };
  const handleStartInspection = (os) => {
    setSelectedOS(os);
    setShowChecklist(true);
  };



  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, cliente_nome')
      .in('status', ['pendente', 'agendado', 'em_andamento']);

    if (!error) {
      setClientes(data || []);
    }
  };

  useEffect(() => {
    fetchOS();
    fetchTecnicos();
    fetchClientes();
  }, [filterStatus]);

  const handleSaveOS = async (os) => {
    try {
      if (os.id) {
        // atualizar
        const { error } = await supabase
          .from('ordem_servico')
          .update({
            numero: os.numero,
            cliente_id: os.cliente_id,
            endereco: os.endereco,
            cidade: os.cidade,
            estado: os.estado,
            cep: os.cep,
            tipo_inspecao: os.tipo_inspecao,
            status: os.status,
            data_agendada: os.data_agendada,
            tecnico_id: os.tecnico_id,
            descricao: os.descricao,
            observacoes: os.observacoes,
          })
          .eq('id', os.id);

        if (error) {
          toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'OS atualizada com sucesso' });
          setIsDialogOpen(false);
          setEditingOS(null);
          await fetchOS();
        }
      } else {
        // inserir
        const { error } = await supabase
          .from('ordem_servico')
          .insert([{
            numero: os.numero,
            cliente_id: os.cliente_id,
            endereco: os.endereco,
            cidade: os.cidade,
            estado: os.estado,
            cep: os.cep,
            tipo_inspecao: os.tipo_inspecao,
            status: os.status,
            data_agendada: os.data_agendada,
            tecnico_id: os.tecnico_id,
            descricao: os.descricao,
            observacoes: os.observacoes,
            created_by: user?.id,
          }]);

        if (error) {
          toast({ title: 'Erro ao criar OS', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'OS criada com sucesso' });
          setIsDialogOpen(false);
          await fetchOS();
        }
      }
    } catch (err) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeleteOS = async (osId) => {
    const { error } = await supabase.from('ordem_servico').delete().eq('id', osId);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'OS removida' });
      await fetchOS();
    }
  };

  const filteredOS = osList.filter(os =>
    os.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'em_progresso': return <Clock className="w-5 h-5 text-orange-400" />;
      case 'cancelada': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Ordens de Serviço</h1>
          <p className="text-gray-300 mt-1">Gerencie e execute as inspeções técnicas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOS(null)} className="bg-gradient-to-r from-blue-500 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingOS ? 'Editar OS' : 'Nova Ordem de Serviço'}</DialogTitle>
            </DialogHeader>
            <OSForm os={editingOS} onSave={handleSaveOS} tecnicos={tecnicos} clientes={clientes} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número, endereço ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em_progresso">Em Progresso</option>
            <option value="concluido">Concluída</option>
            <option value="cancelada">Cancelada</option>
            <option value="encerrado">Encerrado</option>
          </select>
        </div>
      </motion.div>

      {/* Lista de OS */}

      {/* OS List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <OSList 
                searchTerm={searchTerm} 
                filterStatus={filterStatus}
                onViewOS={handleViewOS}
                onStartInspection={handleStartInspection}
              />
            </motion.div>
      
            {/* Modals */}
            {selectedOS && !showChecklist && (
              <OSDetails 
                os={selectedOS}
                onClose={() => setSelectedOS(null)}
                onStartInspection={() => setShowChecklist(true)}
              />
            )}

{/* Modals */}
      {selectedOS && !showChecklist && (
        <OSDetails 
          os={selectedOS}
          onClose={() => setSelectedOS(null)}
          onStartInspection={() => setShowChecklist(true)}
        />
      )}

      {showChecklist && selectedOS && (
        <ChecklistForm
          os={selectedOS}
          onClose={() => {
            setShowChecklist(false);
            setSelectedOS(null);
          }}
          onSubmit={() => {
            setShowChecklist(false);
            setSelectedOS(null);
            toast({
              title: "Inspeção concluída!",
              description: "Checklist preenchido e enviado para validação.",
            });
          }}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          
        </div>
      </motion.div>
    </div>
  );
};

export default OrdemServico;