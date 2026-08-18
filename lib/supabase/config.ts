/**
 * Supabase is optional at build time.
 *
 * The whole site renders from typed fallback data until real keys exist, so
 * the design can be reviewed and the pages can be built before the database
 * is provisioned. Every query layer function checks this first.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * The service role key bypasses row level security, so it must never be
 * imported into anything that reaches the browser. Server routes only.
 */
export function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}
