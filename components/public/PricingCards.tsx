import { CheckIcon, InfoIcon } from "lucide-react";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { Badge } from "@/components/ui/badge";
import { formatPricePerPeriod, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PricingCards({
  software,
  className,
}: {
  software: SoftwareWithCategory;
  className?: string;
}) {
  const plans = software.pricing_plans;
  const starting = startingPriceLabel(software);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {plans.length > 0 ? (
        <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
          <div
            className={cn(
              "grid gap-2",
              plans.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2",
            )}
          >
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex flex-col gap-4 rounded-[1.4rem] border bg-card p-6",
                  plan.highlighted
                    ? "border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]"
                    : "border-zinc-200/70 dark:border-zinc-800",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-base font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.highlighted && <Badge variant="success">Popular</Badge>}
                </div>

                <div>
                  <p className="font-heading text-2xl font-bold tracking-tight tabular-nums">
                    {plan.price === null
                      ? "On request"
                      : formatPricePerPeriod(
                          plan.price,
                          plan.period,
                          plan.currency,
                        )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.vat_inclusive === true
                      ? "Including VAT"
                      : plan.vat_inclusive === false
                        ? "Excluding VAT"
                        : "VAT status unconfirmed"}
                    {plan.user_limit ? ` / ${plan.user_limit}` : ""}
                  </p>
                </div>

                {plan.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                )}

                {plan.features.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckIcon
                          className="mt-0.5 size-3.5 shrink-0 text-[var(--color-brand-dark)]"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* No plan breakdown captured yet, so show the starting price honestly
           rather than inventing tiers. */
        <div className="card-modern flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-3xl font-bold tracking-tight tabular-nums">
              {starting.amount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{starting.note}</p>
          </div>
          <AffiliateCTAButton
            slug={software.slug}
            name={software.name}
            brandColor={software.brand_color}
          >
            See current pricing
          </AffiliateCTAButton>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        <InfoIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          List prices move, and vendors do not always announce it. We re check
          every listed price each quarter, but confirm the current figure on the
          vendor&apos;s own South African pricing page before you budget.
          {software.price_verified_at
            ? ""
            : " This price has not yet been verified against a vendor page."}
        </span>
      </p>
    </div>
  );
}
