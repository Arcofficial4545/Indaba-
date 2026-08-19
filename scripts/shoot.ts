/**
 * Hero screenshot rig.
 *
 * Starts nothing. Assumes `npm run dev` is already up on :3000, loads the
 * homepage at five widths in both themes and writes ten PNGs into .screens/.
 *
 *   npx tsx scripts/shoot.ts
 *
 * The theme is forced by writing next-themes' storage key before the first
 * paint, via an init script, so the page never renders in the wrong theme and
 * then flips. Motion is left on but every shot waits for the load sequence to
 * finish, so what lands in the file is the settled state.
 *
 * The frame is the hero band, from the top of the page down to the band's
 * bottom edge, rather than the viewport. Below 1024px the band is taller than
 * the phone, and a viewport crop hides the half of it being judged.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium, type Browser } from "playwright";

const BASE = process.env.SHOOT_BASE ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), ".screens");

/**
 * The five widths the hero has to hold at 100% zoom. 1920 is the full width
 * desktop the container stops short of, and 1280 is the tightest desktop the
 * 7/5 split has to survive; both are places the layout can pinch without any
 * narrower shot showing it.
 */
const VIEWPORTS = [
  { name: "w1920", width: 1920, height: 1080 },
  { name: "w1440", width: 1440, height: 900 },
  { name: "w1280", width: 1280, height: 800 },
  { name: "w0768", width: 768, height: 1024 },
  { name: "w0390", width: 390, height: 844 },
] as const;

const THEMES = ["light", "dark"] as const;

/** Long enough for the load sequence (last beat lands at ~1.73s) to settle. */
const SETTLE_MS = 2600;

async function shoot(browser: Browser, url: string) {
  const results: string[] = [];

  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2,
        colorScheme: theme,
      });

      // next-themes reads `theme` out of localStorage on mount.
      await context.addInitScript((value) => {
        window.localStorage.setItem("theme", value);
      }, theme);

      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle" });

      /*
        The dev overlay is a fixed badge in the bottom left corner and it lands
        on top of the trust row at some widths, which makes the shot unreadable
        exactly where the numbers are being judged. It does not exist in a
        production build, so hiding it shows the real page rather than hiding a
        real problem.
      */
      await page.addStyleTag({
        content: "nextjs-portal { display: none !important }",
      });

      await page.waitForTimeout(SETTLE_MS);

      /*
        Whether the page scrolls sideways is the thing reasoning gets wrong.

        The hero is overflow-x-clip, which means it can blow its content out to
        any width without the document ever gaining a scrollbar: the page looks
        clean and the band is silently four thousand pixels wide with its
        content cut off. So the band is measured on its own as well as the
        document, and both have to be quiet.
      */
      const overflow = await page.evaluate(() => {
        const hero = document.querySelector(".hero-band");
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          heroScroll: hero?.scrollWidth ?? 0,
          heroClient: hero?.clientWidth ?? 0,
          heroBottom: Math.ceil(hero?.getBoundingClientRect().bottom ?? 0),
        };
      });

      const file = path.join(OUT, `${viewport.name}-${theme}.png`);
      await page.screenshot({
        path: file,
        // clip is intersected with the viewport unless the capture is fullPage.
        fullPage: true,
        clip: {
          x: 0,
          y: 0,
          width: viewport.width,
          height: Math.max(overflow.heroBottom, viewport.height),
        },
      });
      await context.close();

      const slop = overflow.scrollWidth - overflow.clientWidth;
      const heroSlop = overflow.heroScroll - overflow.heroClient;
      results.push(
        `${viewport.name.padEnd(6)} ${theme.padEnd(5)} ` +
          `${String(viewport.width).padStart(4)}px  h ${String(overflow.heroBottom).padStart(4)}px  ` +
          `page ${slop > 0 ? `OVERFLOW +${slop}px` : "ok"}  ` +
          `band ${heroSlop > 0 ? `OVERFLOW +${heroSlop}px` : "ok"}`,
      );
    }
  }

  return results;
}

/**
 * prefers-reduced-motion is a correctness check, not a picture: with reduce
 * on, every element the sequence touches must already be at its final state on
 * the first frame, with no delay left hanging. Sampled straight after load,
 * well inside the delays the no-preference sequence would still be sitting in.
 */
async function checkReducedMotion(browser: Browser, url: string) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const unsettled = await page.evaluate(() => {
    const bad: string[] = [];
    const hero = document.querySelector(".hero-band");
    if (!hero) return ["no .hero-band on the page"];

    // Every element the sequence drives carries its own --d.
    for (const el of hero.querySelectorAll<HTMLElement>("[style*='--d']")) {
      const css = getComputedStyle(el);
      const at =
        el.tagName.toLowerCase() + " ." + (el.className || "?").split(" ")[0];
      if (Number(css.opacity) < 1) bad.push(at + " opacity " + css.opacity);
      if (
        css.transform !== "none" &&
        css.transform !== "matrix(1, 0, 0, 1, 0, 0)"
      ) {
        bad.push(at + " transform " + css.transform);
      }
      if (css.animationName !== "none") {
        bad.push(at + " animating " + css.animationName);
      }
    }
    return bad;
  });

  await context.close();
  return unsettled;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  // Keep the folder out of the repo without touching the root .gitignore.
  await writeFile(path.join(OUT, ".gitignore"), "*\n");

  const response = await fetch(BASE).catch(() => null);
  if (!response?.ok) {
    console.error(`No dev server on ${BASE}. Run \`npm run dev\` first.`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  try {
    const results = await shoot(browser, BASE);
    console.log(results.join("\n"));
    const unsettled = await checkReducedMotion(browser, BASE);
    console.log(
      "" +
        (unsettled.length === 0
          ? "reduced motion: every element final on the first frame"
          : "reduced motion: UNSETTLED - " + unsettled.join("; ")),
    );
    console.log(`\n10 shots written to ${path.relative(process.cwd(), OUT)}`);
  } finally {
    await browser.close();
  }
}

void main();
