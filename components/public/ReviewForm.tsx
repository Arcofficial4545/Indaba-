"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useActionState } from "react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { StarSelector } from "@/components/public/StarSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitReview,
  type ReviewFormState,
} from "@/app/(public)/software/[slug]/reviews/new/actions";
import { REVIEWER_COUNTRIES } from "@/lib/site";
import { COMPANY_SIZES } from "@/lib/types";

const DURATIONS = [
  "Less than 6 months",
  "6 to 12 months",
  "1 to 2 years",
  "2 to 5 years",
  "More than 5 years",
];

const initialState: ReviewFormState = { status: "idle", message: "" };

export function ReviewForm({
  slug,
  softwareName,
}: {
  slug: string;
  softwareName: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitReview,
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
          Review received
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {state.message}
        </p>
      </div>
    );
  }

  const error = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="slug" value={slug} />

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          {state.message}
        </p>
      )}

      {/* Ratings ---------------------------------------------------------- */}
      <fieldset className="card-modern flex flex-col gap-5 p-6">
        <legend className="px-2 font-heading text-base font-bold tracking-tight">
          Rate {softwareName}
        </legend>

        <StarSelector name="overall_rating" label="Overall" />
        <StarSelector name="ease_of_use" label="Ease of use" />
        <StarSelector name="value_for_money" label="Value for money" />
        <StarSelector name="customer_service" label="Customer service" />
        <StarSelector name="functionality" label="Functionality" />

        {RATING_ERRORS.map((field) =>
          error(field) ? (
            <p key={field} role="alert" className="text-sm text-destructive">
              {error(field)}
            </p>
          ) : null,
        )}
      </fieldset>

      {/* The review ------------------------------------------------------- */}
      <fieldset className="card-modern flex flex-col gap-5 p-6">
        <legend className="px-2 font-heading text-base font-bold tracking-tight">
          Your review
        </legend>

        <Field
          id="review_title"
          label="Headline"
          error={error("review_title")}
          required
        >
          <Input
            id="review_title"
            name="review_title"
            required
            maxLength={120}
            placeholder="Sum it up in a sentence"
            aria-invalid={Boolean(error("review_title"))}
          />
        </Field>

        <Field id="summary" label="Your experience" error={error("summary")} required>
          <Textarea
            id="summary"
            name="summary"
            required
            rows={6}
            minLength={40}
            placeholder="What did you use it for, how did the setup go, and would you choose it again?"
            aria-invalid={Boolean(error("summary"))}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="pros" label="What works well">
            <Textarea id="pros" name="pros" rows={3} />
          </Field>
          <Field id="cons" label="What does not">
            <Textarea id="cons" name="cons" rows={3} />
          </Field>
        </div>
      </fieldset>

      {/* About you -------------------------------------------------------- */}
      <fieldset className="card-modern flex flex-col gap-5 p-6">
        <legend className="px-2 font-heading text-base font-bold tracking-tight">
          About you
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="reviewer_name"
            label="Your name"
            error={error("reviewer_name")}
            required
          >
            <Input
              id="reviewer_name"
              name="reviewer_name"
              required
              aria-invalid={Boolean(error("reviewer_name"))}
            />
          </Field>

          <Field id="reviewer_job_title" label="Job title">
            <Input id="reviewer_job_title" name="reviewer_job_title" />
          </Field>

          <Field id="reviewer_company" label="Company">
            <Input id="reviewer_company" name="reviewer_company" />
          </Field>

          <Field id="reviewer_industry" label="Industry">
            <Input id="reviewer_industry" name="reviewer_industry" />
          </Field>

          <Field id="reviewer_company_size" label="Company size">
            <Select id="reviewer_company_size" name="reviewer_company_size" options={COMPANY_SIZES} />
          </Field>

          <Field id="used_for_duration" label="How long have you used it">
            <Select id="used_for_duration" name="used_for_duration" options={DURATIONS} />
          </Field>

          <Field id="reviewer_city" label="City">
            <Input id="reviewer_city" name="reviewer_city" />
          </Field>

          <Field id="reviewer_country" label="Country">
            <Select
              id="reviewer_country"
              name="reviewer_country"
              options={REVIEWER_COUNTRIES}
              defaultValue="South Africa"
            />
          </Field>
        </div>
      </fieldset>

      <div className="flex flex-col items-start gap-3">
        <GlossyButton size="lg" disabled={pending}>
          {pending ? "Sending" : "Submit review"}
        </GlossyButton>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Reviews are checked before they appear. We publish critical reviews as
          readily as positive ones, and we never edit them to suit a vendor.
        </p>
      </div>
    </form>
  );
}

const RATING_ERRORS = [
  "overall_rating",
  "ease_of_use",
  "value_for_money",
  "customer_service",
  "functionality",
];

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

function Select({
  id,
  name,
  options,
  defaultValue,
}: {
  id: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
}) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue ?? ""}
      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-[var(--color-brand-dark)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <option value="">Please choose</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
