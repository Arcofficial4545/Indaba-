import { cn } from "@/lib/utils";

const FORMATS = {
  leaderboard: { width: 728, height: 90, label: "Leaderboard" },
  billboard: { width: 970, height: 250, label: "Billboard" },
  halfpage: { width: 300, height: 600, label: "Half page" },
  video: { width: 300, height: 400, label: "Vertical video" },
} as const;

export type AdFormat = keyof typeof FORMATS;

/**
 * A display advertising slot.
 *
 * Every unit carries a visible "Sponsored" label. That is a disclosure
 * requirement, not decoration, and it also keeps the ad visually separated
 * from editorial content so the page still reads as independent.
 *
 * Until an ad network is wired in, the slot reserves its exact dimensions
 * rather than collapsing. Reserving the space now is what stops a layout
 * shift appearing the day the script goes live.
 */
export function SponsoredAd({
  format,
  className,
}: {
  format: AdFormat;
  className?: string;
}) {
  const { width, height, label } = FORMATS[format];

  return (
    <aside
      aria-label="Advertisement"
      className={cn("flex flex-col items-center gap-2", className)}
    >
      <p className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
        Sponsored
      </p>
      <div
        className="grid w-full place-items-center rounded-2xl border border-dashed border-border bg-muted/40"
        style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}
      >
        <p className="text-xs text-muted-foreground tabular-nums">
          {label} {width}x{height}
        </p>
      </div>
    </aside>
  );
}
