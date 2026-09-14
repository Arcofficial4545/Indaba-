/**
 * Startup check for environment variables.
 *
 * Run from next.config.ts on production builds and production server start, so
 * a misconfigured deploy fails at build instead of serving pages that quietly
 * fall back to local data, drop newsletter signups, or skip IP hashing.
 *
 * Deliberately free of `server-only` and path aliases, because next.config.ts
 * loads it outside the app bundle.
 */

/** Reads the `role` claim of a legacy JWT style Supabase key. */
function jwtRole(key: string): string | null {
  const payload = key.split(".")[1];
  if (!payload) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof claims.role === "string" ? claims.role : null;
  } catch {
    return null;
  }
}

export function validateEnv(env: NodeJS.ProcessEnv = process.env): void {
  const problems: string[] = [];

  const required = (name: string): string => {
    const value = env[name]?.trim() ?? "";
    if (!value) problems.push(`${name} is not set`);
    return value;
  };

  const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
  if (supabaseUrl && !supabaseUrl.startsWith("https://")) {
    problems.push("NEXT_PUBLIC_SUPABASE_URL must be an https URL");
  }

  /*
    The anon key is inlined into the browser bundle. A service role key in this
    slot would publish full database access to every visitor, so it is worth
    refusing to build rather than trusting that nobody pasted the wrong one.
  */
  const anonKey = required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (
    anonKey &&
    (anonKey.startsWith("sb_secret_") || jwtRole(anonKey) === "service_role")
  ) {
    problems.push(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY holds a service role key. Replace it with the anon key and rotate the service role key",
    );
  }

  const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");
  if (serviceKey && serviceKey === anonKey) {
    problems.push("SUPABASE_SERVICE_ROLE_KEY is the same value as the anon key");
  }

  required("IP_HASH_PEPPER");

  // Email is optional until a sending domain exists, but half configured is a
  // mistake worth catching: a key with no sender address sends nothing.
  const hasResendKey = Boolean(env.RESEND_API_KEY?.trim());
  const hasEmailFrom = Boolean(env.EMAIL_FROM?.trim());
  if (hasResendKey !== hasEmailFrom) {
    problems.push("RESEND_API_KEY and EMAIL_FROM must be set together");
  }

  // Optional, because lib/site.ts falls back to the real domain. A localhost
  // value on the production deploy would put localhost in every canonical URL.
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    if (!URL.canParse(siteUrl)) {
      problems.push("NEXT_PUBLIC_SITE_URL is not a valid URL");
    } else if (
      env.VERCEL_ENV === "production" &&
      /localhost|127\.0\.0\.1/.test(siteUrl)
    ) {
      problems.push("NEXT_PUBLIC_SITE_URL points at localhost on the production deploy");
    }
  }

  if (problems.length > 0) {
    throw new Error(
      [
        "Environment check failed:",
        ...problems.map((problem) => `  - ${problem}`),
        "",
        "See .env.example. For a local build with no Supabase project, set SKIP_ENV_VALIDATION=1.",
      ].join("\n"),
    );
  }
}
