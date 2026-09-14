"use server";

import { headers } from "next/headers";

import { clientIp, hashIp } from "@/lib/hash";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContact(
  _previous: ContactFormState,
  form: FormData,
): Promise<ContactFormState> {
  // Honeypot. Left empty by people, filled by most bots.
  if (form.get("website")) {
    return { status: "success", message: "Thank you, your message was sent." };
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const subject = String(form.get("subject") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please give your name.";
  else if (name.length > 200) fieldErrors.name = "Please shorten your name.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "That does not look like an email address.";
  }
  if (subject.length > 300) fieldErrors.subject = "Please shorten the subject.";
  if (message.length < 10) {
    fieldErrors.message = "Please tell us a little more.";
  } else if (message.length > 5000) {
    fieldErrors.message = "Please keep your message under 5 000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return {
      status: "error",
      message: `Our contact form is not available just yet. Please email us directly.`,
    };
  }

  const headerList = await headers();
  const ipHash = hashIp(clientIp(headerList));

  /*
    Throttle per connection: at most three messages in ten minutes. It keys on
    the same peppered hash stored with each message, so no raw IP is read or
    kept for it. Without a pepper there is no hash, and no throttle.
  */
  if (ipHash) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return {
        status: "error",
        message:
          "You have sent a few messages in the last few minutes. Please wait a little before sending another.",
      };
    }
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject || null,
    message,
    ip_hash: ipHash,
    user_agent: headerList.get("user-agent"),
  });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again.",
    };
  }

  return {
    status: "success",
    message: "Thank you. We read everything and will reply if it needs one.",
  };
}
