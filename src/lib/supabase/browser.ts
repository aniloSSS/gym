"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

const fallbackSupabaseUrl = "https://tuhvqmiboiaxiakiifee.supabase.co";
const fallbackSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aHZxbWlib2lheGlha2lpZmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTU4MTIsImV4cCI6MjA5NTI3MTgxMn0.p5ftKjgy9PmQrncZpxlRRaANt-JpMo-u64AO9F0822g";

const getSupabaseConfig = () => ({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey
});

export const isSupabaseConfigured = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const createSupabaseBrowserClient = () => {
  if (browserClient) {
    return browserClient;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars are missing.");
  }

  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return browserClient;
};
