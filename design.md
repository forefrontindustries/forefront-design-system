# Forefront Design System — Design Direction

This repo is a design system, so this file documents the system's own design language *and* the documentation site's design language. They are deliberately different: the system is product-grade UI, the docs are editorial-technical.

## Identity

The system ships four themes from one token contract:

| Theme | Mood | Accent | Radius scale | Display font |
|---|---|---|---|---|
| `forefront-dark` (default) | Deep, engineered, high contrast | Blue `#5793CA` | Tight (4/10/14) | Fraunces |
| `forefront-light` | Clean, technical | Blue `#2F6DA4` | Tight (4/10/14) | Fraunces |
| `signal-dark` | Warm, editorial, softer | Amber `#E0941A` | Round (10/14/20) | Instrument Serif |
| `signal-light` | Paper, warm neutral | Amber `#B87610` | Round (10/14/20) | Instrument Serif |

Radius columns are `radius.control` / `radius.surface` / `radius.overlay` in pixels. Signal is not a hue swap. It changes accent hue, neutral temperature, radius scale, and display typeface, because a theme that only changes one color proves nothing about the token architecture.

## Typography

- **Display:** Fraunces (variable serif) for docs headings and marketing surfaces. Signal theme swaps to Instrument Serif.
- **Body / UI:** Public Sans for all component text and docs body. Chosen over Inter deliberately (Inter is overused and the brief calls for judgment).
- **Mono:** JetBrains Mono for token values, code, and API tables. Monospace token values are a hard requirement in the docs, values must be copy-accurate and scannable.
- Type scale is a token ramp `font.size.10` through `font.size.130` (11px to 64px). Components only consume `40`/`50`/`60`.
- Line height tokens: `tight 1.1`, `snug 1.25`, `normal 1.5`, `relaxed 1.65`. Long-form docs copy uses `relaxed` at a 68ch measure.

## Color

- Dark themes are built on a blue-tinted ink ramp (`#04050a` to `#2b3140`), not pure gray. Pure `#000` is never used as a surface.
- Accent is used for action, focus, and selection only. Never as decoration, never as a large fill behind text.
- Every semantic text/surface pair in every theme must clear WCAG AA (4.5:1 body, 3:1 large). The docs `/accessibility` page computes this live, so violations are visible rather than claimed.

## Space and density

- 4px base grid. Space tokens `space.0` through `space.15` (0 to 128px).
- Two density modes driven by `data-fds-density`: `comfortable` (default) and `compact`. Density only changes control heights and insets, never font sizes below 13px, never focus ring size.

## Motion

- Duration tokens: `instant 0`, `fast 120ms`, `moderate 200ms`, `slow 320ms`, `slower 480ms`.
- Easing tokens: `standard`, `emphasized`, `entrance`, `exit`, `spring`.
- Rule: entrances use `entrance` easing at `moderate`, exits use `exit` at `fast`. Exits are always faster than entrances.
- Every transition and animation in the library is wrapped by `prefers-reduced-motion: reduce`, which collapses duration to `instant` while preserving opacity end-states. Nothing becomes unusable with motion off.

## Component design language

- **Hairlines over shadows.** Borders at `1px` from `border.subtle` define structure. Elevation is reserved for true overlays (modal, tooltip, toast, select popover).
- **Focus is never removed.** Every interactive element renders a 2px `border.focus` ring with a 2px offset via `:focus-visible`. There is no `outline: none` in the codebase without a replacement ring in the same rule.
- **Controls are 1px-bordered, low-radius, and flat.** No gradients, no inner glows.
- **States are token-driven:** rest, hover, active, focus, disabled, invalid, loading. Disabled uses `surface.disabled` + `text.disabled`, never opacity alone (opacity breaks contrast math).
- Components are authored in plain CSS with `--fds-*` custom properties and zero Tailwind dependency, so the library is portable into any consumer app. Tailwind is used only for the docs site chrome.

## Docs site layout

- Enterprise DS documentation conventions: fixed dense left nav (240px), sticky top bar with theme + density switchers, content column capped at 1120px with a right-hand "on this page" rail on component pages.
- Editorial touches that keep it from feeling like generated docs: oversized serif page titles, numbered section markers (`01`, `02`), hairline rules between sections, generous vertical rhythm.
- Component pages follow a fixed order: live demo, playground, anatomy, variants, API table, accessibility notes, do/don't. Consistency across pages is itself a design-system argument.
- Background is flat `surface.canvas`. No gradient meshes, no noise, no glows. The components are the subject and the chrome must not compete with them.

## Anti-patterns for this project

- No purple gradients, no glassmorphism, no decorative blur orbs.
- No agency marketing voice in docs copy. Audience is designers and engineers adopting the system.
- No em dashes in any copy.
- No third-party component primitives (Radix, shadcn, MUI). Everything hand-built, since the point is demonstrating the system can be authored, not configured.
