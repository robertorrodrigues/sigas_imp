import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GeneralSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [general, setGeneral] = useState(settings.general);
  const { toast } = useToast();

  useEffect(() => {
    setGeneral(settings.general);
  }, [settings.general]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGeneral(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings('general', general);
    toast({
      title: "Configurações salvas!",
      description: "As informações da empresa foram atualizadas.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Informações da Empresa</h3>
        <p className="text-sm text-gray-400">Dados da sua empresa para relatórios e certificados.</p>
      </div>
      <div className="space-y-4">
        <input 
          type="text" 
          name="companyName"
          placeholder="Nome da Empresa" 
          value={general.companyName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          type="text" 
          name="cnpj"
          placeholder="CNPJ" 
          value={general.cnpj}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <textarea 
          name="address"
          placeholder="Endereço" 
          rows="3" 
          value={general.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600">Salvar Alterações</Button>
    </div>
  );
};

export default GeneralSettings;