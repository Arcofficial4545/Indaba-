import { sentimentFromDistribution, sentimentPercent } from "@/lib/ranking";
import type { StarDistribution } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A single bar splitting reviews into positive, neutral and negative. Real
 * counts, so a product with a thin tail of unhappy reviewers looks different
 * from one without.
 */
export function SentimentBar({
  distribution,
  className,
  showLegend = true,
}: {
  distribution: StarDistribution;
  className?: string;
  showLegend?: boolean;
}) {
  const sentiment = sentimentFromDistribution(distribution);

  if (sentiment.total === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No reviews yet
      </p>
    );
  }

  const positive = sentimentPercent(sentiment.positive, sentiment.total);
  const neutral = sentimentPercent(sentiment.neutral, sentiment.total);
  const negative = Math.max(0, 100 - positive - neutral);

  return (
    <div className={className}>
      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${positive}% positive, ${neutral}% neutral, ${negative}% negative across ${sentiment.total} reviews`}
      >
        <span
          className="h-full bg-[var(--color-brand)]"
          style={{ width: `${positive}%` }}
        />
        <span
          className="h-full bg-[var(--color-amber)]"
          style={{ width: `${neutral}%` }}
        />
        <span
          className="h-full bg-[var(--color-error)]"
          style={{ width: `${negative}%` }}
        />
      </div>

      {showLegend && (
        <p className="mt-2 text-xs text-muted-foreground tabular-nums">
          {positive}% positive
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          {neutral}% neutral
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          {negative}% negative
        </p>
      )}
    </div>
  );
}
