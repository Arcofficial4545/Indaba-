import type { Metadata } from "next";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContactForm } from "@/components/public/ContactForm";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SITE_LOCATION,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a correction, a listing, an advertising enquiry or anything else.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const searchParams = await props.searchParams;
  const intent = Array.isArray(searchParams.intent)
    ? searchParams.intent[0]
    : searchParams.intent;

  const defaultSubject =
    intent === "listing" ? "Listing my software on Indaba" : undefined;

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Tell us what we{" "}
          <span className="brand-highlight">got wrong</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Corrections, listing enquiries, advertising or anything else. We read
          everything, and we would genuinely rather hear about a wrong price
          than have it sit there.
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
        <ContactForm defaultSubject={defaultSubject} />

        <aside className="card-modern flex flex-col gap-5 p-6">
          <h2 className="font-heading text-base font-bold tracking-tight">
            Other ways to reach us
          </h2>

          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <MailIcon
                className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-dark)]"
                aria-hidden="true"
              />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="transition-colors hover:text-[var(--color-brand-dark)]"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <PhoneIcon
                className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-dark)]"
                aria-hidden="true"
              />
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="transition-colors hover:text-[var(--color-brand-dark)]"
              >
                {CONTACT_PHONE}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-dark)]"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{SITE_LOCATION}</span>
            </li>
          </ul>

          <p className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            Vendors: we are happy to correct a factual error or a stale price,
            and we will not remove an unfavourable review or adjust a rating. Our
            editorial policy explains why.
          </p>
        </aside>
      </div>
    </div>
  );
}
