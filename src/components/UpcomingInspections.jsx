// UpcomingInspections.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const getToday = () => {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
};

const UpcomingInspections = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayInspections();
  }, []);

  const fetchTodayInspections = async () => {
    setLoading(true);

    const today = getToday();

    const { data, error } = await supabase
      .from('ordem_servico')
      .select(`
        id,
        numero,
        endereco,
        cidade,
        data_agendada,
        tipo_inspecao,
        tecnico:tecnico_id ( nome ),
        pedidos:pedido_id ( cliente_nome )
      `)
      .eq('data_agendada', today)
      .order('numero', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar inspeções do dia:', error);
      setInspections([]);
      setLoading(false);
      return;
    }

    setInspections(data || []);
    setLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-6">
        Próximas Inspeções
      </h3>

      {loading && (
        <p className="text-gray-400 text-sm">Carregando inspeções...</p>
      )}

      {!loading && inspections.length === 0 && (
        <p className="text-gray-400 text-sm">
          Nenhuma inspeção agendada para hoje.
        </p>
      )}

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
              <span className="text-blue-400 font-medium text-sm">
                {inspection.numero}
              </span>

              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  inspection.tipo_inspecao === 'Comercial'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-green-500/20 text-green-300'
                }`}
              >
                {inspection.tipo_inspecao || 'Residencial'}
              </span>
            </div>

            <h4 className="text-white font-medium mb-2">
              {inspection.pedidos?.cliente_nome || 'Cliente não informado'}
            </h4>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {inspection.endereco}
                {inspection.cidade ? ` - ${inspection.cidade}` : ''}
              </div>

              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {inspection.tecnico?.nome || 'Sem técnico'}
              </div>

              
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingInspections;
