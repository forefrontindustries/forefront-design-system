# Forefront Design System - design direction

The documentation site is a consumer of the system it documents. It has no private styles, no
one-off colours, and no exceptions. Every declaration in `docs.css` resolves to a token from
`@forefront/tokens`, and the same `lint-tokens` gate that guards `packages/ui` guards the docs.

## Typography

- Display: **Outfit** (Google Fonts). Geometric grotesque. Used for `d-display`, `d-h1`, `d-h2`, `d-h3`.
  Tight tracking at large sizes, weight 600 for headings and 700 for the hero number treatments.
- Body: **Satoshi** (Fontshare). Neutral grotesque with a taller x-height than Inter, which matters on
  a docs site that runs long. Weights 400 and 500.
- Mono: system mono stack for token names, values, and code. Token names are always mono so a reader
  can tell a token from prose without reading it.
- No serif anywhere. Line height is generous (1.6 body, 1.15 display) because the pages are dense
  with tables.

## Colour

The site runs on the system's own themes, `forefront-dark` (default) and `forefront-light`, switched
with `data-fds-theme` on `<html>`. The dark theme is a near-black canvas with raised surfaces one step
up, hairline borders, and a single blue accent used for links, focus, and the accent badge. Accent is
never decorative: if something is blue, it is interactive or it is the one thing on the page that
matters.

## Layout

- Fixed sidebar navigation, grouped by intent (start here, foundations, library, operating the system),
  with a persistent theme select and compact density switch in the top bar so any page can be read in
  any of the four states.
- Content column is measured for reading, not stretched. Tables get their own horizontal scroll
  container so a wide token table never breaks the page grid.
- Asymmetric section rhythm: a hero with an eyebrow and lead, then panels and tables. Stat blocks use
  oversized numerals to break the text rhythm.
- Density: the compact switch is a live demonstration, not a setting. Toggling it changes component
  geometry on every page while colours and contrast ratios stay identical.

## Motion

One purpose only: state feedback. Hover and focus transitions use `duration-fast` and the shared
easing token. There are no scroll animations, because a reference site is read, not toured. Every
duration token collapses to zero under `prefers-reduced-motion`, emitted by the token build.

## Rules for anyone editing this site

1. No literal colour, length, or duration values in `docs.css`. The lint fails the build.
2. Docs prose about the system's shape is generated from the token model and `manifest.json`, never
   re-typed. If a number appears in a sentence, it came from the build.
3. All docs classes are prefixed `d-` so they can never collide with the `fds-` component layer.
4. No em dashes in any copy on this site.
