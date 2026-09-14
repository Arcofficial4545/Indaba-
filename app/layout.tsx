import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { IntroScript } from "@/components/public/Intro";
import { ThemeProvider } from "@/components/theme-provider";
import {
  OG_LOCALE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  ogImageUrl,
} from "@/lib/site";

import "./globals.css";

/*
  There is no next/font call here any more, and that is deliberate.

  The site runs on one face, Switzer, in one variable file. Its @font-face
  rule lives in globals.css §2 rather than here, pointing straight at
  cdn.fontshare.com. The reasoning is written out in full at that rule; the
  short version is that Fontshare's own CSS route serves the rules from
  api.fontshare.com and the binary from cdn.fontshare.com, which puts two
  origins and a render blocking stylesheet in front of the hero headline, and
  the hero headline is the LCP element.

  Inter and IBM Plex Mono are gone, along with the three woff2 files that were
  committed under app/fonts to keep next/font/google off the build path. That
  hermetic-build property is preserved: nothing here resolves a font at build
  time either.
*/

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: ogImageUrl({}), width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/*
  A single light value rather than a prefers-color-scheme pair. The pair was
  correct while the OS drove the theme; it no longer does, so keying the
  browser chrome off that media query would paint a dark-OS visitor's chrome
  dark above a light page. Light is the default and the only theme a
  first-time visitor can land on, so that is what the chrome matches.

  The value is the bone page ground, not white, so the address bar and the
  page are the same colour on a phone.
*/
export const viewport: Viewport = {
  themeColor: "#eeefe9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={SITE_LOCALE}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        {/*
          One origin, opened before the CSS that needs it has finished
          parsing. crossorigin is required on both of these: fonts are always
          fetched in CORS mode, and a preconnect or preload without it opens
          or fills a second, unusable connection.

          The preload is what stops the font being discovered only after the
          stylesheet parses, which on a cold 4G connection is the difference
          between the headline painting in Switzer and painting in Arial and
          then swapping.
        */}
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://cdn.fontshare.com/wf/HJHZ26OECMTXRH7JXPFC7EVIHDSLT2RA/LJRNLR7WCPF3PY3SZ7B2LHNUTQMFNCHL/4MCJYGQDIOOXHWSIIB2OYNDBEALJSOGN.woff2"
          crossOrigin="anonymous"
        />
        {/*
          Decides whether the load sequence runs, synchronously, before the
          first paint. It has to be here and it has to be blocking: React
          cannot make this decision, because sessionStorage is unreadable on
          the server, so a component that checked it would either mismatch on
          hydration or decide a frame too late — and a frame too late means
          the reader sees the finished hero and then an overlay drops onto it.

          It writes data-intro="run" or "off" onto <html>, which both the CSS
          and the Intro component key off. Never "run" under /admin.
        */}
        <IntroScript />
      </head>
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background text-foreground"
      >
        {/*
          Runs before next-themes' own pre-paint script, which sits at the
          position of <ThemeProvider> below.

          next-themes only sanitises the stored theme when enableSystem is on:
          its script computes `enableSystem && stored === "system" ? os
          : stored` and applies the result verbatim. With enableSystem off, a
          "system" left in storage from when this site ran defaultTheme=
          "system" is written to <html> as class="system". That paints light by
          accident, because .dark is simply absent, but useTheme() then reports
          resolvedTheme as the OS theme, so the toggle would offer "Switch to
          light theme" on a page already light, and Sonner would draw dark
          toasts. Discarding anything that is not light or dark lets the read
          fall through to defaultTheme. A real light or dark choice is left
          untouched, so it still persists.

          "theme" is next-themes' default storageKey, which is left unset
          below, and is the same key scripts/shoot.ts writes.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")localStorage.removeItem("theme")}catch(e){}`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only rounded-full bg-[var(--color-surface-ink)] px-4 py-2 font-medium text-[var(--color-text-on-ink)] focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
