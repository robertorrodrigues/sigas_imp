import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FilePlus, CalendarPlus, UserPlus, ClipboardList } from 'lucide-react';

const actions = [
  { name: 'Novo Pedido', icon: FilePlus, href: '/pedidos', color: 'bg-blue-500' },
  { name: 'Agendar OS', icon: CalendarPlus, href: '/agenda', color: 'bg-green-500' },
  { name: 'Ver Ordens', icon: ClipboardList, href: '/ordem-servico', color: 'bg-yellow-500' },
  { name: 'Add Técnico', icon: UserPlus, href: '/tecnicos', color: 'bg-purple-500' },
];

const QuickActions = () => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              to={action.href}
              className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-200"
            >
              <div className={`p-3 rounded-full ${action.color}`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium text-white text-center">{action.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;