import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The dark call to action with a lime square that slides from the left edge to
 * the right edge on hover, carrying the arrow with it. Used for "read all
 * reviews" and the other end of section jumps.
 *
 * The square is inside an overflow-hidden shell so it disappears off both
 * edges rather than overlapping the border radius.
 */
export function GlossyCTA({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-4 overflow-hidden rounded-2xl bg-[#232428] py-2 pr-2 pl-6 text-sm font-semibold text-white transition-colors",
        "hover:bg-[#2c2d32] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>

      <span
        aria-hidden="true"
        className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--color-brand)] text-[var(--color-brand-ink)]"
      >
        {/* Leaves to the right */}
        <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-8" />
        {/* Arrives from the left */}
        <ArrowRightIcon className="absolute size-4 -translate-x-8 transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </span>
    </Link>
  );
}
