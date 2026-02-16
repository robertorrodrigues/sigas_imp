import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportCharts = ({ dateRange, reportType }) => {
  const inspectionsData = [
    { name: 'Jan', Inspeções: 400, Aprovadas: 240 },
    { name: 'Fev', Inspeções: 300, Aprovadas: 139 },
    { name: 'Mar', Inspeções: 200, Aprovadas: 980 },
    { name: 'Abr', Inspeções: 278, Aprovadas: 390 },
    { name: 'Mai', Inspeções: 189, Aprovadas: 480 },
    { name: 'Jun', Inspeções: 239, Aprovadas: 380 },
    { name: 'Jul', Inspeções: 349, Aprovadas: 430 },
  ];

  const resultsData = [
    { name: 'Apto', value: 400 },
    { name: 'Apto com Restrições', value: 150 },
    { name: 'Não Apto', value: 50 },
  ];

  const nonConformityData = [
    { name: 'Vazamento', value: 25 },
    { name: 'Ventilação', value: 15 },
    { name: 'Tubulação', value: 8 },
    { name: 'Válvula', value: 2 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  const COLORS_NC = ['#8B5CF6', '#3B82F6', '#EC4899', '#F97316'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inspections Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Volume de Inspeções</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={inspectionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFF'
                }}
              />
              <Legend wrapperStyle={{ color: '#FFF' }} />
              <Bar dataKey="Inspeções" fill="#3B82F6" />
              <Bar dataKey="Aprovadas" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Results Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Distribuição de Resultados</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={resultsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {resultsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFF'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Non-Conformity Pareto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 lg:col-span-2"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Principais Não Conformidades</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={nonConformityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFF'
                }}
              />
              <Bar dataKey="value" fill="#8B5CF6">
                {nonConformityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_NC[index % COLORS_NC.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportCharts;