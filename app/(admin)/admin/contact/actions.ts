"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function markMessageHandled(form: FormData): Promise<void> {
  const id = String(form.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("contact_messages").update({ handled: true }).eq("id", id);
  revalidatePath("/admin/contact");
}
