/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { appEnv } from '@/lib/env';

export const supabase = createClient(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-application-name': 'jawrah-pixel-platform',
    },
  },
});

export const isSupabaseConfigured = appEnv.hasSupabaseConfig;
