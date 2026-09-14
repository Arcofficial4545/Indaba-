"use server";

import { revalidatePath } from "next/cache";

import { getAdmin } from "@/lib/admin/auth";

export async function markMessageHandled(form: FormData): Promise<void> {
  const id = String(form.get("id") ?? "");
  if (!id) return;

  const admin = await getAdmin();
  if (!admin) return;

  await admin.supabase
    .from("contact_messages")
    .update({ handled: true })
    .eq("id", id);
  revalidatePath("/admin/contact");
}
