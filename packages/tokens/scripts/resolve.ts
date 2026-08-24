/**
 * Shared resolution + rule engine. build.ts, validate.ts and contrast.ts all go
 * through this file, so the rules cannot drift between "the build" and "CI".
 */
import { aliasTarget, flatten, source, themeMeta, type Flat } from "../src/index.ts";

export type Violation = { rule: string; where: string; detail: string; level: "error" | "warn" };

export type Model = {
  primitives: Flat;
  contract: Flat;
  component: Flat;
  themes: { name: string; label: string; isDefault: boolean; file: string; tokens: Flat }[];
  densities: { name: string; label: string; file: string; tokens: Flat }[];
  violations: Violation[];
};

const MAX_ALIAS_DEPTH = 12;

export function loadModel(): Model {
  const violations: Violation[] = [];
  const primitives = flatten(source.primitives, 1);
  const contract = flatten(source.semantic, 2);
  const component = flatten(source.component, 3);

  const themes = source.themes.map((t) => ({
    ...themeMeta(t.tree),
    file: t.file,
    tokens: flatten(t.tree, 2),
  }));
  const densities = source.densities.map((d) => ({
    name: String(d.tree.$name ?? ""),
    label: String(d.tree.$label ?? ""),
    file: d.file,
    tokens: flatten(d.tree, 3),
  }));

  const contractNames = new Set(Object.keys(contract));

  // Rule: exactly one default theme.
  const defaults = themes.filter((t) => t.isDefault);
  if (defaults.length !== 1) {
    violations.push({
      rule: "single-default-theme",
      where: "src/themes",
      detail: `${defaults.length} themes claim to be the default. There is exactly one :root block, so two defaults means the last file wins by filesystem order.`,
      level: "error",
    });
  }

  for (const theme of themes) {
    // Rule: a theme must supply every contract token.
    for (const name of contractNames) {
      if (!(name in theme.tokens)) {
        violations.push({
          rule: "theme-missing-contract-token",
          where: theme.file,
          detail: `missing ${name}. A half-themed component reads nothing and the system loses trust.`,
          level: "error",
        });
      }
    }
    for (const [name, token] of Object.entries(theme.tokens)) {
      // Rule: a theme may not invent tokens outside the contract.
      if (!contractNames.has(name)) {
        violations.push({
          rule: "theme-extra-token",
          where: theme.file,
          detail: `${name} is not declared in the semantic contract, so other themes do not have it.`,
          level: "error",
        });
      }
      // Rule: the semantic layer aliases tier 1. A literal here is a value nobody can find later.
      if (!aliasTarget(token.value)) {
        violations.push({
          rule: "semantic-literal",
          where: theme.file,
          detail: `${name} hardcodes "${token.value}" instead of aliasing a primitive.`,
          level: "error",
        });
      }
    }
    // Rule: contract tokens must be documented, or the docs site cannot explain them.
    for (const [name, token] of Object.entries(contract)) {
      if (!token.description) {
        violations.push({
          rule: "contract-token-undocumented",
          where: "src/semantic.json",
          detail: `${name} has no $description.`,
          level: "error",
        });
      }
    }
  }

  const tier3Names = new Set(Object.keys(component));
  for (const density of densities) {
    for (const name of Object.keys(density.tokens)) {
      // Rule: density is geometry. Anything else is a second theme wearing a disguise.
      if (!tier3Names.has(name)) {
        violations.push({
          rule: "density-outside-tier-3",
          where: density.file,
          detail: `${name} is not a tier 3 component token.`,
          level: "error",
        });
      }
      if (name.includes("color") || name.includes("elevation")) {
        violations.push({
          rule: "density-changes-colour",
          where: density.file,
          detail: `${name} changes colour or elevation.`,
          level: "error",
        });
      }
    }
  }

  // Alias resolution across the whole graph, depth limited so a cycle is caught with its chain.
  const graph: Flat = { ...primitives, ...component };
  for (const theme of themes) Object.assign(graph, theme.tokens);

  const resolveIn = (start: string, scope: Flat, label: string) => {
    const chain: string[] = [start];
    let cursor = start;
    for (let i = 0; i < MAX_ALIAS_DEPTH; i++) {
      const token = scope[cursor];
      if (!token) {
        violations.push({
          rule: "alias-unresolved",
          where: label,
          detail: `${chain.join(" -> ")} points at ${cursor}, which does not exist.`,
          level: "error",
        });
        return undefined;
      }
      const next = aliasTarget(token.value);
      if (!next) return token.value;
      if (chain.includes(next)) {
        violations.push({
          rule: "alias-circular",
          where: label,
          detail: `${[...chain, next].join(" -> ")} is a cycle.`,
          level: "error",
        });
        return undefined;
      }
      chain.push(next);
      cursor = next;
    }
    violations.push({
      rule: "alias-too-deep",
      where: label,
      detail: `${chain.join(" -> ")} exceeded ${MAX_ALIAS_DEPTH} hops.`,
      level: "error",
    });
    return undefined;
  };

  // Warn on unreferenced colour primitives only. Geometry primitives are consumed
  // directly by components, so warning on them would train people to ignore warnings.
  const referenced = new Set<string>();
  for (const scope of [graph, component, ...themes.map((t) => t.tokens)]) {
    for (const token of Object.values(scope)) {
      const target = aliasTarget(token.value);
      if (target) referenced.add(target);
    }
  }
  for (const name of Object.keys(primitives)) {
    if (name.startsWith("color-") && !referenced.has(name)) {
      violations.push({
        rule: "unreferenced-colour-primitive",
        where: "src/primitives.json",
        detail: `${name} is never referenced by the semantic layer.`,
        level: "warn",
      });
    }
  }

  return { primitives, contract, component, themes, densities, violations, resolve: resolveIn } as Model & {
    resolve: typeof resolveIn;
  };
}

/** Fully resolved value map for one theme + density combination. */
export function resolveTheme(model: Model, themeName: string, densityName?: string) {
  const theme = model.themes.find((t) => t.name === themeName);
  if (!theme) throw new Error(`unknown theme ${themeName}`);
  const density = densityName ? model.densities.find((d) => d.name === densityName) : undefined;

  const scope: Flat = {
    ...model.primitives,
    ...theme.tokens,
    ...model.component,
    ...density?.tokens,
  };

  const resolved: Record<string, string> = {};
  const chains: Record<string, string[]> = {};

  for (const name of Object.keys(scope)) {
    const chain: string[] = [name];
    let cursor = name;
    for (let i = 0; i < MAX_ALIAS_DEPTH; i++) {
      const token = scope[cursor];
      if (!token) break;
      const next = aliasTarget(token.value);
      if (!next) {
        resolved[name] = token.value ?? "";
        break;
      }
      if (chain.includes(next)) break;
      chain.push(next);
      cursor = next;
    }
    chains[name] = chain;
  }
  return { resolved, chains, scope };
}
