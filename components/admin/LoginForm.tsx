"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

/**
 * Sign in runs in the browser so the Supabase client can persist the session
 * cookies itself. The proxy then refreshes that session on every request and
 * blocks the admin routes when there is not one.
 */
export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured. See docs/SUPABASE_SETUP.md.");
      setPending(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Deliberately vague. Distinguishing "no such user" from "wrong
      // password" tells an attacker which addresses are real.
      setError("Those details did not work.");
      setPending(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <GlossyButton size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in" : "Sign in"}
      </GlossyButton>
    </form>
  );
}
