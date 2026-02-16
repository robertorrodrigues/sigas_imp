import React from 'react';
import { motion } from 'framer-motion';
import GeneralSettings from '@/components/settings/GeneralSettings';
import UserSettings from '@/components/settings/UserSettings';
import NormasSettings from '@/components/settings/NormasSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import BackupSettings from '@/components/settings/BackupSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';

const ConfigTabs = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'geral':
        return <GeneralSettings />;
      case 'usuarios':
        return <UserSettings />;
      case 'normas':
        return <NormasSettings />;
      case 'seguranca':
        return <SecuritySettings />;
      case 'backup':
        return <BackupSettings />;
      case 'notificacoes':
        return <NotificationsSettings />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default ConfigTabs;