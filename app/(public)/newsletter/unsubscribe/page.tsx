import type { Metadata } from "next";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { GlossyButton } from "@/components/public/GlossyButton";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the Indaba newsletter.",
  alternates: { canonical: `${SITE_URL}/newsletter/unsubscribe` },
  robots: { index: false, follow: false },
};

/**
 * One click unsubscribe.
 *
 * POPIA requires withdrawing consent to be as easy as giving it, so this acts
 * on the token in the link with no confirmation step, no survey and no
 * retention flow.
 */
export default async function UnsubscribePage(
  props: PageProps<"/newsletter/unsubscribe">,
) {
  const searchParams = await props.searchParams;
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  let outcome: "done" | "missing" | "unavailable" = "missing";

  if (token) {
    const supabase = createServiceRoleClient();
    if (!supabase) {
      outcome = "unavailable";
    } else {
      // Returning the affected rows tells us whether the token matched
      // anything, which is what separates "done" from "that link is stale".
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
        })
        .eq("confirm_token", token)
        .select("id");

      outcome = !error && (data?.length ?? 0) > 0 ? "done" : "missing";
    }
  }

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
                ? "Something is wrong at our end. Please try again shortly, or email us and we will remove you by hand."
                : "The link may have expired or already been used. If you are still receiving emails, email us and we will remove you by hand."}
            </p>
          </>
        )}

        <GlossyButton href="/" className="mt-2">
          Back to the site
        </GlossyButton>
      </div>
    </div>
  );
}
