# Forefront Design System — Design Direction

This repo is a design system, so this file documents the system's own design language *and* the documentation site's design language. They are deliberately different: the system is product-grade UI, the docs are editorial-technical.

## Identity

The system ships two themes from one token contract:

| Theme | Appearance | Accent | Canvas | Body text |
|---|---|---|---|---|
| `forefront-dark` (default) | dark | `blue.500` `#5793CA` | `ink.950` `#07090F` | `slate.25` `#F8FAFC` |
| `forefront-light` | light | `blue.600` `#2F6DA4` | `slate.25` `#F8FAFC` | `ink.950` `#07090F` |

Both themes are the real Forefront Industries brand, not invented palettes. Every value in the ink, slate, blue and orange ramps was extracted from the production site and the `runable-forefront-v1.0` source, ranked by usage frequency: `#5793CA` appears 747 times, `#7BA8D1` 125 times, `#0A0C14` 70, `#07090F` 38, `#0A0A12` 33, `#0D1019` 30, `#FF8A3D` 14.

Two themes rather than four is a deliberate correction. A second brand invented purely to prove the token layer can retheme is a demo, not evidence. Light and dark from one value-less semantic contract is the same proof with nothing fictional in it: the light theme resolves the accent role two steps darker on the ramp (`blue.600` instead of `blue.500`) because the same hex cannot clear contrast on both a near-black and a near-white canvas, and that is exactly the kind of decision a semantic layer exists to hold.

### Radius

Radius is theme-owned at tier 2, so geometry can move without touching a component. Both current themes use the same scale, because the brand has one geometry:

| Role | Primitive | Value |
|---|---|---|
| `radius.control` | `radius.sm` | 4px |
| `radius.surface` | `radius.lg` | 10px |
| `radius.overlay` | `radius.xl` | 14px |
| `radius.pill` | `radius.full` | 999px |

## Typography

No serif faces anywhere in this system. The brand does not use one.

- **Display:** Outfit (variable), used at weight 900 with `-0.04em` tracking. Headings, the display scale and marketing surfaces. No component consumes it, because a component whose typeface changes with the theme is a component that reflows.
- **Body / UI:** Satoshi, weights 400 / 500 / 700 / 900. Every component text style and all docs body copy.
- **Mono:** system stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`). Token values, prop names, code samples. This role ships zero font bytes on purpose: the brand owns no mono face, and inventing one would be a decision the brand never made.
- Type scale is a token ramp `font.size.10` through `font.size.130` (11px to 64px). Components only consume `40` / `50` / `60`.
- Line height tokens: `tight 1.1`, `snug 1.25`, `normal 1.5`, `relaxed 1.65`. Long-form docs copy uses `relaxed` at a 68ch measure.

### Fonts are self-hosted, and a measured failure is the reason

Outfit and Satoshi ship as five woff2 files in `packages/web/public/fonts/`, declared in the docs app's `styles.css`, with `outfit-var.woff2` and `satoshi-400.woff2` preloaded for first paint. They are the same faces `jeremymaendel.com` uses, so the system matches the site it is published from.

An earlier version of this system shipped no webfont at all and relied on the platform UI stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. That is the standard advice and it is correct on a Mac. It rendered every heading and paragraph in a **serif** on the machine the work was reviewed on. The cause was measured with a canvas glyph-width probe rather than guessed at: with no SF and no Segoe installed the named families fall through as expected, and then the terminal generic keyword *itself* resolves to a serif face. `sans-serif` is a request to the host font config, not a guarantee. Only `Arial` and `Helvetica` measured as genuinely sans on the same machine.

So both family primitives end the same way, and this is a hard rule:

```
font.family.display   'Outfit', Arial, Helvetica, sans-serif
font.family.sans      'Satoshi', Arial, Helvetica, sans-serif
```

A family stack never terminates on the bare `sans-serif` keyword. Two named grotesques go in front of it first.

The library itself never injects `@font-face`. A component library that fetches fonts takes a decision that belongs to the application: it competes with the host's own loading strategy and breaks under a strict CSP that does not whitelist its font origin. The rules live at the document level in the docs site, which is the pattern a consumer should copy.

### The rem origin belongs to the host application, never to the library

`[data-fds-theme]` once set `font-size` to a token, and the theme provider puts that attribute on `<html>`. That silently rescaled **every rem token in the system** to 87.5%, spacing and control heights and focus-ring offsets included, and nothing looked broken enough to notice. The fix pins the root and moves the theme's text size to the body:

```css
:root[data-fds-theme] { font-size: 100%; }
:root[data-fds-theme] > body { font-size: var(--fds-font-size-40); }
```

A theme can never redefine the unit its own tokens are expressed in. Choosing the rem origin is a host decision: the docs site sets `html { font-size: 112.5% }` because its preview frame scales down, and that lives in the docs app, not in the tokens.

## Color

- Dark surfaces are built on a blue-tinted ink ramp, not neutral gray. `ink.1000` (`#000000`) exists in the ramp but is only ever used as `surface.sunken`, never as the canvas.
- Accent is used for action, focus and selection only. Never as decoration, never as a large fill behind body text.
- Orange (`#FF8A3D`, the production secondary) carries the warning role. It is the brand's only secondary accent and it does not compete with blue for action.
- Every foreground token in the contrast contract is checked at build time against its real background pair. The build fails on a violation. See `packages/tokens/src/contrast.json` (47 requirements, 4 named exemptions) and the live table on `/accessibility`.

### The border.control split

`border.default` and `border.strong` are decorative separators. Interactive control boundaries use `color.border.control` and `color.border.control-hover`, which are separate tokens for one reason: WCAG 1.4.11 requires 3:1 for the boundary of a control, and a hairline that looks correct as a table rule is usually too faint to be a checkbox edge.

Splitting them means the gate can hold controls to 3:1 without forcing every separator in the product to be visually heavy. The gate caught a real failure while building this: `forefront-light` had `border.control` at `slate.400`, which measures 2.96:1 on `surface.canvas`. It shipped as `slate.450` (3.51:1), hover `slate.500` (5.55:1).

## Space and density

- 4px base grid. Space tokens `space.0` through `space.15` (0 to 128px).
- Two density modes driven by `data-fds-density`: `comfortable` (default) and `compact`.
- Density may only override tier 3 tokens. The build fails if a density file touches tier 1 or tier 2. Density changes control heights and insets, never font sizes below 13px, never focus ring geometry.

## Motion

- Duration tokens: `instant 0`, `fast 120ms`, `moderate 200ms`, `slow 320ms`, `slower 480ms`.
- Easing tokens: `standard`, `emphasized`, `entrance`, `exit`, `spring`.
- Rule: entrances use `entrance` easing at `moderate`, exits use `exit` at `fast`. Exits are always faster than entrances.
- Reduced motion is enforced at the token layer, not per component. `prefers-reduced-motion: reduce` zeroes the duration primitives, so every transition in the library collapses at once and a new component cannot forget to opt in. Opacity end-states are preserved, so nothing becomes invisible or unusable with motion off.

## Component design language

- **Hairlines over shadows.** Borders at `1px` define structure. Elevation is reserved for true overlays (modal, tooltip, toast, select popover).
- **Focus is never removed.** Every interactive element renders a 2px `border.focus` ring at 2px offset via `:focus-visible`. Ring geometry lives in tier 3 and is not per-component overridable, because a focus ring a product can shrink is a focus ring a product will shrink. There is no `outline: none` in the codebase without a replacement ring in the same rule.
- **Controls are 1px-bordered, low-radius and flat.** No gradients, no inner glows.
- **States are token-driven:** rest, hover, active, focus, disabled, invalid, loading. Disabled uses `surface.disabled` plus `text.disabled`, never opacity alone, because opacity breaks the contrast math the gate depends on.
- Components are authored in plain CSS with `--fds-*` custom properties and zero Tailwind dependency, so the library is portable into any consumer app. Tailwind is used only for the docs site chrome.
- A CSS lint pass rejects color literals and tier 1 color references in component stylesheets, and fails on any custom property that does not exist in the generated output. The architecture is a convention until something checks it.

## Docs site layout

- Enterprise DS documentation conventions: fixed dense left nav (240px), sticky top bar with theme and density switchers, content column capped at 1120px with a right-hand "on this page" rail on component pages.
- Editorial touches that keep it from feeling generated: oversized Outfit page titles, numbered section markers (`01`, `02`), hairline rules between sections, generous vertical rhythm.
- Component pages follow a fixed order: live demo, playground, anatomy, variants, API table, accessibility notes, do/don't. Consistency across pages is itself a design-system argument.
- API tables are generated from the TypeScript types via the compiler API. A hand-written prop table is wrong the day after it is written.
- Background is flat `surface.canvas`. No gradient meshes, no noise, no glows. The components are the subject and the chrome must not compete with them.

## Anti-patterns for this project

- No serif typefaces. Not in the system, not in the docs, not in a specimen.
- No purple gradients, no glassmorphism, no decorative blur orbs.
- No agency marketing voice in docs copy. The audience is designers and engineers adopting the system.
- No em dashes in any copy.
- No third-party component primitives (Radix, shadcn, MUI). Everything hand-built, since the point is demonstrating the system can be authored, not configured.
- No invented brand values. Every color and typeface traces to the production Forefront site.
