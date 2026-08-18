import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  getServiceRoleKey,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * Read/write client for Server Components, Server Actions and Route Handlers.
 * Returns null when Supabase is not configured, which is what lets the query
 * layer fall back to local data.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies cannot be set. The
          // session is refreshed in proxy.ts instead, so this is safe to skip.
        }
      },
    },
  });
}

/**
 * Service role client. Bypasses RLS, so this is only ever used from server
 * routes that must write regardless of the caller: affiliate click logging,
 * newsletter signups and contact messages.
 */
export function createServiceRoleClient() {
  const serviceKey = getServiceRoleKey();
  if (!SUPABASE_URL || !serviceKey) return null;

  return createServerClient(SUPABASE_URL, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // A service role client carries no user session.
      },
    },
  });
}
