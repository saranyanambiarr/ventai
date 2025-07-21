import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided. Please create a .env file in the /frontend directory with VITE_SUPABASE_URL and VITE_SUPabase_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 