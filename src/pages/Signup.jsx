import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

const Signup = ({ companySlug: companySlugProp }) => {
  const [name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const companySlug = useMemo(() => {
    if (companySlugProp) return companySlugProp;

    const [firstSegment] = location.pathname.split('/').filter(Boolean);
    return firstSegment && !['login', 'signup'].includes(firstSegment) ? firstSegment : null;
  }, [companySlugProp, location.pathname]);

  const logoSrc = companySlug ? `/images/${companySlug}/logo.png` : '/images/logoSigas.png';

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirm || !name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, email e senha.',
        variant: 'destructive',
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: 'Senhas diferentes',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const empresaSlugToUse = companySlug || 'gasmetro';
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresa')
        .select('id')
        .eq('logo', empresaSlugToUse)
        .maybeSingle();

      if (empresaError || !empresaData?.id) {
        toast({
          title: 'Empresa não encontrada',
          description: 'Não foi possível identificar a empresa para esse cadastro.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(email, password, {
        data: {
          name,
          role: 'administrador',
          xid_empresa: empresaData.id,
        },
      });

      if (!error) {
        toast({
          title: 'Cadastro realizado!',
          description: 'Verifique seu email para confirmação, se aplicável.',
        });
        navigate(companySlug ? `/${companySlug}/login` : '/login');
      } else {
        toast({
          title: 'Erro no cadastro',
          description: error.message || 'Não foi possível criar a conta.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logoSrc}
              alt={companySlug ? `Logo ${companySlug}` : 'Logo SIGas'}
              className="h-16 w-auto rounded-xl object-contain bg-white/10 p-2 shadow-lg"
              onError={(event) => {
                event.currentTarget.src = '/images/logoSigas.png';
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-10 h-10 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">SIGas</h1>
          </div>
          <p className="text-gray-300 mt-2">Crie sua conta</p>
          {companySlug && <p className="text-sm text-blue-200 mt-1">Empresa: {companySlug}</p>}
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Confirmar senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a senha"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Criar conta
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Já possui conta? <button onClick={() => navigate(companySlug ? `/${companySlug}/login` : '/login')} className="text-white underline">Entrar</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
