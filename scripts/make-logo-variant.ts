/**
 * Writes the light-surface variant of the Indaba mark.
 *
 *   npx tsx scripts/make-logo-variant.ts
 *
 * WHY THIS EXISTS. The supplied mark is two-tone: about 90% ink and about 6%
 * sand, which is the brand palette exactly. On the ink footer and in dark mode
 * the site was showing it through `filter: brightness(0) invert(0.93)`, which
 * flattens the whole thing to one near-white silhouette and throws the sand
 * away. That is a visible change to somebody's logo, made for a legitimate
 * reason — the ink parts are invisible on an ink surface — but the wrong fix.
 *
 * No CSS filter can lighten the dark parts while leaving the sand alone:
 * `invert(1)` turns sand into a dark blue, and anything through `grayscale`
 * turns it dark. So the variant is generated as a real asset instead. Ink goes
 * to bone, sand stays sand, and the mark keeps its two-tone identity on a dark
 * background the same way it has on a light one.
 *
 * Run it again if the source mark is ever replaced.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const BASE = process.env.SHOOT_BASE ?? "http://localhost:3000";
const SOURCE = "/logos/indaca_logo7.png";
const OUTPUT = "indaba-mark-light.png";

/** Anything darker than this is structure and becomes bone. */
const INK_LUMA = 120;
/** The palette values the variant paints with. */
const BONE = [238, 239, 233];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });

  const dataUrl = await page.evaluate(
    async ([src, inkLuma, bone]) => {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`could not load ${src}`));
        img.src = src as string;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(img, 0, 0);
      const image = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = image;
      const [br, bg, bb] = bone as number[];
      let repainted = 0;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 8) continue;
        // Rec. 709 luma. Only the structural ink is repainted; the sand
        // accent sits well above the threshold and is left exactly as it is.
        const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        if (luma < (inkLuma as number)) {
          data[i] = br;
          data[i + 1] = bg;
          data[i + 2] = bb;
          repainted++;
        }
      }
      context.putImageData(image, 0, 0);
      return { url: canvas.toDataURL("image/png"), repainted, size: [canvas.width, canvas.height] };
    },
    [`${BASE}${SOURCE}`, INK_LUMA, BONE] as const,
  );

  await browser.close();

  const base64 = dataUrl.url.replace(/^data:image\/png;base64,/, "");
  const target = path.join(process.cwd(), "public", "logos", OUTPUT);
  await writeFile(target, Buffer.from(base64, "base64"));

  console.log(
    `wrote public/logos/${OUTPUT} — ${dataUrl.size.join("x")}, ` +
      `${dataUrl.repainted} ink pixels repainted to bone, sand untouched`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
