import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgendaCalendar from '@/components/AgendaCalendar';
import TechnicianSchedule from '@/components/TechnicianSchedule';
import { supabase } from '@/lib/customSupabaseClient';

const getLocalDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

const Agenda = () => {
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [osList, setOsList] = useState([]);

  useEffect(() => {
    fetchOS();
  }, []);

  const fetchOS = async () => {
    const { data, error } = await supabase
      .from('ordem_servico')
      .select(`
        id,
        numero,
        cidade,
        endereco,
        status,
        data_agendada,
        tecnico_id,
        tecnico:tecnico_id ( id, nome ),
        pedidos:pedido_id ( cliente_nome )
      `)
      .order('data_agendada');

    if (error) {
      console.error(error);
      return;
    }

    const normalized = data.map(os => ({
      id: os.id,
      numero: os.numero,
      cidade: os.cidade,
      endereco: os.endereco,
      status: os.status,
      data: getLocalDate(os.data_agendada),

      // ✅ IMPORTANTE: manter estrutura compatível
      tecnico_id: os.tecnico_id,
      tecnico: os.tecnico || null,

      cliente: os.pedidos?.cliente_nome || 'Cliente desconhecido'
    }));

    setOsList(normalized);

    
  };

  if (!selectedDate) return null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-white">
          Agenda de Inspeções
        </h1>
      </motion.div>

      <div className="flex space-x-2">
        <Button
          variant={viewMode === 'calendar' ? 'default' : 'secondary'}
          onClick={() => setViewMode('calendar')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Calendário
        </Button>

        <Button
          variant={viewMode === 'technician' ? 'default' : 'secondary'}
          onClick={() => setViewMode('technician')}
        >
          <User className="w-4 h-4 mr-2" />
          Por Técnico
        </Button>
      </div>

      {viewMode === 'calendar' ? (
        <AgendaCalendar
          osList={osList}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onOsAtualizada={fetchOS}   
        />
      ) : (
        <TechnicianSchedule
          osList={osList}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Agenda;