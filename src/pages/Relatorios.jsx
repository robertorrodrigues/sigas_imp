import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ReportCharts from '@/components/ReportCharts';
import ReportFilters from '@/components/ReportFilters';

const Relatorios = () => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('geral');

  const handleExport = (format) => {
    toast({
      title: "Exportação iniciada!",
      description: `Relatório será exportado em formato ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios e Analytics</h1>
          <p className="text-gray-300 mt-1">Análise de performance e indicadores</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            onClick={() => handleExport('pdf')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button
            onClick={() => handleExport('excel')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Excel</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Inspeções (Mês)</p>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-green-400 text-sm">+18%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Taxa Aprovação</p>
              <p className="text-2xl font-bold text-white">94.2%</p>
              <p className="text-green-400 text-sm">+2.1%</p>
            </div>
            <PieChart className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Tempo Médio</p>
              <p className="text-2xl font-bold text-white">2.4h</p>
              <p className="text-red-400 text-sm">+0.2h</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Receita (Mês)</p>
              <p className="text-2xl font-bold text-white">R$ 45.2k</p>
              <p className="text-green-400 text-sm">+12%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ReportFilters 
          dateRange={dateRange}
          setDateRange={setDateRange}
          reportType={reportType}
          setReportType={setReportType}
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ReportCharts dateRange={dateRange} reportType={reportType} />
      </motion.div>
    </div>
  );
};

export default Relatorios;