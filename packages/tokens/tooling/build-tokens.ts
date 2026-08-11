/**
 * Token build pipeline.
 *
 * Reads the DTCG-shaped JSON in src/ and emits every downstream artifact into build/.
 * Run with `bun run tokens:build` from the repo root.
 *
 * The important part of this script is not the emitting, it is the validating. A design
 * system fails in practice when a semantic token exists in one theme and not another, so
 * the build treats that as a hard error rather than a lint warning. See validate() below.
 *
 * Deliberate choice: no timestamp is written into any generated file. Generated artifacts
 * are committed so reviewers can read them on GitHub and so a fresh clone runs without a
 * build step, and a timestamp would produce a diff on every run for no information gain.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const PREFIX = "fds";
const SRC = join(import.meta.dirname, "..", "src");
const OUT = join(import.meta.dirname, "..", "build");

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

export type TokenType =
	| "color"
	| "dimension"
	| "fontFamily"
	| "fontWeight"
	| "number"
	| "shadow"
	| "duration"
	| "cubicBezier";

interface FlatToken {
	/** Dot path, e.g. "color.surface.canvas" */
	path: string;
	/** CSS custom property name, e.g. "--fds-color-surface-canvas" */
	cssVar: string;
	type: TokenType;
	/** Raw authored value: a literal, or an alias like "{color.ink.950}" */
	value: string;
	/** Alias target path when the value is an alias, otherwise null */
	alias: string | null;
	description: string | null;
}

interface ThemeMeta {
	name: string;
	label: string;
	appearance: "light" | "dark";
	description: string;
	isDefault: boolean;
}

interface ValidationIssue {
	level: "error" | "warning";
	scope: string;
	message: string;
}

/** One declared pair from contrast.json that carries a threshold. */
interface ContrastRequirement {
	foreground: string;
	background: string;
	min: number;
	usage: string;
	rule: string;
}

/** A pair that is deliberately unthresholded, named so it is auditable rather than absent. */
interface ContrastExemption {
	foreground: string;
	background: string;
	usage: string;
	reason: string;
}

interface ContrastCheck extends ContrastRequirement {
	theme: string;
	foregroundValue: string;
	backgroundValue: string;
	ratio: number;
	passes: boolean;
}

/* ------------------------------------------------------------------ *
 * DTCG walking
 * ------------------------------------------------------------------ */

const isGroup = (v: unknown): v is Json =>
	typeof v === "object" && v !== null && !Array.isArray(v);

const childKeys = (node: Json) => Object.keys(node).filter((k) => !k.startsWith("$"));

/**
 * Flattens a DTCG tree into tokens. `$type` is inherited from the nearest
 * ancestor that declares it, which is what lets primitives.json declare
 * `"color": { "$type": "color", ... }` once instead of on every leaf.
 */
function flatten(node: Json, trail: string[] = [], inheritedType?: TokenType): FlatToken[] {
	const type = (node.$type as TokenType | undefined) ?? inheritedType;
	const out: FlatToken[] = [];

	if ("$value" in node) {
		const path = trail.join(".");
		if (!type) throw new Error(`Token "${path}" has no $type and no ancestor declares one.`);
		const raw = String(node.$value);
		const aliasMatch = /^\{([^}]+)\}$/.exec(raw.trim());
		out.push({
			path,
			cssVar: toCssVar(path),
			type,
			value: raw,
			alias: aliasMatch ? (aliasMatch[1] as string) : null,
			description: (node.$description as string | undefined) ?? null,
		});
		return out;
	}

	for (const key of childKeys(node)) {
		const child = node[key];
		if (isGroup(child)) out.push(...flatten(child, [...trail, key], type));
	}
	return out;
}

/**
 * Collects the semantic contract. Contract entries carry a `$description` but no
 * `$value`: the contract declares which tokens must exist, themes supply the values.
 */
function collectContract(node: Json, trail: string[] = [], inheritedType?: TokenType): FlatToken[] {
	const type = (node.$type as TokenType | undefined) ?? inheritedType;
	const keys = childKeys(node);

	if (keys.length === 0 && trail.length > 0) {
		const path = trail.join(".");
		if (!type) throw new Error(`Contract entry "${path}" has no $type and no ancestor declares one.`);
		return [
			{
				path,
				cssVar: toCssVar(path),
				type,
				value: "",
				alias: null,
				description: (node.$description as string | undefined) ?? null,
			},
		];
	}

	const out: FlatToken[] = [];
	for (const key of keys) {
		const child = node[key];
		if (isGroup(child)) out.push(...collectContract(child, [...trail, key], type));
	}
	return out;
}

const toCssVar = (path: string) => `--${PREFIX}-${path.split(".").join("-")}`;

/* ------------------------------------------------------------------ *
 * Load
 * ------------------------------------------------------------------ */

const readJson = (p: string): Json => JSON.parse(readFileSync(p, "utf8")) as Json;

const primitivesSrc = readJson(join(SRC, "primitives.json"));
const semanticSrc = readJson(join(SRC, "semantic.json"));
const componentSrc = readJson(join(SRC, "component.json"));
const contrastSrc = readJson(join(SRC, "contrast.json"));

const contrastRequirements = (contrastSrc.requirements ?? []) as ContrastRequirement[];
const contrastExemptions = (contrastSrc.exempt ?? []) as ContrastExemption[];

const primitives = flatten(primitivesSrc);
const contract = collectContract(semanticSrc);
const componentTokens = flatten(componentSrc);

const themeFiles = readdirSync(join(SRC, "themes"))
	.filter((f) => f.endsWith(".json"))
	.sort();

const themes = themeFiles.map((file) => {
	const src = readJson(join(SRC, "themes", file));
	const meta: ThemeMeta = {
		name: String(src.$name ?? file.replace(/\.json$/, "")),
		label: String(src.$label ?? src.$name ?? file),
		appearance: (src.$appearance as "light" | "dark") ?? "dark",
		description: String(src.$description ?? ""),
		isDefault: src.$default === true,
	};
	// Themes inherit $type from the contract, not from their own file, so a theme
	// author cannot accidentally re-type a token.
	return { meta, tokens: flattenThemeAgainstContract(src, contract), file };
});

/**
 * Flattens a theme file, taking each token's type from the contract rather than the
 * theme. Tokens the contract does not know about are still collected so validate()
 * can report them as extras.
 */
function flattenThemeAgainstContract(src: Json, contractTokens: FlatToken[]): FlatToken[] {
	const typeByPath = new Map(contractTokens.map((t) => [t.path, t.type]));
	const out: FlatToken[] = [];

	const walk = (node: Json, trail: string[]) => {
		if ("$value" in node) {
			const path = trail.join(".");
			const raw = String(node.$value);
			const aliasMatch = /^\{([^}]+)\}$/.exec(raw.trim());
			out.push({
				path,
				cssVar: toCssVar(path),
				type: typeByPath.get(path) ?? "color",
				value: raw,
				alias: aliasMatch ? (aliasMatch[1] as string) : null,
				description: (node.$description as string | undefined) ?? null,
			});
			return;
		}
		for (const key of childKeys(node)) {
			const child = node[key];
			if (isGroup(child)) walk(child, [...trail, key]);
		}
	};

	walk(src, []);
	return out;
}

const densityFiles = existsSync(join(SRC, "density"))
	? readdirSync(join(SRC, "density")).filter((f) => f.endsWith(".json")).sort()
	: [];

const densities = densityFiles.map((file) => {
	const src = readJson(join(SRC, "density", file));
	const typeByPath = new Map(componentTokens.map((t) => [t.path, t.type]));
	const out: FlatToken[] = [];
	const walk = (node: Json, trail: string[]) => {
		if ("$value" in node) {
			const path = trail.join(".");
			const raw = String(node.$value);
			const aliasMatch = /^\{([^}]+)\}$/.exec(raw.trim());
			out.push({
				path,
				cssVar: toCssVar(path),
				type: typeByPath.get(path) ?? "dimension",
				value: raw,
				alias: aliasMatch ? (aliasMatch[1] as string) : null,
				description: null,
			});
			return;
		}
		for (const key of childKeys(node)) {
			const child = node[key];
			if (isGroup(child)) walk(child, [...trail, key]);
		}
	};
	walk(src, []);
	return {
		name: String(src.$name ?? file.replace(/\.json$/, "")),
		label: String(src.$label ?? src.$name ?? file),
		description: String(src.$description ?? ""),
		tokens: out,
	};
});

/* ------------------------------------------------------------------ *
 * Resolution
 * ------------------------------------------------------------------ */

const primitiveByPath = new Map(primitives.map((t) => [t.path, t]));
const contractPaths = new Set(contract.map((t) => t.path));
const componentByPath = new Map(componentTokens.map((t) => [t.path, t]));

/**
 * Resolves an alias chain down to a literal value, within the context of one theme.
 * Depth-limited so a circular alias produces a readable error instead of a stack overflow.
 */
function resolveLiteral(
	path: string,
	themeTokens: Map<string, FlatToken>,
	seen: string[] = [],
): { value: string; chain: string[] } {
	if (seen.includes(path)) {
		throw new Error(`Circular token alias: ${[...seen, path].join(" -> ")}`);
	}
	if (seen.length > 8) {
		throw new Error(`Token alias chain deeper than 8 levels at "${path}". Flatten it.`);
	}

	const token = primitiveByPath.get(path) ?? themeTokens.get(path) ?? componentByPath.get(path);
	if (!token) throw new Error(`Unresolvable token reference "{${path}}".`);
	if (!token.alias) return { value: token.value, chain: [...seen, path] };
	return resolveLiteral(token.alias, themeTokens, [...seen, path]);
}

/* ------------------------------------------------------------------ *
 * Contrast
 *
 * The maths lives in the build, not only in the docs site, because a number
 * rendered in a browser informs whoever happens to look at the page, while a
 * number computed here can stop a merge. Same formulas, different authority.
 * ------------------------------------------------------------------ */

interface Rgb {
	r: number;
	g: number;
	b: number;
	a: number;
}

function parseColor(value: string): Rgb | null {
	const input = value.trim().toLowerCase();

	if (input.startsWith("#")) {
		const hex = input.slice(1);
		const pair = (i: number) => Number.parseInt(hex.slice(i, i + 2), 16);
		const single = (i: number) => Number.parseInt(hex[i]!.repeat(2), 16);
		if (hex.length === 3 || hex.length === 4) {
			return {
				r: single(0),
				g: single(1),
				b: single(2),
				a: hex.length === 4 ? single(3) / 255 : 1,
			};
		}
		if (hex.length === 6 || hex.length === 8) {
			return { r: pair(0), g: pair(2), b: pair(4), a: hex.length === 8 ? pair(6) / 255 : 1 };
		}
		return null;
	}

	const rgb = /^rgba?\(([^)]+)\)$/.exec(input);
	if (rgb) {
		const parts = rgb[1]!.split(/[,/\s]+/).filter(Boolean).map(Number);
		if (parts.length < 3 || parts.some(Number.isNaN)) return null;
		return { r: parts[0]!, g: parts[1]!, b: parts[2]!, a: parts[3] ?? 1 };
	}

	return null;
}

/**
 * Flattens a translucent colour over its backdrop before measuring.
 *
 * Several border tokens are alpha values. Measuring one as if it were opaque
 * reports a ratio nobody ever sees on screen, which is the most common way an
 * automated contrast report ends up being confidently wrong.
 */
function composite(front: Rgb, backdrop: Rgb): Rgb {
	if (front.a >= 1) return front;
	return {
		r: front.r * front.a + backdrop.r * (1 - front.a),
		g: front.g * front.a + backdrop.g * (1 - front.a),
		b: front.b * front.a + backdrop.b * (1 - front.a),
		a: 1,
	};
}

function luminance({ r, g, b }: Rgb): number {
	const channel = (value: number) => {
		const srgb = value / 255;
		return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratioOf(foreground: string, background: string): number | null {
	const fg = parseColor(foreground);
	const bg = parseColor(background);
	if (!fg || !bg) return null;
	const backdrop = composite(bg, { r: 255, g: 255, b: 255, a: 1 });
	const front = composite(fg, backdrop);
	const l1 = luminance(front);
	const l2 = luminance(backdrop);
	const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
	return Math.round(ratio * 100) / 100;
}

/**
 * Runs the whole contrast contract against every theme.
 *
 * Returns the checks so they can be written into the manifest as well: the docs
 * site shows the same rows, and a pair cannot appear in one and not the other.
 */
function runContrastContract(): { checks: ContrastCheck[]; issues: ValidationIssue[] } {
	const checks: ContrastCheck[] = [];
	const issues: ValidationIssue[] = [];

	for (const requirement of [...contrastRequirements]) {
		for (const side of ["foreground", "background"] as const) {
			const path = requirement[side];
			if (!contractPaths.has(path)) {
				issues.push({
					level: "error",
					scope: "contrast",
					message: `requirement "${requirement.foreground} on ${requirement.background}" references "${path}", which is not a semantic contract token. The contrast contract may only pair tier 2 tokens, because tier 1 does not change per theme and tier 3 is geometry.`,
				});
			}
		}
	}

	for (const theme of themes) {
		const themeMap = new Map(theme.tokens.map((t) => [t.path, t]));
		const values = new Map<string, string>();
		for (const token of theme.tokens) {
			try {
				values.set(token.path, resolveLiteral(token.path, themeMap).value);
			} catch {
				// Rule 2 already reports unresolvable aliases; skip rather than double-report.
			}
		}

		for (const requirement of contrastRequirements) {
			const fg = values.get(requirement.foreground);
			const bg = values.get(requirement.background);
			if (!fg || !bg) continue;

			const ratio = ratioOf(fg, bg);
			if (ratio === null) {
				issues.push({
					level: "error",
					scope: "contrast",
					message: `${theme.meta.name}: could not parse "${fg}" or "${bg}" while checking ${requirement.foreground} on ${requirement.background}. Every colour in a measured pair must be a hex or rgb() value.`,
				});
				continue;
			}

			const passes = ratio >= requirement.min;
			checks.push({
				...requirement,
				theme: theme.meta.name,
				foregroundValue: fg,
				backgroundValue: bg,
				ratio,
				passes,
			});

			if (!passes) {
				issues.push({
					level: "error",
					scope: `contrast:${theme.meta.name}`,
					message: `${requirement.foreground} on ${requirement.background} is ${ratio.toFixed(2)}:1, below the required ${requirement.min}:1 (${requirement.usage}). ${requirement.rule}`,
				});
			}
		}
	}

	return { checks, issues };
}

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

const { checks: contrastChecks, issues: contrastIssues } = runContrastContract();

function validate(): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	// 1. Contract completeness, in both directions, for every theme.
	for (const theme of themes) {
		const provided = new Set(theme.tokens.map((t) => t.path));

		for (const entry of contract) {
			if (!provided.has(entry.path)) {
				issues.push({
					level: "error",
					scope: theme.meta.name,
					message: `missing semantic token "${entry.path}" required by the contract`,
				});
			}
		}
		for (const token of theme.tokens) {
			if (!contractPaths.has(token.path)) {
				issues.push({
					level: "error",
					scope: theme.meta.name,
					message: `declares "${token.path}", which is not in the semantic contract. Add it to semantic.json first so every theme is required to define it.`,
				});
			}
		}
	}

	// 2. Every alias resolves, in every theme, with no cycles.
	for (const theme of themes) {
		const themeMap = new Map(theme.tokens.map((t) => [t.path, t]));
		for (const token of [...theme.tokens, ...componentTokens]) {
			if (!token.alias) continue;
			try {
				resolveLiteral(token.path, themeMap);
			} catch (error) {
				issues.push({
					level: "error",
					scope: theme.meta.name,
					message: `${token.path}: ${(error as Error).message}`,
				});
			}
		}
	}

	// 3. Density overrides may only override tokens that exist in tier 3.
	for (const density of densities) {
		for (const token of density.tokens) {
			if (!componentByPath.has(token.path)) {
				issues.push({
					level: "error",
					scope: `density:${density.name}`,
					message: `overrides "${token.path}", which is not a component token. Density can only restate tier 3.`,
				});
			}
		}
	}

	// 4. Exactly one default theme.
	const defaults = themes.filter((t) => t.meta.isDefault);
	if (defaults.length !== 1) {
		issues.push({
			level: "error",
			scope: "themes",
			message: `expected exactly one theme with "$default": true, found ${defaults.length}`,
		});
	}

	// 5. Warn on unreferenced COLOR primitives only.
	//
	//    The architectural rule this enforces: color must always pass through tier 2,
	//    because color is the axis that changes per theme. A color primitive nothing
	//    aliases is either dead weight or, worse, a value a component is reaching for
	//    directly and breaking theming with.
	//
	//    Geometry and motion primitives (space, duration, easing, z-index, line-height,
	//    tracking) are intentionally exempt: components consume those straight from
	//    tier 1 because they do not vary by theme. Flagging them would train everyone
	//    to ignore this warning, which is worse than not having it.
	const referenced = new Set<string>();
	for (const token of [...themes.flatMap((t) => t.tokens), ...componentTokens, ...densities.flatMap((d) => d.tokens)]) {
		if (token.alias) referenced.add(token.alias);
	}
	for (const p of primitives) {
		if (p.type !== "color") continue;
		if (!referenced.has(p.path)) {
			issues.push({
				level: "warning",
				scope: "primitives",
				message: `color primitive "${p.path}" is unreferenced. Color must reach components through tier 2, so an unaliased color ramp step is either dead or being reached for directly.`,
			});
		}
	}

	// 6. Semantic tokens must alias a primitive, never hardcode a literal. This is the
	//    rule that keeps tier 1 the single source of raw values.
	for (const theme of themes) {
		for (const token of theme.tokens) {
			if (!token.alias) {
				issues.push({
					level: "error",
					scope: theme.meta.name,
					message: `"${token.path}" hardcodes the literal "${token.value}". Semantic tokens must alias a primitive.`,
				});
			}
		}
	}

	// 7. Every foreground token has to be accounted for in the contrast contract, as
	//    either a measured requirement or a named exemption.
	//
	//    Without this rule the contract decays quietly: someone adds a text tone or a
	//    border colour, never adds it to contrast.json, and the audit keeps passing
	//    while covering less of the system than it did last month. An untested token is
	//    not the same as a token that passes, so the build refuses to guess which one
	//    it is looking at.
	const audited = new Set<string>();
	for (const r of contrastRequirements) audited.add(r.foreground);
	for (const e of contrastExemptions) audited.add(e.foreground);

	for (const entry of contract) {
		const isForeground =
			entry.path.startsWith("color.text.") ||
			entry.path.startsWith("color.border.") ||
			entry.path.startsWith("color.icon.");
		if (!isForeground || audited.has(entry.path)) continue;
		issues.push({
			level: "error",
			scope: "contrast",
			message: `"${entry.path}" is a foreground token that the contrast contract never measures. Add it to requirements in contrast.json with the surface it is drawn on, or add it to exempt with the reason it carries no threshold.`,
		});
	}

	// 8. The contrast contract itself, measured against every theme.
	issues.push(...contrastIssues);

	return issues;
}

/* ------------------------------------------------------------------ *
 * Emit: CSS
 * ------------------------------------------------------------------ */

const banner = (what: string) => `/**
 * ${what}
 *
 * GENERATED FILE. Do not edit by hand.
 * Source: packages/tokens/src/**. Regenerate with \`bun run tokens:build\`.
 */`;

function aliasToCss(token: FlatToken): string {
	// Semantic and component tokens emit var() references rather than resolved
	// literals. That is what makes theme switching a single attribute change at
	// runtime instead of a stylesheet swap.
	return token.alias ? `var(${toCssVar(token.alias)})` : token.value;
}

function emitCss(): string {
	const lines: string[] = [banner("Design token custom properties"), ""];

	lines.push(
		"/* Layer order is declared once, here, so consumers can reason about override",
		"   precedence without reading every stylesheet. Component styles live in",
		"   `fds.components`, which always wins over token layers but always loses to",
		"   `fds.overrides`, the layer an application owns. */",
		"@layer fds.reset, fds.primitives, fds.semantic, fds.component, fds.components, fds.overrides;",
		"",
	);

	// Tier 1
	lines.push("@layer fds.primitives {", "\t:root {");
	let group = "";
	for (const token of primitives) {
		const top = token.path.split(".").slice(0, 2).join(".");
		if (top !== group) {
			group = top;
			lines.push(`\t\t/* ${group} */`);
		}
		lines.push(`\t\t${token.cssVar}: ${token.value};`);
	}
	lines.push("\t}", "}", "");

	// Tier 2, one block per theme
	lines.push("@layer fds.semantic {");
	for (const theme of themes) {
		const selector = theme.meta.isDefault
			? `:root,\n\t[data-${PREFIX}-theme="${theme.meta.name}"]`
			: `[data-${PREFIX}-theme="${theme.meta.name}"]`;
		lines.push(`\t/* ${theme.meta.label} */`);
		lines.push(`\t${selector} {`);
		lines.push(`\t\tcolor-scheme: ${theme.meta.appearance};`);
		for (const token of theme.tokens) {
			lines.push(`\t\t${token.cssVar}: ${aliasToCss(token)};`);
		}
		lines.push("\t}", "");
	}
	lines.push("}", "");

	// Tier 3 + density
	lines.push("@layer fds.component {", "\t:root {");
	for (const token of componentTokens) {
		lines.push(`\t\t${token.cssVar}: ${aliasToCss(token)};`);
	}
	lines.push("\t}", "");
	for (const density of densities) {
		lines.push(`\t/* ${density.label} density */`);
		lines.push(`\t[data-${PREFIX}-density="${density.name}"] {`);
		for (const token of density.tokens) {
			lines.push(`\t\t${token.cssVar}: ${aliasToCss(token)};`);
		}
		lines.push("\t}", "");
	}

	// Reduced motion is enforced at the token layer, not per component. Every
	// transition in the library reads a duration token, so zeroing them here
	// removes motion system-wide without touching a single component stylesheet.
	lines.push(
		"\t/* Reduced motion is handled at the token layer. Because every animated",
		"\t   property in the library reads a duration token, collapsing the ramp here",
		"\t   disables motion system-wide and no component can opt back in. End states",
		"\t   are preserved, so nothing becomes invisible or unusable. */",
		"\t@media (prefers-reduced-motion: reduce) {",
		"\t\t:root {",
	);
	for (const token of primitives.filter((t) => t.type === "duration")) {
		lines.push(`\t\t\t${token.cssVar}: 0ms;`);
	}
	lines.push("\t\t}", "\t}", "}", "");

	return lines.join("\n");
}

/* ------------------------------------------------------------------ *
 * Emit: TypeScript
 * ------------------------------------------------------------------ */

function emitTs(): string {
	const themePayload = themes.map((theme) => {
		const themeMap = new Map(theme.tokens.map((t) => [t.path, t]));
		const tokens = theme.tokens.map((token) => {
			const { value, chain } = resolveLiteral(token.path, themeMap);
			return {
				path: token.path,
				cssVar: token.cssVar,
				type: token.type,
				alias: token.alias,
				/** Fully resolved literal. Used by the docs contrast checker. */
				resolved: value,
				chain,
				description: contract.find((c) => c.path === token.path)?.description ?? null,
			};
		});
		return { ...theme.meta, tokens };
	});

	const defaultTheme = themes.find((t) => t.meta.isDefault)!.meta.name;
	const defaultThemeMap = new Map(
		themes.find((t) => t.meta.isDefault)!.tokens.map((t) => [t.path, t]),
	);

	const componentPayload = componentTokens.map((token) => ({
		path: token.path,
		cssVar: token.cssVar,
		type: token.type,
		alias: token.alias,
		resolved: resolveLiteral(token.path, defaultThemeMap).value,
		themeDependent: dependsOnSemantic(token, defaultThemeMap),
		description: token.description,
	}));

	const json = (v: unknown) => JSON.stringify(v, null, 2);

	return `${banner("Typed design token model")}

export type TokenType =
${(["color", "dimension", "fontFamily", "fontWeight", "number", "shadow", "duration", "cubicBezier"] as const).map((t) => `\t| "${t}"`).join("\n")};

export interface TokenRecord {
	path: string;
	cssVar: string;
	type: TokenType;
	/** Authored value: a literal at tier 1, an alias at tiers 2 and 3. */
	value: string;
	description: string | null;
}

export interface ResolvedToken {
	path: string;
	cssVar: string;
	type: TokenType;
	alias: string | null;
	/** Alias chain resolved to a literal. Safe to feed to a contrast calculator. */
	resolved: string;
	chain: string[];
	description: string | null;
}

export interface ThemeRecord {
	name: string;
	label: string;
	appearance: "light" | "dark";
	description: string;
	isDefault: boolean;
	tokens: ResolvedToken[];
}

/** Tier 1. Raw values. Never reference these from a component. */
export const primitives = ${json(
		primitives.map((t) => ({
			path: t.path,
			cssVar: t.cssVar,
			type: t.type,
			value: t.value,
			description: t.description,
		})),
	)} as const satisfies readonly TokenRecord[];

/** Tier 2 contract plus each theme's resolved values. */
export const themes = ${json(themePayload)} as unknown as ThemeRecord[];

/** Tier 3. Component geometry. */
export const componentTokens = ${json(componentPayload)};

export interface ContrastRequirement {
	foreground: string;
	background: string;
	/** Minimum ratio this pair has to clear in every theme for the build to pass. */
	min: number;
	usage: string;
	rule: string;
}

export interface ContrastExemption {
	foreground: string;
	background: string;
	usage: string;
	/** Why this pair deliberately carries no threshold. */
	reason: string;
}

/**
 * The contrast contract, from src/contrast.json.
 *
 * The build measures every requirement against every theme and exits non-zero on a
 * violation, which is why the accessibility page can render these rows as verified
 * rather than as a claim. Reading the same source in both places is deliberate: a
 * docs table with its own copy of the pair list is a table that drifts.
 */
export const contrastRequirements = ${json(contrastRequirements)} as unknown as ContrastRequirement[];

/** Pairs with no threshold, named so an absent pair is never mistaken for an untested one. */
export const contrastExemptions = ${json(contrastExemptions)} as unknown as ContrastExemption[];

/** Density modes. Each restates a subset of tier 3. */
export const densities = ${json(
		densities.map((d) => ({
			name: d.name,
			label: d.label,
			description: d.description,
			tokens: d.tokens.map((t) => ({
				path: t.path,
				cssVar: t.cssVar,
				alias: t.alias,
				value: t.value,
			})),
		})),
	)};

export type ThemeName = ${themes.map((t) => `"${t.meta.name}"`).join(" | ")};
export type DensityName = ${["comfortable", ...densities.map((d) => d.name)].map((d) => `"${d}"`).join(" | ")};

/**
 * Union of every semantic token path. Generated, so a typo in consumer code is a
 * compile error rather than a silently missing custom property at runtime.
 */
export type SemanticTokenPath =
${contract.map((c) => `\t| "${c.path}"`).join("\n")};

export type PrimitiveTokenPath =
${primitives.map((p) => `\t| "${p.path}"`).join("\n")};

export const themeNames = ${json(themes.map((t) => t.meta.name))} as ThemeName[];
export const densityNames = ${json(["comfortable", ...densities.map((d) => d.name)])} as DensityName[];
export const defaultTheme: ThemeName = "${defaultTheme}";

/** \`cssVar("color.surface.canvas")\` -> \`"var(--${PREFIX}-color-surface-canvas)"\` */
export function cssVar(path: SemanticTokenPath | PrimitiveTokenPath | string): string {
	return \`var(--${PREFIX}-\${path.split(".").join("-")})\`;
}

/** The DOM attributes that drive theming. Exported so consumers never hardcode them. */
export const THEME_ATTRIBUTE = "data-${PREFIX}-theme";
export const DENSITY_ATTRIBUTE = "data-${PREFIX}-density";
`;
}

function dependsOnSemantic(token: FlatToken, themeMap: Map<string, FlatToken>): boolean {
	let current: FlatToken | undefined = token;
	const guard = new Set<string>();
	while (current?.alias) {
		if (guard.has(current.path)) return false;
		guard.add(current.path);
		if (contractPaths.has(current.alias)) return true;
		const next: FlatToken | undefined =
			primitiveByPath.get(current.alias) ?? themeMap.get(current.alias) ?? componentByPath.get(current.alias);
		current = next;
	}
	return false;
}

/* ------------------------------------------------------------------ *
 * Emit: Figma variables
 * ------------------------------------------------------------------ */

const FIGMA_TYPE: Record<TokenType, string> = {
	color: "COLOR",
	dimension: "FLOAT",
	number: "FLOAT",
	fontFamily: "STRING",
	fontWeight: "FLOAT",
	shadow: "STRING",
	duration: "FLOAT",
	cubicBezier: "STRING",
};

/** Figma variables are unitless numbers, so rem and px collapse to a px float. */
function toFigmaValue(type: TokenType, value: string): string | number {
	if (type === "dimension") {
		const rem = /^(-?[\d.]+)rem$/.exec(value.trim());
		if (rem) return Number.parseFloat(rem[1] as string) * 16;
		const px = /^(-?[\d.]+)px$/.exec(value.trim());
		if (px) return Number.parseFloat(px[1] as string);
		return value;
	}
	if (type === "duration") {
		const ms = /^(-?[\d.]+)ms$/.exec(value.trim());
		if (ms) return Number.parseFloat(ms[1] as string);
		return value;
	}
	if (type === "number" || type === "fontWeight") {
		const n = Number.parseFloat(value);
		return Number.isNaN(n) ? value : n;
	}
	return value;
}

const figmaName = (path: string) => path.split(".").join("/");

function emitFigma(): string {
	const primitiveCollection = {
		name: "Primitives",
		description:
			"Tier 1. Read-only in Figma: these are generated from code and overwritten on every sync, so edits here are lost. File a token change as a PR against packages/tokens/src/primitives.json.",
		modes: ["Value"],
		variables: primitives.map((t) => ({
			name: figmaName(t.path),
			type: FIGMA_TYPE[t.type],
			scopes: t.type === "color" ? ["ALL_SCOPES"] : ["ALL_SCOPES"],
			description: t.description ?? "",
			valuesByMode: { Value: toFigmaValue(t.type, t.value) },
		})),
	};

	// One Figma mode per theme. Semantic variables alias primitives, which is exactly
	// how Figma models this, so a designer switching mode on a frame sees the same
	// result a developer gets from flipping data-fds-theme.
	const semanticCollection = {
		name: "Semantic",
		description:
			"Tier 2. One mode per theme. Every variable aliases a Primitives variable, matching the code contract in packages/tokens/src/semantic.json.",
		modes: themes.map((t) => t.meta.label),
		variables: contract.map((entry) => {
			const valuesByMode: Record<string, unknown> = {};
			for (const theme of themes) {
				const token = theme.tokens.find((t) => t.path === entry.path);
				if (!token) continue;
				valuesByMode[theme.meta.label] = token.alias
					? { type: "VARIABLE_ALIAS", collection: "Primitives", name: figmaName(token.alias) }
					: toFigmaValue(entry.type, token.value);
			}
			return {
				name: figmaName(entry.path),
				type: FIGMA_TYPE[entry.type],
				scopes: ["ALL_SCOPES"],
				description: entry.description ?? "",
				valuesByMode,
			};
		}),
	};

	const componentCollection = {
		name: "Component",
		description:
			"Tier 3. One mode per density. Aliases Semantic or Primitives. Component variables exist so a designer resizing a control changes one variable instead of every instance.",
		modes: ["Comfortable", ...densities.map((d) => d.label)],
		variables: componentTokens.map((t) => {
			const valuesByMode: Record<string, unknown> = {
				Comfortable: t.alias
					? {
							type: "VARIABLE_ALIAS",
							collection: contractPaths.has(t.alias) ? "Semantic" : "Primitives",
							name: figmaName(t.alias),
						}
					: toFigmaValue(t.type, t.value),
			};
			for (const density of densities) {
				const override = density.tokens.find((o) => o.path === t.path);
				const source = override ?? t;
				valuesByMode[density.label] = source.alias
					? {
							type: "VARIABLE_ALIAS",
							collection: contractPaths.has(source.alias) ? "Semantic" : "Primitives",
							name: figmaName(source.alias),
						}
					: toFigmaValue(t.type, source.value);
			}
			return {
				name: figmaName(t.path),
				type: FIGMA_TYPE[t.type],
				scopes: ["ALL_SCOPES"],
				description: t.description ?? "",
				valuesByMode,
			};
		}),
	};

	return JSON.stringify(
		{
			$schema: "https://forefrontindustries.io/schemas/figma-variables-1.json",
			$comment:
				"GENERATED FILE. Import target for the Figma Variables sync plugin. Code is the source of truth: this file is written by `bun run tokens:build` and is overwritten on every run.",
			version: "1.0.0",
			collections: [primitiveCollection, semanticCollection, componentCollection],
		},
		null,
		2,
	);
}

/* ------------------------------------------------------------------ *
 * Emit: manifest
 * ------------------------------------------------------------------ */

function emitManifest(issues: ValidationIssue[]): string {
	const byType: Record<string, number> = {};
	for (const t of primitives) byType[t.type] = (byType[t.type] ?? 0) + 1;

	const unused = issues.filter((i) => i.scope === "primitives" && i.level === "warning").map((i) => i.message);

	return JSON.stringify(
		{
			$comment:
				"GENERATED FILE. The docs site reads this so foundation pages cannot go stale relative to the token source. No timestamp is recorded, deliberately: generated artifacts are committed and a timestamp would create a diff on every build.",
			counts: {
				primitives: primitives.length,
				semanticContract: contract.length,
				componentTokens: componentTokens.length,
				themes: themes.length,
				densities: densities.length + 1,
				totalCustomProperties:
					primitives.length + contract.length * themes.length + componentTokens.length,
			},
			primitivesByType: byType,
			themes: themes.map((t) => ({
				name: t.meta.name,
				label: t.meta.label,
				appearance: t.meta.appearance,
				isDefault: t.meta.isDefault,
				coverage: `${t.tokens.filter((tok) => contractPaths.has(tok.path)).length}/${contract.length}`,
			})),
			contractGroups: [...new Set(contract.map((c) => c.path.split(".").slice(0, 2).join(".")))],
			contrast: {
				$comment:
					"Computed by the build, not by the page that displays it. A failure here exits non-zero, so these rows are the reason the build passed rather than a report about it.",
				requirements: contrastRequirements.length,
				exemptions: contrastExemptions.length,
				checksRun: contrastChecks.length,
				failures: contrastChecks.filter((c) => !c.passes).length,
				worstByTheme: themes.map((theme) => {
					const forTheme = contrastChecks.filter((c) => c.theme === theme.meta.name);
					const worst = forTheme.reduce<ContrastCheck | null>(
						(low, c) => (low === null || c.ratio - c.min < low.ratio - low.min ? c : low),
						null,
					);
					return {
						theme: theme.meta.name,
						checks: forTheme.length,
						failures: forTheme.filter((c) => !c.passes).length,
						tightestPair: worst ? `${worst.foreground} on ${worst.background}` : null,
						tightestRatio: worst ? worst.ratio : null,
						tightestRequirement: worst ? worst.min : null,
						headroom: worst ? Math.round((worst.ratio - worst.min) * 100) / 100 : null,
					};
				}),
			},
			unreferencedPrimitives: unused.length,
			unreferencedPrimitiveDetail: unused,
			attributes: { theme: `data-${PREFIX}-theme`, density: `data-${PREFIX}-density` },
		},
		null,
		2,
	);
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

function write(file: string, contents: string) {
	const target = join(OUT, file);
	mkdirSync(dirname(target), { recursive: true });
	writeFileSync(target, contents);
	return target;
}

const issues = validate();
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

for (const w of warnings) console.warn(`  warn  [${w.scope}] ${w.message}`);

if (errors.length > 0) {
	console.error(`\ntokens: build failed with ${errors.length} error(s)\n`);
	for (const e of errors) console.error(`  error [${e.scope}] ${e.message}`);
	console.error(
		"\nThe semantic contract in src/semantic.json is enforced, not advisory. Every theme must define every contract token.\n",
	);
	process.exit(1);
}

write("tokens.css", emitCss());
write("tokens.ts", emitTs());
write("tokens.figma.json", emitFigma());
write("manifest.json", emitManifest(issues));
write(
	"index.ts",
	`${banner("Package entry point")}\n\nexport * from "./tokens";\nexport { default as manifest } from "./manifest.json";\n`,
);

const total = primitives.length + contract.length * themes.length + componentTokens.length;
console.log(
	`tokens: ok  ${primitives.length} primitives, ${contract.length} semantic x ${themes.length} themes, ${componentTokens.length} component, ${densities.length + 1} densities  ->  ${total} custom properties` +
		(warnings.length > 0 ? `  (${warnings.length} warning(s))` : ""),
);
