import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon, SparklesIcon } from "lucide-react";

import { BrandLogo } from "@/components/public/BrandLogo";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { getCategories } from "@/lib/queries/categories";
import { getTopRatedSoftware } from "@/lib/queries/software";
import {
  COMPANY_NAV,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LEGAL_NAV,
  MAIN_NAV,
  SITE_LOCATION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

export async function Footer() {
  // Categories and popular reviews come from the database, never hardcoded,
  // so the footer keeps up as the catalogue grows.
  const [categories, popular] = await Promise.all([
    getCategories(),
    getTopRatedSoftware(5),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 overflow-hidden rounded-t-[2.5rem] bg-[#141517] text-white/70">
      <div className="container-site pt-16 pb-0">
        {/* 1. Newsletter band */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
              <SparklesIcon
                className="size-4 text-[var(--color-brand)]"
                aria-hidden="true"
              />
              One email a month
            </p>
            <h2 className="mt-5 font-heading text-3xl font-medium tracking-tight text-balance text-white sm:text-[2.2rem] sm:leading-[1.18]">
              Know when a price{" "}
              <span className="brand-highlight">actually changes</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60">
              We re verify listed prices every quarter and write up what moved.
              No spam, POPIA compliant, and one click to unsubscribe.
            </p>
          </div>
          <div className="w-full max-w-md">
            <NewsletterForm tone="dark" source="footer" />
          </div>
        </div>

        {/* 2. Five link columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <BrandLogo href="/" className="text-white [&_span]:text-white" />
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              {SITE_TAGLINE}.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MailIcon
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                  aria-hidden="true"
                />
                <span>{SITE_LOCATION}</span>
              </li>
            </ul>
          </div>

          <FooterColumn
            title="Explore"
            links={MAIN_NAV.map((item) => ({
              label: item.label,
              href: item.href,
            }))}
          />

          <FooterColumn
            title="Categories"
            links={categories.map((category) => ({
              label: category.name,
              href: `/category/${category.slug}`,
            }))}
          />

          <FooterColumn
            title="Company"
            links={COMPANY_NAV.map((item) => ({
              label: item.label,
              href: item.href,
            }))}
          />

          <FooterColumn
            title="Popular reviews"
            links={popular.map((software) => ({
              label: software.name,
              href: `/software/${software.slug}`,
            }))}
          />
        </div>

        {/* 3. Legal bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-white/45">
            Copyright {year} {SITE_NAME}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/45 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*
        4. Ghost wordmark. Clipped by the bottom edge of the viewport, which is
        what makes the footer read as a slab sliding under the page.
      */}
      <div
        aria-hidden="true"
        className="container-site pointer-events-none select-none"
      >
        <p
          className="-mb-[0.26em] text-center font-heading leading-none font-bold tracking-tight text-white/[0.045]"
          style={{ fontSize: "clamp(4rem, 14vw, 13rem)" }}
        >
          {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-[0.7rem] font-bold tracking-widest text-white/40 uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
