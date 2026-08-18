/**
 * Creates the single admin user and adds them to the allowlist.
 *
 *   npm run create-admin
 *   npm run create-admin -- --email you@example.com --password 'your password'
 *
 * Membership of admin_users, not merely being signed in, is what the row level
 * security policies check. A user created here without the allowlist row could
 * sign in and still write nothing, which is the intended design.
 */

import { createInterface } from "node:readline/promises";
import { randomBytes } from "node:crypto";

import { done, fail, getServiceClient, step } from "./lib/client";

function arg(name: string): string | null {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 ? (process.argv[index + 1] ?? null) : null;
}

async function main() {
  const supabase = getServiceClient();

  let email = arg("email");
  let password = arg("password");

  if (!email || !password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    if (!email) email = (await rl.question("Admin email: ")).trim();
    if (!password) {
      const suggested = randomBytes(12).toString("base64url");
      const answer = await rl.question(
        `Password (press enter to use ${suggested}): `,
      );
      password = answer.trim() || suggested;
      console.log(`\n  Password: ${password}`);
      console.log("  Save that now. It is not stored anywhere else.\n");
    }
    rl.close();
  }

  if (!email || !password || password.length < 10) {
    fail("an email and a password of at least 10 characters are required");
  }

  step(`creating auth user for ${email}`);
  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  let userId = created?.user?.id ?? null;

  if (createError) {
    // Already exists is the common case on a re run, and is not a failure.
    if (!/already/i.test(createError.message)) {
      fail("could not create the auth user", createError);
    }
    step("that user already exists, looking them up");

    const { data: list, error: listError } =
      await supabase.auth.admin.listUsers();
    if (listError) fail("could not list users", listError);

    userId =
      list.users.find(
        (user) => user.email?.toLowerCase() === email.toLowerCase(),
      )?.id ?? null;
  }

  if (!userId) fail("could not determine the user id");

  step("adding them to the admin allowlist");
  const { error: allowError } = await supabase
    .from("admin_users")
    .upsert({ user_id: userId, email }, { onConflict: "user_id" });

  if (allowError) {
    fail(
      "could not add the allowlist row. Apply 0001_schema.sql, which creates admin_users.",
      allowError,
    );
  }

  done(
    `Admin ready. Sign in at /admin/login with ${email}.\n\n` +
      "  Now turn off public signups in the Supabase dashboard under\n" +
      "  Authentication, Sign In and Providers, Email, so nobody else can\n" +
      "  create an account.",
  );
}

main().catch((error) => fail("create-admin crashed", error));
