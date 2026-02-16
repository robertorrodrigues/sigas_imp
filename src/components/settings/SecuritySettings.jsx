import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

const SecuritySettings = () => {
  const { settings, updateSettings } = useSettings();
  const [security, setSecurity] = useState(settings.security);
  const { toast } = useToast();

  useEffect(() => {
    setSecurity(settings.security);
  }, [settings.security]);

  const handleChange = (name, value) => {
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings('security', security);
    toast({
      title: "Configurações salvas!",
      description: "As configurações de segurança foram atualizadas.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Segurança</h3>
        <p className="text-sm text-gray-400">Políticas de senha, MFA e retenção de dados.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
          <span className="text-white">Exigir autenticação de dois fatores (MFA) para administradores</span>
          <Switch
            checked={security.mfa}
            onCheckedChange={(checked) => handleChange('mfa', checked)}
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Política de Retenção de Dados (anos)</label>
          <input 
            type="number" 
            value={security.retentionPolicy}
            onChange={(e) => handleChange('retentionPolicy', parseInt(e.target.value, 10))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>
      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600">Salvar Alterações</Button>
    </div>
  );
};

export default SecuritySettings;