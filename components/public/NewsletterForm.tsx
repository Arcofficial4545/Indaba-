"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";

import {
  subscribeToNewsletter,
  type NewsletterFormState,
} from "@/app/(public)/newsletter/actions";
import { GlossyButton } from "@/components/public/GlossyButton";
import { cn } from "@/lib/utils";

const initialState: NewsletterFormState = { status: "idle", message: "" };

/**
 * Double opt in signup. POPIA requires consent to be freely given and
 * recorded, so the confirmation link is the actual subscription event and this
 * form only ever creates a pending row.
 *
 * `source` travels with the submission because the same form sits in the
 * footer of every page and on the newsletter landing page, and knowing which
 * one converted is the only thing worth measuring about it.
 */
export function NewsletterForm({
  className,
  tone = "dark",
  source = "site",
}: {
  className?: string;
  tone?: "dark" | "light";
  /** Recorded against the consent row, e.g. "footer" or "newsletter-page". */
  source?: string;
}) {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  const isDark = tone === "dark";

  if (state.status === "success") {
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
        {state.message}
      </p>
    );
  }

  const failed = state.status === "error";

  return (
    <form action={formAction} className={cn("w-full", className)} noValidate>
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="newsletter-website">Leave this empty</label>
        <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="source" value={source} />

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
          placeholder="you@company.co.za"
          aria-invalid={failed}
          aria-describedby={failed ? "newsletter-error" : undefined}
          className={cn(
            "h-12 w-full flex-1 rounded-xl border px-4 text-sm outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]",
            isDark
              ? "border-white/15 bg-white/10 text-white placeholder:text-white/45"
              : "border-input bg-background text-foreground placeholder:text-muted-foreground",
            failed && "border-[var(--color-error)]",
          )}
        />
        <GlossyButton size="lg" disabled={pending}>
          {pending ? "Signing up" : "Subscribe"}
          <ArrowRightIcon aria-hidden="true" />
        </GlossyButton>
      </div>

      {failed && (
        <p
          id="newsletter-error"
          role="alert"
          className="mt-2 text-sm text-[var(--color-error)]"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
