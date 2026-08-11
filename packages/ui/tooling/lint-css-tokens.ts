/**
 * Enforces the token contract in component CSS.
 *
 * A three-tier token architecture is a convention until something checks it. The
 * failure mode is never a designer rejecting the system: it is one #5793CA
 * landing in a hover state during a deadline, surviving review because the diff
 * was 40 lines of layout, and then not changing when the theme does. Two years
 * later nobody can say which colours are themeable.
 *
 * Three rules, all failures:
 *
 * 1. No colour literals. Hex, rgb(), hsl(), or a named CSS colour in a colour
 *    property. Tier 1 is the only place literals are allowed to exist.
 * 2. No tier 1 colour references. A component reading --fds-color-blue-500
 *    directly is invisible to theming: the Signal themes have no blue at all.
 * 3. Every custom property a component reads must exist in the generated
 *    stylesheet. This catches typos, which otherwise fail silently as an
 *    unstyled property with no console warning anywhere.
 */

import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const uiRoot = resolve(import.meta.dir, "..");
const repoRoot = resolve(uiRoot, "../..");
const tokensCssPath = resolve(repoRoot, "packages/tokens/build/tokens.css");

/** Tier 1 colour ramps. Referencing these from a component defeats theming. */
const TIER1_COLOR_PREFIXES = [
	"--fds-color-ink-",
	"--fds-color-slate-",
	"--fds-color-sand-",
	"--fds-color-blue-",
	"--fds-color-amber-",
	"--fds-color-green-",
	"--fds-color-red-",
	"--fds-color-alpha-",
];

/**
 * Properties where a bare keyword means a colour. `transparent`, `currentColor`
 * and `inherit` are allowed: they are relationships, not values, and forbidding
 * them would force a token for "the colour of the thing above me".
 */
const COLOR_PROPERTIES =
	/^(color|background-color|border-color|border-.*-color|outline-color|fill|stroke|box-shadow|text-decoration-color|caret-color|-webkit-text-fill-color)$/;
const ALLOWED_COLOR_KEYWORDS = new Set(["transparent", "currentcolor", "inherit", "none", "unset", "initial"]);
const NAMED_COLORS =
	/\b(white|black|red|blue|green|yellow|orange|purple|pink|gray|grey|silver|maroon|navy|teal|olive|lime|aqua|fuchsia)\b/i;

interface Violation {
	file: string;
	line: number;
	rule: string;
	detail: string;
	text: string;
}

function knownCustomProperties(): Set<string> {
	const css = readFileSync(tokensCssPath, "utf8");
	const names = new Set<string>();
	for (const match of css.matchAll(/^\s*(--fds-[\w-]+):/gm)) names.add(match[1]!);
	return names;
}

function main() {
	const known = knownCustomProperties();
	if (known.size === 0) {
		throw new Error(
			"lint:tokens: no custom properties found in packages/tokens/build/tokens.css. Run the token build first.",
		);
	}

	const glob = new Bun.Glob("src/**/*.css");
	const files = [...glob.scanSync({ cwd: uiRoot, absolute: true })].sort();
	const violations: Violation[] = [];

	for (const file of files) {
		const lines = readFileSync(file, "utf8").split("\n");
		let inComment = false;

		lines.forEach((raw, index) => {
			// Comments carry explanations that legitimately mention hex values and
			// tier 1 names, so they are stripped before the rules run.
			let line = raw;
			if (inComment) {
				const end = line.indexOf("*/");
				if (end === -1) return;
				line = line.slice(end + 2);
				inComment = false;
			}
			const start = line.indexOf("/*");
			if (start !== -1) {
				const end = line.indexOf("*/", start);
				if (end === -1) {
					inComment = true;
					line = line.slice(0, start);
				} else {
					line = line.slice(0, start) + line.slice(end + 2);
				}
			}
			if (!line.trim()) return;

			const record = (rule: string, detail: string) =>
				violations.push({
					file: relative(repoRoot, file),
					line: index + 1,
					rule,
					detail,
					text: raw.trim(),
				});

			// Rule 1: colour literals.
			if (/#[0-9a-f]{3,8}\b/i.test(line)) record("no-color-literal", "hex literal");
			if (/\b(rgb|rgba|hsl|hsla|oklch|lab)\(/i.test(line)) record("no-color-literal", "colour function");

			const declaration = line.match(/^\s*(--)?([\w-]+)\s*:\s*(.+?);?\s*$/);
			if (declaration && !declaration[1]) {
				const property = declaration[2]!.toLowerCase();
				const value = declaration[3]!;
				if (
					COLOR_PROPERTIES.test(property) &&
					!value.includes("var(") &&
					!ALLOWED_COLOR_KEYWORDS.has(value.toLowerCase().replace(/;$/, "")) &&
					NAMED_COLORS.test(value)
				) {
					record("no-color-literal", `named colour in ${property}`);
				}
			}

			// Rules 2 and 3: every referenced custom property.
			for (const match of line.matchAll(/var\(\s*(--fds-[\w-]+)/g)) {
				const name = match[1]!;
				if (TIER1_COLOR_PREFIXES.some((prefix) => name.startsWith(prefix))) {
					record("no-tier-1-color", name);
				}
				if (!known.has(name)) record("unknown-token", name);
			}
		});
	}

	if (violations.length === 0) {
		console.log(`css tokens: ok  ${files.length} stylesheets, ${known.size} known custom properties`);
		return;
	}

	console.error(`css tokens: ${violations.length} violation(s)\n`);
	for (const violation of violations) {
		console.error(`  ${violation.file}:${violation.line}  [${violation.rule}] ${violation.detail}`);
		console.error(`    ${violation.text}`);
	}
	console.error(
		"\nComponent CSS may only reference tier 2 (semantic) and tier 3 (component) tokens.\nIf a value you need does not exist, add it to the token source. That is the point.",
	);
	process.exit(1);
}

main();
