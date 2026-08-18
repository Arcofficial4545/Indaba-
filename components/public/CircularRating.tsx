import { formatRating } from "@/lib/format";
import { withAlpha } from "@/lib/brandColors";
import { cn } from "@/lib/utils";

/**
 * The rating dial, drawn in the product's own accent colour.
 *
 * An SVG ring rather than a conic gradient, because a stroke dash gives a
 * clean rounded cap and scales without banding.
 */
export function CircularRating({
  rating,
  colour,
  size = 132,
  label = "out of 5",
  className,
}: {
  rating: number;
  colour: string;
  size?: number;
  label?: string;
  className?: string;
}) {
  const stroke = Math.max(8, Math.round(size * 0.085));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, rating / 5));

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={withAlpha(colour, 0.16)}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p
            className="font-heading font-bold tracking-tight tabular-nums"
            style={{ fontSize: size * 0.26 }}
          >
            {formatRating(rating)}
          </p>
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
