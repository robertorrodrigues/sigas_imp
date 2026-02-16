import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const BackupSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [backup, setBackup] = useState(settings.backup);
  const { toast } = useToast();

  useEffect(() => {
    setBackup(settings.backup);
  }, [settings.backup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBackup(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings('backup', backup);
    toast({
      title: "Configurações salvas!",
      description: "As configurações de backup foram atualizadas.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Backup e Armazenamento</h3>
        <p className="text-sm text-gray-400">Configure a rotina de backups e o local de armazenamento.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Frequência do Backup</label>
          <select name="frequency" value={backup.frequency} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Local de Armazenamento</label>
          <select name="storage" value={backup.storage} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="cloud">Nuvem (Recomendado)</option>
            <option value="local">Servidor Local</option>
          </select>
        </div>
      </div>
      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600">Salvar Alterações</Button>
    </div>
  );
};

export default BackupSettings;