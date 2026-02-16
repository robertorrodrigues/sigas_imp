import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, User, Clock, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OSDetails = ({ os, onClose, onStartInspection }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Detalhes da OS</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-blue-400">{os.numero}</span>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300">
                Status - {os.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{os.pedidos?.cliente_nome ?? '—'}</h3>
            <p className="text-gray-300">Tipo: {os.tipo}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Endereço
                </label>
                <div className="flex items-center text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  {os.endereco}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Técnico Responsável
                </label>
                <div className="flex items-center text-white">
                  <User className="w-4 h-4 mr-2" />
                  {os.tecnico?.nome ?? '—'}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Norma Aplicável
                </label>
                <div className="flex items-center text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  {os.norma?.nome ?? '48'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Data do Agendamento
                </label>
                <div className="flex items-center text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                   {os.data_agendada.substring(0,10)}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Horário
                </label>
                <div className="flex items-center text-white">
                  <Clock className="w-4 h-4 mr-2" />
                  {os.data_agendada.substring(11,25)}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Preview */}
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">Checklist Aplicável</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Verificação de instalações de gás
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Inspeção de tubulações e conexões
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Teste de vazamentos
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Verificação de ventilação
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Fechar
            </Button>
            {(os.status === 'pendente' || os.status === 'em_progresso') && (
              <Button
                onClick={onStartInspection}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {os.status === 'pendente' ? 'Iniciar Inspeção' : 'Continuar Inspeção'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OSDetails;