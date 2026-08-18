import type { Metadata } from "next";
import Link from "next/link";
import { ScaleIcon, SearchCheckIcon, ShieldCheckIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { GlossyButton } from "@/components/public/GlossyButton";
import { formatNumber } from "@/lib/format";
import { getSiteStats } from "@/lib/queries/stats";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: `Who ${SITE_NAME} is, how we rate software, and how we make money.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

const PRINCIPLES = [
  {
    icon: SearchCheckIcon,
    title: "We check the price ourselves",
    body: "Every figure is researched from the vendor's own South African page, recorded with its source and the date it was checked, and stated in rand with the VAT basis given. Where a vendor publishes no price we say so rather than guessing, and where we could not verify one, the page tells you.",
  },
  {
    icon: ScaleIcon,
    title: "Ratings are calculated, not decided",
    body: "Aggregate ratings are computed by the database from verified user reviews. Nobody here can adjust them, and no vendor can pay to. Rankings use a weighted average, so a product with four hundred reviews is not beaten by one with thirty.",
  },
  {
    icon: ShieldCheckIcon,
    title: "We say how we make money",
    body: "Some links earn us a commission. Every one of them carries a visible disclosure next to it. We list products with no affiliate programme at all, and we name weaknesses in the products that earn us the most.",
  },
];

const COMPLIANCE = [
  "SARS eFiling submissions that transfer without rebuilding figures",
  "VAT201 returns at the 15% standard rate, covering standard, zero rated and exempt supplies",
  "EMP201 monthly declarations and EMP501 biannual reconciliations",
  "IRP5 and IT3(a) employee tax certificates, and e@syFile exports",
  "UIF declarations to the Department of Employment and Labour",
  "SDL and the Employment Tax Incentive",
  "BCEA leave entitlements",
  "POPIA compliant data handling",
  "Bank feed coverage for Absa, FNB, Standard Bank, Nedbank and Capitec",
  "ACB payment files for salary runs",
];

export default async function AboutPage() {
  const stats = await getSiteStats();

  return (
    <div className="container-site flex flex-col gap-16 py-8">
      <Breadcrumbs items={[{ label: "About" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          The place you work out{" "}
          <span className="brand-highlight">what to buy</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {SITE_TAGLINE}.
        </p>
      </header>

      {/* The story --------------------------------------------------------- */}
      <section id="story" aria-labelledby="story-heading" className="mx-auto w-full max-w-3xl scroll-mt-32">
        <h2
          id="story-heading"
          className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Why this exists
        </h2>
        <div className="prose-content mt-5">
          <p>
            <em>Indaba</em> is a Nguni word used across South African business
            English for the gathering where people talk something through and
            reach a decision. That is what this is meant to be.
          </p>
          <p>
            Choosing business software in this country is harder than it should
            be. The international comparison sites rank products for markets
            that do not have SARS, do not run EMP501 reconciliations and do not
            lose connectivity for two hours in the afternoon. Their prices are
            in dollars, their reviews come from businesses nothing like yours,
            and their idea of a compliance feature is not ours.
          </p>
          <p>
            So we built the thing we wanted: {formatNumber(stats.softwareCount)}{" "}
            products judged against a South African yardstick, priced in rand
            with the VAT position stated, and rated by{" "}
            {formatNumber(stats.reviewCount)} people who actually run them.
          </p>
        </div>
      </section>

      {/* How we work ------------------------------------------------------- */}
      <section id="method" aria-labelledby="method-heading" className="scroll-mt-32">
        <h2
          id="method-heading"
          className="mx-auto mb-10 max-w-2xl text-center font-heading text-3xl font-medium tracking-tight text-balance sm:text-[2.4rem]"
        >
          How we <span className="brand-highlight">actually work</span>
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <article key={principle.title} className="card-modern flex flex-col gap-4 p-6">
              <principle.icon
                className="size-7 text-[var(--color-brand-dark)]"
                aria-hidden="true"
              />
              <h3 className="font-heading text-lg font-bold tracking-tight text-balance">
                {principle.title}
              </h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* The yardstick ----------------------------------------------------- */}
      <section
        id="yardstick"
        aria-labelledby="yardstick-heading"
        className="scroll-mt-32 rounded-[2.5rem] bg-[var(--color-navy)] p-8 text-white sm:p-12"
      >
        <h2
          id="yardstick-heading"
          className="max-w-2xl font-heading text-2xl font-medium tracking-tight text-balance sm:text-3xl"
        >
          The <span className="brand-highlight">compliance yardstick</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
          Every product is measured against the same list, because these are the
          things that decide whether software works in this country. They are
          also exactly what buyers search for.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {COMPLIANCE.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/75">
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-brand)]"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* People ------------------------------------------------------------ */}
      <section id="people" aria-labelledby="people-heading" className="mx-auto w-full max-w-3xl scroll-mt-32">
        <h2
          id="people-heading"
          className="font-heading text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Who writes this
        </h2>
        <div className="prose-content mt-5">
          <p>
            A small editorial team based in Cape Town, with contributors who
            have done the work they write about: chartered accountants in
            practice, payroll administrators who have survived reconciliation
            season, and people who have migrated a ledger and lived to describe
            it.
          </p>
          <p>
            We are not a software reseller, an implementation partner or a
            vendor. If you want to know how a review earns its keep, our{" "}
            <Link href="/editorial-policy">editorial policy</Link> and{" "}
            <Link href="/affiliate-disclosure">affiliate disclosure</Link> set it
            out in full.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <GlossyButton href="/contact" size="lg">
            Get in touch
          </GlossyButton>
          <GlossyButton href="/software" size="lg" variant="dark">
            Browse the directory
          </GlossyButton>
        </div>
      </section>
    </div>
  );
}
