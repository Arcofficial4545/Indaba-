import type { Metadata } from "next";
import Link from "next/link";
import { DownloadIcon } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const supabase = await createClient();

  const rows = supabase
    ? ((
        await supabase
          .from("newsletter_subscribers")
          .select("id, email, status, created_at, confirmed_at, consent_source")
          .order("created_at", { ascending: false })
          .limit(200)
      ).data ?? [])
    : [];

  const confirmed = rows.filter((row) => row.status === "confirmed").length;
  const pending = rows.filter((row) => row.status === "pending").length;

  return (
    <AdminShell
      title="Newsletter"
      description={`${formatNumber(confirmed)} confirmed, ${formatNumber(pending)} awaiting confirmation`}
      actions={
        <Link
          href="/admin/newsletter-export"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
        >
          <DownloadIcon className="size-3.5" aria-hidden="true" />
          Export CSV
        </Link>
      }
    >
      <div className="card-modern overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Newsletter subscribers</caption>
            <thead>
              <tr className="border-b border-border">
                {["Email", "Status", "Signed up", "Confirmed", "Source"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 text-left text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{String(row.email)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          row.status === "confirmed"
                            ? "success"
                            : row.status === "pending"
                              ? "amber"
                              : "muted"
                        }
                      >
                        {String(row.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(String(row.created_at))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {row.confirmed_at ? formatDate(String(row.confirmed_at)) : "Not yet"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.consent_source ? String(row.consent_source) : "Not recorded"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Only confirmed subscribers may be emailed. A pending row means the
        person asked to subscribe but has not clicked the confirmation link, and
        POPIA treats that as consent not yet given.
      </p>
    </AdminShell>
  );
}
