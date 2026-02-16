import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-400' : 'text-red-400'
            }`}>
              {change} vs período anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;