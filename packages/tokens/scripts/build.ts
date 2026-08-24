/**
 * One source, six artifacts. Run with `bun run build` inside packages/tokens.
 *
 *   build/tokens.css          the stylesheet the browser reads
 *   build/tokens.tailwind.css Tailwind v4 @theme bridge for product teams on Tailwind
 *   build/tokens.ts           typed model with resolved values and alias chains
 *   build/tokens.native.ts    React Native: resolved, unitless, per theme
 *   build/tokens.md3.css      Material 3 role bridge (--md-sys-*) for M3 surfaces
 *   build/tokens.figma.json   3 collections with real VARIABLE_ALIAS references
 *   build/manifest.json       counts, coverage, contrast results, rule violations
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { aliasTarget, cssRef, cssVar } from "../src/index.ts";
import { loadModel, resolveTheme } from "./resolve.ts";
import { contrastReport } from "./contrast.ts";
import { MD3_COLOR_MAP, MD3_SHAPE_MAP, MD3_TYPESCALE_MAP } from "./md3-map.ts";

const OUT = join(import.meta.dir, "..", "build");
mkdirSync(OUT, { recursive: true });

const model = loadModel();
const errors = model.violations.filter((v) => v.level === "error");
const warnings = model.violations.filter((v) => v.level === "warn");

if (errors.length) {
  console.error(`\n${errors.length} token rule violation(s):\n`);
  for (const v of errors) console.error(`  [${v.rule}] ${v.where}: ${v.detail}`);
  console.error("\nBuild refused. Nothing was written.\n");
  process.exit(1);
}

const defaultTheme = model.themes.find((t) => t.isDefault)!;
const decl = (name: string, value: string) => `  ${cssVar(name)}: ${value};`;
const emitValue = (raw: string | undefined) => {
  const target = aliasTarget(raw);
  return target ? cssRef(target) : (raw ?? "");
};

/* ------------------------------------------------------------------ tokens.css */
const primitiveBlock = Object.entries(model.primitives)
  .map(([name, token]) => decl(name, emitValue(token.value)))
  .join("\n");

const themeBlock = (names: string[], tokens: Record<string, { value?: string }>) =>
  names.map((n) => decl(n, emitValue(tokens[n]?.value))).join("\n");

const contractOrder = Object.keys(model.contract);

const css = `/**
 * Forefront Design System tokens. GENERATED FILE - do not edit.
 * Source: packages/tokens/src, build: packages/tokens/scripts/build.ts
 * ${Object.keys(model.primitives).length} primitives, ${contractOrder.length} contract tokens, ${Object.keys(model.component).length} component tokens.
 */
@layer fds.primitives, fds.semantic, fds.component, fds.density;

@layer fds.primitives {
  :root {
${primitiveBlock}
  }
}

@layer fds.semantic {
  /* The default theme is emitted on :root as well, so a consumer who forgets the
     data attribute still gets a working system instead of unset custom properties. */
  :root,
  [data-fds-theme="${defaultTheme.name}"] {
${themeBlock(contractOrder, defaultTheme.tokens)}
  }
${model.themes
  .filter((t) => !t.isDefault)
  .map(
    (t) => `
  [data-fds-theme="${t.name}"] {
${themeBlock(contractOrder, t.tokens)}
  }`,
  )
  .join("\n")}
}

@layer fds.component {
  :root {
${Object.entries(model.component)
  .map(([name, token]) => decl(name, emitValue(token.value)))
  .join("\n")}
  }
}

@layer fds.density {
${model.densities
  .map(
    (d) => `  [data-fds-density="${d.name}"] {
${Object.entries(d.tokens)
  .map(([name, token]) => decl(name, emitValue(token.value)))
  .join("\n")}
  }`,
  )
  .join("\n\n")}
}

@media (prefers-reduced-motion: reduce) {
  :root {
${Object.keys(model.primitives)
  .filter((n) => n.startsWith("duration-"))
  .map((n) => decl(n, "0ms"))
  .join("\n")}
  }
}
`;
writeFileSync(join(OUT, "tokens.css"), css);

/* --------------------------------------------------- tokens.tailwind.css (v4) */
const twMap: [string, string][] = [
  ...contractOrder.filter((n) => n.startsWith("color-")).map((n) => [`--color-${n.replace(/^color-/, "")}`, n] as [string, string]),
  ...Object.keys(model.primitives).filter((n) => n.startsWith("space-")).map((n) => [`--spacing-${n.replace("space-", "")}`, n] as [string, string]),
  ...Object.keys(model.primitives).filter((n) => n.startsWith("font-size-")).map((n) => [`--text-${n.replace("font-size-", "")}`, n] as [string, string]),
  ...contractOrder.filter((n) => n.startsWith("radius-")).map((n) => [`--radius-${n.replace("radius-", "")}`, n] as [string, string]),
  ...contractOrder.filter((n) => n.startsWith("font-")).map((n) => [`--font-${n.replace("font-", "")}`, n] as [string, string]),
  ...contractOrder.filter((n) => n.startsWith("elevation-")).map((n) => [`--shadow-${n.replace("elevation-", "")}`, n] as [string, string]),
];
writeFileSync(
  join(OUT, "tokens.tailwind.css"),
  `/* GENERATED - Tailwind v4 bridge. Import after tokens.css: utilities resolve to the same custom properties, so a theme switch still costs one DOM write. */
@theme inline {
${twMap.map(([tw, fds]) => `  ${tw}: ${cssRef(fds)};`).join("\n")}
}
`,
);

/* ---------------------------------------------------------------- tokens.ts */
const themeResolutions = Object.fromEntries(
  model.themes.map((t) => [t.name, resolveTheme(model, t.name)]),
);

const tsModel = {
  meta: {
    generated: "GENERATED FILE - do not edit. bun run tokens:build",
    counts: {
      primitives: Object.keys(model.primitives).length,
      contract: contractOrder.length,
      component: Object.keys(model.component).length,
      cssCustomProperties:
        Object.keys(model.primitives).length +
        contractOrder.length * model.themes.length +
        Object.keys(model.component).length +
        model.densities.reduce((n, d) => n + Object.keys(d.tokens).length, 0),
    },
    themes: model.themes.map((t) => ({ name: t.name, label: t.label, isDefault: t.isDefault })),
    densities: model.densities.map((d) => ({ name: d.name, label: d.label })),
  },
  primitives: model.primitives,
  contract: model.contract,
  component: model.component,
  themes: Object.fromEntries(
    model.themes.map((t) => [
      t.name,
      {
        label: t.label,
        isDefault: t.isDefault,
        aliases: Object.fromEntries(Object.entries(t.tokens).map(([n, v]) => [n, v.value])),
        resolved: themeResolutions[t.name].resolved,
        chains: themeResolutions[t.name].chains,
      },
    ]),
  ),
  densities: Object.fromEntries(
    model.densities.map((d) => [
      d.name,
      { label: d.label, overrides: Object.fromEntries(Object.entries(d.tokens).map(([n, v]) => [n, v.value])) },
    ]),
  ),
};

writeFileSync(
  join(OUT, "tokens.ts"),
  `/* GENERATED FILE - do not edit. Source: packages/tokens/src */
export const tokens = ${JSON.stringify(tsModel, null, 2)} as const;

export type ThemeName = keyof typeof tokens.themes;
export type DensityName = keyof typeof tokens.densities;
export type ContractToken = keyof typeof tokens.contract;
export type PrimitiveToken = keyof typeof tokens.primitives;
export type ComponentToken = keyof typeof tokens.component;

/** Typed accessor so product code cannot invent a token name that does not exist. */
export const token = (name: ContractToken | PrimitiveToken | ComponentToken) => \`var(--fds-\${name})\`;

export default tokens;
`,
);

/* ------------------------------------------------------------ tokens.native.ts */
const toNumber = (value: string): number | string => {
  const rem = /^(-?[\d.]+)rem$/.exec(value.trim());
  if (rem) return Number.parseFloat(rem[1]) * 16;
  const px = /^(-?[\d.]+)px$/.exec(value.trim());
  if (px) return Number.parseFloat(px[1]);
  const ms = /^(-?[\d.]+)ms$/.exec(value.trim());
  if (ms) return Number.parseFloat(ms[1]);
  return value;
};

const nativeThemes = Object.fromEntries(
  model.themes.map((t) => {
    const { resolved } = themeResolutions[t.name];
    return [
      t.name,
      Object.fromEntries(
        Object.entries(resolved)
          .filter(([, v]) => v && !v.includes("var("))
          .map(([n, v]) => [n.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()), toNumber(v)]),
      ),
    ];
  }),
);

writeFileSync(
  join(OUT, "tokens.native.ts"),
  `/* GENERATED FILE - do not edit.
 * React Native has no cascade and no custom properties, so tokens ship fully resolved
 * per theme with rem converted to dp. The contract is identical to web: same names,
 * same intent, camelCased for JS style objects.
 */
export const nativeTokens = ${JSON.stringify(nativeThemes, null, 2)} as const;

export type NativeThemeName = keyof typeof nativeTokens;
export const useNativeTheme = (name: NativeThemeName = "${defaultTheme.name}") => nativeTokens[name];
export default nativeTokens;
`,
);

/* ------------------------------------------------------------- tokens.md3.css */
const md3 = `/* GENERATED - Material 3 bridge.
 * Maps the Forefront semantic contract onto md.sys.* roles so a Material 3 surface
 * (@material/web on web, MaterialTheme on Compose via the same JSON) renders in
 * Forefront themes without forking the palette. Roles that MD3 keeps static
 * (error) still resolve through the Forefront contract so dark mode stays coherent.
 */
:root {
${MD3_COLOR_MAP.map(([md, fds]) => `  --md-sys-color-${md}: ${cssRef(fds)};`).join("\n")}

${MD3_SHAPE_MAP.map(([md, fds]) => `  --md-sys-shape-corner-${md}: ${cssRef(fds)};`).join("\n")}

${MD3_TYPESCALE_MAP.map(
  ([scale, spec]) => `  --md-sys-typescale-${scale}-font: ${cssRef(spec.font)};
  --md-sys-typescale-${scale}-size: ${cssRef(spec.size)};
  --md-sys-typescale-${scale}-line-height: ${cssRef(spec.lineHeight)};
  --md-sys-typescale-${scale}-weight: ${cssRef(spec.weight)};
  --md-sys-typescale-${scale}-tracking: ${cssRef(spec.tracking)};`,
).join("\n\n")}
}
`;
writeFileSync(join(OUT, "tokens.md3.css"), md3);

/* ----------------------------------------------------------- tokens.figma.json */
const figmaType = (type?: string) => (type === "color" ? "COLOR" : type === "number" ? "FLOAT" : "STRING");

const figma = {
  $generated: "GENERATED FILE - do not edit. Import with the Figma Variables REST API or a plugin.",
  collections: [
    {
      name: "1. Primitives",
      modes: ["Value"],
      variables: Object.entries(model.primitives).map(([name, token]) => ({
        name: name.replace(/-/g, "/"),
        resolvedType: figmaType(token.type),
        valuesByMode: { Value: token.value },
        scopes: token.type === "color" ? ["ALL_SCOPES"] : ["ALL_SCOPES"],
        description: token.description ?? "Tier 1 primitive.",
      })),
    },
    {
      name: "2. Semantic",
      modes: model.themes.map((t) => t.label),
      variables: contractOrder.map((name) => ({
        name: name.replace(/-/g, "/"),
        resolvedType: figmaType(model.contract[name].type),
        valuesByMode: Object.fromEntries(
          model.themes.map((t) => [
            t.label,
            {
              type: "VARIABLE_ALIAS",
              id: `1. Primitives/${(aliasTarget(t.tokens[name]?.value) ?? "").replace(/-/g, "/")}`,
            },
          ]),
        ),
        description: model.contract[name].description ?? "",
      })),
    },
    {
      name: "3. Component",
      modes: ["Comfortable", ...model.densities.map((d) => d.label)],
      variables: Object.entries(model.component).map(([name, token]) => {
        const base = aliasTarget(token.value);
        const valueFor = (source?: string) => {
          const target = aliasTarget(source);
          if (!target) return source;
          const collection = target in model.contract ? "2. Semantic" : "1. Primitives";
          return { type: "VARIABLE_ALIAS", id: `${collection}/${target.replace(/-/g, "/")}` };
        };
        return {
          name: name.replace(/-/g, "/"),
          resolvedType: figmaType(token.type),
          valuesByMode: {
            Comfortable: base ? valueFor(token.value) : token.value,
            ...Object.fromEntries(
              model.densities.map((d) => [
                d.label,
                d.tokens[name] ? valueFor(d.tokens[name].value) : base ? valueFor(token.value) : token.value,
              ]),
            ),
          },
          description: token.description ?? "Tier 3 component token.",
        };
      }),
    },
  ],
};
writeFileSync(join(OUT, "tokens.figma.json"), JSON.stringify(figma, null, 2));

/* ------------------------------------------------------------- manifest.json */
const contrast = contrastReport(model);
const unreferenced = warnings.filter((w) => w.rule === "unreferenced-colour-primitive").map((w) => w.detail.split(" ")[0]);

const manifest = {
  $generated: "GENERATED FILE - the docs site reads this so the foundation pages cannot go stale.",
  builtAt: new Date().toISOString().slice(0, 10),
  version: (await Bun.file(join(import.meta.dir, "..", "package.json")).json()).version,
  counts: tsModel.meta.counts,
  themes: tsModel.meta.themes,
  densities: tsModel.meta.densities,
  coverage: Object.fromEntries(
    model.themes.map((t) => [
      t.name,
      { supplied: Object.keys(t.tokens).length, required: contractOrder.length, complete: Object.keys(t.tokens).length === contractOrder.length },
    ]),
  ),
  artifacts: ["tokens.css", "tokens.tailwind.css", "tokens.ts", "tokens.native.ts", "tokens.md3.css", "tokens.figma.json", "manifest.json"],
  rules: {
    enforced: [
      "theme-missing-contract-token",
      "theme-extra-token",
      "semantic-literal",
      "contract-token-undocumented",
      "alias-unresolved",
      "alias-circular",
      "alias-too-deep",
      "density-outside-tier-3",
      "density-changes-colour",
      "single-default-theme",
    ],
    warnings: ["unreferenced-colour-primitive"],
  },
  unreferencedColourPrimitives: unreferenced,
  accessibility: contrast,
};
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(
  `tokens built: ${manifest.counts.cssCustomProperties} custom properties, ${contractOrder.length} contract tokens, ${model.themes.length} themes, ${manifest.artifacts.length} artifacts`,
);
if (warnings.length) console.log(`${warnings.length} warning(s): ${warnings.map((w) => w.rule).join(", ")}`);
const failing = contrast.pairs.filter((p) => !p.passes);
if (failing.length) {
  console.error(`\ncontrast failures:\n${failing.map((p) => `  ${p.theme} ${p.label}: ${p.ratio}:1 (needs ${p.required}:1)`).join("\n")}`);
  process.exit(1);
}
console.log(`contrast: ${contrast.pairs.length} pairs checked across ${model.themes.length} themes, all pass`);
