"use server";

import { redirect } from "next/navigation";

import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Applies an unsubscribe from the button on /newsletter/unsubscribe.
 *
 * POST only, deliberately. The link in an email opens the page; nothing
 * changes until this runs. See the page for why.
 */
export async function unsubscribe(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "").trim();
  let outcome: "done" | "missing" | "unavailable" = "missing";

  // Tokens are hex: 64 characters from signup, 32 after an older confirmation.
  if (/^[a-f0-9]{16,128}$/i.test(token)) {
    const supabase = createServiceRoleClient();
    if (!supabase) {
      outcome = "unavailable";
    } else {
      // Returning the affected rows tells a real token from a stale one.
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
        })
        .eq("confirm_token", token)
        .select("id");

      outcome = !error && (data?.length ?? 0) > 0 ? "done" : "missing";
    }
  }

  redirect(`/newsletter/unsubscribe?outcome=${outcome}`);
}
