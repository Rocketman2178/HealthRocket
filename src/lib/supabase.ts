import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl?.startsWith('https://') || !supabaseAnonKey) {
  throw new Error(
    'Invalid Supabase configuration. Please check your environment variables:\n' +
    '- VITE_SUPABASE_URL should start with https://\n' +
    '- VITE_SUPABASE_ANON_KEY should not be empty'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
