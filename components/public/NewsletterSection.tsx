import { CheckIcon, MailIcon } from "lucide-react";

import { NewsletterForm } from "@/components/public/NewsletterForm";

const PROMISES = [
  "One email a month, never more",
  "POPIA compliant, your address is never sold or shared",
  "One click to unsubscribe, no questions asked",
];

export function NewsletterSection() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="overflow-hidden rounded-[2.5rem] bg-[var(--color-navy)] p-8 text-white sm:p-12"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
            <MailIcon
              className="size-4 text-[var(--color-brand)]"
              aria-hidden="true"
            />
            The Indaba brief
          </p>

          <h2
            id="newsletter-heading"
            className="mt-5 font-heading text-3xl font-medium tracking-tight text-balance text-white sm:text-[2.4rem] sm:leading-[1.16]"
          >
            Software pricing moves.{" "}
            <span className="brand-highlight">We tell you when</span>
          </h2>

          <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-white/60">
            Every quarter we re check the listed price of each product against
            the vendor&apos;s own South African page. When something changes,
            you hear about it before your renewal does.
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {PROMISES.map((promise) => (
              <li key={promise} className="flex items-start gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand)]"
                >
                  <CheckIcon
                    className="size-3 text-[var(--color-brand-ink)]"
                    strokeWidth={3}
                  />
                </span>
                <span className="text-white/70">{promise}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-8">
          <NewsletterForm tone="dark" />
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            By subscribing you agree to receive the monthly brief. We store your
            address and the time you consented, and nothing else.
          </p>
        </div>
      </div>
    </section>
  );
}
