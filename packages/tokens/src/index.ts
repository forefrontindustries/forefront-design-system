/**
 * Source-of-truth loader. Everything downstream (build, validate, contrast, docs)
 * reads the token tiers through this module so there is exactly one place that
 * knows how the source files are laid out on disk.
 */
import primitives from "./primitives.json" with { type: "json" };
import semantic from "./semantic.json" with { type: "json" };
import component from "./component.json" with { type: "json" };
import dark from "./themes/forefront-dark.json" with { type: "json" };
import light from "./themes/forefront-light.json" with { type: "json" };
import compact from "./density/compact.json" with { type: "json" };

export type TokenNode = {
  $type?: string;
  $value?: string;
  $description?: string;
};

export type TokenTree = { [key: string]: TokenTree | TokenNode | string | boolean | undefined };

export const PREFIX = "fds";

export const source = {
  primitives: primitives as TokenTree,
  semantic: semantic as TokenTree,
  component: component as TokenTree,
  themes: [
    { file: "themes/forefront-dark.json", tree: dark as TokenTree },
    { file: "themes/forefront-light.json", tree: light as TokenTree },
  ],
  densities: [{ file: "density/compact.json", tree: compact as TokenTree }],
};

export type Flat = Record<string, { value?: string; type?: string; description?: string; tier: 1 | 2 | 3 }>;

const isNode = (v: unknown): v is TokenNode =>
  typeof v === "object" && v !== null && ("$value" in v || "$description" in v || "$type" in v);

/** `color_surface_accent.bold` -> `color-surface-accent-bold` */
export function flatten(tree: TokenTree, tier: 1 | 2 | 3, prefixPath: string[] = []): Flat {
  const out: Flat = {};
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    const path = [...prefixPath, key.replace(/_/g, "-")];
    if (isNode(value)) {
      out[path.join("-")] = {
        value: value.$value,
        type: value.$type,
        description: value.$description,
        tier,
      };
    } else if (typeof value === "object" && value !== null) {
      Object.assign(out, flatten(value as TokenTree, tier, path));
    }
  }
  return out;
}

/** `{space.4}` -> `space-4`; returns null when the value is a literal. */
export function aliasTarget(value: string | undefined): string | null {
  if (!value) return null;
  const match = /^\{([a-z0-9.-]+)\}$/i.exec(value.trim());
  return match ? match[1].replace(/\./g, "-") : null;
}

export const cssVar = (name: string) => `--${PREFIX}-${name}`;
export const cssRef = (name: string) => `var(${cssVar(name)})`;

export const themeMeta = (tree: TokenTree) => ({
  name: String(tree.$name ?? ""),
  label: String(tree.$label ?? ""),
  isDefault: tree.$default === true,
});
