/**
 * Screenshot and layout-audit rig.
 *
 * Starts nothing. Assumes `npm run dev` is already up on :3000.
 *
 *   npx tsx scripts/shoot.ts                      home, both themes, all widths
 *   npx tsx scripts/shoot.ts /software/xero       one route
 *   npx tsx scripts/shoot.ts / --widths 1280,390  a subset
 *   npx tsx scripts/shoot.ts / --theme light      one theme
 *   npx tsx scripts/shoot.ts / --scale 1.25       125% Windows display scaling
 *   npx tsx scripts/shoot.ts /about /contact      several routes
 *
 * This replaces a hero-only rig. It was written when the hero was the only
 * thing being judged, so it clipped every shot to `.hero-band` and only ran
 * five widths. The redesign has to hold at seven widths on every template, so
 * the frame is now the whole page and the route is an argument.
 *
 * The theme is forced by writing next-themes' storage key before the first
 * paint, via an init script, so the page never renders in the wrong theme and
 * then flips.
 *
 * The overflow audit is the part that actually catches regressions. Whether a
 * page scrolls sideways is the thing reasoning gets wrong, and a section with
 * `overflow-x: clip` can blow its content out to any width without the
 * document ever gaining a scrollbar: the page looks clean and the band is
 * silently four thousand pixels wide with its content cut off. So every
 * section is measured on its own as well as the document, and the offending
 * element is named rather than just counted.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium, type Browser } from "playwright";

const BASE = process.env.SHOOT_BASE ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), ".screens");

/**
 * The seven widths the layout has to hold at 100% zoom.
 *
 * 1280 is the one that matters most: it is a 1080p Windows laptop at 100%
 * browser zoom, and it is where this layout has broken twice before. 1920 is
 * the full width the container stops short of. 1024 is the breakpoint the
 * hero reflows at, so it is checked on the desktop side of the boundary.
 */
const ALL_WIDTHS = [390, 768, 1024, 1280, 1440, 1536, 1920] as const;

const THEMES = ["light", "dark"] as const;

/** Long enough for the load sequence (capped at 1200ms) to finish and settle. */
const SETTLE_MS = 2200;

type Args = {
  routes: string[];
  widths: number[];
  themes: readonly string[];
  scale: number;
};

function parseArgs(argv: string[]): Args {
  const routes: string[] = [];
  let widths = [...ALL_WIDTHS] as number[];
  let themes: readonly string[] = THEMES;
  let scale = 1;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--widths") {
      widths = argv[++i].split(",").map((w) => Number(w.trim()));
    } else if (arg === "--theme") {
      themes = [argv[++i]];
    } else if (arg === "--scale") {
      scale = Number(argv[++i]);
    } else if (!arg.startsWith("--")) {
      routes.push(normaliseRoute(arg));
    }
  }

  return { routes: routes.length > 0 ? routes : ["/"], widths, themes, scale };
}

/**
 * Accepts `/software/xero`, `software/xero`, or the mangled absolute path Git
 * Bash produces on Windows.
 *
 * MSYS rewrites any argument that looks like a POSIX absolute path into a
 * Windows one before the process ever sees it, so `scripts/shoot.ts /admin`
 * arrives as `C:/Program Files/Git/admin`. Prefixing every invocation with
 * MSYS_NO_PATHCONV=1 works but has to be remembered every time, and the
 * failure is a confusing 404 rather than an obvious error. Undoing it here
 * costs four lines and cannot be forgotten.
 */
function normaliseRoute(arg: string): string {
  let route = arg;
  const mangled = route.match(/^[A-Za-z]:[/\\].*?[/\\]Git(\/.*)$/);
  if (mangled) route = mangled[1];
  if (!route.startsWith("/")) route = `/${route}`;
  return route;
}

/** `/software/xero` -> `software-xero`, `/` -> `home`. */
function slugify(route: string): string {
  const cleaned = route.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-");
  return cleaned === "" ? "home" : cleaned;
}

type Overflow = {
  docScroll: number;
  docClient: number;
  bodyScroll: number;
  /** How far the window could actually be scrolled sideways. 0 is the goal. */
  scrolledX: number;
  offenders: { tag: string; cls: string; scroll: number; client: number }[];
};

async function shoot(browser: Browser, args: Args) {
  const results: string[] = [];
  let failures = 0;

  /*
    One context per theme, reused across every route and width, with the
    viewport resized between shots.

    A context per shot meant the webfont was fetched from cdn.fontshare.com
    once for every combination — fourteen cold fetches for a single route in
    two themes — and Playwright blocks screenshot() on document.fonts.ready,
    so a run died on a font timeout rather than on anything to do with the
    page being audited. Sharing the context shares the HTTP cache: the font is
    fetched once per theme and every later shot is warm.

    deviceScaleFactor is fixed for a whole run, so it is safe to set here.
    Only the viewport varies per shot.
  */
  for (const theme of args.themes) {
    const context = await browser.newContext({
      /*
        Windows display scaling at 125% does not change the CSS pixel width of
        the viewport, it changes how many device pixels each CSS pixel
        occupies. deviceScaleFactor is the faithful way to model it, and it is
        a real test because it is the default on the machines this audience
        uses: a layout that only just fits at 1280 shows its seams once every
        border is 1.25 device pixels.
      */
      viewport: { width: args.widths[0], height: 900 },
      /*
        Base DPR of 1, not 2. A full-page shot of the home page at 1920 is
        already ~12 000px tall; at 2x that is a 3840x25000 bitmap and
        Chromium times out encoding it. --scale is what models Windows
        display scaling on top of this, which is the case that actually needs
        testing.
      */
      deviceScaleFactor: args.scale,
      colorScheme: theme as "light" | "dark",
    });

    await context.addInitScript((value) => {
      window.localStorage.setItem("theme", value);
    }, theme);

    const page = await context.newPage();

    for (const route of args.routes) {
      for (const width of args.widths) {
        await page.setViewportSize({ width, height: 900 });

        /*
          Neither "networkidle" nor "load".

          "networkidle" never resolves: the dev server holds an HMR websocket
          open for the page's lifetime, so the network is never idle and the
          wait only ends by timing out.

          "load" waits for every subresource, including the webfont, which
          makes a slow CDN fetch fail a layout audit.

          SETTLE_MS below is what actually guarantees the page has stopped
          moving, and it covers the font swap and the load sequence together.
        */
        await page.goto(`${BASE}${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 45_000,
        });

        /*
          The dev overlay is a fixed badge in the bottom left corner and it
          lands on top of real content at some widths, which makes the shot
          unreadable exactly where something is being judged. It does not
          exist in a production build, so hiding it shows the real page rather
          than hiding a real problem.
        */
        await page.addStyleTag({
          content: [
            "nextjs-portal { display: none !important }",
            /*
              Scroll-driven reveals are neutralised for the capture.

              A fullPage screenshot stitches the whole document while the
              scroll position stays at 0, so every scroll-timeline animation
              below the fold is frozen at its "before entry" keyframe — which
              for the heading reveal means clipped to nothing. The headings
              are verified separately by scrolling one into view; freezing
              them here is what makes the audit shots show the real layout
              rather than an artefact of how the screenshot is taken.
            */
            ".reveal-line > *, .animate-fill-bar { animation: none !important; clip-path: none !important; transform: none !important }",
          ].join(" "),
        });

        await page.waitForTimeout(SETTLE_MS);

        const overflow: Overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const offenders: {
            tag: string;
            cls: string;
            scroll: number;
            client: number;
          }[] = [];

          for (const el of Array.from(
            document.querySelectorAll<HTMLElement>("body *"),
          )) {
            // 2px of slack absorbs sub-pixel rounding at fractional DPR.
            if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
              const style = getComputedStyle(el);

              /*
                An element that clips or scrolls itself cannot push the
                document sideways, so it is not an overflow bug. It can still
                be a DESIGN bug — the brief warns specifically about a section
                with overflow-x: clip that is silently four thousand pixels
                wide with its content cut off — so a self-clipping element is
                only reported when it is hiding a substantial amount of its
                own content. A star rating masking 14px into 7px is a mask
                doing its job; a band hiding 40% of itself is not.
              */
              /*
                An element can declare that it clips on purpose. The hero band
                does: the sand disc is designed to run off the right edge of
                the canvas, so the band hides about 29% of its own content by
                intent, which is exactly what the cut-content heuristic below
                is meant to flag. An explicit opt-out is better than tuning the
                threshold until the one real case stops firing.
              */
              if (el.hasAttribute("data-bleed")) continue;

              const selfClips =
                style.overflowX === "auto" ||
                style.overflowX === "scroll" ||
                style.overflowX === "hidden" ||
                style.overflowX === "clip";
              if (selfClips) {
                const ratio = el.scrollWidth / Math.max(el.clientWidth, 1);
                if (ratio < 1.25 || el.clientWidth < 120) continue;
                // A deliberate scroller is exempt from the cut-content check.
                if (style.overflowX === "auto" || style.overflowX === "scroll") {
                  continue;
                }
              }

              /*
                Visually-hidden elements are clipped to a 1px box on purpose,
                so their content always "overflows". Skip-links and sr-only
                spans would otherwise be reported on every single shot and
                train the eye to ignore this list, which is the one thing it
                must not do.
              */
              if (
                el.clientWidth <= 4 ||
                style.clipPath === "inset(50%)" ||
                style.clip === "rect(0px, 0px, 0px, 0px)"
              ) {
                continue;
              }

              /*
                An element wider than its box but sitting inside an ancestor
                that clips horizontally is not a bug either: that is how a
                marquee track, a carousel rail and a scrolling table are all
                built.
              */
              let clipped = false;
              for (
                let p = el.parentElement;
                p && p !== document.body;
                p = p.parentElement
              ) {
                const px = getComputedStyle(p).overflowX;
                if (
                  px === "hidden" ||
                  px === "clip" ||
                  px === "auto" ||
                  px === "scroll"
                ) {
                  clipped = true;
                  break;
                }
              }
              if (clipped) continue;

              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls:
                  typeof el.className === "string"
                    ? el.className.split(" ").slice(0, 3).join(" ")
                    : "",
                scroll: el.scrollWidth,
                client: el.clientWidth,
              });
            }
          }

          /*
            The authoritative test is whether the window can actually be
            scrolled sideways, not whether scrollWidth is larger than
            clientWidth. Those disagree: an absolutely positioned element that
            has escaped to the initial containing block inflates
            documentElement.scrollWidth while body.scrollWidth stays correct,
            and conversely a large scrollWidth on a clipped element scrolls
            nothing. Asking the browser to scroll and reading back where it
            landed is the only answer a user would recognise.
          */
          window.scrollTo(5000, 0);
          const scrolledX = Math.round(window.scrollX);
          window.scrollTo(0, 0);

          return {
            docScroll: doc.scrollWidth,
            docClient: doc.clientWidth,
            bodyScroll: document.body.scrollWidth,
            scrolledX,
            offenders: offenders.slice(0, 5),
          };
        });

        const name = `${slugify(route)}-w${String(width).padStart(4, "0")}-${theme}${
          args.scale !== 1 ? `-x${args.scale}` : ""
        }.png`;
        await page.screenshot({
          path: path.join(OUT, name),
          fullPage: true,
          // The font is already warm in this context; do not hang on it.
          timeout: 60_000,
        });

        const slop = overflow.scrolledX;
        if (slop > 0 || overflow.offenders.length > 0) failures += 1;

        let line =
          `${slugify(route).padEnd(22)} ${String(width).padStart(4)} ${theme.padEnd(5)} ` +
          (slop > 0
            ? `SCROLLS SIDEWAYS ${slop}px (doc ${overflow.docScroll}, body ${overflow.bodyScroll})`
            : "page ok");
        for (const o of overflow.offenders) {
          line += `\n${" ".repeat(24)}wide: <${o.tag} class="${o.cls}"> ${o.scroll} in ${o.client}`;
        }
        results.push(line);
      }
    }

    await context.close();
  }

  return { results, failures };
}
/**
 * prefers-reduced-motion is a correctness check, not a picture: with reduce
 * on, every element the sequence touches must already be at its final state
 * on the first frame, with no delay left hanging. Sampled straight after
 * domcontentloaded, well inside the delays the no-preference sequence would
 * still be sitting in.
 */
async function checkReducedMotion(browser: Browser, route: string) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });

  const unsettled = await page.evaluate(() => {
    const bad: string[] = [];
    for (const el of Array.from(
      document.querySelectorAll<HTMLElement>("main *, header *"),
    )) {
      const css = getComputedStyle(el);
      const at = `${el.tagName.toLowerCase()}.${(typeof el.className === "string" ? el.className : "").split(" ")[0] || "?"}`;
      /*
        Only effectively-invisible counts, not any opacity below 1.

        A partial opacity is usually a deliberate resting state — the marquee
        logos sit at 0.55 by design — and flagging those buried the one thing
        this check exists for: an element left stuck at the start of a reveal
        that reduced motion should have skipped. That failure always looks
        like opacity 0, not opacity 0.55.
      */
      if (Number(css.opacity) < 0.05 && css.opacity !== "") {
        bad.push(`${at} opacity ${css.opacity}`);
      }
      /*
        el.getAnimations(), not animationPlayState.

        A CSS animation that has run to completion still reports
        animationPlayState: "running" — the property describes whether the
        animation is paused, not whether it has finished. Under reduced motion
        every duration is collapsed to 0.01ms, so Radix's closed-state
        accordion animations complete instantly and were still reported as
        unsettled on every single run. The Web Animations API reports
        playState "finished" correctly, which is the question being asked.
      */
      for (const animation of el.getAnimations()) {
        if (animation.playState === "running") {
          bad.push(`${at} animating ${css.animationName}`);
          break;
        }
      }
      if (bad.length > 8) break;
    }
    return bad;
  });

  await context.close();
  return unsettled;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
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
    const { results, failures } = await shoot(browser, args);
    console.log(results.join("\n"));

    const unsettled = await checkReducedMotion(browser, args.routes[0]);
    console.log(
      "\nreduced motion: " +
        (unsettled.length === 0
          ? "every element final on the first frame"
          : "UNSETTLED - " + unsettled.join("; ")),
    );

    const shots =
      args.routes.length * args.widths.length * args.themes.length;
    console.log(
      `\n${shots} shots written to ${path.relative(process.cwd(), OUT)}` +
        (failures > 0 ? `\n${failures} shot(s) had overflow` : ""),
    );
  } finally {
    await browser.close();
  }
}

void main();
