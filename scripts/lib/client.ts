import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";

/**
 * Service role client for the seed and maintenance scripts.
 *
 * These scripts write content that no anonymous visitor may write, so they run
 * on the service role key and bypass row level security. That key must never
 * leave a server, which is why it lives in .env.local and not in anything
 * prefixed NEXT_PUBLIC.
 */

config({ path: ".env.local" });
config({ path: ".env" });

export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      [
        "",
        "  Supabase is not configured.",
        "",
        "  Copy .env.local.example to .env.local and fill in:",
        "    NEXT_PUBLIC_SUPABASE_URL",
        "    SUPABASE_SERVICE_ROLE_KEY",
        "",
        "  See docs/SUPABASE_SETUP.md for where to find them.",
        "",
      ].join("\n"),
    );
    process.exit(1);
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Consistent progress output across the scripts. */
export function step(message: string) {
  console.log(`  ${message}`);
}

export function done(message: string) {
  console.log(`\n${message}\n`);
}

export function fail(message: string, error?: unknown): never {
  console.error(`\n  FAILED: ${message}`);
  if (error) console.error(error);
  process.exit(1);
}
