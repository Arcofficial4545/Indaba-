import { Figure } from "@/components/public/Figure";
import { cn } from "@/lib/utils";

/**
 * The structural rail, and the site's signature.
 *
 * Every section on every page opens with one of these: a name in sentence
 * case and a live count in tabular figures, in a fixed left-hand column, with
 * the content in the well to its right.
 *
 * It is what replaces the eyebrow it is not allowed to be. A tracked-out
 * ALL-CAPS "BROWSE BY CATEGORY" above a centred heading tells the reader
 * nothing; "Categories / 6" tells them the size of the evidence before it
 * tells them anything else. On a directory that is the more confident
 * opening, and it repeats often enough to become the layout's fingerprint.
 *
 * Below 1024 it unstacks into a row above the well rather than disappearing,
 * because the count is the point.
 */
export function Rail({
  label,
  count,
  note,
}: {
  label: string;
  /** Pre-formatted by the caller, so it can be "39" or "6 196". */
  count?: string;
  note?: string;
}) {
  return (
    <div className="rail">
      <p className="text-small text-[var(--color-text-muted)]">{label}</p>
      {count && (
        <Figure
          as="p"
          className="mt-0.5 text-[1.375rem] leading-tight text-[var(--color-text)] lg:mt-2"
        >
          {count}
        </Figure>
      )}
      {note && (
        <p className="mt-2 hidden max-w-[22ch] text-small leading-relaxed text-[var(--color-text-muted)] lg:block">
          {note}
        </p>
      )}
    </div>
  );
}

/**
 * A section built on the rail grid.
 *
 * The visible heading is the statement in the well, and it is the real `<h2>`
 * — what looks like the heading is the heading. The rail label is a `<p>`
 * beside it. Getting that the other way round would put the document outline
 * at odds with the visual hierarchy for the sake of tidiness in the markup.
 *
 * `.reveal-line` masks the heading's FIRST LINE only, from CSS, with no
 * JavaScript. That is the one automatic animation any section below the hero
 * is allowed. Nothing else in here fades, rises or staggers.
 *
 * `padding-block` comes from the four-step rhythm and lives only on the
 * section. Element spacing inside uses margin exclusively, so the two systems
 * cannot cancel each other out — the specificity trap the brief warns about,
 * and one this build has already been bitten by once.
 */
export function RailSection({
  id,
  label,
  count,
  note,
  heading,
  children,
  className,
  rhythm = 2,
}: {
  id: string;
  label: string;
  count?: string;
  note?: string;
  /** The statement that opens the section. Rendered as the h2. */
  heading: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  rhythm?: 1 | 2 | 3 | 4;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn("container-site", className)}
      style={{ paddingBlock: `var(--section-${rhythm})` }}
    >
      <div className="rail-grid">
        <Rail label={label} count={count} note={note} />
        <div className="well">
          <h2 id={id} className="section-heading reveal-line">
            <span>{heading}</span>
          </h2>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
