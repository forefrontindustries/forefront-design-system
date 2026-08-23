/**
 * Docs data layer.
 *
 * Everything the docs site says about the system is read from the generated token model,
 * never re-typed by hand. If a token is added, renamed, or deprecated, these pages change
 * on the next build with no editing.
 */
import tokens from "@forefront/tokens";
import manifest from "@forefront/tokens/manifest";

export { manifest, tokens };

export type Tier = 1 | 2 | 3;

export interface TokenRow {
  name: string;
  tier: Tier;
  type: string;
  /** Literal for tier 1 and tier 3, theme alias target for tier 2. */
  raw: string;
  /** Full reference chain from the token down to the literal it resolves to. */
  chain: string[];
  resolved: string;
  description?: string;
  isColor: boolean;
}

const THEMES = Object.keys(tokens.themes) as (keyof typeof tokens.themes)[];
export const themeNames = THEMES.map(String);
export const defaultTheme =
  themeNames.find((name) => (tokens.themes as Record<string, { isDefault?: boolean }>)[name]?.isDefault) ??
  themeNames[0]!;

const primitives = tokens.primitives as Record<string, { value: string; type: string }>;
const contract = tokens.contract as Record<string, { type: string; description?: string }>;
const component = tokens.component as Record<string, { value: string; type: string }>;

function aliasToName(reference: string): string | null {
  const match = /^\{([^}]+)\}$/.exec(reference.trim());
  return match ? match[1]!.replace(/\./g, "-") : null;
}

function themeAliases(theme: string): Record<string, string> {
  return ((tokens.themes as Record<string, { aliases: Record<string, string> }>)[theme]?.aliases ?? {}) as Record<
    string,
    string
  >;
}

/** Walks a value down through aliases until it hits a literal, collecting every hop. */
export function resolveChain(name: string, theme: string): { chain: string[]; value: string } {
  const chain = [name];
  let cursor = name;

  for (let hop = 0; hop < 8; hop += 1) {
    const raw =
      component[cursor]?.value ??
      themeAliases(theme)[cursor] ??
      primitives[cursor]?.value ??
      undefined;
    if (raw === undefined) break;
    const next = aliasToName(raw);
    if (!next) return { chain, value: raw };
    chain.push(next);
    cursor = next;
  }

  return { chain, value: primitives[cursor]?.value ?? "" };
}

const COLOR_TYPES = new Set(["color"]);

export function allTokens(theme: string): TokenRow[] {
  const rows: TokenRow[] = [];

  for (const [name, entry] of Object.entries(primitives)) {
    rows.push({
      name,
      tier: 1,
      type: entry.type,
      raw: entry.value,
      chain: [name],
      resolved: entry.value,
      isColor: COLOR_TYPES.has(entry.type),
    });
  }

  for (const [name, entry] of Object.entries(contract)) {
    const raw = themeAliases(theme)[name] ?? "";
    const { chain, value } = resolveChain(name, theme);
    rows.push({
      name,
      tier: 2,
      type: entry.type,
      raw,
      chain,
      resolved: value,
      description: entry.description,
      isColor: COLOR_TYPES.has(entry.type),
    });
  }

  for (const [name, entry] of Object.entries(component)) {
    const { chain, value } = resolveChain(name, theme);
    rows.push({
      name,
      tier: 3,
      type: entry.type,
      raw: entry.value,
      chain,
      resolved: value,
      isColor: COLOR_TYPES.has(entry.type),
    });
  }

  return rows;
}

export const densityOverrides = Object.entries(
  (tokens.densities as Record<string, { label: string; overrides: Record<string, string> }>) ?? {},
).map(([name, entry]) => ({ name, label: entry.label, overrides: entry.overrides }));

export interface ContrastPair {
  theme: string;
  label: string;
  ratio: number;
  required: number;
  passes: boolean;
  /** What the pair is used for, e.g. "body copy". */
  note: string;
  fgValue: string;
  bgValue: string;
}

export const contrastPairs: ContrastPair[] = (manifest.accessibility?.pairs ?? []) as ContrastPair[];

export function cssVar(name: string) {
  return `--fds-${name}`;
}
