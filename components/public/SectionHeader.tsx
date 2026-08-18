import type { LucideIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The centred section header. Three parts stacked and centred: a pill eyebrow,
 * a large heading where two or three words carry the lime highlight, and a
 * muted subtitle.
 *
 * Pass the heading split into `title` and `highlight` rather than embedding
 * markup, so the highlight rule stays enforceable: one per section, never
 * twice in the same heading.
 */
export function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  highlight,
  titleAfter,
  subtitle,
  className,
  align = "center",
  headingId,
}: {
  eyebrow: string;
  icon?: LucideIcon;
  title: string;
  highlight?: string;
  titleAfter?: string;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "center" | "start";
  headingId?: string;
}) {
  const centred = align === "center";

  return (
    <div
      className={cn(
        "flex max-w-xl flex-col gap-5 pb-2",
        centred ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <p className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-foreground/80">
        {Icon && (
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
        {eyebrow}
      </p>

      <h2
        id={headingId}
        className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-[2.6rem] sm:leading-[1.18]"
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="brand-highlight">{highlight}</span>
          </>
        )}
        {titleAfter && ` ${titleAfter}`}
      </h2>

      {subtitle && (
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
