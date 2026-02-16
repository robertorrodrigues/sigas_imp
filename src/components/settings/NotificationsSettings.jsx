import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const NotificationsSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [notifications, setNotifications] = useState(settings.notifications);
  const { toast } = useToast();

  useEffect(() => {
    setNotifications(settings.notifications);
  }, [settings.notifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotifications(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings('notifications', notifications);
    toast({
      title: "Configurações salvas!",
      description: "Os templates de notificação foram atualizados.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Notificações</h3>
        <p className="text-sm text-gray-400">Configure templates de e-mail, SMS e WhatsApp.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Template de E-mail</label>
          <textarea 
            name="emailTemplate"
            value={notifications.emailTemplate}
            onChange={handleChange}
            rows="4" 
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">Template de SMS</label>
          <textarea 
            name="smsTemplate"
            value={notifications.smsTemplate}
            onChange={handleChange}
            rows="2" 
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <p className="text-xs text-gray-400">Use variáveis como {"{cliente}"} e {"{data}"} para personalizar as mensagens.</p>
      </div>
      <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600">Salvar Alterações</Button>
    </div>
  );
};

export default NotificationsSettings;