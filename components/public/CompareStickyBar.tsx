import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatRating } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * The mobile action bar on a head to head page.
 *
 * On a narrow screen the two affiliate CTAs sit thousands of pixels apart, one
 * per column, so by the time a reader has decided they have scrolled past
 * both. This keeps the decision reachable from anywhere on the page.
 *
 * Hidden from `lg` up, where both CTAs are already on screen together. It is
 * not marked `aria-hidden`: the links inside it are focusable, and hiding a
 * focusable element from the accessibility tree strands anyone tabbing through
 * on a control that announces nothing.
 */
export function CompareStickyBar({
  a,
  b,
}: {
  a: SoftwareWithCategory;
  b: SoftwareWithCategory;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl lg:hidden"
      /*
        The safe area inset keeps the buttons clear of the home indicator on an
        iPhone, where the bottom of the viewport is not the bottom of the
        screen.
      */
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-site grid grid-cols-2 gap-3 py-3">
        <StickyHalf software={a} />
        <StickyHalf software={b} />
      </div>
    </div>
  );
}

function StickyHalf({ software }: { software: SoftwareWithCategory }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <SoftwareLogo
          name={software.name}
          slug={software.slug}
          logoUrl={software.logo_url}
          brandColor={software.brand_color}
          size={28}
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{software.name}</p>
          <p className="text-[0.7rem] text-muted-foreground tabular-nums">
            {formatRating(software.overall_rating)} out of 5
          </p>
        </div>
      </div>
      <AffiliateCTAButton
        slug={software.slug}
        name={software.name}
        brandColor={software.brand_color}
        className="h-10 w-full px-3 text-xs"
      >
        Visit site
      </AffiliateCTAButton>
    </div>
  );
}
