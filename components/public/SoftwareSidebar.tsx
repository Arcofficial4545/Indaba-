import {
  BuildingIcon,
  CalendarIcon,
  GlobeIcon,
  HeadphonesIcon,
  LanguagesIcon,
  TagIcon,
} from "lucide-react";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { AffiliateDisclosureNote } from "@/components/public/AffiliateDisclosureNote";
import { CompareToggle } from "@/components/public/CompareTray";
import { Figure } from "@/components/public/Figure";
import { Badge } from "@/components/ui/badge";
import { formatDate, startingPriceLabel } from "@/lib/format";
import { SITE_COUNTRY } from "@/lib/site";
import type { SoftwareWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The vendor spec sheet. Facts a buyer checks before reading any prose. */
export function SoftwareSidebar({
  software,
  className,
}: {
  software: SoftwareWithCategory;
  className?: string;
}) {
  const price = startingPriceLabel(software);

  const rows = [
    {
      icon: BuildingIcon,
      label: "Vendor",
      value: software.vendor_name ?? "Not stated",
    },
    {
      icon: CalendarIcon,
      label: "Founded",
      value: software.founded_year ? String(software.founded_year) : "Not stated",
    },
    {
      icon: GlobeIcon,
      label: "Available in",
      value:
        software.countries_available.length > 0
          ? software.countries_available.join(", ")
          : SITE_COUNTRY,
    },
    {
      icon: LanguagesIcon,
      label: "Languages",
      value:
        software.languages.length > 0
          ? software.languages.join(", ")
          : "English",
    },
    {
      icon: HeadphonesIcon,
      label: "Support",
      value:
        software.support_types.length > 0
          ? software.support_types.join(", ")
          : "Not stated",
    },
  ];

  return (
    <div className={cn("card-modern flex flex-col gap-6 p-6", className)}>
      <div>
        {/*
          Sentence case, no tracking, no uppercase. A tracked-out ALL-CAPS
          label above a value is on the banned list and it was here twice.
        */}
        <p className="text-small text-[var(--color-text-muted)]">
          Starting price
        </p>
        {price.isCustom ? (
          <p className="mt-2 text-h3 font-medium tracking-[-0.01em]">
            {price.amount}
          </p>
        ) : (
          <Figure
            as="p"
            className="mt-2 text-[2rem] leading-none tracking-[-0.02em]"
          >
            {price.amount}
          </Figure>
        )}
        <p className="mt-2 text-small text-[var(--color-text-muted)]">
          {price.note}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {software.free_trial && (
            <Badge variant="success">
              {software.free_trial_days
                ? `${software.free_trial_days} day free trial`
                : "Free trial"}
            </Badge>
          )}
          {software.free_version && <Badge variant="muted">Free plan</Badge>}
        </div>
      </div>

      <dl className="flex flex-col gap-4 border-t border-border pt-5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <row.icon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <dt className="text-small text-[var(--color-text-muted)]">
                {row.label}
              </dt>
              <dd className="mt-0.5">{row.value}</dd>
            </div>
          </div>
        ))}

        {software.price_verified_at && (
          <div className="flex items-start gap-3">
            <TagIcon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <dt className="text-small text-[var(--color-text-muted)]">
                Price checked
              </dt>
              <dd className="mt-0.5">{formatDate(software.price_verified_at)}</dd>
            </div>
          </div>
        )}
      </dl>

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        <AffiliateCTAButton
          slug={software.slug}
          name={software.name}
          brandColor={software.brand_color}
          className="w-full"
        />

        {/*
          Add to compare, on the money page, filling the same persistent tray
          as the top-rated table and the category listing. Three entry points,
          one control, one piece of state.
        */}
        <label className="flex cursor-pointer items-center justify-center gap-2 text-small text-[var(--color-text-muted)]">
          <CompareToggle slug={software.slug} name={software.name} />
          <span>Add to comparison</span>
        </label>

        <AffiliateDisclosureNote />
      </div>
    </div>
  );
}
