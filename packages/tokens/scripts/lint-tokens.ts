/**
 * lint-tokens: refuses literal design values in component CSS.
 *
 * The token pipeline is only worth anything if components cannot bypass it. This lint
 * reads every stylesheet in packages/ui and fails on hard-coded colour, radius, spacing,
 * duration, shadow, and font-size values, plus any component reaching into a tier 1
 * primitive it is not allowed to touch.
 *
 * Run: bun packages/tokens/scripts/lint-tokens.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../../../", import.meta.url).pathname;
const TARGETS = ["packages/ui/src", "packages/web/src/web"];

/** Properties where a literal is a design decision escaping the token layer. */
const GUARDED = [
  "color",
  "background",
  "background-color",
  "border",
  "border-color",
  "border-width",
  "border-radius",
  "box-shadow",
  "font-family",
  "font-size",
  "font-weight",
  "letter-spacing",
  "line-height",
  "gap",
  "padding",
  "padding-inline",
  "padding-block",
  "margin",
  "transition",
  "transition-duration",
  "animation-duration",
  "width",
  "height",
  "outline",
  "outline-offset",
];

const LITERAL_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "hex colour", re: /#[0-9a-fA-F]{3,8}\b/ },
  { name: "rgb/hsl/oklch colour", re: /\b(rgb|rgba|hsl|hsla|oklch|lab|color-mix)\(/ },
  { name: "named colour", re: /\b(red|blue|green|black|white|gray|grey|orange|purple|yellow)\b/ },
  { name: "time literal", re: /\b\d+(\.\d+)?m?s\b/ },
  { name: "rem/px length", re: /\b\d+(\.\d+)?(rem|px|em)\b/ },
];

/** Literals that are structural, not design decisions, and are allowed. */
// 1px and -1px are the visually-hidden clip idiom, not a design decision.
const ALLOWED_LITERAL =
  /^(0|0px|none|auto|inherit|initial|unset|transparent|currentColor|1px|-1px|100%|50%|max-content|min-content|fit-content)$/;

interface Violation {
  file: string;
  line: number;
  rule: string;
  text: string;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".css")) out.push(full);
  }
  return out;
}

function lintFile(file: string): Violation[] {
  const violations: Violation[] = [];
  const lines = readFileSync(file, "utf8").split("\n");
  const rel = relative(ROOT, file);
  const isComponentSheet = rel.startsWith("packages/ui");

  lines.forEach((raw, index) => {
    const line = raw.split("/*")[0] ?? "";
    const match = /^\s*([a-z-]+)\s*:\s*([^;]+);?\s*$/.exec(line);
    if (!match) return;
    const [, property, rawValue] = match;
    if (!property || !rawValue) return;
    if (property.startsWith("--")) return;
    if (!GUARDED.includes(property)) return;

    // Strip every var() reference: what is left is what the author wrote by hand.
    const bare = rawValue.replace(/var\([^)]*\)/g, " ").trim();
    if (bare === "" || ALLOWED_LITERAL.test(bare)) return;

    for (const pattern of LITERAL_PATTERNS) {
      if (pattern.re.test(bare)) {
        violations.push({ file: rel, line: index + 1, rule: `literal-${pattern.name.split(" ")[0]}`, text: line.trim() });
        return;
      }
    }
  });

  if (isComponentSheet) {
    // Tier discipline: components read tier 2 and tier 3. A handful of tier 1 primitives
    // are shared plumbing (space, radius scale, z-index, elevation, easing, duration, font)
    // and are allowed by name; anything else in tier 1 is a layering violation.
    const allowedPrimitivePrefixes = [
      "--fds-space-",
      "--fds-radius-",
      "--fds-z-index-",
      "--fds-elevation-",
      "--fds-easing-",
      "--fds-duration-",
      "--fds-font-",
      "--fds-border-width-",
    ];
    lines.forEach((raw, index) => {
      for (const ref of raw.matchAll(/var\((--fds-[a-z0-9-]+)/g)) {
        const name = ref[1]!;
        if (name.startsWith("--fds-color-") || name.startsWith("--fds-focus-")) return;
        if (allowedPrimitivePrefixes.some((prefix) => name.startsWith(prefix))) return;
        // Component tier tokens are everything else, e.g. --fds-control-height-md.
        if (/^--fds-(control|button|badge|input|checkbox|switch|card|tab|modal|tooltip|toast|field|select|spinner|focus)/.test(name)) return;
        violations.push({ file: rel, line: index + 1, rule: "unknown-token-reference", text: name });
      }
    });
  }

  return violations;
}

const files = TARGETS.flatMap((target) => {
  try {
    return walk(join(ROOT, target));
  } catch {
    return [];
  }
});

const violations = files.flatMap(lintFile);

if (violations.length > 0) {
  console.error(`lint-tokens: ${violations.length} violation(s)\n`);
  for (const violation of violations) {
    console.error(`  ${violation.file}:${violation.line}  [${violation.rule}]  ${violation.text}`);
  }
  console.error("\nEvery design value in a component stylesheet must read a token.");
  process.exit(1);
}

console.log(`lint-tokens: ${files.length} stylesheet(s) clean, no literal design values`);
