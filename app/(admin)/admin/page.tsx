import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangleIcon, ArrowRightIcon } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  robots: { index: false, follow: false },
};

async function count(table: string, filter?: [string, string]) {
  const supabase = await createClient();
  if (!supabase) return null;

  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) query = query.eq(filter[0], filter[1]);

  const { count: total } = await query;
  return total ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    software,
    published,
    reviews,
    pendingReviews,
    articles,
    subscribers,
    messages,
  ] = await Promise.all([
    count("software"),
    count("software", ["status", "published"]),
    count("reviews", ["status", "published"]),
    count("reviews", ["status", "hidden"]),
    count("articles", ["status", "published"]),
    count("newsletter_subscribers", ["status", "confirmed"]),
    count("contact_messages", ["handled", "false"]),
  ]);

  /* Products whose price has never been verified against a vendor page. This
     is the single most useful number on this screen, because a stale or
     unverified price is what costs the site its credibility. */
  const { data: unverified } = supabase
    ? await supabase
        .from("software")
        .select("id, name, slug, price_verified_at, starting_price")
        .is("price_verified_at", null)
        .eq("status", "published")
        .limit(10)
    : { data: null };

  const { data: recentReviews } = supabase
    ? await supabase
        .from("reviews")
        .select("id, reviewer_name, review_title, overall_rating, status, review_date")
        .order("review_date", { ascending: false })
        .limit(6)
    : { data: null };

  if (!supabase) {
    return (
      <AdminShell title="Dashboard">
        <div className="card-modern p-8">
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Supabase is not configured
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The public site is running on local fallback data. Follow
            docs/SUPABASE_SETUP.md to connect a database, then reload this page.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Dashboard" description="What needs attention">
      <div className="flex flex-col gap-8">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Published software" value={published} of={software} href="/admin/software" />
          <Stat label="Published reviews" value={reviews} href="/admin/reviews" />
          <Stat label="Reviews awaiting moderation" value={pendingReviews} href="/admin/reviews" highlight={Boolean(pendingReviews)} />
          <Stat label="Published articles" value={articles} href="/admin/articles" />
          <Stat label="Confirmed subscribers" value={subscribers} href="/admin/newsletter" />
          <Stat label="Unhandled messages" value={messages} href="/admin/contact" highlight={Boolean(messages)} />
        </dl>

        {/* Unverified pricing ------------------------------------------- */}
        <section aria-labelledby="unverified-heading">
          <h2
            id="unverified-heading"
            className="mb-4 flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
          >
            <AlertTriangleIcon
              className="size-4 text-[var(--color-amber-dark)]"
              aria-hidden="true"
            />
            Prices never verified against a vendor page
          </h2>

          {!unverified || unverified.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Every published product has a verified price. Well done.
            </p>
          ) : (
            <div className="card-modern divide-y divide-border">
              {unverified.map((row) => (
                <Link
                  key={String(row.id)}
                  href={`/admin/software/${String(row.id)}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <span className="font-medium">{String(row.name)}</span>
                  <span className="flex items-center gap-3 text-muted-foreground">
                    {row.starting_price === null ? (
                      <Badge variant="muted">No published price</Badge>
                    ) : (
                      <Badge variant="amber">Unverified</Badge>
                    )}
                    <ArrowRightIcon className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent reviews ----------------------------------------------- */}
        <section aria-labelledby="recent-reviews-heading">
          <h2
            id="recent-reviews-heading"
            className="mb-4 font-heading text-lg font-bold tracking-tight"
          >
            Latest reviews
          </h2>

          {!recentReviews || recentReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="card-modern divide-y divide-border">
              {recentReviews.map((row) => (
                <Link
                  key={String(row.id)}
                  href={`/admin/reviews/${String(row.id)}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {String(row.review_title)}
                    </span>
                    <span className="text-muted-foreground">
                      {String(row.reviewer_name)} / {formatDate(String(row.review_date))}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="font-heading font-bold tabular-nums">
                      {String(row.overall_rating)}
                    </span>
                    <Badge variant={row.status === "published" ? "success" : "muted"}>
                      {String(row.status)}
                    </Badge>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  of,
  href,
  highlight,
}: {
  label: string;
  value: number | null;
  of?: number | null;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card-modern card-modern-hover flex flex-col gap-1 p-5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
    >
      <dt className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd
        className={
          highlight
            ? "font-heading text-3xl font-bold tracking-tight text-[var(--color-amber-dark)] tabular-nums"
            : "font-heading text-3xl font-bold tracking-tight tabular-nums"
        }
      >
        {value === null ? "n/a" : formatNumber(value)}
        {of !== undefined && of !== null && (
          <span className="ml-1.5 text-base font-medium text-muted-foreground">
            of {formatNumber(of)}
          </span>
        )}
      </dd>
    </Link>
  );
}
