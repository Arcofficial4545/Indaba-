/**
 * Enforces the editorial rules that a checklist alone will not survive.
 *
 *   npm run check-copy
 *
 * A launch checklist item that nothing verifies is a wish. This is the test.
 *
 * Checks:
 *   1. No em dashes or en dashes used as sentence punctuation.
 *   2. No banned marketing vocabulary.
 *   3. American spellings that should be British or South African.
 *
 * It reads the content modules, which are the source of truth for everything
 * that gets seeded, so it catches a problem before it reaches the database.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

const FILES = [
  "lib/content/articles.ts",
  "lib/content/catalogue.ts",
  "lib/content/pages.ts",
  "lib/content/corpus.ts",
  "lib/content/faqs.ts",
  "lib/content/categoryIntros.ts",
  "lib/content/pricing.ts",
];

type Rule = {
  name: string;
  pattern: RegExp;
  hint: string;
};

const RULES: Rule[] = [
  {
    name: "em or en dash",
    // The dash characters themselves. A hyphen between words is fine; these
    // are the ones used as sentence punctuation.
    pattern: /[—–]/g,
    hint: "Rewrite the sentence. Use a full stop, a comma or a colon.",
  },
  {
    name: "banned marketing word",
    pattern:
      /\b(unlock|seamless(ly)?|revolutionis[e|ing]|game.?changer|cutting.?edge|best.?in.?class|leverage|synerg(y|ies)|in today's fast.?paced world)\b/gi,
    hint: "Say what it actually does instead.",
  },
  {
    name: "American spelling",
    pattern:
      /\b(organization|organize[ds]?|recognize[ds]?|customiz(e|ed|ing|ation)|optimiz(e|ed|ing|ation)|analyz(e|ed|ing)|color|favorite|center|licence to|program(?!me))\b/g,
    hint: "Use the British or South African spelling.",
  },
];

/** Only check string and template literal content, not code or identifiers. */
function extractProse(source: string): { text: string; line: number }[] {
  const results: { text: string; line: number }[] = [];
  const lines = source.split("\n");

  lines.forEach((line, index) => {
    // Skip import lines and obvious code, keep anything with quoted prose.
    if (/^\s*(import|export type|type |const \w+: Record)/.test(line)) return;
    results.push({ text: line, line: index + 1 });
  });

  return results;
}

async function main() {
  let problems = 0;
  let checked = 0;

  for (const relative of FILES) {
    const absolute = path.join(process.cwd(), relative);
    let source: string;

    try {
      source = await readFile(absolute, "utf8");
    } catch {
      console.log(`  skipped ${relative}, not found`);
      continue;
    }

    checked += 1;
    const prose = extractProse(source);

    for (const rule of RULES) {
      for (const { text, line } of prose) {
        // Reset between lines because the patterns are global.
        rule.pattern.lastIndex = 0;
        const matches = text.match(rule.pattern);
        if (!matches) continue;

        for (const match of new Set(matches)) {
          problems += 1;
          console.error(
            `\n  ${relative}:${line}\n    ${rule.name}: ${JSON.stringify(match)}\n    ${rule.hint}\n    ${text.trim().slice(0, 120)}`,
          );
        }
      }
    }
  }

  if (problems === 0) {
    console.log(`\n  Copy check passed across ${checked} files.\n`);
    return;
  }

  console.error(`\n  ${problems} problem(s) found across ${checked} files.\n`);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
