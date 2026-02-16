import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, MapPin, Calendar, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PedidosList = ({ searchTerm, filterStatus }) => {
  const pedidos = [
    {
      id: 'PED-2024-001',
      cliente: 'Condomínio Solar',
      tipo: 'Residencial',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      status: 'pendente',
      prioridade: 'alta',
      dataCriacao: '2024-01-15',
      responsavel: 'João Silva'
    },
    {
      id: 'PED-2024-002',
      cliente: 'Empresa ABC Ltda',
      tipo: 'Comercial',
      endereco: 'Av. Principal, 456 - Empresarial',
      telefone: '(11) 88888-8888',
      status: 'agendado',
      prioridade: 'normal',
      dataCriacao: '2024-01-14',
      responsavel: 'Maria Santos'
    },
    {
      id: 'PED-2024-003',
      cliente: 'Edifício Central',
      tipo: 'Residencial',
      endereco: 'Rua do Centro, 789 - Vila Nova',
      telefone: '(11) 77777-7777',
      status: 'em_andamento',
      prioridade: 'normal',
      dataCriacao: '2024-01-13',
      responsavel: 'Carlos Lima'
    },
    {
      id: 'PED-2024-004',
      cliente: 'Indústria XYZ',
      tipo: 'Industrial',
      endereco: 'Distrito Industrial, 321',
      telefone: '(11) 66666-6666',
      status: 'concluido',
      prioridade: 'baixa',
      dataCriacao: '2024-01-12',
      responsavel: 'Ana Costa'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-orange-500/20 text-orange-300',
      agendado: 'bg-blue-500/20 text-blue-300',
      em_andamento: 'bg-purple-500/20 text-purple-300',
      concluido: 'bg-green-500/20 text-green-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const getPriorityColor = (prioridade) => {
    const colors = {
      baixa: 'bg-gray-500/20 text-gray-300',
      normal: 'bg-blue-500/20 text-blue-300',
      alta: 'bg-orange-500/20 text-orange-300',
      urgente: 'bg-red-500/20 text-red-300'
    };
    return colors[prioridade] || 'bg-gray-500/20 text-gray-300';
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = searchTerm === '' || 
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || pedido.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewPedido = (pedido) => {
    toast({
      title: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const handleEditPedido = (pedido) => {
    toast({
      title: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-xl font-semibold text-white">
          Pedidos ({filteredPedidos.length})
        </h3>
      </div>

      <div className="divide-y divide-white/10">
        {filteredPedidos.map((pedido, index) => (
          <motion.div
            key={pedido.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-white/5 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-blue-400 font-medium">{pedido.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pedido.status)}`}>
                    {pedido.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(pedido.prioridade)}`}>
                    {pedido.prioridade.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-white font-semibold text-lg mb-2">{pedido.cliente}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {pedido.endereco}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {pedido.telefone}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Criado em {new Date(pedido.dataCriacao).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {pedido.responsavel}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  onClick={() => handleViewPedido(pedido)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleEditPedido(pedido)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-400">Nenhum pedido encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default PedidosList;