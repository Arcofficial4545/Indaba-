import { StarIcon } from "lucide-react";

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * One row of a star distribution. The fill animates up from zero on first
 * paint, which the reduced motion rule in globals.css neutralises.
 */
export function RatingBar({
  star,
  count,
  total,
  className,
}: {
  star: number;
  count: number;
  total: number;
  className?: string;
}) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <span className="flex w-10 shrink-0 items-center gap-1 tabular-nums">
        {star}
        <StarIcon
          className="size-3 fill-[var(--color-star)] text-[var(--color-star)]"
          aria-hidden="true"
        />
      </span>

      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <span
          className="animate-fill-bar block h-full rounded-full bg-[var(--color-brand)]"
          style={{ width: `${percent}%` }}
        />
      </span>

      <span className="w-14 shrink-0 text-right text-muted-foreground tabular-nums">
        {formatNumber(count)}
      </span>
    </div>
  );
}
