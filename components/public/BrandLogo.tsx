import Link from "next/link";

import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The mark. A rounded lime tile carrying the olive initial, which works at
 * favicon size and never puts white text on the lime.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid size-8 shrink-0 place-items-center rounded-[0.6rem] bg-[var(--color-brand)] font-heading text-lg font-bold text-[var(--color-brand-ink)]",
        className,
      )}
    >
      I
    </span>
  );
}

/**
 * The wordmark. `Ind` in the foreground colour, `aba` in the brand accent.
 * On light surfaces the accent is the deep olive, because the lime itself
 * would be unreadable as text.
 */
export function BrandLogo({
  className,
  withMark = true,
  href = "/",
}: {
  className?: string;
  withMark?: boolean;
  href?: string | null;
}) {
  const content = (
    <>
      {withMark && <LogoMark />}
      <span className="font-heading text-xl font-medium tracking-tight">
        Ind
        <span className="text-[var(--color-brand-dark)]">aba</span>
      </span>
      <span className="sr-only">{SITE_NAME}</span>
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-2 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
    className,
  );

  if (href === null) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href={href} className={classes} aria-label={`${SITE_NAME} home`}>
      {content}
    </Link>
  );
}
