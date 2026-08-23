# Changelog

All notable changes to this repository are documented here. Versions follow the house
interpretation of semver in [VERSIONING.md](./VERSIONING.md). Entries are generated from changesets
on release, so nothing in this file is hand-written after the initial release.

## 1.0.0

Initial release of the Forefront Design System.

### Added

- **`@forefront/tokens` 1.0.0** - three-tier semantic token system: 134 primitives, a 66 token
  value-less semantic contract, 67 component tokens, and 17 compact density overrides.
- **Themes** - `forefront-dark` (default) and `forefront-light`, each supplying the full contract.
  Theming is two attributes on `<html>`: `data-fds-theme` and `data-fds-density`.
- **Platform artifacts** - one token source emits seven outputs: `tokens.css` (custom properties with
  a `prefers-reduced-motion` override), `tokens.tailwind.css` (Tailwind v4 `@theme inline`),
  `tokens.ts` (typed), `tokens.native.ts` (resolved unitless React Native values),
  `tokens.md3.css` (Material 3 `md.sys.*` bridge), `tokens.figma.json` (Figma Variables with real
  `VARIABLE_ALIAS` references), and `manifest.json`.
- **Validation gates** - hard-fail rules: `theme-missing-contract-token`, `theme-extra-token`,
  `semantic-literal`, `contract-token-undocumented`, `alias-unresolved`, `alias-circular`,
  `alias-too-deep`, `density-outside-tier-3`, `density-changes-colour`, `single-default-theme`.
  Warning only: `unreferenced-colour-primitive`.
- **Contrast gate** - 40 foreground and background pairs measured across both themes on every build
  against WCAG 2.2 AA. A failing pair fails the build.
- **Literal value lint** - `lint:tokens` scans `packages/ui/src` and `packages/web/src/web` and fails
  on raw colour, length, or duration values in guarded CSS properties.
- **`@forefront/ui` 1.0.0** - ten components with documented keyboard models: Button, Badge, Field
  (with Input and TextField), Checkbox, Switch, Card, Tabs, Modal, Tooltip, and Toast.
- **Storybook 9** - theme and density toolbar globals, `@storybook/addon-a11y` running in error mode
  so axe violations fail rather than inform.
- **Documentation site** - token explorer with full alias chains, theming and density reference,
  multi-platform output reference, generated accessibility report, live component previews, and the
  contribution, governance, versioning, and roadmap documents. Every number in its prose is read from
  `manifest.json`, so the docs cannot drift from the build.

### Notes

- Restored the `duration-*` scale (`instant 0ms`, `fast 120ms`, `moderate 200ms`, `slow 320ms`,
  `slower 480ms`). The recovered source had these flattened to `0s` by a `prefers-reduced-motion`
  block; the build now emits that override separately instead of baking it into the tokens.
- Normalized `radius-full` to `999px`.
