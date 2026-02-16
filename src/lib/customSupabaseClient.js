import { createClient } from '@supabase/supabase-js';



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//const supabaseUrl = 'https://rcmxhipkvyyjhblphwhh.supabase.co';
//const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbXhoaXBrdnl5amhibHBod2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTg5NjAsImV4cCI6MjA3NDMzNDk2MH0.dg73i1EDoEkm03wdWJWVFcr3SMk4sYIdbx8fS7DqFIQ';

console.log('ENV:', import.meta.env); // verifique se VITE_SUPABASE_* aparecem

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas.');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);