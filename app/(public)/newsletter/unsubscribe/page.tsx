import type { Metadata } from "next";
import { CheckCircle2Icon, MailIcon, XCircleIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { GlossyButton } from "@/components/public/GlossyButton";
import { SITE_URL } from "@/lib/site";

import { unsubscribe } from "./actions";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the Indaba newsletter.",
  alternates: { canonical: `${SITE_URL}/newsletter/unsubscribe` },
  robots: { index: false, follow: false },
};

/**
 * Unsubscribe, confirmed with one click on this page.
 *
 * The link in an email only opens this page; the change happens on the button,
 * which posts. Mail security scanners (Outlook Safe Links among them) open every
 * link in a message to check it, and when opening the link was itself the
 * unsubscribe, they silently removed people who never asked to leave.
 *
 * Leaving is still one click once the page is open, with no survey and no
 * retention flow, which is what POPIA asks for.
 */
export default async function UnsubscribePage(
  props: PageProps<"/newsletter/unsubscribe">,
) {
  const searchParams = await props.searchParams;
  const read = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const token = read(searchParams.token);
  const outcome = read(searchParams.outcome);

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Newsletter", href: "/newsletter" },
          { label: "Unsubscribe" },
        ]}
      />

      <div className="card-modern mx-auto flex w-full max-w-lg flex-col items-center gap-4 p-12 text-center">
        {outcome === "done" ? (
          <>
            <CheckCircle2Icon
              className="size-10 text-[var(--color-brand-dark)]"
              aria-hidden="true"
            />
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              You are unsubscribed
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              That is done, with no further steps. You will not hear from us
              again unless you subscribe once more.
            </p>
          </>
        ) : token && !outcome ? (
          <>
            <MailIcon
              className="size-10 text-[var(--color-brand-dark)]"
              aria-hidden="true"
            />
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Unsubscribe from the newsletter?
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You will stop receiving our emails straight away.
            </p>
            <form action={unsubscribe} className="mt-2">
              <input type="hidden" name="token" value={token} />
              <GlossyButton type="submit">Unsubscribe</GlossyButton>
            </form>
          </>
        ) : (
          <>
            <XCircleIcon
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {outcome === "unavailable"
                ? "We cannot do that right now"
                : "That link did not work"}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {outcome === "unavailable"
                ? "Something is wrong at our end. Please try again shortly."
                : "The link may have expired or already been used. If you are still receiving emails, use the unsubscribe link in the latest one."}
            </p>
          </>
        )}

        {outcome && (
          <GlossyButton href="/" className="mt-2">
            Back to the site
          </GlossyButton>
        )}
      </div>
    </div>
  );
}
