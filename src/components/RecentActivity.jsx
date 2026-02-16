import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'inspection_completed',
      message: 'Inspeção OS-2024-001 concluída por João Silva',
      time: '5 min atrás',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'validation_pending',
      message: 'OS-2024-002 aguardando validação técnica',
      time: '15 min atrás',
      icon: Clock,
      color: 'text-orange-400'
    },
    {
      id: 3,
      type: 'non_conformity',
      message: 'Não conformidade detectada em OS-2024-003',
      time: '1 hora atrás',
      icon: AlertTriangle,
      color: 'text-red-400'
    },
    {
      id: 4,
      type: 'technician_assigned',
      message: 'Maria Santos designada para OS-2024-004',
      time: '2 horas atrás',
      icon: User,
      color: 'text-blue-400'
    },
    {
      id: 5,
      type: 'inspection_completed',
      message: 'Inspeção OS-2024-005 concluída por Carlos Lima',
      time: '3 horas atrás',
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">Atividades Recentes</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200"
          >
            <div className={`p-2 rounded-lg bg-white/10 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;