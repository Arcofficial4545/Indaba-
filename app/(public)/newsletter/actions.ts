"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";

import { sendNewsletterWelcome } from "@/lib/email";
import { clientIp, hashIp } from "@/lib/hash";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Single step signup.
 *
 * Submitting the form is the subscription: the row is written as `confirmed`
 * straight away, with the consent record POPIA asks for (when, from which
 * form, a peppered IP hash and the user agent). A welcome email follows as the
 * receipt, and its one-click unsubscribe is the safeguard against an address
 * somebody else typed in.
 *
 * The welcome email goes out through lib/email.ts. Until Resend has a verified
 * domain it can refuse, and the subscription still stands; the success copy
 * only mentions an email when one was actually accepted.
 *
 * /api/newsletter/confirm is kept so confirmation links in emails sent before
 * this change still work.
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

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
  const ipHash = hashIp(clientIp(headerList));

  /*
    Throttle per connection: at most five new sign-ups in ten minutes, so the
    form cannot be used to pour addresses into the list or send welcome emails
    to strangers in bulk. Same peppered hash as the consent record; no hash, no
    throttle.
  */
  if (ipHash) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("consent_ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      return {
        status: "error",
        message:
          "Too many sign-ups from this connection. Please try again in a few minutes.",
      };
    }
  }

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  /*
    Already subscribed, so stop here without sending anything. Sending a fresh
    welcome on every submission would let anyone who knows an address fill its
    owner's inbox.
  */
  if (existing?.status === "confirmed") {
    return {
      status: "success",
      message: "You are already subscribed, so there is nothing more to do.",
    };
  }

  const token = randomBytes(32).toString("hex");
  const subscription = {
    status: "confirmed" as const,
    // Kept in confirm_token because the unsubscribe page matches on it.
    confirm_token: token,
    confirmed_at: new Date().toISOString(),
    unsubscribed_at: null,
    consent_ip_hash: ipHash,
    consent_source: source,
    user_agent: headerList.get("user-agent"),
  };

  /*
    A new address is inserted. An address left pending by the old two step
    flow, or one that unsubscribed and has come back, is the same write as an
    update, so this branches only on whether the row exists.
  */
  const { error } = existing
    ? await supabase
        .from("newsletter_subscribers")
        .update(subscription)
        .eq("id", existing.id)
    : await supabase
        .from("newsletter_subscribers")
        .insert({ email, ...subscription });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong signing you up. Please try again.",
    };
  }

  const sent = await sendNewsletterWelcome(email, token);

  return {
    status: "success",
    message: sent
      ? "You are subscribed. Welcome to Indaba community. "
      : "You are subscribed. Welcome to Indaba.",
  };
}
