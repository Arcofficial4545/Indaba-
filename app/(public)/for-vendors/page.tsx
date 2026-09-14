import type { Metadata } from "next";
import Link from "next/link";
import {
  CoinsIcon,
  MessagesSquareIcon,
  ScaleIcon,
  SearchCheckIcon,
  ShieldCheckIcon,
  TagIcon,
} from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Figure } from "@/components/public/Figure";
import { GlossyButton } from "@/components/public/GlossyButton";
import { formatNumber } from "@/lib/format";
import { getSiteStats } from "@/lib/queries/stats";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "For software vendors",
  description: `How software vendors work with ${SITE_NAME}: free listings, accurate details, replies to reviews, affiliate partnerships and labelled sponsored placements.`,
  alternates: { canonical: `${SITE_URL}/for-vendors` },
};

/**
 * The page an affiliate manager or a vendor's marketing lead lands on.
 *
 * It answers what they check before approving a partnership: that listing is
 * not pay to play, how outbound links are tracked and disclosed, and where the
 * editorial line sits. The only figures on it are live counts from the
 * directory. Traffic and audience numbers belong in a media kit the owner
 * supplies, never in copy written here.
 */
const WAYS = [
  {
    icon: SearchCheckIcon,
    title: "Get listed, free",
    body: "A listing costs nothing and never depends on a commercial relationship. We add the products South African businesses actually shortlist, including ones with no affiliate programme. Tell us the product and where its South African pricing lives.",
    cta: { label: "List your software", href: "/contact?intent=listing" },
  },
  {
    icon: TagIcon,
    title: "Keep your details accurate",
    body: "Prices, plans, trial terms and support options change. Tell us when yours do and we will check them against your own pages, record the date, and update the profile.",
    cta: { label: "Send a correction", href: "/contact?intent=correction" },
  },
  {
    icon: MessagesSquareIcon,
    title: "Reply to reviews",
    body: "Vendors can respond publicly to reviews of their product, and replies are labelled as coming from the vendor. We do not remove unfavourable reviews or change ratings on request.",
    cta: { label: "Ask about vendor replies", href: "/contact?intent=reviews" },
  },
  {
    icon: CoinsIcon,
    title: "Affiliate and partner programmes",
    body: "If you run an affiliate or referral programme, send us the terms. Every outbound link goes through our own click tracking, carries the sponsored attribute, and sits next to a visible disclosure. A partnership never changes a rating or a ranking.",
    cta: { label: "Discuss a partnership", href: "/contact?intent=partnership" },
  },
  {
    icon: ScaleIcon,
    title: "Sponsored placements",
    body: "Display placements are available on request. Every one carries a visible sponsored label and sits apart from editorial content, so a reader can always tell the two apart.",
    cta: { label: "Enquire about advertising", href: "/contact?intent=advertising" },
  },
];

const NEVER = [
  "Sell a rating, a ranking or a higher place in a list",
  "Remove or edit a review because a vendor asked",
  "Leave a product out because it has no commercial relationship with us",
  "Publish sponsored content without labelling it",
];

export default async function ForVendorsPage() {
  const stats = await getSiteStats();

  return (
    <div className="container-site flex flex-col gap-16 py-8">
      <Breadcrumbs items={[{ label: "For vendors" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Work with {SITE_NAME}
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {SITE_NAME} helps South African businesses choose software, with prices
          in rand and the VAT basis stated. This is how vendors take part,
          without any of it touching how we rate products.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <GlossyButton href="/contact?intent=listing" size="lg">
            List your software
          </GlossyButton>
          <GlossyButton
            href="/contact?intent=partnership"
            size="lg"
            variant="dark"
          >
            Discuss a partnership
          </GlossyButton>
        </div>
      </header>

      <section aria-labelledby="directory-heading" className="mx-auto w-full max-w-3xl">
        <h2 id="directory-heading" className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          The directory today
        </h2>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="card-modern p-6">
            <dt className="text-sm text-muted-foreground">Products listed</dt>
            <dd className="mt-2 text-[2rem] leading-none">
              <Figure as="span">{formatNumber(stats.softwareCount)}</Figure>
            </dd>
          </div>
          <div className="card-modern p-6">
            <dt className="text-sm text-muted-foreground">Software categories</dt>
            <dd className="mt-2 text-[2rem] leading-none">
              <Figure as="span">{formatNumber(stats.categoryCount)}</Figure>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">
          Live counts from the directory, not estimates.
        </p>
      </section>

      <section aria-labelledby="ways-heading">
        <h2
          id="ways-heading"
          className="mx-auto mb-10 max-w-2xl text-center font-heading text-3xl font-medium tracking-tight text-balance sm:text-[2.4rem]"
        >
          How vendors work with us
        </h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {WAYS.map((way) => (
            <article key={way.title} className="card-modern flex flex-col gap-4 p-6">
              <way.icon
                className="size-7 text-[var(--color-brand-dark)]"
                aria-hidden="true"
              />
              <h3 className="font-heading text-lg font-bold tracking-tight text-balance">
                {way.title}
              </h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {way.body}
              </p>
              <Link
                href={way.cta.href}
                className="mt-auto text-sm font-medium underline underline-offset-4 hover:text-[var(--color-text-accent)]"
              >
                {way.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="never-heading" className="mx-auto w-full max-w-3xl">
        <div className="card-modern flex flex-col gap-5 p-8">
          <ShieldCheckIcon
            className="size-7 text-[var(--color-brand-dark)]"
            aria-hidden="true"
          />
          <h2 id="never-heading" className="font-heading text-2xl font-bold tracking-tight">
            What we will not do, for anyone
          </h2>
          <ul className="flex flex-col gap-3">
            {NEVER.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-brand)]"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            The full rules are in our{" "}
            <Link href="/editorial-policy" className="underline underline-offset-4">
              editorial policy
            </Link>{" "}
            and{" "}
            <Link href="/affiliate-disclosure" className="underline underline-offset-4">
              affiliate disclosure
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
