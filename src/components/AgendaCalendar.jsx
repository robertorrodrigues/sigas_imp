import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AgendaCalendar = ({ selectedDate, onDateChange, inspections = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getInspectionsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return inspections.filter(inspection => inspection.data === dateStr);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleAddInspection = () => {
    toast({
      title: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex items-center space-x-1">
            <Button
              onClick={() => navigateMonth(-1)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigateMonth(1)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, i) => (
            <div key={i} className="p-2 text-center text-gray-400 text-xs sm:text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayInspections = day ? getInspectionsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

            return (
              <motion.div
                key={index}
                whileHover={{ scale: day ? 1.05 : 1 }}
                className={`p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] rounded-lg cursor-pointer transition-colors ${
                  !day ? '' :
                  isSelected ? 'bg-blue-500/30 border border-blue-400' :
                  isToday ? 'bg-green-500/20' :
                  'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
                onClick={() => day && onDateChange(day)}
              >
                {day && (
                  <>
                    <div className={`text-xs sm:text-sm font-medium mb-1 text-center sm:text-left ${isToday ? 'text-green-300' : 'text-white'}`}>
                      {day.getDate()}
                    </div>
                    <div className="hidden sm:block space-y-1">
                      {dayInspections.slice(0, 2).map(inspection => (
                        <div
                          key={inspection.id}
                          className="text-xs bg-blue-500/30 text-blue-200 px-1 py-0.5 rounded truncate"
                        >
                          {inspection.hora}
                        </div>
                      ))}
                    </div>
                    {dayInspections.length > 0 && (
                       <div className="sm:hidden flex justify-center items-center mt-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                       </div>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Day Details */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            {selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Selecione uma data'}
          </h3>
          <Button
            onClick={handleAddInspection}
            size="icon"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {selectedDate && (
          <div className="space-y-4">
            {getInspectionsForDate(selectedDate).map(inspection => (
              <motion.div
                key={inspection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium text-sm">{inspection.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    inspection.status === 'confirmada' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {inspection.status}
                  </span>
                </div>
                
                <h4 className="text-white font-medium mb-3">{inspection.cliente}</h4>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {inspection.hora}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {inspection.tecnico}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {inspection.endereco}
                  </div>
                </div>
              </motion.div>
            ))}

            {getInspectionsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhuma inspeção agendada.</p>
                <Button
                  onClick={handleAddInspection}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaCalendar;