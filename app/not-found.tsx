import Link from "next/link";
import { CompassIcon } from "lucide-react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { SearchBar } from "@/components/public/SearchBar";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { getTopRatedSoftware } from "@/lib/queries/software";

/**
 * A 404 that offers a way forward rather than a dead end. Popular software is
 * pulled live, because the most likely reason somebody is here is a mistyped
 * or renamed product URL.
 */
export default async function NotFound() {
  const popular = await getTopRatedSoftware(6);

  return (
    <div className="container-site flex flex-col items-center gap-10 py-20">
      <div className="flex max-w-xl flex-col items-center gap-5 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-2xl bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]"
        >
          <CompassIcon className="size-7" />
        </span>

        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          That page is not <span className="brand-highlight">here</span>
        </h1>

        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          The link may be old, or the product may have been renamed. Try a
          search, or start from one of the reviews people read most.
        </p>

        <SearchBar className="mt-2" />
      </div>

      {popular.length > 0 && (
        <section aria-labelledby="popular-heading" className="w-full max-w-4xl">
          <h2
            id="popular-heading"
            className="mb-5 text-center text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase"
          >
            Most read reviews
          </h2>

          <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((software) => (
                <Link
                  key={software.id}
                  href={`/software/${software.slug}`}
                  className="flex items-center gap-3 rounded-[1.4rem] border border-zinc-200/70 bg-card p-4 transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none dark:border-zinc-800 dark:hover:border-zinc-700"
                >
                  <SoftwareLogo
                    name={software.name}
                    slug={software.slug}
                    logoUrl={software.logo_url}
                    brandColor={software.brand_color}
                    size={40}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-sm font-bold tracking-tight">
                      {software.name}
                    </span>
                    <StarRating
                      rating={software.overall_rating}
                      size="sm"
                      className="mt-1"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <GlossyButton href="/software" size="lg">
          Browse all software
        </GlossyButton>
        <GlossyButton href="/" size="lg" variant="dark">
          Back home
        </GlossyButton>
      </div>
    </div>
  );
}
