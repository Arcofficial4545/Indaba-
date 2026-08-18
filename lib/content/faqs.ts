import type { Faq } from "@/components/public/FaqAccordion";
import { formatNumber, formatPricePerPeriod, formatRating } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * FAQs are generated from the product record, never hand written.
 *
 * Two reasons. Hand written FAQs go stale the moment a price changes, and
 * FAQPage structured data that contradicts the visible page is worse than
 * none at all. Every answer below is assembled from fields that the rest of
 * the page also renders, so they cannot drift apart.
 */
export function buildFaqs(software: SoftwareWithCategory): Faq[] {
  const faqs: Faq[] = [];
  const name = software.name;

  /* Cost ------------------------------------------------------------------ */
  if (software.starting_price === null) {
    faqs.push({
      question: `How much does ${name} cost in South Africa?`,
      answer: `${software.vendor_name ?? name} does not publish a list price for ${name}. Pricing is quoted per business, usually after a scoping call, and depends on user numbers and which modules you take. Ask for the total first year cost including implementation rather than the monthly licence alone, because the setup fee is often the larger number.`,
    });
  } else if (software.starting_price === 0) {
    faqs.push({
      question: `Is ${name} really free?`,
      answer: `${name} has a free tier that works without payment. ${
        software.free_version
          ? "It is a genuine free plan rather than a trial, though it carries limits on users or features that most growing businesses eventually hit."
          : "Check the limits carefully before committing, because the free tier is narrower than the paid plans."
      } Paid plans add capacity and support.`,
    });
  } else {
    const price = formatPricePerPeriod(
      software.starting_price,
      software.billing_period,
      software.price_currency,
    );
    const vatNote =
      software.vat_inclusive === true
        ? "That figure includes VAT at 15%."
        : software.vat_inclusive === false
          ? "That figure excludes VAT, so add 15% for the amount you will actually pay."
          : "We have not been able to confirm whether that figure includes VAT, so check before you budget.";

    faqs.push({
      question: `How much does ${name} cost in South Africa?`,
      answer: `${name} starts at ${price}. ${vatNote} List prices move, so treat this as a guide and confirm on the vendor's own South African pricing page before you commit.`,
    });
  }

  /* Free trial ------------------------------------------------------------ */
  faqs.push({
    question: `Does ${name} have a free trial?`,
    answer: software.free_trial
      ? `Yes. ${name} offers a free trial${
          software.free_trial_days ? ` of ${software.free_trial_days} days` : ""
        }. Use it on real data rather than the demo set, because the questions that matter are whether your own imports, VAT codes and reports come through correctly.`
      : `No. ${name} does not offer a self service free trial. ${
          software.free_version
            ? "There is a free plan you can use to get a feel for it."
            : "You can usually arrange a guided demo with the vendor or a local implementation partner instead."
        }`,
  });

  /* Local suitability ----------------------------------------------------- */
  const category = software.category?.name.toLowerCase() ?? "business";
  faqs.push({
    question: `Is ${name} suitable for a South African business?`,
    answer: `${name} is used by South African businesses and appears regularly on local shortlists for ${category}. What matters most is whether it handles the compliance work you actually face: VAT201 returns at the standard 15% rate, SARS eFiling submissions, and where payroll is involved, EMP201, EMP501, IRP5 certificates and UIF declarations. Confirm those against your own requirements during the trial rather than taking the feature list on trust.`,
  });

  /* Integrations ---------------------------------------------------------- */
  if (software.integrations.length > 0) {
    const list = software.integrations.slice(0, 6).join(", ");
    faqs.push({
      question: `What does ${name} integrate with?`,
      answer: `${name} connects to ${list}${
        software.integrations.length > 6 ? " among others" : ""
      }. If a bank feed matters to you, check coverage for your own bank specifically, because support for Absa, FNB, Standard Bank, Nedbank and Capitec varies between products and between account types at the same bank.`,
    });
  }

  /* What users say -------------------------------------------------------- */
  if (software.review_count > 0) {
    faqs.push({
      question: `What do users say about ${name}?`,
      answer: `${name} holds ${formatRating(
        software.overall_rating,
      )} out of 5 across ${formatNumber(
        software.review_count,
      )} verified reviews. Reviewers rate it ${formatRating(
        software.ease_of_use_rating,
      )} for ease of use, ${formatRating(
        software.value_for_money_rating,
      )} for value for money, ${formatRating(
        software.customer_service_rating,
      )} for customer service and ${formatRating(
        software.functionality_rating,
      )} for functionality. The lowest of those four is usually the one worth reading the written reviews about.`,
    });
  }

  return faqs;
}

/** FAQPage structured data built from the same objects the page renders. */
export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
