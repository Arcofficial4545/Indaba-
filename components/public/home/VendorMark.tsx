import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { LOGO_FILES } from "@/lib/logo-manifest";
import { LOGO_OPTICS, opticalHeight } from "@/lib/logo-optics";
import { getBrandKey } from "@/lib/logos";

// The catalogue still names Paymaster. Its original vendor wordmark is scoped
// to the homepage; provenance is recorded in docs/design/design-notes.md.
const PAYMASTER_LOGO = { file: "/logos/category-paymaster.png", height: 22, aspect: 300 / 57 };

/** Preserve measured proportions of both wordmarks and compact symbols. */
export function VendorMark({ name, slug, logoUrl, size = 28 }: {
  name: string;
  slug: string;
  logoUrl?: string | null;
  size?: number;
}) {
  const key = getBrandKey(slug);
  const bundled = key ? LOGO_FILES[key] : undefined;
  const local = slug === "paymaster" ? PAYMASTER_LOGO : undefined;
  const src = logoUrl ?? bundled?.file ?? local?.file;
  if (!src) {
    return <span role="img" aria-label={`${name} logo`}><SoftwareLogo name={name} slug={slug} size={size} /></span>;
  }
  const optics = logoUrl ? undefined : (key ? LOGO_OPTICS[key] : local);
  const wordmark = !logoUrl && (bundled?.shape === "wordmark" || key === "odoo" || !!local);
  const opticalSize = Math.round((optics?.height ?? opticalHeight(key)) * size / 32);
  const height = wordmark ? opticalSize : Math.max(size, opticalSize);
  const width = Math.round(height * (optics?.aspect ?? 1));
  return (
    // Keep native vendor artwork, including SVGs, at its measured proportions.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`${name} logo`} width={width} height={height}
      style={{ width, height }} className={`home-vendor-mark${wordmark ? " home-vendor-wordmark" : ""}`}
      loading="lazy" decoding="async" />
  );
}
