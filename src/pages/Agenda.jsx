import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgendaCalendar from '@/components/AgendaCalendar';
import TechnicianSchedule from '@/components/TechnicianSchedule';
import inspections from '@/lib/inspectionsData';

const Agenda = () => {
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Agenda de Inspeções</h1>
          <p className="text-gray-300 mt-1">Gerencie agendamentos e roteirização</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 p-1 rounded-xl border border-white/20">
          <Button
            onClick={() => setViewMode('calendar')}
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            className={`w-full sm:w-auto ${viewMode === 'calendar' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendário
          </Button>
          <Button
            onClick={() => setViewMode('technician')}
            variant={viewMode === 'technician' ? 'default' : 'ghost'}
            className={`w-full sm:w-auto ${viewMode === 'technician' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Por Técnico
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs sm:text-sm">Hoje</p>
              <p className="text-xl sm:text-2xl font-bold text-white">8</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs sm:text-sm">Semana</p>
              <p className="text-xl sm:text-2xl font-bold text-white">32</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs sm:text-sm">Técnicos</p>
              <p className="text-xl sm:text-2xl font-bold text-white">5</p>
            </div>
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs sm:text-sm">Regiões</p>
              <p className="text-xl sm:text-2xl font-bold text-white">12</p>
            </div>
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {viewMode === 'calendar' ? (
          <AgendaCalendar 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            inspections={inspections}
          />
        ) : (
          <TechnicianSchedule
            inspections={inspections}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Agenda;