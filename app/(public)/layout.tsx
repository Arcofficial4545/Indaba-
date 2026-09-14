import { CompareProvider } from "@/components/public/CompareTray";
import { Footer } from "@/components/public/Footer";
import { Intro } from "@/components/public/Intro";
import { Navbar } from "@/components/public/Navbar";
import { SearchProvider } from "@/components/public/SearchProvider";
import { Toaster } from "@/components/ui/sonner";
import { getNavCategories, getNavFeaturedComparison } from "@/lib/queries/nav";
import { getSearchIndex } from "@/lib/queries/search";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
    Three reads, concurrent. All of them feed the navigation, which is on
    every page, so they are fetched together rather than in sequence: run one
    after another they would add three round trips to every route's TTFB.

    The layout is statically rendered and revalidated hourly like the pages
    inside it, so in practice these run once an hour, not once a request.
  */
  const [searchIndex, categories, featured] = await Promise.all([
    getSearchIndex(),
    getNavCategories(),
    getNavFeaturedComparison(),
  ]);

  return (
    <>
      {/*
        The intro is an overlay over a page that is already complete, never a
        gate on rendering. It is rendered before the header only so that its
        fixed overlay sits above it in paint order without needing a larger
        z-index than the sticky nav.
      */}
      <Intro />
      {/*
        One search dialog for the site, mounted here so that the navbar's ⌘K
        and the hero's field open the same panel rather than two of them.
      */}
      {/*
        Both providers wrap the whole tree, because both pieces of state have
        to survive a route change: the compare tray follows the reader across
        the site, and the search dialog is opened from two places.
      */}
      <SearchProvider items={searchIndex}>
        <CompareProvider>
          <Navbar categories={categories} featured={featured} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </CompareProvider>
      </SearchProvider>
      <Toaster />
    </>
  );
}
