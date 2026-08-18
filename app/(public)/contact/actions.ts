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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "That does not look like an email address.";
  }
  if (message.length < 10) {
    fieldErrors.message = "Please tell us a little more.";
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

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject || null,
    message,
    ip_hash: hashIp(clientIp(headerList)),
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
