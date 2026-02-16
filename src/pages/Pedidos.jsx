import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import PedidoForm from '@/components/PedidoForm';
import PedidosList from '@/components/PedidosList';
import ExcelUpload from '@/components/ExcelUpload';
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

const Pedidos = () => {
  const [showForm, setShowForm] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPedidos = async () => {
    setLoading(true);
    let query = supabase.from('pedidos').select('*');

    if (filterStatus !== 'todos') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query.order('data_criacao', { ascending: false });

    if (error) {
      toast({ title: 'Erro ao buscar pedidos', description: error.message, variant: 'destructive' });
      setPedidos([]);
    } else {
      setPedidos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPedidos();
  }, [filterStatus]);

  const handleExcelUpload = (file) => {
    toast({
      title: "Upload realizado!",
      description: `Arquivo ${file.name} processado com sucesso.`,
    });
    setShowExcelUpload(false);
  };

  const handleSavePedido = async (formData) => {
    try {
      if (editingPedido?.id) {
        // Atualizar pedido existente
        const { error } = await supabase
          .from('pedidos')
          .update({
            numero: formData.numero,
            cliente_nome: formData.cliente,
            tipo: formData.tipo,
            endereco: formData.endereco,
            cidade: formData.cidade,
            cep: formData.cep,
            contato: formData.contato,
            email: formData.email,
            telefone: formData.telefone,
            prioridade: formData.prioridade,
            status: formData.status,
            observacoes: formData.observacoes,
            data_atualizacao: new Date().toISOString(),
          })
          .eq('id', editingPedido.id);

        if (error) {
          toast({ title: 'Erro ao atualizar pedido', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Pedido atualizado com sucesso!' });
          setShowForm(false);
          setEditingPedido(null);
          await fetchPedidos();
        }
      } else {
        // Criar novo pedido
        const numeroSequencial = String(Math.floor(Math.random() * 100000)).padStart(6, '0');
        const numeroOS = `PED-${new Date().getFullYear()}-${numeroSequencial}`;

        const { error } = await supabase
          .from('pedidos')
          .insert([{
            numero: numeroOS,
            cliente_nome: formData.cliente,
            tipo: formData.tipo,
            endereco: formData.endereco,
            cidade: formData.cidade,
            cep: formData.cep,
            contato: formData.contato,
            email: formData.email,
            telefone: formData.telefone,
            prioridade: formData.prioridade,
            status: 'pendente',
            observacoes: formData.observacoes,
            criado_por: user?.id,
          }]);

        if (error) {
          toast({ title: 'Erro ao criar pedido', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Pedido criado com sucesso!', description: `Número: ${numeroOS}` });
          setShowForm(false);
          setEditingPedido(null);
          await fetchPedidos();
        }
      }
    } catch (err) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeletePedido = async (pedidoId) => {
    const { error } = await supabase.from('pedidos').delete().eq('id', pedidoId);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Pedido removido' });
      await fetchPedidos();
    }
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.numero?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Pedidos de Inspeção</h1>
          <p className="text-gray-300 mt-1">Gerencie todos os pedidos de inspeção</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button
            onClick={() => setShowExcelUpload(true)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Importar Excel</span>
            <span className="sm:hidden">Importar</span>
          </Button>
          <Button
            onClick={() => {
              setEditingPedido(null);
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
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
                placeholder="Buscar por cliente, endereço, número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="agendado">Agendado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Pedidos Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Número</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Endereço</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Prioridade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && (
                <tr><td colSpan="7" className="px-6 py-4 text-gray-400">Carregando...</td></tr>
              )}
              {!loading && filteredPedidos.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-4 text-gray-400">Nenhum pedido encontrado</td></tr>
              )}
              {filteredPedidos.map(pedido => (
                <tr key={pedido.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{pedido.numero}</td>
                  <td className="px-6 py-4 text-gray-300">{pedido.cliente_nome}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize">{pedido.tipo}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{pedido.endereco}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pedido.status === 'concluido' ? 'bg-green-500/20 text-green-300' :
                      pedido.status === 'em_andamento' ? 'bg-orange-500/20 text-orange-300' :
                      pedido.status === 'agendado' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {pedido.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pedido.prioridade === 'alta' ? 'bg-red-500/20 text-red-300' :
                      pedido.prioridade === 'normal' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {pedido.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingPedido({
                            id: pedido.id,
                            numero: pedido.numero,
                            cliente: pedido.cliente_nome,
                            tipo: pedido.tipo,
                            endereco: pedido.endereco,
                            cidade: pedido.cidade,
                            cep: pedido.cep,
                            contato: pedido.contato,
                            email: pedido.email,
                            telefone: pedido.telefone,
                            prioridade: pedido.prioridade,
                            status: pedido.status,
                            observacoes: pedido.observacoes,
                          });
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
                            <AlertDialogTitle>Deletar Pedido?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePedido(pedido.id)} className="bg-red-600">Deletar</AlertDialogAction>
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

      {/* Modals */}
      {showForm && (
        <PedidoForm
          pedido={editingPedido}
          onClose={() => {
            setShowForm(false);
            setEditingPedido(null);
          }}
          onSubmit={handleSavePedido}
        />
      )}

      {showExcelUpload && (
        <ExcelUpload
          onClose={() => setShowExcelUpload(false)}
          onUpload={handleExcelUpload}
        />
      )}
    </div>
  );
};

export default Pedidos;