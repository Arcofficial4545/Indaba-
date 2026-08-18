import type { Metadata, Viewport } from "next";
import { Google_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/theme-provider";
import { OG_LOCALE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

/*
  Google Sans is the display and heading face. Its wght axis runs 400 to 700,
  so it is loaded as a variable font: one file, the whole usable range, and no
  synthetic bold above 700.
*/
const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

/*
  Inter is the reading face. Body copy, labels, table cells, form fields and
  long form article text, because it holds up at small sizes and has proper
  tabular figures.
*/
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
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
      className={`${googleSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
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
