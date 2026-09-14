import type { LucideIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A section header.
 *
 * It used to be three things stacked and centred: a pill eyebrow with an icon,
 * a large heading where two or three words carried the lime highlight, and a
 * muted subtitle. All three are now banned patterns — a pill eyebrow above a
 * heading, an accented word inside one, and centred section text — so the
 * component keeps its name and its call sites and stops doing any of them.
 *
 * The props survive on purpose. `eyebrow` becomes a quiet label above the
 * heading rather than a pill, `highlight` is concatenated into the title as
 * ordinary words, and `icon` is accepted and ignored. That let four call sites
 * across the template pages be corrected in one edit rather than four, and the
 * props fall away as those pages are rewritten.
 *
 * New sections should use `RailSection` instead, which puts the label and a
 * live count on the structural rail where the rest of the site keeps them.
 */
export function SectionHeader({
  eyebrow,
  title,
  highlight,
  titleAfter,
  subtitle,
  className,
  headingId,
}: {
  eyebrow: string;
  /** Accepted and ignored. Icons no longer appear above headings. */
  icon?: LucideIcon;
  title: string;
  /** Joined into the title as plain words. No longer accented. */
  highlight?: string;
  titleAfter?: string;
  subtitle?: React.ReactNode;
  className?: string;
  /** Accepted and ignored. Section text is left aligned everywhere. */
  align?: "center" | "start";
  headingId?: string;
}) {
  const heading = [title, highlight, titleAfter].filter(Boolean).join(" ");

  return (
    <div className={cn("flex max-w-[62ch] flex-col items-start", className)}>
      <p className="text-small text-[var(--color-text-muted)]">{eyebrow}</p>

      <h2 id={headingId} className="section-heading reveal-line mt-2">
        <span>{heading}</span>
      </h2>

      {subtitle && (
        <p className="mt-4 leading-relaxed text-[var(--color-text-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
