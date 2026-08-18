"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { cn } from "@/lib/utils";

/**
 * Double opt in signup. POPIA requires consent to be freely given and
 * recorded, so the confirmation email is the actual subscription event and
 * this form only ever creates a pending row.
 *
 * The submit handler is wired to /api/newsletter in a later milestone. Until
 * then it validates and reports state without pretending to have stored
 * anything.
 */
export function NewsletterForm({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("That does not look like an email address.");
      return;
    }

    setStatus("pending");
    setMessage("");

    // Placeholder until the newsletter endpoint ships.
    await new Promise((resolve) => setTimeout(resolve, 400));

    setStatus("done");
    setMessage("Check your inbox and confirm the subscription.");
  };

  const isDark = tone === "dark";

  if (status === "done") {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm",
          isDark ? "bg-white/10 text-white" : "bg-muted text-foreground",
          className,
        )}
        role="status"
      >
        <CheckIcon
          className="size-4 text-[var(--color-brand)]"
          aria-hidden="true"
        />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.co.za"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          className={cn(
            "h-12 w-full flex-1 rounded-xl border px-4 text-sm outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]",
            isDark
              ? "border-white/15 bg-white/10 text-white placeholder:text-white/45"
              : "border-input bg-background text-foreground placeholder:text-muted-foreground",
            status === "error" && "border-[var(--color-error)]",
          )}
        />
        <GlossyButton size="lg" disabled={status === "pending"}>
          {status === "pending" ? "Signing up" : "Subscribe"}
          <ArrowRightIcon aria-hidden="true" />
        </GlossyButton>
      </div>

      {status === "error" && (
        <p
          id="newsletter-error"
          role="alert"
          className="mt-2 text-sm text-[var(--color-error)]"
        >
          {message}
        </p>
      )}
    </form>
  );
}
