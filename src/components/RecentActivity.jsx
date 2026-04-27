// RecentActivity.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

/* ===== Helpers ===== */

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'min', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} atrás`;
    }
  }

  return 'agora mesmo';
};

const statusConfig = {
  concluido: {
    icon: CheckCircle,
    color: 'text-green-400',
    message: (os) =>
      `Inspeção ${os.numero} concluída`
  },
  nao_conforme: {
    icon: AlertTriangle,
    color: 'text-red-400',
    message: (os) =>
      `Não conformidade detectada em ${os.numero}`
  },
  em_progresso: {
    icon: Clock,
    color: 'text-orange-400',
    message: (os) =>
      `${os.numero} em progresso`
  }
};

const defaultConfig = {
  icon: User,
  color: 'text-blue-400',
  message: (os) =>
    `${os.numero} atualizada`
};

/* ===== Component ===== */

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('ordem_servico')
      .select(`
        id,
        numero,
        status,
        updated_at,
        tecnico:tecnico_id ( nome )
      `)
      .neq('status', 'pendente')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      setActivities([]);
      setLoading(false);
      return;
    }

    setActivities(data || []);
    setLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">
        Atividades Recentes
      </h3>

      {loading && (
        <p className="text-gray-400 text-sm">Carregando atividades...</p>
      )}

      {!loading && activities.length === 0 && (
        <p className="text-gray-400 text-sm">
          Nenhuma atividade recente.
        </p>
      )}

      <div className="space-y-4">
        {activities.map((os, index) => {
          const config = statusConfig[os.status] || defaultConfig;
          const Icon = config.icon;

          return (
            <motion.div
              key={os.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-white/10 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <p className="text-white text-sm">
                  {config.message(os)}
                  {os.tecnico?.nome && ` por ${os.tecnico.nome}`}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {timeAgo(os.updated_at)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;