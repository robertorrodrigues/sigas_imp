import React from 'react';
import { Filter, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportFilters = ({ dateRange, setDateRange, reportType, setReportType }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="ano">Este ano</option>
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="geral">Geral</option>
              <option value="tecnico">Por Técnico</option>
              <option value="regiao">Por Região</option>
              <option value="nao_conformidade">Não Conformidades</option>
            </select>
          </div>

          {/* Technician */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Técnico
            </label>
            <select
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="joao">João Silva</option>
              <option value="maria">Maria Santos</option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Região
            </label>
            <select
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="norte">Zona Norte</option>
              <option value="sul">Zona Sul</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;