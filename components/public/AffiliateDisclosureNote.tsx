import Link from "next/link";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Sits next to every commercial call to action.
 *
 * This is not boilerplate. It is both an ethical obligation and a ranking
 * factor, and the wording is deliberately plain: what we earn, that it costs
 * the reader nothing, and that it does not touch the ratings.
 */
export function AffiliateDisclosureNote({
  className,
  variant = "inline",
}: {
  className?: string;
  variant?: "inline" | "panel";
}) {
  const text = (
    <>
      We may earn a commission if you buy through this link, at no extra cost to
      you. It never affects our ratings or where a product ranks.{" "}
      <Link
        href="/affiliate-disclosure"
        className="underline underline-offset-2 hover:text-foreground"
      >
        How we make money
      </Link>
      .
    </>
  );

  if (variant === "panel") {
    return (
      <p
        className={cn(
          "flex items-start gap-2 rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground",
          className,
        )}
      >
        <InfoIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>{text}</span>
      </p>
    );
  }

  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {text}
    </p>
  );
}
