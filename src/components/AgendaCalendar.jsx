import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const AgendaCalendar = ({ selectedDate, onDateChange, osList }) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const getOSForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return osList.filter(os => os.data === dateStr);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <div className="lg:col-span-2 bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const osDoDia = day ? getOSForDate(day) : [];
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

            return (
              <motion.div
                key={i}
                onClick={() => day && onDateChange(day)}
                whileHover={{ scale: day ? 1.05 : 1 }}
                className={`min-h-[80px] p-2 rounded-lg cursor-pointer ${
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

      {/* Detalhes do dia */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">
          {selectedDate
            ? selectedDate.toLocaleDateString('pt-BR')
            : 'Selecione um dia'}
        </h3>

        {selectedDate && getOSForDate(selectedDate).map(os => (
          <div
            key={os.id}
            className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3"
          >
            <p className="text-white font-semibold">{os.numero}</p>

            <div className="text-gray-300 text-sm mt-2 space-y-1">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" /> {os.tecnico}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> {os.endereco}
              </div>
            </div>
          </div>
        ))}

        {selectedDate && getOSForDate(selectedDate).length === 0 && (
          <p className="text-gray-400">Nenhuma OS agendada.</p>
        )}
      </div>
    </div>
  );
};

export default AgendaCalendar;