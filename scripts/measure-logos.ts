/**
 * Measures the optical area of every bundled vendor mark and writes
 * `lib/logo-optics.ts`.
 *
 *   npx tsx scripts/measure-logos.ts
 *
 * WHY THIS EXISTS. The marquee used to size marks by their bounding box: 32px
 * tall for a square glyph, 96px wide for a wordmark. A bounding box says
 * nothing about how much ink is actually inside it, so "wave" and "paysoft" —
 * wide, solid, edge-to-edge lockups — rendered at roughly twice the visual
 * weight of a thin glyph like Sage or Xero, and the row read as a set of
 * unrelated logos rather than one even band.
 *
 * The row is painted `filter: brightness(0)`, so every mark is a flat
 * silhouette and its optical weight is exactly its ink area. That makes the
 * measurement objective rather than a matter of taste: rasterise each file at
 * a fixed height, count the alpha, and scale each mark so the ink areas match.
 *
 * The numbers are committed rather than computed at runtime because they only
 * change when an asset changes, and a marquee should not be doing image
 * decoding work on the client to decide how big something is.
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { LOGO_FILES } from "../lib/logo-manifest";

/**
 * Marks are fetched from the running dev server rather than off disk: a
 * canvas cannot read back pixels it drew from a file:// image, and the assets
 * have to be same-origin for getImageData to be allowed at all.
 */
const BASE = process.env.SHOOT_BASE ?? "http://localhost:3000";

/** Rasterisation height. Big enough that hairlines survive the count. */
const SAMPLE = 160;
/** Where the median mark lands, in px, matching the row's old fixed height. */
const TARGET_HEIGHT = 32;
/**
 * Nothing may be scaled outside this. A mark whose ink is a tiny fraction of
 * its box would otherwise be blown up until its bounding box overran the row,
 * and an almost-solid one would shrink to a speck.
 */
const MIN_HEIGHT = 22;
const MAX_HEIGHT = 38;

type Measured = { key: string; file: string; ink: number; aspect: number; opaque: boolean };

async function main() {
  const dir = path.join(process.cwd(), "public", "logos");
  const files = new Set(await readdir(dir));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });

  const measured: Measured[] = [];

  for (const [key, entry] of Object.entries(LOGO_FILES)) {
    const name = entry.file.replace("/logos/", "");
    if (!files.has(name)) {
      console.warn(`missing on disk, skipped: ${entry.file}`);
      continue;
    }
    const url = `${BASE}${entry.file}`;

    /*
      Drawn through an <img> rather than parsed, so an SVG is measured exactly
      as the browser will paint it — including its own viewBox padding, which
      is a real part of how heavy the mark looks in the row.
    */
    const result = await page.evaluate(
      async ([href, sample]) => {
        const img = new Image();
        img.decoding = "sync";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`could not load ${href}`));
          img.src = href as string;
        });
        const size = sample as number;
        const natural = img.naturalWidth / img.naturalHeight || 1;
        const w = Math.max(1, Math.round(size * natural));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = size;
        const context = canvas.getContext("2d")!;
        context.drawImage(img, 0, 0, w, size);
        const { data } = context.getImageData(0, 0, w, size);
        let alpha = 0;
        for (let i = 3; i < data.length; i += 4) alpha += data[i];
        return { ink: alpha / 255, aspect: natural, area: w * size };
      },
      [url, SAMPLE] as const,
    );

    measured.push({
      key,
      file: entry.file,
      ink: result.ink,
      aspect: result.aspect,
      // An asset with a solid background paints as a filled block once the
      // greyscale filter lands on it. Scaling cannot fix that; only a new
      // export can, so it is reported rather than silently absorbed.
      opaque: result.ink / result.area > 0.97,
    });
  }

  await browser.close();

  const inks = measured.map((m) => m.ink).sort((a, b) => a - b);
  const median = inks[Math.floor(inks.length / 2)];
  const targetInk = median * (TARGET_HEIGHT / SAMPLE) ** 2;

  const rows = measured
    .map((m) => {
      const ideal = SAMPLE * Math.sqrt(targetInk / m.ink);
      const height = Math.round(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, ideal)));
      return { ...m, ideal, height };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  for (const row of rows) {
    console.log(
      `${row.key.padEnd(20)} ink ${Math.round(row.ink).toString().padStart(6)}  ` +
        `ideal ${row.ideal.toFixed(1).padStart(6)}  ->  ${row.height}px` +
        (row.opaque ? "   OPAQUE BACKGROUND" : "") +
        (Math.abs(row.ideal - row.height) > 1.5 ? "   (clamped)" : ""),
    );
  }

  const body = rows
    .map((row) => `  "${row.key}": { height: ${row.height}, aspect: ${row.aspect.toFixed(3)} },`)
    .join("\n");

  await writeFile(
    path.join(process.cwd(), "lib", "logo-optics.ts"),
    `// Generated by scripts/measure-logos.ts. Do not edit by hand.
// Run \`npx tsx scripts/measure-logos.ts\` to refresh.
//
// height is the rendered height in px that gives this mark the same ink area
// as every other mark in the row. aspect is width / height of the source file,
// which is what reserves the correct width so the marquee cannot shift.
//
// The row is painted as flat silhouettes, so ink area IS optical weight. See
// the header of the script for why a bounding box is the wrong unit here.

export type LogoOptics = { height: number; aspect: number };

export const LOGO_OPTICS: Record<string, LogoOptics> = {
${body}
};

/** The height to render a mark at. Unmeasured marks fall back to the median. */
export function opticalHeight(key: string | null | undefined): number {
  return (key && LOGO_OPTICS[key]?.height) || ${TARGET_HEIGHT};
}
`,
    "utf8",
  );

  console.log(`\nwrote lib/logo-optics.ts (${rows.length} marks, median ink ${Math.round(median)})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
