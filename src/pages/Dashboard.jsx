import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  ClipboardList,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';
import UpcomingInspections from '@/components/UpcomingInspections';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Pedidos Pendentes',
      value: '24',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Inspeções Hoje',
      value: '8',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      change: '+5%'
    },
    {
      title: 'Concluídas (Mês)',
      value: '156',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+18%'
    },
    {
      title: 'Não Conformes',
      value: '12',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      change: '-8%'
    }
  ];

  const quickActions = [
    { name: 'Novo Pedido', icon: FileText, path: '/pedidos', roles: ['administrador', 'atendente'], color: 'from-blue-500 to-blue-600' },
    { name: 'Minhas OS', icon: ClipboardList, path: '/ordem-servico', roles: ['tecnico'], color: 'from-blue-500 to-blue-600' },
    { name: 'Agendar', icon: Calendar, path: '/agenda', roles: ['administrador', 'atendente'], color: 'from-green-500 to-green-600' },
    { name: 'Ver Agenda', icon: Calendar, path: '/agenda', roles: ['tecnico'], color: 'from-green-500 to-green-600' },
    { name: 'Emitir Certificado', icon: Award, path: '/certificados', roles: ['administrador', 'atendente'], color: 'from-teal-500 to-teal-600' },
    { name: 'Técnicos', icon: Users, path: '/tecnicos', roles: ['administrador'], color: 'from-purple-500 to-purple-600' },
    { name: 'Relatórios', icon: TrendingUp, path: '/relatorios', roles: ['administrador'], color: 'from-orange-500 to-orange-600' },
  ];

  const availableActions = quickActions.filter(action => action.roles.includes(user?.role));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-1">Visão geral do sistema de inspeções</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 text-sm">
            <span className="text-white">Atualizado: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {availableActions.map(action => (
            <Button 
              key={action.name}
              onClick={() => navigate(action.path)} 
              className={`flex-col h-auto py-3 bg-gradient-to-r ${action.color} hover:brightness-110`}
            >
              <action.icon className="w-6 h-6 mb-1" />
              <span className="text-xs sm:text-sm">{action.name}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <RecentActivity />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <UpcomingInspections />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;