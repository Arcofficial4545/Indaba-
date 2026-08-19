/**
 * Downloads vendor brand marks into public/logos and writes a manifest.
 *
 *   npm run logos            fetch anything missing
 *   npm run logos -- --force re fetch everything
 *
 * Three kinds of source:
 *   simple-icons  a monochrome vector glyph, painted in the official brand
 *                 colour on the way through
 *   direct        the vendor's own published asset, saved byte for byte
 *   domain        resolved from the vendor's hostname through one icon
 *                 service, for brands with no vector asset worth linking
 *
 * Every file gets an entry in public/logos/manifest.json recording where it
 * came from and when, so the provenance of each mark is auditable rather than
 * folklore.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import { BRAND_LOGOS, type BrandLogoSource } from "../lib/logos";

const OUT_DIR = path.join(process.cwd(), "public", "logos");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
const SIMPLE_ICONS_VERSION = "16.28.0";
/*
  One host resolves every domain sourced mark. Requesting 256 gets the largest
  icon a site publishes rather than the 16px favicon, which is the difference
  between a usable mark and a smudge on the 84px profile header.
*/
const DOMAIN_ICON_ENDPOINT = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const force = process.argv.includes("--force");

type ManifestEntry = {
  brand: string;
  file: string;
  shape: "mark" | "wordmark";
  hex: string;
  width: number | null;
  height: number | null;
  sourceUrl: string;
  note: string;
  fetchedAt: string;
};

async function fetchBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/** Read width and height out of a PNG IHDR chunk. */
function pngSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** Read width and height out of an SVG viewBox. */
function svgSize(svg: string): { width: number; height: number } | null {
  const match = svg.match(/viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}

/**
 * Simple Icons ship an unfilled path that renders black by default. Painting
 * it with the official brand colour is what makes a grid of marks readable.
 */
function paintSimpleIcon(svg: string, hex: string): string {
  const withoutTitle = svg.replace(/<title>.*?<\/title>/s, "");
  return withoutTitle.replace(
    /<svg([^>]*)>/,
    (_full, attrs: string) =>
      `<svg${attrs.replace(/\sfill="[^"]*"/g, "")} fill="${hex}">`,
  );
}

async function fetchOne(
  key: string,
  logo: BrandLogoSource,
): Promise<ManifestEntry> {
  if (logo.kind === "simple-icons") {
    const url = `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_VERSION}/icons/${logo.source}.svg`;
    const raw = (await fetchBuffer(url)).toString("utf8");
    const painted = paintSimpleIcon(raw, logo.hex);
    const file = `${key}.svg`;
    await writeFile(path.join(OUT_DIR, file), painted, "utf8");
    const size = svgSize(painted);
    return {
      brand: logo.brand,
      file: `/logos/${file}`,
      shape: logo.shape,
      hex: logo.hex,
      width: size?.width ?? null,
      height: size?.height ?? null,
      sourceUrl: url,
      note: logo.note,
      fetchedAt: new Date().toISOString(),
    };
  }

  const url =
    logo.kind === "domain" ? DOMAIN_ICON_ENDPOINT(logo.source) : logo.source;

  const buffer = await fetchBuffer(url);
  const isSvg =
    url.endsWith(".svg") ||
    buffer.subarray(0, 200).toString("utf8").includes("<svg");
  const file = `${key}.${isSvg ? "svg" : "png"}`;
  await writeFile(path.join(OUT_DIR, file), buffer);

  const size = isSvg ? svgSize(buffer.toString("utf8")) : pngSize(buffer);

  return {
    brand: logo.brand,
    file: `/logos/${file}`,
    shape: logo.shape,
    hex: logo.hex,
    width: size?.width ?? null,
    height: size?.height ?? null,
    sourceUrl: url,
    note: logo.note,
    fetchedAt: new Date().toISOString(),
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let manifest: Record<string, ManifestEntry> = {};
  if (existsSync(MANIFEST)) {
    try {
      manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
    } catch {
      manifest = {};
    }
  }

  const keys = Object.keys(BRAND_LOGOS);
  let fetched = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const key of keys) {
    const logo = BRAND_LOGOS[key];
    const existing = manifest[key];
    const onDisk =
      existing && existsSync(path.join(process.cwd(), "public", existing.file));

    if (!force && onDisk) {
      skipped += 1;
      continue;
    }

    try {
      manifest[key] = await fetchOne(key, logo);
      const entry = manifest[key];
      const dims =
        entry.width && entry.height ? `${entry.width}x${entry.height}` : "?";
      console.log(`  ok    ${key.padEnd(12)} ${entry.shape.padEnd(8)} ${dims}`);
      fetched += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  FAIL  ${key.padEnd(12)} ${message}`);
      failures.push(`${key}: ${message}`);
    }
  }

  // Sort keys so the manifest diffs cleanly between runs.
  const sorted = Object.fromEntries(
    Object.keys(manifest)
      .sort()
      .map((key) => [key, manifest[key]]),
  );
  await writeFile(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");

  /*
    A typed companion for the app to import. Generated rather than hand kept,
    so the file paths the components use can never drift from what is actually
    on disk.
  */
  const lines = Object.entries(sorted).map(
    ([key, entry]) =>
      `  ${JSON.stringify(key)}: { file: ${JSON.stringify(entry.file)}, shape: ${JSON.stringify(entry.shape)}, width: ${entry.width}, height: ${entry.height} },`,
  );
  const generated = `// Generated by scripts/fetch-logos.ts. Do not edit by hand.
// Run \`npm run logos\` to refresh.

export type LogoFile = {
  file: string;
  shape: "mark" | "wordmark";
  width: number | null;
  height: number | null;
};

export const LOGO_FILES: Record<string, LogoFile> = {
${lines.join("\n")}
};
`;
  await writeFile(
    path.join(process.cwd(), "lib", "logo-manifest.ts"),
    generated,
    "utf8",
  );

  console.log(
    `\n${fetched} fetched, ${skipped} already present, ${failures.length} failed`,
  );
  if (failures.length > 0) {
    console.error("\nFailures:");
    for (const failure of failures) console.error(`  ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
