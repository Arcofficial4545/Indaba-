import "server-only";

import { createClient } from "@supabase/supabase-js";

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * Public content has the same permissions for every visitor, including during
 * static generation when there is no request or cookie store. Use the anon
 * key and let RLS restrict the records; never attach an admin session here.
 * Authenticated pages and actions continue using the cookie-aware server client.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
