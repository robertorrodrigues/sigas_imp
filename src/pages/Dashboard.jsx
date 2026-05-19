import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FilePlus,
  Package,
  UserPlus,
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
import { supabase } from '@/lib/customSupabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString().slice(0, 10);

  const firstDayOfNextMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  ).toISOString().slice(0, 10);

  const monthStart = `${firstDayOfMonth}T00:00:00`;
  const nextMonthStart = `${firstDayOfNextMonth}T00:00:00`;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);

    const [
      pedidosPendentes,
      inspecoesHoje,
      concluidasMes,
      naoConformes
    ] = await Promise.all([
      supabase.from('pedidos').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),

      supabase
        .from('ordem_servico')
        .select('id', { count: 'exact', head: true })
        .eq('data_agendada', today),

      supabase
        .from('ordem_servico')
        .select('id', { count: 'exact', head: true })
        .in('status', ['concluido', 'concluida'])
        .gte('data_conclusao', monthStart)
        .lt('data_conclusao', nextMonthStart),

      supabase
        .from('ordem_servico')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'nao_conforme')
    ]);

    setStats([
      {
        title: 'Pedidos Pendentes',
        value: pedidosPendentes.count ?? 0,
        icon: FileText,
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Inspeções Hoje',
        value: inspecoesHoje.count ?? 0,
        icon: Clock,
        color: 'from-orange-500 to-orange-600'
      },
      {
        title: 'Concluídas (Mês)',
        value: concluidasMes.count ?? 0,
        icon: CheckCircle,
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Não Conformes',
        value: naoConformes.count ?? 0,
        icon: AlertTriangle,
        color: 'from-red-500 to-red-600'
      }
    ]);

    setLoading(false);
  };

  const quickActions = [
    { name: 'Novo Pedido', icon: FilePlus, path: '/pedidos?novo=true', roles: ['administrador', 'atendente'], color: 'from-blue-500 to-blue-600' },
    { name: 'Nova OS', icon: ClipboardList, path: '/ordem-servico?novo=true', roles: ['administrador', 'tecnico'], color: 'from-green-500 to-green-600' },
    { name: 'Novo Equipamento', icon: Package, path: '/equipamentos?novo=true', roles: ['administrador', 'atendente'], color: 'from-cyan-500 to-cyan-600' },
    { name: 'Novo Usuário', icon: UserPlus, path: '/configuracoes?tab=usuarios&novo=true', roles: ['administrador'], color: 'from-purple-500 to-purple-600' }
  ];

  const userRole = user?.user_metadata?.role || 'atendente';
  const availableActions = quickActions.filter(action =>
    action.roles.includes(userRole)
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300 mt-1">Visão geral do sistema de inspeções</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} loading={loading} />
          </motion.div>
        ))}
      </div>

      <motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableActions.map(action => (
            <Button
              key={action.name}
              onClick={() => navigate(action.path)}
              className={`flex-col h-auto py-3 bg-gradient-to-r ${action.color}`}
            >
              <action.icon className="w-6 h-6 mb-1" />
              <span className="text-sm">{action.name}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity />
        <UpcomingInspections />
      </div>
    </div>
  );
};

export default Dashboard;