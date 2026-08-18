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
import { Badge } from "@/components/ui/badge";
import { formatDate, startingPriceLabel } from "@/lib/format";
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
          : "South Africa",
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
        <p className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
          Starting price
        </p>
        <p
          className={cn(
            "mt-2 font-heading font-bold tracking-tight tabular-nums",
            price.isCustom ? "text-xl" : "text-3xl",
          )}
        >
          {price.amount}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{price.note}</p>

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
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-0.5 font-medium">{row.value}</dd>
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
              <dt className="text-xs text-muted-foreground">Price checked</dt>
              <dd className="mt-0.5 font-medium">
                {formatDate(software.price_verified_at)}
              </dd>
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
        <AffiliateDisclosureNote />
      </div>
    </div>
  );
}
