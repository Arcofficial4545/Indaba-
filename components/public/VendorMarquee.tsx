import { LOGO_FILES } from "@/lib/logo-manifest";
import { LOGO_OPTICS, opticalHeight } from "@/lib/logo-optics";
import { getBrandKey } from "@/lib/logos";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * The proof row. Seam-free, and a Server Component.
 *
 * SIZING IS BY OPTICAL AREA, NOT BY BOUNDING BOX. Every mark used to render at
 * 32px tall, or 96px wide if the manifest called it a wordmark. A bounding box
 * says nothing about how much ink is inside it, so the solid edge-to-edge
 * lockups — wave, paysoft, payspace — carried roughly twice the visual weight
 * of a thin glyph like Sage or Xero and the row read as a set of unrelated
 * logos at unrelated sizes.
 *
 * `lib/logo-optics.ts` holds a measured height per mark: each file rasterised,
 * its alpha counted, and a height chosen that gives it the same ink area as
 * every other mark. Because the row is painted as flat silhouettes, ink area
 * IS optical weight, so this is a measurement rather than a matter of taste.
 * Run `npx tsx scripts/measure-logos.ts` after changing any asset.
 *
 * Width comes from the same table so every slot is reserved before the image
 * arrives and the row cannot shift.
 */
export function VendorMarquee({ software }: { software: SoftwareWithCategory[] }) {
  const marks = software
    .flatMap((product) => {
      const key = getBrandKey(product.slug);
      const bundled = key ? LOGO_FILES[key] : undefined;
      const src = product.logo_url ?? bundled?.file;
      if (!src) return [];
      /*
        An admin upload has no measurement, so it falls back to the median
        height and a square reservation. That is the one case where the row
        can be slightly uneven, and it is better than dropping the product.
      */
      const optics = product.logo_url || !key ? undefined : LOGO_OPTICS[key];
      const height = product.logo_url ? 32 : opticalHeight(key);
      return [{
        id: product.id,
        name: product.name,
        src,
        height,
        width: Math.round(height * (optics?.aspect ?? 1)),
      }];
    })
    .slice(0, 18);

  if (!marks.length) return null;

  return (
    /* data-bleed: the run is rendered twice and translated, so it is three
       times its own box on purpose. It is a scroller, not a layout bug, and
       the audit rig has an opt-out for exactly this. */
    <div className="hero-marquee" data-bleed="" aria-label="Products reviewed on Indaba">
      <div className="hero-marquee-track">
        {[false, true].map((echo) => (
          <ul key={String(echo)} className="hero-marquee-run" aria-hidden={echo || undefined}>
            {marks.map((mark) => (
              <li key={mark.id}>
                {/* Static bundled marks need no image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mark.src}
                  alt={echo ? "" : `${mark.name} logo`}
                  width={mark.width}
                  height={mark.height}
                  style={{ width: mark.width, height: mark.height ,cursor: "pointer", }}
                  loading="lazy"
                  decoding="async"
                  className="hero-marquee-logo"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
