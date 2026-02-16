import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/customSupabaseClient';  
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



const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(user || { name: '', email: '', role: 'administrador' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="administrador">Administrador</option>
        <option value="tecnico">Técnico</option>
        <option value="atendente">Atendente</option>
      </select>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="enabled" checked={!!formData.enabled} onChange={handleChange} className="w-4 h-4" />
        <span className="text-sm text-gray-300">Ativo</span>
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="validation" checked={!!formData.validation} onChange={handleChange} className="w-4 h-4" />
        <span className="text-sm text-gray-300">Validador</span>
      </label>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

const UserSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [dbUsers, setDbUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, enabled')
      .order('name', { ascending: true });

    if (error) {
      toast({ title: 'Erro ao buscar usuários', description: error.message, variant: 'destructive' });
      setDbUsers([]);
    } else {
      console.log('Fetched profiles:', data);
      setDbUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();

    // opcional: escuta mudanças em profiles e refaz fetch
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => { fetchProfiles(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveUser = async (user) => {
  setLoading(true);

  try {
    if (user.id) {
      // atualizar usuário existente
      const { error } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          email: user.email,
          role: user.role,
          enabled: user.enabled ?? true,
          validador: user.validation ?? false,
        })
        .eq('id', user.id);

      if (error) {
        toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Usuário atualizado' });
        setIsDialogOpen(false);
        setEditingUser(null);
        await fetchProfiles();
      }
    } else {
      // inserir novo registro em profiles
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          name: user.name,
          email: user.email,
          role: user.role,
          enabled: user.enabled ?? true,
          validador: user.validation ?? false,
        }])
        .select() // retorna o registro inserido
        .single();

      if (error) {
        toast({ title: 'Erro ao criar usuário', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Usuário criado', description: data.email });
        setIsDialogOpen(false);
        setEditingUser(null);
        await fetchProfiles();
      }
    }
  } catch (err) {
    toast({ title: 'Erro', description: err.message || String(err), variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};

  const handleDeleteUser = async (userId) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Usuário removido' });
      fetchProfiles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Gerenciamento de Usuários</h3>
          <p className="text-sm text-gray-400">Adicione, remova e edite permissões de usuários.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)} className="bg-gradient-to-r from-green-500 to-green-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            </DialogHeader>
            <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10">
        <ul className="divide-y divide-white/10">


          {loading && (
            <li className="p-4 text-gray-300">Carregando usuários...</li>
          )}
          {!loading && dbUsers.length === 0 && (
            <li className="p-4 text-gray-400">Nenhum usuário encontrado.</li>
          )}
          {!loading && dbUsers.map(user => (
             <li key={user.id} className="p-4 flex items-center justify-between">
               <div>
                <p className="font-medium text-white">{user.name || <span className="text-gray-400">—</span>}</p>
                <p className="text-sm text-gray-400">{user.email} - <span className="capitalize">{user.role || '—'}</span> {user.enabled === false ? <span className="text-red-400 ml-2">(desativado)</span> : ''}</p>
               </div>
               <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsDialogOpen(true); }}>
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
                         Essa ação não pode ser desfeita. Isso irá remover permanentemente o usuário.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancelar</AlertDialogCancel>
                       <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">Deletar</AlertDialogAction>
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

export default UserSettings;