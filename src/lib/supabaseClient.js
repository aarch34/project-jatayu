/**
 * PROJECT JATAYU 3.0 — SUPABASE CLIENT INTEGRATION
 * Configures the Supabase client using environment variables.
 */
import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

/**
 * Helper to check if valid Supabase credentials have been configured
 */
export function isSupabaseConfigured() {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
}

/**
 * Shared Supabase Client instance
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
