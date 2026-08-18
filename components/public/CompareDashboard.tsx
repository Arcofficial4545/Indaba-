import { CheckIcon, MinusIcon } from "lucide-react";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { CircularRating } from "@/components/public/CircularRating";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { getBrandColor } from "@/lib/brandColors";
import { formatNumber, formatRating, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIMENSIONS = [
  { key: "ease_of_use_rating", label: "Ease of use" },
  { key: "value_for_money_rating", label: "Value for money" },
  { key: "customer_service_rating", label: "Customer service" },
  { key: "functionality_rating", label: "Functionality" },
] as const;

export function CompareDashboard({
  a,
  b,
}: {
  a: SoftwareWithCategory;
  b: SoftwareWithCategory;
}) {
  const colourA = getBrandColor(a.slug, a.brand_color);
  const colourB = getBrandColor(b.slug, b.brand_color);

  // The union of both feature lists, so neither product's strengths are hidden.
  const features = Array.from(
    new Set([...a.features, ...b.features]),
  ).sort((x, y) => x.localeCompare(y));

  return (
    <div className="flex flex-col gap-14">
      {/* Ratings side by side --------------------------------------------- */}
      <section aria-labelledby="ratings-compare-heading">
        <h2 id="ratings-compare-heading" className="sr-only">
          Ratings compared
        </h2>

        <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
          <div className="grid gap-2 md:grid-cols-2">
            {[a, b].map((software, index) => (
              <div
                key={software.id}
                className="flex flex-col items-center gap-5 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 text-center dark:border-zinc-800"
              >
                <SoftwareLogo
                  name={software.name}
                  slug={software.slug}
                  logoUrl={software.logo_url}
                  brandColor={software.brand_color}
                  size={64}
                />
                <h3 className="font-heading text-xl font-bold tracking-tight">
                  {software.name}
                </h3>
                <CircularRating
                  rating={software.overall_rating}
                  colour={index === 0 ? colourA : colourB}
                  size={116}
                />
                <StarRating
                  rating={software.overall_rating}
                  showNumber={false}
                />
                <p className="text-sm text-muted-foreground tabular-nums">
                  {formatNumber(software.review_count)} verified reviews
                </p>
                <AffiliateCTAButton
                  slug={software.slug}
                  name={software.name}
                  brandColor={software.brand_color}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dimension by dimension ------------------------------------------- */}
      <section aria-labelledby="dimensions-heading">
        <h2
          id="dimensions-heading"
          className="mb-6 font-heading text-2xl font-bold tracking-tight"
        >
          Where each one wins
        </h2>

        <div className="card-modern overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">
              {a.name} and {b.name} rated across four dimensions
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="p-4 text-left font-medium">
                  Rated on
                </th>
                <th scope="col" className="p-4 text-center font-medium">
                  {a.name}
                </th>
                <th scope="col" className="p-4 text-center font-medium">
                  {b.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((dimension) => {
                const left = a[dimension.key];
                const right = b[dimension.key];
                return (
                  <tr key={dimension.key} className="border-b border-border last:border-0">
                    <th scope="row" className="p-4 text-left font-normal text-muted-foreground">
                      {dimension.label}
                    </th>
                    <ScoreCell value={left} wins={left > right} />
                    <ScoreCell value={right} wins={right > left} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing ----------------------------------------------------------- */}
      <section aria-labelledby="pricing-compare-heading">
        <h2
          id="pricing-compare-heading"
          className="mb-6 font-heading text-2xl font-bold tracking-tight"
        >
          What they cost
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {[a, b].map((software) => {
            const price = startingPriceLabel(software);
            return (
              <div key={software.id} className="card-modern flex flex-col gap-3 p-6">
                <p className="text-sm font-medium">{software.name}</p>
                <p
                  className={cn(
                    "font-heading font-bold tracking-tight tabular-nums",
                    price.isCustom ? "text-xl" : "text-3xl",
                  )}
                >
                  {price.amount}
                </p>
                <p className="text-sm text-muted-foreground">{price.note}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {software.free_trial && (
                    <Badge variant="success">Free trial</Badge>
                  )}
                  {software.free_version && (
                    <Badge variant="muted">Free plan</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature matrix ---------------------------------------------------- */}
      {features.length > 0 && (
        <section aria-labelledby="features-compare-heading">
          <h2
            id="features-compare-heading"
            className="mb-6 font-heading text-2xl font-bold tracking-tight"
          >
            Feature by feature
          </h2>

          <div className="card-modern overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Features present in {a.name} and {b.name}
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="p-4 text-left font-medium">
                      Feature
                    </th>
                    <th scope="col" className="p-4 text-center font-medium whitespace-nowrap">
                      {a.name}
                    </th>
                    <th scope="col" className="p-4 text-center font-medium whitespace-nowrap">
                      {b.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature} className="border-b border-border last:border-0">
                      <th scope="row" className="p-4 text-left font-normal text-muted-foreground">
                        {feature}
                      </th>
                      <HasCell has={a.features.includes(feature)} name={a.name} feature={feature} />
                      <HasCell has={b.features.includes(feature)} name={b.name} feature={feature} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ScoreCell({ value, wins }: { value: number; wins: boolean }) {
  return (
    <td className="p-4 text-center">
      <span
        className={cn(
          "inline-block rounded-full px-3 py-1 font-heading font-bold tabular-nums",
          wins
            ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)]"
            : "text-muted-foreground",
        )}
      >
        {formatRating(value)}
      </span>
      {wins && <span className="sr-only">, higher</span>}
    </td>
  );
}

function HasCell({
  has,
  name,
  feature,
}: {
  has: boolean;
  name: string;
  feature: string;
}) {
  return (
    <td className="p-4 text-center">
      {has ? (
        <CheckIcon
          className="mx-auto size-4 text-[var(--color-brand-dark)]"
          aria-hidden="true"
        />
      ) : (
        <MinusIcon
          className="mx-auto size-4 text-muted-foreground/40"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">
        {name} {has ? "has" : "does not list"} {feature}
      </span>
    </td>
  );
}
