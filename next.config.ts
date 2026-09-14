import type { NextConfig } from "next";
import {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants";

import { validateEnv } from "./lib/env";

/*
  Sent with every response. The site is never meant to be framed (which blocks
  clickjacking of the admin), content types are never sniffed, full URLs are
  not leaked to other sites, unused browser features are switched off, and
  browsers are held to HTTPS.

  A Content-Security-Policy is not set yet: the inline theme script and the
  JSON-LD blocks need nonces or hashes first, and a policy that breaks the
  theme on load is worse than none.
*/
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // No "X-Powered-By: Next.js": there is no reason to name the framework.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  images: {
    /*
      AVIF first, WebP behind it, and the original PNG for anything that
      supports neither. Next picks per request from the Accept header, and the
      array order is the preference order.

      This is what satisfies the brief's "convert the scale to AVIF/WebP with
      a PNG fallback" without a build step and without committing three copies
      of the asset. It matters that it is automatic: the hero illustration is
      going to be replaced with a real export, and a manual conversion
      pipeline would leave a stale AVIF sitting in front of the new PNG.

      Note this costs storage, because each format is cached separately.
    */
    formats: ["image/avif", "image/webp"],
  },
};

export default function config(phase: string): NextConfig {
  // `next dev` keeps working on fallback data with no Supabase project. Builds
  // and production servers do not, so a misconfigured deploy fails here.
  const isProduction =
    phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER;
  if (isProduction && process.env.SKIP_ENV_VALIDATION !== "1") {
    validateEnv();
  }
  return nextConfig;
}
