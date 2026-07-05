
import { useAuth } from '@/contexts/SupabaseAuthContext'; // ✅ FALTAVA ISSO
import { supabase } from '@/lib/customSupabaseClient';


export const useCompanyId = () => {
  const { user } = useAuth();

  const resolveCompanyId = async () => {
    // ✅ PROTEÇÃO AQUI
    if (!user) return null;

    const fromUser =
      user?.user_metadata?.xid_empresa ??
      user?.xid_empresa ??
      null;

    if (fromUser) return fromUser;

    const { data, error } = await supabase
      .from('profiles')
      .select('xid_empresa')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('Erro ao resolver empresa', error);
      return null;
    }

    return data?.xid_empresa ?? null;
  };

  return resolveCompanyId;
};