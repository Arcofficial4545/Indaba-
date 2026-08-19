"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useMemo, useSyncExternalStore } from "react";

import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Product screenshots in a nested tray.
 *
 * Only ever rendered when a product actually has screenshots. A carousel of
 * one stock placeholder is worse than no carousel, so the caller checks the
 * array rather than this component rendering an empty frame.
 *
 * Carousel position is read through `useSyncExternalStore` rather than mirrored
 * into state, because Embla already is the store. Copying its position into
 * React state means a render pass that exists only to catch up with something
 * that already happened.
 */
export function ScreenshotCarousel({
  screenshots,
  name,
  className,
}: {
  screenshots: Screenshot[];
  name: string;
  className?: string;
}) {
  /*
    Embla animates by driving a transform in JavaScript, so the global CSS
    reduced motion rule does not reach it. Dropping the duration to zero makes
    the slide a jump cut instead, which is what that preference asks for.
  */
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const options = useMemo(
    () => ({ loop: false, align: "start" as const, duration: reducedMotion ? 0 : 22 }),
    [reducedMotion],
  );

  const [emblaRef, embla] = useEmblaCarousel(options);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!embla) return () => {};
      embla.on("select", onStoreChange).on("reInit", onStoreChange);
      return () => {
        embla.off("select", onStoreChange).off("reInit", onStoreChange);
      };
    },
    [embla],
  );

  const selected = useSyncExternalStore(
    subscribe,
    () => embla?.selectedScrollSnap() ?? 0,
    () => 0,
  );
  const canScrollPrev = useSyncExternalStore(
    subscribe,
    () => embla?.canScrollPrev() ?? false,
    () => false,
  );
  const canScrollNext = useSyncExternalStore(
    subscribe,
    () => embla?.canScrollNext() ?? false,
    () => false,
  );

  if (screenshots.length === 0) return null;

  const single = screenshots.length === 1;

  return (
    <div
      className={cn(
        "rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.4rem] border border-zinc-200/70 bg-card dark:border-zinc-800">
        <div
          className="overflow-hidden"
          ref={emblaRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${name} screenshots`}
        >
          <div className="flex">
            {screenshots.map((shot, index) => (
              <figure
                key={shot.url}
                className="flex min-w-0 flex-[0_0_100%] flex-col"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${screenshots.length}`}
              >
                {/*
                  A plain img rather than next/image: screenshots are uploaded
                  to Supabase storage and served from a host that is not in the
                  image config, so the optimiser would refuse them outright.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.url}
                  alt={shot.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="aspect-16/10 w-full bg-muted object-cover"
                />
                {shot.caption && (
                  <figcaption className="px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                    {shot.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>

        {!single && (
          <div className="flex items-center justify-between gap-4 border-t border-zinc-200/70 px-4 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <CarouselButton
                label="Previous screenshot"
                disabled={!canScrollPrev}
                onClick={() => embla?.scrollPrev()}
              >
                <ChevronLeftIcon className="size-4" aria-hidden="true" />
              </CarouselButton>
              <CarouselButton
                label="Next screenshot"
                disabled={!canScrollNext}
                onClick={() => embla?.scrollNext()}
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              </CarouselButton>
            </div>

            {/*
              Position is stated as text as well as shown as dots. Colour is
              never the only signal of where you are.
            */}
            <p className="text-xs text-muted-foreground tabular-nums">
              {selected + 1} of {screenshots.length}
            </p>

            <div className="flex items-center gap-1.5">
              {screenshots.map((shot, index) => (
                <button
                  key={shot.url}
                  type="button"
                  aria-label={`Go to screenshot ${index + 1}`}
                  aria-current={index === selected}
                  onClick={() => embla?.scrollTo(index)}
                  className={cn(
                    "size-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
                    index === selected
                      ? "bg-[var(--color-brand-dark)]"
                      : "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-xl border border-zinc-200/70 bg-card transition-colors hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-ink)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-800"
    >
      {children}
    </button>
  );
}
