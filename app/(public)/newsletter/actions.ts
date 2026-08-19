"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";

import { clientIp, hashIp } from "@/lib/hash";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Double opt in signup.
 *
 * The row this writes is always `pending`. Nothing about it counts as consent
 * until the reader acts on the confirmation link, which is what POPIA means by
 * consent being freely given rather than assumed from a form submission. The
 * confirmation itself happens in /api/newsletter/confirm.
 *
 * NOTE FOR WHOEVER WIRES THE MAIL PROVIDER: this stores the pending row and
 * mints the token, but nothing dispatches the confirmation email yet, because
 * no sending provider is configured. Until one is, subscriptions accumulate as
 * pending and the reader is told exactly that. When the provider lands, send
 * `${SITE_URL}/api/newsletter/confirm?token=${token}` and revisit the success
 * copy below, which is deliberately worded not to promise an inbox.
 */
export async function subscribeToNewsletter(
  _previous: NewsletterFormState,
  form: FormData,
): Promise<NewsletterFormState> {
  // Honeypot. Left empty by people, filled by most bots.
  if (form.get("website")) {
    return { status: "success", message: "Thank you, you are on the list." };
  }

  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const source = String(form.get("source") ?? "").trim() || "site";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "That does not look like an email address.",
    };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return {
      status: "error",
      message:
        "Signups are not available just yet. Please try again a little later.",
    };
  }

  const headerList = await headers();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  /*
    Already confirmed, so stop here. Reissuing a token would let anyone who
    knows an address churn confirmation mail at its owner.
  */
  if (existing?.status === "confirmed") {
    return {
      status: "success",
      message: "You are already on the list, so there is nothing more to do.",
    };
  }

  const token = randomBytes(32).toString("hex");
  const consent = {
    status: "pending" as const,
    confirm_token: token,
    consent_ip_hash: hashIp(clientIp(headerList)),
    consent_source: source,
    user_agent: headerList.get("user-agent"),
  };

  /*
    A pending row gets a fresh token, and so does an address that unsubscribed
    and has come back. Both are the same write, which is why this upserts on
    the email rather than branching.
  */
  const { error } = existing
    ? await supabase
        .from("newsletter_subscribers")
        .update({ ...consent, confirmed_at: null, unsubscribed_at: null })
        .eq("id", existing.id)
    : await supabase.from("newsletter_subscribers").insert({ email, ...consent });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong signing you up. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Thank you. Your address is recorded as pending and becomes a subscription only once you confirm it.",
  };
}
