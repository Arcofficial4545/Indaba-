"use server";

import { revalidatePath } from "next/cache";

import { getAdmin } from "@/lib/admin/auth";

/**
 * Only these keys can be written. Same whitelist discipline as the resource
 * registry: a key the form did not offer cannot be set by posting it.
 */
const ALLOWED_KEYS = [
  "site_announcement",
  "adsense_account",
  "google_site_verification",
  "contact_email",
  "contact_phone",
] as const;

export async function saveSettings(form: FormData): Promise<void> {
  const admin = await getAdmin();
  if (!admin) return;
  const { supabase } = admin;

  const rows = ALLOWED_KEYS.map((key) => ({
    key,
    value: String(form.get(key) ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  }));

  await supabase.from("site_settings").upsert(rows, { onConflict: "key" });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
