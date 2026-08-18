import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { formatNumber } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics | Admin",
  robots: { index: false, follow: false },
};

const WINDOW_DAYS = 30;

/**
 * Reading the clock is a side effect, so it lives in the loader rather than in
 * the component body where the compiler rightly objects to it.
 */
async function loadClicks(): Promise<{ software_name: string }[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const since = new Date(
    Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data } = await supabase
    .from("affiliate_clicks")
    .select("software_name, clicked_at")
    .gte("clicked_at", since)
    .limit(5000);

  return (data ?? []) as { software_name: string }[];
}

export default async function AdminAnalyticsPage() {
  const clicks = await loadClicks();

  // Aggregated here rather than in SQL because the volume is small and this
  // avoids a database view that would need its own migration.
  const byProduct = new Map<string, number>();
  for (const click of clicks) {
    const name = String(click.software_name);
    byProduct.set(name, (byProduct.get(name) ?? 0) + 1);
  }

  const ranked = Array.from(byProduct.entries()).sort((a, b) => b[1] - a[1]);
  const total = clicks.length;
  const busiest = ranked[0]?.[1] ?? 1;

  return (
    <AdminShell
      title="Analytics"
      description={`Affiliate clicks over the last ${WINDOW_DAYS} days`}
    >
      <div className="flex flex-col gap-8">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="card-modern p-5">
            <dt className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
              Total clicks
            </dt>
            <dd className="font-heading text-3xl font-bold tracking-tight tabular-nums">
              {formatNumber(total)}
            </dd>
          </div>
          <div className="card-modern p-5">
            <dt className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
              Products clicked
            </dt>
            <dd className="font-heading text-3xl font-bold tracking-tight tabular-nums">
              {formatNumber(ranked.length)}
            </dd>
          </div>
          <div className="card-modern p-5">
            <dt className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
              Daily average
            </dt>
            <dd className="font-heading text-3xl font-bold tracking-tight tabular-nums">
              {formatNumber(Math.round(total / WINDOW_DAYS))}
            </dd>
          </div>
        </dl>

        <section aria-labelledby="by-product-heading">
          <h2
            id="by-product-heading"
            className="mb-4 font-heading text-lg font-bold tracking-tight"
          >
            Clicks by product
          </h2>

          {ranked.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No clicks recorded in this window. If the site is live and this
              stays empty, check that SUPABASE_SERVICE_ROLE_KEY is set, because
              the tracking route logs on the service role.
            </p>
          ) : (
            <div className="card-modern flex flex-col gap-3 p-6">
              {ranked.slice(0, 25).map(([name, count]) => (
                <div key={name} className="flex items-center gap-4 text-sm">
                  <span className="w-48 shrink-0 truncate">{name}</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-[var(--color-brand)]"
                      style={{ width: `${Math.round((count / busiest) * 100)}%` }}
                    />
                  </span>
                  <span className="w-16 shrink-0 text-right tabular-nums">
                    {formatNumber(count)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Click records carry a peppered hash of the visitor address rather than
          the address itself, so these totals cannot be traced back to an
          individual. That is deliberate and is what the privacy policy
          promises.
        </p>
      </div>
    </AdminShell>
  );
}
