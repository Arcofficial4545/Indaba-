import "server-only";

import nodemailer from "nodemailer";

import { newsletterWelcomeEmail } from "@/lib/email-templates";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Transactional email, through whichever transport is configured.
 *
 *   SMTP    SMTP_USER and SMTP_PASSWORD. Used first when both are set. This is
 *           the interim route while there is no verified sending domain: a
 *           Gmail account with an App Password delivers to any address.
 *           SMTP_HOST and SMTP_PORT default to Gmail, and the sender is always
 *           "<site name> <SMTP_USER>", because Gmail sends as the account that
 *           signs in whatever the From header says.
 *   Resend  RESEND_API_KEY with EMAIL_FROM. Delivers to any address once a
 *           domain is verified in Resend; before that, only to the Resend
 *           account owner.
 *
 * With no transport configured, or when the provider refuses, a send returns
 * false and callers say so rather than promising an inbox.
 *
 * Moving to a verified domain later is an environment change only: remove
 * SMTP_USER and SMTP_PASSWORD, and set RESEND_API_KEY and EMAIL_FROM.
 */

type Message = {
  to: string;
  subject: string;
  text: string;
  html: string;
  headers?: Record<string, string>;
};

type SmtpConfig = { host: string; port: number; user: string; pass: string };

function smtpConfig(): SmtpConfig | null {
  const user = process.env.SMTP_USER?.trim();
  // Google shows App Passwords in groups of four with spaces; SMTP wants none.
  const pass = process.env.SMTP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  // Gmail unless told otherwise, so the interim route needs only two variables.
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim() || 465) || 465;
  return { host, port, user, pass };
}

async function sendWithSmtp(
  config: SmtpConfig,
  from: string,
  message: Message,
): Promise<boolean> {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // 465 is TLS from the first byte; 587 upgrades the connection with STARTTLS.
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transport.sendMail({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: message.headers,
    });
    return true;
  } catch (error) {
    // The error code only. The address is personal information and stays out of logs.
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "unknown";
    console.error(`SMTP refused an email: ${code}`);
    return false;
  }
}

async function sendWithResend(
  apiKey: string,
  from: string,
  message: Message,
): Promise<boolean> {
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

async function send(message: Message): Promise<boolean> {
  const smtp = smtpConfig();
  if (smtp) {
    return sendWithSmtp(smtp, `${SITE_NAME} <${smtp.user}>`, message);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (apiKey && from) return sendWithResend(apiKey, from, message);

  return false;
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
