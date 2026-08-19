import { NextResponse, type NextRequest } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

/**
 * Double opt in confirmation.
 *
 * This is the moment consent actually exists. Everything before it is a
 * pending row that we are not entitled to email, so the update is narrow: it
 * matches the token, and it only promotes rows that are still pending.
 *
 * The token is cleared on success. It is also the unsubscribe token, so a
 * fresh one is minted in its place rather than left blank, otherwise the
 * unsubscribe link in the first email would have nothing to match on.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  const back = (outcome: "confirmed" | "expired" | "unavailable") =>
    NextResponse.redirect(
      new URL(`/newsletter?confirmation=${outcome}`, SITE_URL),
      302,
    );

  if (!token) return back("expired");

  const supabase = createServiceRoleClient();
  if (!supabase) return back("unavailable");

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      // Rotated, not cleared. See the note above.
      confirm_token: crypto.randomUUID().replace(/-/g, ""),
    })
    .eq("confirm_token", token)
    .eq("status", "pending")
    .select("id");

  if (error) return back("unavailable");

  // No rows matched: the link was already used, or the address unsubscribed.
  return back((data?.length ?? 0) > 0 ? "confirmed" : "expired");
}
