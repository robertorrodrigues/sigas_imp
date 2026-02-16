import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import OSList from '@/components/OSList';
import OSDetails from '@/components/OSDetails';
import ChecklistForm from '@/components/ChecklistForm';

const OrdemServicoNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedOS, setSelectedOS] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);

  const handleViewOS = (os) => {
    setSelectedOS(os);
  };

  const handleStartInspection = (os) => {
    setSelectedOS(os);
    setShowChecklist(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Ordens de Serviço</h1>
          <p className="text-gray-300 mt-1">Gerencie e execute as inspeções técnicas</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por OS, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="agendada">Agendada</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="validacao">Validação</option>
              <option value="aprovada">Aprovada</option>
            </select>
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* OS List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <OSList 
          searchTerm={searchTerm} 
          filterStatus={filterStatus}
          onViewOS={handleViewOS}
          onStartInspection={handleStartInspection}
        />
      </motion.div>

      {/* Modals */}
      {selectedOS && !showChecklist && (
        <OSDetails 
          os={selectedOS}
          onClose={() => setSelectedOS(null)}
          onStartInspection={() => setShowChecklist(true)}
        />
      )}

      {showChecklist && selectedOS && (
        <ChecklistForm
          os={selectedOS}
          onClose={() => {
            setShowChecklist(false);
            setSelectedOS(null);
          }}
          onSubmit={() => {
            setShowChecklist(false);
            setSelectedOS(null);
            toast({
              title: "Inspeção concluída!",
              description: "Checklist preenchido e enviado para validação.",
            });
          }}
        />
      )}
    </div>
  );
};

export default OrdemServicoNew;