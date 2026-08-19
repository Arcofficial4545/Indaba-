import { CheckIcon, MinusIcon } from "lucide-react";

import { formatPricePerPeriod } from "@/lib/format";
import type { PricingPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Plan by plan comparison.
 *
 * The cards above this say what each plan costs. This says what the jump
 * between them actually buys, which is the question a reader is really asking
 * when they scroll past the middle tier.
 *
 * Two kinds of row. First the terms every plan records: price, billing period,
 * VAT basis, seat limit, and the line describing what the tier covers. Then a
 * tick matrix of per plan features, but only for the products where a vendor
 * has actually published one. Most have not, and a matrix of empty columns
 * would say less than the note row above it.
 */
export function PricingTable({
  plans,
  name,
  className,
}: {
  plans: PricingPlan[];
  name: string;
  className?: string;
}) {
  // A one column table compares nothing, so there is nothing to draw.
  if (plans.length < 2) return null;

  const features: string[] = [];
  for (const plan of plans) {
    for (const feature of plan.features) {
      if (!features.includes(feature)) features.push(feature);
    }
  }

  const terms: { label: string; value: (plan: PricingPlan) => string }[] = [
    {
      label: "Price",
      value: (plan) =>
        plan.price === null
          ? "On request"
          : formatPricePerPeriod(plan.price, plan.period, plan.currency),
    },
    {
      label: "VAT",
      value: (plan) =>
        plan.vat_inclusive === true
          ? "Included"
          : plan.vat_inclusive === false
            ? "Excluded"
            : "Unconfirmed",
    },
  ];

  // Only offered as rows when at least one plan has something to put in them.
  if (plans.some((plan) => plan.user_limit)) {
    terms.push({ label: "Users", value: (plan) => plan.user_limit || "Not stated" });
  }
  if (plans.some((plan) => plan.description)) {
    terms.push({
      label: "What it covers",
      value: (plan) => plan.description || "Not stated",
    });
  }

  return (
    <div className={cn("card-modern overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">{name} plans compared</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="p-4 text-left font-medium">
                Plan
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  scope="col"
                  className="p-4 text-center font-medium whitespace-nowrap"
                >
                  <span
                    className={cn(
                      "font-heading font-bold tracking-tight",
                      plan.highlighted && "text-[var(--color-brand-dark)]",
                    )}
                  >
                    {plan.name}
                  </span>
                  {plan.highlighted && (
                    <span className="sr-only">, the plan most people take</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {terms.map((term) => (
              <tr key={term.label} className="border-b border-border last:border-0">
                <th
                  scope="row"
                  className="p-4 text-left font-normal text-muted-foreground"
                >
                  {term.label}
                </th>
                {plans.map((plan) => (
                  <td
                    key={plan.name}
                    className="p-4 text-center text-pretty tabular-nums"
                  >
                    {term.value(plan)}
                  </td>
                ))}
              </tr>
            ))}

            {features.map((feature) => (
              <tr key={feature} className="border-b border-border last:border-0">
                <th
                  scope="row"
                  className="p-4 text-left font-normal text-muted-foreground"
                >
                  {feature}
                </th>
                {plans.map((plan) => {
                  const included = plan.features.includes(feature);
                  return (
                    <td key={plan.name} className="p-4 text-center">
                      {included ? (
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
                      {/* The tick is never the only signal. */}
                      <span className="sr-only">
                        {plan.name} {included ? "includes" : "does not include"}{" "}
                        {feature}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
