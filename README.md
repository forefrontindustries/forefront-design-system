# Forefront Design System

A semantic token system and React component library, built as the source of truth for tokens,
components, and standards across web, mobile, and native surfaces.

Docs site: `bun run dev` then open http://localhost:4200
Storybook: `cd packages/ui && bun run storybook` then open http://localhost:6006

## Why this repo looks the way it does

Most design systems fail in the same two places: the token layer has no enforced structure, so it
rots into a flat list of one-off variables, and the process has no gates, so quality depends on who
reviewed the pull request that day. This repo answers both with build rules rather than guidelines.

- **Three tiers, one direction of reference.** Primitives hold literals. The semantic contract holds
  intent and no values. Component tokens hold geometry. References only ever point up one tier, and
  the validator fails the build on anything else.
- **The semantic contract is value-less on purpose.** A theme is a value table over the contract, so
  theme completeness is machine-checkable: a missing token or an extra token is a named build error.
- **Accessibility is a gate, not a review step.** Contrast is measured across every theme on every
  build. A theme cannot ship an unreadable state.
- **Multi-platform output is generated, never hand-maintained.** One token source emits CSS custom
  properties, a Tailwind v4 `@theme inline` layer, typed TypeScript, resolved unitless React Native
  values, Figma Variables with real `VARIABLE_ALIAS` references, and a Material 3 `md.sys.*` bridge.
- **The docs site is a consumer, not an exception.** It passes the same literal-value lint as the
  component package, and every number in its prose is read from the generated manifest.

## Packages

| Package | Name | What it owns |
| --- | --- | --- |
| `packages/tokens` | `@forefront/tokens` | Token source, resolver, build, validation, contrast gate, platform artifacts |
| `packages/ui` | `@forefront/ui` | React components, token-only stylesheet, Storybook |
| `packages/web` | docs site | Documentation, token explorer, live component previews |
| `packages/mobile` | Expo app | React Native consumption target |
| `packages/desktop` | Electron shell | Desktop consumption target |

## Token model

```
tier 1  primitives        literals only, reference nothing        134 tokens
tier 2  semantic contract intent names, no values, themed          66 tokens
tier 3  component         geometry, references tier 1 or 2         67 tokens
        density overrides tier 3 only, never colour                17 overrides
```

Enforced hard-fail rules: `theme-missing-contract-token`, `theme-extra-token`, `semantic-literal`,
`contract-token-undocumented`, `alias-unresolved`, `alias-circular`, `alias-too-deep`,
`density-outside-tier-3`, `density-changes-colour`, `single-default-theme`. Warning only:
`unreferenced-colour-primitive`.

## Install and use

```bash
bun install
bun run tokens:build
```

Web:

```ts
import "@forefront/tokens/css";
import { Button } from "@forefront/ui";
import "@forefront/ui/styles.css";

document.documentElement.setAttribute("data-fds-theme", "forefront-light");
document.documentElement.setAttribute("data-fds-density", "compact");
```

React Native:

```ts
import { tokens } from "@forefront/tokens/native";

const styles = { padding: tokens.spaceMd, color: tokens.colorTextPrimary };
```

Tailwind v4:

```css
@import "tailwindcss";
@import "@forefront/tokens/tailwind";
```

## Scripts

| Command | What it does |
| --- | --- |
| `bun run tokens:build` | Emits all seven platform artifacts and `manifest.json` |
| `bun run tokens:validate` | Tier, naming, alias, and theme completeness rules |
| `bun run tokens:contrast` | WCAG 2.2 AA check across every theme |
| `bun run lint:tokens` | Fails on literal colour, length, or duration values in component and docs CSS |
| `bun run typecheck` | Every package |
| `bun run build` | Turborepo build across the monorepo |
| `bun run dev` | Docs site on port 4200 |

CI runs exactly these commands, in this order. There is no check that only exists on the server.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the three contribution tracks and the local loop,
[GOVERNANCE.md](./GOVERNANCE.md) for ownership and decision rights, [VERSIONING.md](./VERSIONING.md)
for what each semver bump means here, and [ROADMAP.md](./ROADMAP.md) for what is next.

## License

MIT
