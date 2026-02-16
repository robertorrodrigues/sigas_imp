import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Clock } from 'lucide-react';

const UpcomingInspections = () => {
  const inspections = [
    {
      id: 'OS-2024-010',
      client: 'Condomínio Solar',
      address: 'Rua das Flores, 123',
      technician: 'João Silva',
      time: '09:00',
      type: 'Residencial'
    },
    {
      id: 'OS-2024-011',
      client: 'Empresa ABC Ltda',
      address: 'Av. Principal, 456',
      technician: 'Maria Santos',
      time: '14:00',
      type: 'Comercial'
    },
    {
      id: 'OS-2024-012',
      client: 'Edifício Central',
      address: 'Rua do Centro, 789',
      technician: 'Carlos Lima',
      time: '16:30',
      type: 'Residencial'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Próximas Inspeções</h3>
      <div className="space-y-4">
        {inspections.map((inspection, index) => (
          <motion.div
            key={inspection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 font-medium text-sm">{inspection.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                inspection.type === 'Comercial' 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {inspection.type}
              </span>
            </div>
            
            <h4 className="text-white font-medium mb-2">{inspection.client}</h4>
            
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {inspection.address}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {inspection.technician}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {inspection.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingInspections;