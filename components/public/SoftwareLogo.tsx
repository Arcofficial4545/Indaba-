import { getBrandColor } from "@/lib/brandColors";
import { LOGO_FILES } from "@/lib/logo-manifest";
import { getBrandKey } from "@/lib/logos";
import { cn } from "@/lib/utils";

/**
 * The product logo.
 *
 * Vendor marks sit on a white plate in both themes. That is deliberate: a
 * number of these marks are dark green or navy wordmarks that would disappear
 * against a dark card, and a consistent plate also stops a grid of nineteen
 * logos looking like a ransom note.
 *
 * Falls back to the initials mark when a product has no brand mapping yet,
 * which is the normal state for a newly added listing.
 */
export function SoftwareLogo({
  name,
  slug,
  logoUrl,
  brandColor,
  size = 48,
  className,
}: {
  name: string;
  slug: string;
  /** An admin uploaded override always wins over the bundled mark. */
  logoUrl?: string | null;
  brandColor?: string | null;
  size?: number;
  className?: string;
}) {
  const colour = getBrandColor(slug, brandColor);
  const brandKey = getBrandKey(slug);
  const bundled = brandKey ? LOGO_FILES[brandKey] : undefined;
  const src = logoUrl ?? bundled?.file ?? null;

  const initials = name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const base = cn(
    "inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl",
    className,
  );

  if (!src) {
    return (
      <span
        className={cn(base, "border bg-card")}
        style={{
          width: size,
          height: size,
          borderColor: `color-mix(in srgb, ${colour} 35%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${colour} 8%, transparent)`,
        }}
      >
        <span
          aria-hidden="true"
          className="font-heading font-bold"
          style={{ color: colour, fontSize: Math.max(12, size * 0.34) }}
        >
          {initials}
        </span>
      </span>
    );
  }

  // A wordmark needs the width; a square glyph wants breathing room instead.
  const isWordmark = bundled?.shape === "wordmark" && !logoUrl;
  const padding = isWordmark
    ? Math.round(size * 0.1)
    : Math.round(size * 0.18);

  return (
    <span
      className={cn(base, "border border-zinc-200/80 bg-white dark:border-zinc-700/60")}
      style={{ width: size, height: size, padding }}
    >
      {/*
        A plain img rather than next/image: these are static assets of well
        under a kilobyte each, so the optimiser has nothing to gain, and it
        avoids needing dangerouslyAllowSVG for the vector marks.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        className="size-full object-contain"
      />
    </span>
  );
}
