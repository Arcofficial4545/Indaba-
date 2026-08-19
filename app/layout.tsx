import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/theme-provider";
import { OG_LOCALE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

/*
  Both faces are loaded from woff2 files committed under app/fonts rather than
  through next/font/google. next/font/google resolves the family over the
  network at build time, so fonts.googleapis.com becomes a hard build
  dependency: a CI machine that cannot reach it fails the build outright
  rather than degrading. Reading the files off disk keeps the build
  hermetic. The emitted CSS is identical either way, because next/font
  self-hosts the Google files too — this only moves the download from build
  time to the one time it was committed.

  Each file is the latin subset pulled from the family Google serves, which is
  what subsets: ["latin"] resolved to before.
*/

/*
  Inter is the whole face: headings, body copy, labels, table cells, form
  fields and long form article text. It holds up at small sizes, has proper
  tabular figures, and carries a real 100 to 900 wght axis, so a bold heading
  is drawn rather than synthesised.

  Exposed as --font-inter, not --font-sans, because Tailwind 4 emits its own
  --font-sans on :root. Two declarations of that name land on <html> at equal
  specificity, and the winner would be decided by stylesheet order. The
  @theme inline block in globals.css maps --font-inter onto --font-sans and
  --font-heading instead, which is the one direction that cannot collide.
*/
const inter = localFont({
  src: "./fonts/Inter-latin-variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/*
  IBM Plex Mono is the data face. It carries the counts in the hero trust row,
  where the numerals are the whole argument. --font-mono was previously the
  bare ui-monospace system stack, which resolves to a different face on every
  operating system, and a review total cannot be allowed to render differently
  per machine.

  adjustFontFallback is off because the generated metric override is measured
  against Arial, and scaling a proportional face onto a monospace advance
  width reflows the numerals it is meant to hold still.
*/
const ibmPlexMono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | South Africa's independent business software guide`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | South Africa's independent business software guide`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: SITE_NAME }],
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-ZA"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background text-foreground"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only rounded-xl bg-[var(--color-brand)] px-4 py-2 font-medium text-[var(--color-brand-ink)] focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]"
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
