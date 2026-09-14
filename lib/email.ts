import "server-only";

import { newsletterWelcomeEmail } from "@/lib/email-templates";
import { SITE_URL } from "@/lib/site";

/**
 * Transactional email through Resend's HTTP API.
 *
 * Optional by design. With no key configured, or while the Resend account has
 * no verified domain (Resend then delivers only to the account owner's own
 * address), a send is refused and the caller gets `false`. Callers treat that
 * as "not sent" and say so, rather than promising an inbox.
 */
async function send(message: {
  to: string;
  subject: string;
  text: string;
  html: string;
  headers?: Record<string, string>;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        headers: message.headers,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      // Status only. The address is personal information and stays out of logs.
      console.error(`Resend refused an email: HTTP ${response.status}`);
    }
    return response.ok;
  } catch {
    console.error("Resend could not be reached");
    return false;
  }
}

/**
 * The welcome email, sent the moment someone subscribes. The token is the
 * subscriber row's confirm_token, which is what the unsubscribe page matches on.
 */
export function sendNewsletterWelcome(
  email: string,
  token: string,
): Promise<boolean> {
  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?token=${token}`;

  const message = newsletterWelcomeEmail({ email, unsubscribeUrl });

  /*
    No List-Unsubscribe header on this one. It is a one-off receipt, the header
    is a bulk mail signal that pushes Gmail towards the Promotions tab, and the
    unsubscribe link is in the body. The actual newsletter sends are bulk mail
    and must carry the header.
  */
  return send({ to: email, ...message });
}
