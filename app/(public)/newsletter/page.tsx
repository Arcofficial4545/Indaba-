import type { Metadata } from "next";
import { CheckCircle2Icon, CheckIcon, XCircleIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "One email a month covering what changed in South African business software pricing. POPIA compliant, one click to unsubscribe.",
  alternates: { canonical: `${SITE_URL}/newsletter` },
};

const PROMISES = [
  {
    title: "One email a month, never more",
    body: "We write when there is something worth telling you. There is no drip sequence and no upsell campaign.",
  },
  {
    title: "What actually changed",
    body: "Every quarter we re check the listed price of each product against the vendor's own South African page. When something moves, you hear about it before your renewal does.",
  },
  {
    title: "POPIA compliant, properly",
    body: "We use double opt in, so nothing happens until you confirm from your inbox. We record your address and the moment you consented, and nothing else. We never sell or share it.",
  },
  {
    title: "One click to leave",
    body: "Every email carries a working unsubscribe link. No survey, no retention flow, no asking why.",
  },
];

/**
 * The outcomes /api/newsletter/confirm can send a reader back with. Rendered
 * here rather than on a page of their own so the confirmation lands somewhere
 * that explains what they just signed up for.
 */
const CONFIRMATION = {
  confirmed: {
    ok: true,
    title: "You are subscribed",
    body: "That is consent recorded and confirmed. One email a month, and every one of them carries a working unsubscribe link.",
  },
  expired: {
    ok: false,
    title: "That link did not work",
    body: "It may have been used already, or the address may have unsubscribed since. Sign up again below and we will send a fresh one.",
  },
  unavailable: {
    ok: false,
    title: "We cannot confirm that right now",
    body: "Something is wrong at our end rather than with your link. Please try it again shortly.",
  },
} as const;

export default async function NewsletterPage(
  props: PageProps<"/newsletter">,
) {
  const searchParams = await props.searchParams;
  const raw = Array.isArray(searchParams.confirmation)
    ? searchParams.confirmation[0]
    : searchParams.confirmation;
  const outcome =
    raw && raw in CONFIRMATION
      ? CONFIRMATION[raw as keyof typeof CONFIRMATION]
      : null;

  return (
    <div className="container-site flex flex-col gap-12 py-8">
      <Breadcrumbs items={[{ label: "Newsletter" }]} />

      {outcome && (
        <div
          role="status"
          className="card-modern mx-auto flex w-full max-w-2xl items-start gap-4 p-6"
        >
          {outcome.ok ? (
            <CheckCircle2Icon
              className="mt-0.5 size-6 shrink-0 text-[var(--color-brand-dark)]"
              aria-hidden="true"
            />
          ) : (
            <XCircleIcon
              className="mt-0.5 size-6 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col gap-1.5">
            <h2 className="font-heading text-base font-bold tracking-tight">
              {outcome.title}
            </h2>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {outcome.body}
            </p>
          </div>
        </div>
      )}

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Know when a price{" "}
          <span className="brand-highlight">actually changes</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Software vendors raise prices quietly and hope you are on annual
          billing. We check, and we tell you.
        </p>
        <NewsletterForm
          tone="light"
          className="max-w-lg"
          source="newsletter-page"
        />
      </header>

      <div className="mx-auto w-full max-w-3xl rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
        <div className="grid gap-2 sm:grid-cols-2">
          {PROMISES.map((promise) => (
            <div
              key={promise.title}
              className="flex flex-col gap-3 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800"
            >
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-full bg-[var(--color-brand)]"
              >
                <CheckIcon
                  className="size-3.5 text-[var(--color-brand-ink)]"
                  strokeWidth={3}
                />
              </span>
              <h2 className="font-heading text-base font-bold tracking-tight">
                {promise.title}
              </h2>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {promise.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
