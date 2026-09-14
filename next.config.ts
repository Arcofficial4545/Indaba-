import type { NextConfig } from "next";
import {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants";

import { validateEnv } from "./lib/env";

const nextConfig: NextConfig = {
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
