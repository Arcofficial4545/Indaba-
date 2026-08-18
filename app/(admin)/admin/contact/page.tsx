import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { markMessageHandled } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminContactPage() {
  const supabase = await createClient();

  const rows = supabase
    ? ((
        await supabase
          .from("contact_messages")
          .select("id, name, email, subject, message, handled, created_at")
          .order("created_at", { ascending: false })
          .limit(100)
      ).data ?? [])
    : [];

  const outstanding = rows.filter((row) => !row.handled).length;

  return (
    <AdminShell
      title="Messages"
      description={`${formatNumber(outstanding)} still to deal with`}
    >
      {rows.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <p className="font-heading text-base font-bold tracking-tight">
            No messages
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Anything sent through the contact form appears here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <article key={String(row.id)} className="card-modern flex flex-col gap-4 p-6">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {String(row.name)}{" "}
                    <a
                      href={`mailto:${String(row.email)}`}
                      className="font-normal text-muted-foreground hover:text-[var(--color-brand-dark)]"
                    >
                      {String(row.email)}
                    </a>
                  </p>
                  {row.subject && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {String(row.subject)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    {formatDate(String(row.created_at))}
                  </span>
                  {row.handled ? (
                    <Badge variant="success">Handled</Badge>
                  ) : (
                    <form action={markMessageHandled}>
                      <input type="hidden" name="id" value={String(row.id)} />
                      <button
                        type="submit"
                        className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                      >
                        Mark handled
                      </button>
                    </form>
                  )}
                </div>
              </header>

              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {String(row.message)}
              </p>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
