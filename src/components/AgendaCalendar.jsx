import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

const AgendaCalendar = ({
  osList,
  selectedDate,
  onDateChange,
  onOsAtualizada
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [osSelecionada, setOsSelecionada] = useState(null);
  const [novaData, setNovaData] = useState('');
  const [novoTecnico, setNovoTecnico] = useState('');
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const fetchTecnicos = async () => {
    const { data, error } = await supabase
      .from('tecnico')
      .select('id, nome')
      .eq('status', 'ativo')
      .order('nome');

    if (!error) setTecnicos(data || []);
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-red-400/20 text-red-300',
      em_progresso: 'bg-purple-500/20 text-purple-300',
      concluido: 'bg-green-500/20 text-green-300',
      cancelada: 'bg-orange-500/20 text-orange-300',
      encerrado: 'bg-red-500/20 text-green-300',
      nao_conforme: 'bg-red-500/20 text-red-300',
    };
    return colors[status] ?? 'bg-gray-500/20 text-gray-300';
  };

  useEffect(() => {
    if (editModalOpen) fetchTecnicos();
  }, [editModalOpen]);

  /* ===== Calendário ===== */

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Espaços vazios antes do primeiro dia
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Dias do mês
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const getOSForDate = (date) => {
    if (!date) return [];
    return osList.filter(os => os.data === formatDate(date));
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const abrirEdicao = (os) => {
    if (os.status !== 'pendente') return;

    setOsSelecionada(os);
    setNovaData(os.data);
    setNovoTecnico(os.tecnico_id || '');
    setEditModalOpen(true);
  };

  const salvarEdicao = async () => {
    const { error } = await supabase
      .from('ordem_servico')
      .update({
        data_agendada: novaData,
        tecnico_id: novoTecnico
      })
      .eq('id', osSelecionada.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message
      });
      return;
    }

    setEditModalOpen(false);
    onOsAtualizada?.();
  };

  const days = getDaysInMonth(currentMonth);

  const monthNames = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ===== CALENDÁRIO ===== */}
      <div className="lg:col-span-2 bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const osDoDia = day ? getOSForDate(day) : [];
            const isSelected =
              day &&
              selectedDate &&
              day.toDateString() === selectedDate.toDateString();

            return (
              <motion.div
                key={i}
                onClick={() => day && onDateChange(day)}
                whileHover={{ scale: day ? 1.05 : 1 }}
                className={`min-h-[90px] p-2 rounded-lg cursor-pointer ${
                  !day
                    ? ''
                    : isSelected
                    ? 'bg-blue-500/30 border border-blue-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {day && (
                  <>
                    <div className="text-white font-semibold text-sm">
                      {day.getDate()}
                    </div>
                    {osDoDia.length > 0 && (
                      <div className="mt-1 text-xs text-blue-300">
                        {osDoDia.length} OS
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== LISTA DO DIA ===== */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">
          {selectedDate
            ? selectedDate.toLocaleDateString('pt-BR')
            : 'Selecione um dia'}
        </h3>

        {selectedDate &&
          getOSForDate(selectedDate).map(os => (
            <div
              key={os.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3"
            >  
              <p className="text-white font-semibold">{os.numero}      -
              <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      os.status
                    )}`}
                  >
                         {os.status}
                  </span>
              </p>
              <div className="text-gray-300 text-sm mt-2 space-y-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {os.tecnico?.nome || 'Sem técnico'}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {os.endereco}
                </div>
              </div>

              {os.status === 'pendente' && (
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => abrirEdicao(os)}
                >
                  Editar OS
                </Button>
              )}
            </div>
          ))}
      </div>

      {/* ===== MODAL ===== */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar os dados da OS </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <label className="block text-white text-sm font-medium mb-2">
              Altere a data de agendamento
            </label>
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-white text-sm font-medium mb-2">
              Altere o técnico que irá realizar a OS
            </label>
            <select
              value={novoTecnico}
              onChange={(e) => setNovoTecnico(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um técnico</option>
              {tecnicos.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarEdicao}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgendaCalendar;