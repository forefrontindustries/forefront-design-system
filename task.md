# Forefront Design System — build progress

Plan: /home/user/plan-forefront-design-system.md (approved)

## Done
- [x] app_init managed app at /home/user/forefront-design-system (web port 4200)
- [x] design.md (design direction, 4 themes, typography, motion, anti-patterns)
- [x] @forefront/tokens: DTCG source (primitives / value-less semantic contract / component tier 3),
      4 themes, compact density, build pipeline with 6 hard-fail validations.
      Build green: 151 primitives, 65 semantic x 4 themes, 67 component, 2 densities -> 478 custom props, 0 warnings.
- [x] @forefront/ui scaffold: package.json, tsconfig, lib (cx, useControllableState, focus trap +
      escape + scroll lock, portal, presence, compose-refs, meta contract), styles/index.css
- [x] 12 components authored (tsx + css + meta.ts): Button, Input, Select, Checkbox, RadioGroup,
      Switch, Badge, Card, Modal, Tooltip, Tabs, Toast. Internal Field scaffolding shared by form controls.

## Done (continued)
- [x] barrels, extract-props.ts (TS compiler API -> component-api.json), lint-css-tokens.ts
- [x] workspace wiring, root scripts (tokens:build, api:build, lint:tokens), bun install
- [x] docs site: 10 routes, theme + density switcher, playground, motion lab, generated API tables
- [x] design.md radius table verified correct (Forefront 4/10/14, Signal 10/14/20)
- [x] CONTRAST GATE: packages/tokens/src/contrast.json (47 requirements + 4 named exemptions),
      build rules 7 (every text/border/icon token must be measured or named exempt) and 8 (ratio check).
      188 checks across 4 themes, 0 failures. Gate found and fixed:
        - border.default/strong were doing double duty on controls (1.25:1 in dark) ->
          split contrast-guaranteed border.control + border.control-hover, migrated
          input/select/checkbox/radio/switch/secondary-button CSS to them
        - forefront-dark accent-bold-active blue.600 -> blue.300 (label was 3.64:1); signal-dark
          amber.600 -> amber.300 for the same state model: in a dark theme states move AWAY from canvas
        - dark themes now invert the danger fill (red.400 fill / red.950 label, hover red.300) the same
          way the accent fill is already inverted; white-on-red.500 hover was 3.91:1. Added red.300.
        - border.disabled raised to clear the 1.2 house floor (ink.650 / slate.200 / sand.600)
        - deleted color.text.inverse: no surface it is drawn on, nothing rendered it
- [x] accessibility.tsx rewritten to render the shared contract from @forefront/tokens (no local PAIRS),
      per-pair min + cited rule, exempt table with reasons, build-gate stats from manifest
- [x] two new "decisions on record" entries on the docs home page

## Done (continued 2)
- [x] README.md + CONTRIBUTING.md written (architecture and decisions first)
- [x] tooling/keyboard-audit.py + `bun run audit:keyboard`: 55 browser-driven assertions, 55/55 pass,
      exits non-zero on failure or console error. It found TWO REAL BUGS:
        1. Portal returned null until its own mount effect ran -> Modal focus trap ran against a null
           ref, bailed, never re-ran. Dialog opened with the page behind it fully tabbable. Fixed by
           creating the portal host during render; trap now waits for its container (bounded rAF) and
           pulls focus back when it has escaped.
        2. Toast declared role=status/aria-live on elements inserted in the same tick and mounted no
           live region until the first toast. Viewport is now a persistent polite live region owned by
           ToastProvider; only assertive toasts declare their own semantics.
- [x] RadioGroup fieldset now carries role="radiogroup" + aria-labelledby -> legend
- [x] .prose + .prose sibling spacing fix; a11y swatches render fills as fills, boundaries as borders
- [x] turbo.json outputs declared (build/**, generated/**) -> no more "no output files" warnings
- [x] konsistent.json template bug fixed (expected ../components/ErrorBoundary, actual __ErrorBoundary)
- [x] all green: tokens:build, api:build, lint:tokens, check-conventions, typecheck (5 pkgs), build (4 tasks)

## Blocked
- oxlint CRASHES in this sandbox on any input, even a single file:
  `panicked at crates/oxc_allocator/src/pool/fixed_size.rs:112:67`. Its fixed-size allocator wants a
  mapping this box will not give it (3.9GB total RAM). Not caused by this work and not fixable in the
  repo. `bun run lint` therefore stops at oxlint; konsistent + lint:tokens both pass on their own.

## Next
- [ ] push public repo forefrontindustries/forefront-design-system (main + master)
- [ ] deploy docs worker (CF acct 35309211a30bff8d263cad687ebba3d5), strip runable badge + runable.js
- [ ] jeremymaendel.com/projects/design-systems landing page in /home/user/jeremy-resume
- [ ] deliver + report URLs

## Constraints (do not violate)
- no third-party primitives, no em dashes in copy, remove RunableBadge, no "runable" in public URLs
- gitignore ignores `scripts/` and `dist` -> use `tooling/` and `build/`
- component CSS may only reference tier 2 + tier 3 tokens, never hex or tier 1 colour
