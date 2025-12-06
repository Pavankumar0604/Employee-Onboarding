import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export type { Database };

// Supabase configuration - single source of truth
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Environment validation
if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = "❌ Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.";

    if (typeof window !== 'undefined') {
        console.error(errorMsg);
    } else {
        throw new Error(errorMsg);
    }
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
});

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return !!(supabaseUrl && supabaseAnonKey);
};
