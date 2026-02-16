import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TechnicianSchedule = ({ inspections = [], selectedDate = null, onDateSelect = null }) => {
  const technicians = [
    { id: 1, name: 'João Silva', phone: '(11) 99999-9999', rating: 4.8 },
    { id: 2, name: 'Maria Santos', phone: '(11) 88888-8888', rating: 4.9 },
    { id: 3, name: 'Carlos Lima', phone: '(11) 77777-7777', rating: 4.7 }
  ];

  const handleOptimizeRoute = (technicianId) => {
    toast({
      title: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const handleContactTechnician = (phone) => {
    toast({
      title: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  return (
    <div className="space-y-6">
      {technicians.map((technician, index) => (
        <motion.div
          key={technician.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20"
        >
          {/* Technician Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-lg">
                  {technician.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{technician.name}</h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300 mt-1">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {technician.phone}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {technician.rating}
                  </div>
                  <span>{(() => { const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null; return inspections.filter(i => i.tecnico === technician.name && (!dateStr || i.data === dateStr)).length; })()} inspeções</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button
                onClick={() => handleContactTechnician(technician.phone)}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none border-white/20 text-white hover:bg-white/10"
              >
                <Phone className="w-4 h-4 mr-1" />
                Contatar
              </Button>
              <Button
                onClick={() => handleOptimizeRoute(technician.id)}
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Otimizar
              </Button>
            </div>
          </div>

          {/* Inspections */}
          <div className="space-y-3">
            {(
              (() => {
                const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
                return inspections.filter(i => i.tecnico === technician.name && (!dateStr || i.data === dateStr));
              })()
            ).map((inspection, inspectionIndex) => (
              <motion.div
                key={inspection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index * 0.1) + (inspectionIndex * 0.05) }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-blue-400 font-medium">{inspection.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inspection.status === 'confirmada' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {inspection.status}
                      </span>
                    </div>
                    
                    <h4 className="text-white font-medium mb-2">{inspection.cliente}</h4>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {inspection.hora}
                      </div>
                      <div className="flex items-center mt-1 sm:mt-0">
                        <MapPin className="w-4 h-4 mr-1" />
                        {inspection.endereco}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => onDateSelect && onDateSelect(new Date(inspection.data))}
                    >
                      Detalhes
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {(() => { const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null; return inspections.filter(i => i.tecnico === technician.name && (!dateStr || i.data === dateStr)).length === 0; })() && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhuma inspeção agendada para hoje.</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TechnicianSchedule;