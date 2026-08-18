import { StarIcon } from "lucide-react";

import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

/**
 * Stars plus the number. Colour is never the only signal, so the numeric
 * rating always sits beside the row unless the caller is showing it elsewhere.
 */
export function StarRating({
  rating,
  size = "md",
  showNumber = true,
  reviewCount,
  className,
}: {
  rating: number;
  size?: keyof typeof SIZE_CLASS;
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${formatRating(rating)} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(1, Math.max(0, rounded - star + 1));
          return (
            <span key={star} className="relative inline-block">
              <StarIcon
                className={cn(SIZE_CLASS[size], "text-muted-foreground/30")}
                aria-hidden="true"
              />
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                  aria-hidden="true"
                >
                  <StarIcon
                    className={cn(
                      SIZE_CLASS[size],
                      "fill-[var(--color-star)] text-[var(--color-star)]",
                    )}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {showNumber && (
        <span className="font-heading text-sm font-bold tabular-nums">
          {formatRating(rating)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground tabular-nums">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
