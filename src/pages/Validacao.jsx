
// src/app/validacao/Validacao.jsx  (ou onde você deseja)
// Certifique-se de ajustar o caminho conforme sua estrutura de pastas.

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ValidationList from '@/components/ValidationList';
import ValidationDetails from '@/components/ValidationDetails';
import ValidationNewValidador from '@/components/ValidationNewValidador';
import { supabase } from '@/lib/customSupabaseClient';

const startOfTodayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};
const endOfTodayISO = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

const Validacao = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pendente');
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [selectedNewValidador, setSelectedNewValidador] = useState(null);


  // Stats
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedTodayCount, setApprovedTodayCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const startOfTodayISO = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };
  const endOfTodayISO = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const refreshStats = async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);

      const { count: pendCount, error: pendErr } = await supabase
        .from('validacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      if (pendErr) throw pendErr;

      // Aprovadas Hoje — preferindo validated_at; se não existir, você pode trocar para data_conclusao
      const { count: apprTodayCount, error: apprErr } = await supabase
        .from('validacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aprovada')
        .gte('data_validacao', startOfTodayISO())
        .lt('data_validacao', endOfTodayISO());
      if (apprErr) throw apprErr;

      const { count: rejCount, error: rejErr } = await supabase
        .from('validacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejeitada');
      if (rejErr) throw rejErr;

      setPendingCount(pendCount || 0);
      setApprovedTodayCount(apprTodayCount || 0);
      setRejectedCount(rejCount || 0);
    } catch (err) {
      console.error('Erro ao carregar stats:', err?.message || err);
      setStatsError('Não foi possível carregar as estatísticas.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshStats();
    // Realtime: qualquer mudança na tabela dispara recálculo de stats
    const channel = supabase
      .channel('validacoes-stats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'validacoes' },
        () => {
          refreshStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const approvalRate = useMemo(() => {
    const denominator = approvedTodayCount + rejectedCount;
    if (!denominator) return 0;
    // A "Taxa de Aprovação" pode ser definida de várias formas.
    // Aqui: aprovadas hoje / (aprovadas hoje + rejeitadas total) * 100 (ajuste conforme sua métrica)
    return Math.round((approvedTodayCount / denominator) * 100);
  }, [approvedTodayCount, rejectedCount]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Validação Técnica</h1>
          <p className="text-gray-300 mt-2">Revise e valide as inspeções realizadas</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {/* Pendentes */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-white">
                {loadingStats ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  pendingCount.toLocaleString('pt-BR')
                )}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
          {statsError && (
            <p className="text-xs text-red-300 mt-2">{statsError}</p>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Aprovadas Hoje</p>
              <p className="text-2xl font-bold text-white">
                {loadingStats ? '...' : approvedTodayCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Rejeitadas</p>
              <p className="text-2xl font-bold text-white">
                {loadingStats ? '...' : rejectedCount}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Taxa Aprovação</p>
              <p className="text-2xl font-bold text-white">
                {loadingStats ? '...' : `${approvalRate}%`}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por OS, cliente ou técnico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovada">Aprovadas</option>
              <option value="rejeitada">Rejeitadas</option>
              <option value="contestacao">Em Contestação</option>
            </select>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Validation List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ValidationList
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSelectValidation={setSelectedValidation}
          onSelectNewValidador={setSelectedNewValidador}
        />
      </motion.div>

      {/* Modal */}
      {selectedValidation && (
        <ValidationDetails
          validation={selectedValidation}
          onClose={() => setSelectedValidation(null)}
        />
      )}

       {/* Modal */}
      {selectedNewValidador && (
        <ValidationNewValidador
          validation={selectedNewValidador}
          onClose={() => setSelectedNewValidador(null)}
        />
      )}
    </div>
  );
};

export default Validacao;
