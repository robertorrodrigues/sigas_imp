import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';


const PedidoForm = ({ pedido, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(pedido || {
    numero: '',
    cliente: '',
    tipo: 'residencial',
    endereco: '',
    cidade: '',
    cep: '',
    contato: '',
    email: '',
    telefone: '',
    prioridade: 'normal',
    status: 'pendente',
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      toast({
        title: "Arquivo anexado!",
        description: `${file.name} foi anexado ao pedido.`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Pedido de Inspeção</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Cliente/Empresa
              </label>
              <input
                type="text"
                required
                value={formData.cliente}
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do cliente ou empresa"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tipo de Inspeção
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Endereço Completo
            </label>
            <input
              type="text"
              required
              value={formData.endereco}
              onChange={(e) => setFormData({...formData, endereco: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rua, número, bairro"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Cidade
              </label>
              <input
                type="text"
                required
                value={formData.cidade}
                onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cidade"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                CEP
              </label>
              <input
                type="text"
                required
                value={formData.cep}
                onChange={(e) => setFormData({...formData, cep: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Telefone
              </label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Prioridade
            </label>
            <select
              value={formData.prioridade}
              onChange={(e) => setFormData({...formData, prioridade: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="baixa">Baixa</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Informações adicionais sobre a inspeção..."
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Anexos
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 mb-2">Clique para anexar arquivos</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-400 hover:text-blue-300"
              >
                Selecionar arquivos
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Criar Pedido
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PedidoForm;