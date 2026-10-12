import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "../config";

let client: SupabaseClient | null = null;

/** Cliente anônimo sem cookies — usado nas páginas públicas (permite cache/ISR). Somente leitura via RLS. */
export function getPublicClient() {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
