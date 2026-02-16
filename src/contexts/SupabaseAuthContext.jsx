
// SupabaseAuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase getSession error:', error);
      }
      handleSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Opcional: console.log('Auth event:', event);
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(
    async (email, password, options = {}) => {
      try {
        // Validações de tipos para evitar o "bad_json"
        if (typeof email !== 'string' || typeof password !== 'string') {
          const msg = 'Email e senha devem ser strings.';
          toast({
            variant: 'destructive',
            title: 'Sign up Failed',
            description: msg,
          });
          return { data: null, error: new Error(msg) };
        }

        // options.data pode conter metadados do usuário (ex.: name)
        const safeOptions = {
          ...options,
          // Garante que data é um objeto
          data: typeof options.data === 'object' && options.data !== null ? options.data : undefined,
          // Se você usa confirmação por e-mail, configure isso (opcional)
          // emailRedirectTo: options.emailRedirectTo ?? 'https://seuapp.com/welcome',
        };

        console.log('Calling supabase.auth.signUp with:', {
          email,
          hasPassword: !!password,
          options: safeOptions,
        });

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: safeOptions,
        });

        if (error) {
          console.error('Supabase SignUp Error:', error);
          toast({
            variant: 'destructive',
            title: 'Sign up Failed',
            description: error.message || 'Something went wrong',
          });
        } else {
          // Em projetos com confirmação por e-mail ativada:
          // data.user pode estar null e data.session será null.
          // O usuário precisa clicar no link do e-mail.
          toast({
            variant: 'default',
            title: 'Cadastro iniciado',
            description:
              'Se a confirmação por e-mail estiver ativada, verifique sua caixa de entrada para concluir o cadastro.',
          });
        }

        return { data, error };
      } catch (err) {
        console.error('Unexpected signUp error:', err);
        toast({
          variant: 'destructive',
          title: 'Sign up Failed',
          description: 'Erro inesperado ao cadastrar.',
        });
        return { data: null, error: err };
      }
    },
    [toast]
  );

  const signIn = useCallback(
    async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Supabase SignIn Error:', error);
          toast({
            variant: 'destructive',
            title: 'Sign in Failed',
            description: error.message || 'Something went wrong',
          });
        }
        return { data, error };
      } catch (err) {
        console.error('Unexpected signIn error:', err);
        toast({
          variant: 'destructive',
          title: 'Sign in Failed',
          description: 'Erro inesperado ao entrar.',
        });
        return { data: null, error: err };
      }
    },
    [toast]
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase SignOut Error:', error);
        toast({
          variant: 'destructive',
          title: 'Sign out Failed',
          description: error.message || 'Something went wrong',
        });
      }
      return { error };
    } catch (err) {
      console.error('Unexpected signOut error:', err);
      toast({
        variant: 'destructive',
        title: 'Sign out Failed',
        description: 'Erro inesperado ao sair.',
      });
      return { error: err };
    }
  }, [toast]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }),
    [user, session, loading, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
