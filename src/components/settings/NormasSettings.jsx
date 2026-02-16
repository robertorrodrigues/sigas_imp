import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NormaForm = ({ norma, onSave, onCancel }) => {
  const [formData, setFormData] = useState(norma || { name: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome da Norma" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição" rows="3" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

const NormasSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNorma, setEditingNorma] = useState(null);

  const handleSaveNorma = (norma) => {
    let updatedNormas;
    if (norma.id) {
      updatedNormas = settings.normas.map(n => n.id === norma.id ? norma : n);
    } else {
      const newNorma = { ...norma, id: Date.now() };
      updatedNormas = [...settings.normas, newNorma];
    }
    updateSettings('normas', updatedNormas);
    toast({ title: "Sucesso!", description: `Norma ${norma.id ? 'atualizada' : 'adicionada'}.` });
    setIsDialogOpen(false);
    setEditingNorma(null);
  };

  const handleDeleteNorma = (normaId) => {
    const updatedNormas = settings.normas.filter(n => n.id !== normaId);
    updateSettings('normas', updatedNormas);
    toast({ title: "Sucesso!", description: "Norma removida." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Normas e Checklists</h3>
          <p className="text-sm text-gray-400">Configure as normas e os checklists associados.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingNorma(null)} className="bg-gradient-to-r from-green-500 to-green-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Norma
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>{editingNorma ? 'Editar Norma' : 'Nova Norma'}</DialogTitle>
            </DialogHeader>
            <NormaForm norma={editingNorma} onSave={handleSaveNorma} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10">
        <ul className="divide-y divide-white/10">
          {settings.normas.map(norma => (
            <li key={norma.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{norma.name}</p>
                <p className="text-sm text-gray-400">{norma.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditingNorma(norma); setIsDialogOpen(true); }}>
                  <Edit className="w-4 h-4 text-blue-400" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso irá remover permanentemente a norma.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteNorma(norma.id)} className="bg-red-600 hover:bg-red-700">Deletar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NormasSettings;