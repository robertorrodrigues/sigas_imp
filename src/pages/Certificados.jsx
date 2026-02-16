import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Award, FileWarning, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CertificateList from '@/components/CertificateList';
import CertificateDetails from '@/components/CertificateDetails';

const Certificados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const stats = [
    { title: 'Emitidos (Mês)', value: '128', icon: Award, color: 'text-blue-400' },
    { title: 'Relatórios NC (Mês)', value: '15', icon: FileWarning, color: 'text-yellow-400' },
    { title: 'Aprovados', value: '98%', icon: Check, color: 'text-green-400' },
    { title: 'Rejeitados', value: '2%', icon: X, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Certificados e Relatórios</h1>
          <p className="text-gray-300 mt-1">Gerencie os documentos gerados pelas inspeções</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </motion.div>

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
                placeholder="Buscar por certificado, cliente, OS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="certificado">Certificado</option>
              <option value="relatorio_nc">Relatório NC</option>
            </select>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CertificateList
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSelectCertificate={setSelectedCertificate}
        />
      </motion.div>

      {selectedCertificate && (
        <CertificateDetails
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default Certificados;