// lucide v1 removed brand icons, so LinkedIn verification is shown with a
// neutral identity mark plus an accessible label rather than the wordmark.
import { BadgeCheckIcon, MinusIcon, PlusIcon, UserCheckIcon } from "lucide-react";

import { StarRating } from "@/components/public/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatMonthYear } from "@/lib/format";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ReviewCard({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) {
  const initials = review.reviewer_name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <article className={cn("card-modern flex flex-col gap-4 p-6", className)}>
      <header className="flex items-start gap-3">
        <Avatar className="size-11">
          {review.reviewer_avatar_url && (
            <AvatarImage
              src={review.reviewer_avatar_url}
              alt=""
              aria-hidden="true"
            />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
            {review.reviewer_name}
            {review.verified_linkedin && (
              <UserCheckIcon
                className="size-3.5 text-[#0a66c2]"
                aria-label="Identity verified via LinkedIn"
              />
            )}
            {review.verified_badge && (
              <BadgeCheckIcon
                className="size-4 text-[var(--color-brand-dark)]"
                aria-label="Verified reviewer"
              />
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {review.reviewer_job_title}
            {review.reviewer_industry && (
              <span className="text-muted-foreground/70">
                {" "}
                / {review.reviewer_industry}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/80">
            {review.reviewer_company_size}
            {review.reviewer_city && ` / ${review.reviewer_city}`}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <StarRating rating={review.overall_rating} size="sm" />
          <time
            dateTime={review.review_date}
            className="mt-1 block text-xs text-muted-foreground"
          >
            {formatMonthYear(review.review_date)}
          </time>
        </div>
      </header>

      <div>
        <h3 className="font-heading text-base font-bold tracking-tight text-balance">
          {review.review_title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
          {review.summary}
        </p>
      </div>

      {(review.pros || review.cons) && (
        <dl className="grid gap-3 sm:grid-cols-2">
          {review.pros && (
            <div className="rounded-2xl bg-[var(--color-brand-light)] p-4">
              <dt className="flex items-center gap-1.5 text-[0.7rem] font-bold tracking-widest text-[var(--color-brand-dark)] uppercase">
                <PlusIcon className="size-3" aria-hidden="true" />
                Pros
              </dt>
              <dd className="mt-2 text-sm leading-relaxed">{review.pros}</dd>
            </div>
          )}
          {review.cons && (
            <div className="rounded-2xl bg-muted p-4">
              <dt className="flex items-center gap-1.5 text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
                <MinusIcon className="size-3" aria-hidden="true" />
                Cons
              </dt>
              <dd className="mt-2 text-sm leading-relaxed">{review.cons}</dd>
            </div>
          )}
        </dl>
      )}

      <footer className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {review.used_for_duration && (
          <Badge variant="muted">Used {review.used_for_duration}</Badge>
        )}
        {review.helpful_count > 0 && (
          <span className="tabular-nums">
            {review.helpful_count} found this helpful
          </span>
        )}
      </footer>

      {review.vendor_response && (
        <div className="rounded-2xl border-l-2 border-[var(--color-brand)] bg-muted/60 p-4">
          <p className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
            Response from the vendor
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {review.vendor_response}
          </p>
        </div>
      )}
    </article>
  );
}
