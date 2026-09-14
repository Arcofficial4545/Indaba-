import "server-only";

import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/*
  The admin check every admin page, server action and route handler runs for
  itself.

  proxy.ts already turns signed-out visitors away from /admin, but a proxy is a
  routing layer, not an authorisation boundary: a matcher change, a refactor or
  a framework bug removes it without a sound. So each entry point checks the
  same admin_users allowlist the row level security policies use, rather than
  trusting that a signed-in session means an admin.
*/
async function currentSession() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS lets a signed-in user read only their own allowlist row, if one exists.
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: Boolean(data) };
}

/** For server actions and route handlers: the admin session, or null. */
export async function getAdmin() {
  const session = await currentSession();
  return session?.isAdmin
    ? { supabase: session.supabase, user: session.user }
    : null;
}

/**
 * For pages. Signed out goes to the login page. Signed in but not on the
 * allowlist is a 404: sending them to the login page would loop, because
 * proxy.ts sends signed-in users from the login page back to /admin.
 */
export async function requireAdmin() {
  const session = await currentSession();
  if (!session) redirect("/admin/login");
  if (!session.isAdmin) notFound();
  return { supabase: session.supabase, user: session.user };
}
