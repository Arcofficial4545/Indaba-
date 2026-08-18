import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * CSV export of confirmed subscribers.
 *
 * Only confirmed rows are exported. Exporting pending or unsubscribed
 * addresses into a mailing tool is how a business ends up emailing people who
 * never agreed to it.
 */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return new NextResponse("Database not configured", { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Not authorised", { status: 401 });
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, confirmed_at, consent_source, interests")
    .eq("status", "confirmed")
    .order("confirmed_at", { ascending: true });

  if (error) {
    return new NextResponse("Export failed", { status: 500 });
  }

  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    // Quote anything containing a comma, quote or newline, per RFC 4180.
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const header = "email,confirmed_at,consent_source,interests";
  const lines = (data ?? []).map((row) =>
    [
      escape(row.email),
      escape(row.confirmed_at),
      escape(row.consent_source),
      escape(Array.isArray(row.interests) ? row.interests.join(" ") : ""),
    ].join(","),
  );

  const csv = [header, ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="indaba-subscribers-${date}.csv"`,
      "cache-control": "no-store",
    },
  });
}
