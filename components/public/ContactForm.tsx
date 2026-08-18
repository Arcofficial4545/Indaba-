"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useActionState } from "react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitContact,
  type ContactFormState,
} from "@/app/(public)/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="card-modern flex flex-col items-center gap-4 p-12 text-center">
        <CheckCircle2Icon
          className="size-10 text-[var(--color-brand-dark)]"
          aria-hidden="true"
        />
        <h2 className="font-heading text-xl font-bold tracking-tight">
          Message sent
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {state.message}
        </p>
      </div>
    );
  }

  const error = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="card-modern flex flex-col gap-5 p-6 sm:p-8">
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={error("name")} required>
          <Input id="name" name="name" required autoComplete="name" aria-invalid={Boolean(error("name"))} />
        </Field>

        <Field id="email" label="Email address" error={error("email")} required>
          <Input id="email" name="email" type="email" required autoComplete="email" aria-invalid={Boolean(error("email"))} />
        </Field>
      </div>

      <Field id="subject" label="Subject">
        <Input id="subject" name="subject" defaultValue={defaultSubject} />
      </Field>

      <Field id="message" label="Message" error={error("message")} required>
        <Textarea id="message" name="message" rows={7} required aria-invalid={Boolean(error("message"))} />
      </Field>

      <div className="flex flex-col items-start gap-3">
        <GlossyButton size="lg" disabled={pending}>
          {pending ? "Sending" : "Send message"}
        </GlossyButton>
        <p className="text-xs leading-relaxed text-muted-foreground">
          We store your message and email address so we can reply. Nothing else,
          and never shared with a vendor.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
