import { ExternalLinkIcon } from "lucide-react";

import { getBrandColor, glossyButtonVars } from "@/lib/brandColors";
import { cn } from "@/lib/utils";

/**
 * The "Visit website" call to action.
 *
 * It never points at the vendor directly. It points at /api/track-click, which
 * logs the click and then redirects. That route is built so a logging failure
 * still issues the redirect: money first, analytics second.
 *
 * The button takes the product's own brand colour, so the CTA on the Xero page
 * is Xero blue and the one on the Sage page is Sage green.
 */
export function AffiliateCTAButton({
  slug,
  name,
  brandColor,
  className,
  children,
}: {
  slug: string;
  name: string;
  brandColor?: string | null;
  className?: string;
  children?: React.ReactNode;
}) {
  const colour = getBrandColor(slug, brandColor);

  return (
    <a
      href={`/api/track-click?software=${encodeURIComponent(slug)}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={glossyButtonVars(colour)}
      className={cn(
        "btn-glossy inline-flex h-11 items-center justify-center gap-2 px-5 text-sm",
        "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      {children ?? `Visit ${name}`}
      <ExternalLinkIcon className="size-4" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
