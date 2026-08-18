"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getResource, sanitisePayload } from "@/lib/admin/resources";
import { createClient } from "@/lib/supabase/server";

export type SaveState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Every write goes through here.
 *
 * Two guarantees. The caller must be signed in, which the row level security
 * policies also enforce independently. And the payload is reduced to the
 * registry's whitelist before it reaches the database, so a crafted form post
 * cannot set a column the admin was never shown, including a rating.
 */
export async function saveResource(
  _previous: SaveState,
  form: FormData,
): Promise<SaveState> {
  const resourceKey = String(form.get("__resource") ?? "");
  const id = String(form.get("__id") ?? "");

  const resource = getResource(resourceKey);
  if (!resource) {
    return { status: "error", message: "Unknown resource." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { status: "error", message: "The database is not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "You are not signed in." };
  }

  const { values, errors } = sanitisePayload(resource, form);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: errors,
    };
  }

  const isUpdate = id !== "";
  const query = isUpdate
    ? supabase.from(resource.table).update(values).eq("id", id)
    : supabase.from(resource.table).insert(values);

  const { error } = await query;

  if (error) {
    return {
      status: "error",
      // Surface the database message. The admin is a single trusted user, and
      // a unique constraint violation is far more useful than "save failed".
      message: error.message,
    };
  }

  revalidatePath(`/admin/${resource.key}`);
  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}`);
}

export async function deleteResource(form: FormData): Promise<void> {
  const resourceKey = String(form.get("__resource") ?? "");
  const id = String(form.get("__id") ?? "");

  const resource = getResource(resourceKey);
  if (!resource || !id || resource.canDelete === false) return;

  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from(resource.table).delete().eq("id", id);

  revalidatePath(`/admin/${resource.key}`);
  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}`);
}

/** Toggle a review between published and hidden from the list view. */
export async function setReviewStatus(form: FormData): Promise<void> {
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!id || !["published", "hidden"].includes(status)) return;

  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("reviews").update({ status }).eq("id", id);

  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
