# Forefront Design System

A three-tier token pipeline, two themes generated from a single enforced contract, and twelve
accessible React components built without a primitives library.

**Live documentation: [design-system.jeremymaendel.com](https://design-system.jeremymaendel.com)**

This repository is a work sample. It is written to be read, so the reasoning is in here alongside the
code, and every claim it makes about itself is produced by a script rather than typed into a
paragraph.

| | |
| --- | --- |
| Tokens | 132 primitives, 66 semantic contract entries per theme, 67 component tokens, 2 densities, compiled to 331 CSS custom properties |
| Themes | `forefront-dark` (default), `forefront-light`, both built from the real Forefront Industries brand values |
| Components | 12 public, all hand-authored, 20 typed interfaces, 88 documented props |
| Contrast contract | 47 declared requirements plus 4 named exemptions, 94 checks per build, 0 tolerated failures |
| Build gates | 8 validation rules, all of them errors except one deliberate warning |
| Keyboard audit | 55 assertions driven in a real browser, 0 tolerated failures |
| Dependencies in the component library | React, and a class-name helper that is 18 lines of this repository |

---

## The short version of the argument

Most design systems fail in one of three ways. They wrap someone else's primitives and inherit a
behaviour model nobody on the team can debug. They call the middle token tier "semantic" while
letting each theme invent its own set of names. Or they publish an accessibility page whose numbers
were true on the day someone typed them.

This one is built to fail loudly instead:

1. **Nothing is wrapped.** No Radix, no shadcn, no MUI, no Headless UI. Every focus trap, roving
   tabindex, listbox, live region and controllable-state hook in here is authored. The parts teams
   outsource are exactly the parts that decide whether a keyboard user can finish the task.
2. **The semantic tier holds no values.** `semantic.json` is names and descriptions only. Each theme
   supplies every value. A theme that misses a token, invents one, hardcodes a literal instead of
   aliasing a primitive, or forms a circular alias fails the build.
3. **Contrast is a build gate.** Every pair a component actually renders is declared with the
   threshold it must clear and the WCAG rule that threshold comes from. The build measures all of
   them in every theme and exits non-zero on a violation. Any text, border or icon token the
   contract never measures is *also* a build error, so a colour cannot enter the system without
   someone stating where it is drawn.

Point 3 is the one that earned its place. Switching it on failed the repository, which is written up
in full below.

<details>
<summary>A note on the repository shape</summary>

The three packages that make up this work sample are `packages/tokens`, `packages/ui` and
`packages/web`. The `packages/mobile` and `packages/desktop` directories are untouched scaffolding from
the monorepo template this was started from. They are left in place rather than deleted so a clone
installs, type-checks and builds exactly as it does here, and no part of the design system depends on
them. If you are reviewing this, the interesting files are `packages/tokens/src`,
`packages/tokens/tooling/build-tokens.ts`, `packages/ui/src` and `tooling/keyboard-audit.py`.

</details>

---

## Architecture

```
packages/tokens        DTCG JSON source -> CSS custom properties, typed TS, Figma Variables payload
packages/ui            React component library, plain CSS, zero Tailwind, zero third-party primitives
packages/web           The documentation site, which is also the system's integration test
```

### The three tiers

**Tier 1, primitives (`src/primitives.json`).** Literal values and nothing else. Colour ramps, the
space scale, durations, easings, type sizes, z-index. No primitive references another primitive.

**Tier 2, the semantic contract (`src/semantic.json`).** Names and descriptions, no values. This file
is the interface between the system and a theme. `color.surface.raised` means "card and panel
background sitting above the canvas" in every theme, whatever it resolves to.

**Themes (`src/themes/*.json`).** Each theme supplies exactly one alias for every tier 2 name. A theme
is a complete implementation of the contract or it is a build failure. There is no fallback, because a
fallback is how a half-themed component reaches production looking almost right.

**Tier 3, component tokens (`src/component.json`).** Geometry that several components share:
`control.height`, `control.padding-inline`, `focus.ring-width`, `focus.ring-offset`, `modal.width`.
Theme-independent by design, which is what lets a Button and an Input line up on the same row without
a magic number in either file.

**Density (`src/density/compact.json`).** Density may only restate tier 3. It cannot touch colour, and
the build enforces that, because "compact" is a geometry decision and a density file that can change
colour is a second theme system hiding inside the first.

### Why the tiers are shaped that way

Colour has to travel primitive -> semantic -> component, because colour is the axis that varies per
theme. Geometry and motion do not vary per theme, so components consume space, duration and easing
straight from tier 1. Forcing everything through tier 2 for symmetry would double the token count and
teach everyone that half the indirection is ceremony.

The build reflects that asymmetry honestly: the unreferenced-primitive warning fires for colour only.
A colour ramp step nothing aliases is either dead or is being reached for directly by a component,
which breaks theming. An unreferenced duration is fine. A warning that fires on things that are fine
is a warning everyone learns to scroll past.

### What the build emits

```
build/tokens.css          CSS custom properties, layered, one block per theme and density
build/tokens.ts           Typed token model: resolved values, aliases, descriptions, theme metadata
build/tokens.figma.json   Figma Variables REST payload, collections and modes, aliases preserved
build/manifest.json       Counts, contract groups, contrast gate results, unreferenced primitives
```

All four are committed. A fresh clone renders without a build step, a reviewer can read the output on
GitHub instead of trusting a description of it, and no generated file carries a timestamp, so
rebuilding produces no diff. A build that dirties the working tree every time it runs is a build
people stop running.

### Theming and layering

Themes apply through `data-fds-theme`, density through `data-fds-density`. The default theme is also
emitted on `:root`, so a consumer that never sets an attribute still gets a coherent system. Each
theme declares its own `color-scheme`, which is what makes native scrollbars and form controls match.

Layer order is declared once, at the top of the emitted CSS:

```css
@layer fds.reset, fds.primitives, fds.semantic, fds.component, fds.components, fds.overrides;
```

Declaring the order up front means specificity arguments are settled before they start. A consumer
overriding a component writes into `fds.overrides` and wins without a single `!important`.

### Reduced motion

`prefers-reduced-motion` zeroes the duration primitives themselves, at the token layer. A component
cannot opt back in, because there is nothing left to animate with. End states are preserved: the
loading spinner becomes a static ring, the toast progress rail is not rendered, and nothing becomes
invisible or unreachable. Implementing this per component is how one transition survives the sweep.

---

## The contrast gate, and what it broke

The gate lives in `packages/tokens/src/contrast.json` and is read by the token build. The docs site
renders the same file, which is the point: an accessibility page holding its own copy of the pair list
is a page that drifts, and a drifted accessibility table is worse than none, because it reads as
verification while verifying nothing.

Two rules enforce it. The first resolves every declared pair in every theme, composites any
translucent value over its backdrop, and errors when the measured ratio is below the declared minimum.
The second is stricter and matters more: any token in a foreground group, meaning `text`, `border` or
`icon`, that the contract never measures is a build error. Without that second rule the contract
decays quietly, covering less of the system each month while continuing to pass.

Switching it on produced twelve errors. None of them were the tool being wrong.

**A decorative border and a control boundary cannot be the same token.** `border.default` and
`border.strong` were doing double duty: card edges and hairline separators on one hand, inputs,
checkboxes, radios, switch tracks and secondary buttons on the other. In the dark themes that put an
interactive boundary at **1.25:1**, a real SC 1.4.11 failure, and the checkbox border at 1.45:1. The
tempting fix was to brighten those tokens, which would have made every card edge in the system shout.
The correct fix was to admit the token was carrying two incompatible obligations: `border.control` and
`border.control-hover` were added as contrast-guaranteed tier 2 tokens, the six interactive components
were migrated onto them, and `border.default` stayed decorative and quiet. One token, one
accessibility obligation.

**In a dark theme, interaction states have to move away from the canvas.** The primary button's
pressed state was one ramp step darker than its base, which is correct in a light theme where the bold
fill is the dark element. In the dark themes the bold fill is the *light* element, so darkening moved
the fill toward the canvas and took the label with it: `text.on-accent` on `surface.accent-bold-active`
measured **3.64:1**. Both dark themes now step outward for hover and further outward for press.

**The destructive button in the dark themes was inverted, not brightened.** White on `red.500` at
hover measured **3.91:1**. Darkening the red to fix the label would have dropped the fill itself to
2.63:1 against the canvas, failing the boundary check instead. Both constraints are satisfiable only
by inverting the button the way the accent button is already inverted in dark mode: a light red fill
with a dark label. That is also what Material 3 does in dark themes, for the same reason.

**A house floor that nothing meets is theatre.** Disabled borders are held to a deliberately low
1.2:1, because a disabled control should recede. Three themes measured 1.13 to 1.19. The floor was
kept and the tokens were moved, because the alternative is a threshold written to match whatever the
code already did.

**One token could not name a surface it is drawn on.** `color.text.inverse` had a description, a value
in every theme, and no renderer anywhere in the library. It was deleted. A contract token that
cannot answer "on what background" is not a contract token, it is a colour someone liked.

Current state: **94 checks, 0 failures**. The tightest enforced pair is the disabled control boundary
at 1.34:1 in `forefront-dark` and 1.46:1 in `forefront-light` against that 1.2:1 floor. The tightest
3:1 boundary is `border.control` on the canvas at 3.51:1, which is the pair the gate caught below
threshold and forced a token change to fix. The `/accessibility` page recomputes all of it in the
browser from the same resolved values, using a second independent implementation of the WCAG
formula, and its numbers match the build's per theme. The two agreeing is the check.

---

## Brand values, and the typography failure that shaped them

Every colour and both typefaces in this system come from the production Forefront Industries site and
the `runable-forefront-v1.0` source. Nothing is invented. The palette was extracted by ranking hex
literals by usage frequency, which is why `blue.500` is `#5793CA` (747 occurrences), the hover step is
`#7BA8D1` (125), the ink ramp is `#0A0C14` / `#07090F` / `#0A0A12` / `#0D1019` rather than a neutral
grey, and the single secondary accent is `#FF8A3D` (14), carrying the warning role.

The type stack is Clash Display for the display role and Satoshi for body and all component text.
There are no serif faces anywhere in the system, because the brand does not use one. The mono role
resolves to a system stack and ships zero font bytes, because the brand owns no mono face and
inventing one would be a decision the brand never made.

**The fonts are self-hosted, and the production site is the reason.** Both faces were loaded from a
third-party CDN. Those requests started returning 404, the loader was eventually removed, and the
`font-family` declarations were left in place. The outcome was a site that named two brand faces in
its stylesheet and rendered `-apple-system` to every visitor, silently, with nothing failing loudly
enough for anyone to notice. A design system exists to make that failure impossible, so both faces
ship here as eight `woff2` files with the two first-paint weights preloaded, which also means the
system works offline and under a strict CSP.

The library still never injects an `@font-face` rule. A component library that fetches fonts is taking
a decision that belongs to the application, so the declarations live at the document level in the docs
site, which is the pattern a consumer should copy.

---

## Components

Button, Input, Select, Checkbox, RadioGroup, Switch, Badge, Card, Modal, Tooltip, Tabs, Toast.

Authored in plain CSS against `--fds-*` custom properties, with **zero Tailwind dependency**, so the
library drops into any consumer including one with no utility framework. Tailwind is used for the
chrome of the documentation site and nowhere else.

Two lint gates run over the library. `lint:tokens` walks all 14 stylesheets in the library and rejects
hex literals and tier-1 colour references, so a component cannot break theming by reaching past tier 2.
`typecheck` is plain `tsc --noEmit` with no escape hatches in the components.

Accessibility work worth naming:

- **The focus ring is centralized and not overridable.** Width, offset and colour come from `focus.*`
  in tier 3, so the ring is identical on a button, an input, a tab and a card. The library contains
  exactly two `outline: none` declarations, on the inner element of Input and on the link overlay of an
  interactive Card. Both exist because the ring is drawn on the wrapper instead, and in both cases the
  replacement ring is in the same file a few lines away. Grepping for the third one is a fair review
  step, which is why the count is stated rather than the intention.
- **Disabled is a token pair, never opacity.** Fading enabled colours to 40% produces a ratio nobody
  measured and a different one per theme. Every disabled state uses `surface.disabled` with
  `text.disabled`, and that pair is in the audit.
- **Live regions match severity.** Toast uses `role="alert"` with assertive politeness for danger and
  warning, `role="status"` with polite for everything else. Making every notification assertive is how
  users learn to ignore the region.
- **Nothing is announced that is not behaviourally true.** Modal sets `aria-modal` *and* traps focus.
  Select maintains `aria-activedescendant` *and* never moves DOM focus into the listbox. Announcing a
  relationship the behaviour does not honour is worse than announcing nothing, because it removes the
  user's ability to work around it.

Every component ships a `meta.ts` describing its lifecycle status, its keyboard contract and its
anatomy. The docs site reads those, so a component cannot quietly ship undocumented keyboard support.

---

## Prop tables are generated, not written

`packages/ui/tooling/extract-props.ts` walks the component declarations with the TypeScript compiler
API and emits `component-api.json`: prop names, resolved types, defaults, required flags and the JSDoc
on each. The docs site renders that, and the interactive playground derives its controls from the same
output, so adding a variant to a union makes it appear in both the table and the playground with no
documentation change at all.

Hand-written prop tables are wrong within two releases. The only durable version is the one that
cannot disagree with the types.

---

## Running it

```bash
bun install
bun run tokens:build     # tier 1/2/3 -> css, ts, figma payload, manifest. 8 validation rules.
bun run api:build        # component types -> component-api.json
bun run lint:tokens      # component CSS may not reference hex or tier-1 colour
bun run typecheck
bun run dev              # docs site on :4200
bun run build
bun run audit:keyboard   # 55 keyboard and ARIA assertions, needs the dev server up
```

To see the gate refuse something, point a theme's `color.border.control` at a primitive two ramp steps
closer to its surface and run `bun run tokens:build`. It should exit non-zero and name the pair, the
theme, the measured ratio, the required ratio and the rule.

---

## The keyboard audit, and what it found

`tooling/keyboard-audit.py` drives Chrome against the running docs site and makes 55 assertions about
behaviour rather than markup. `aria-modal="true"` is trivial to assert and proves nothing. Whether Tab
can escape an open dialog is the actual question, so the audit presses the keys and reads back
`document.activeElement`.

It found three bugs that were invisible to review and to every screenshot.

**The focus trap was not running at all.** `Portal` returned `null` until its own mount effect had
run, which put the dialog panel one commit later than the parent component's effects. Modal's
`useFocusTrap` therefore ran against a `null` ref, bailed on its own guard clause, and never re-ran
because its dependency array had not changed. The result: a dialog that opened correctly, looked
correct in every screenshot, had a valid `aria-modal` and `aria-labelledby`, locked background
scrolling, and left focus behind it with the entire page still tabbable. The fix creates the portal
host during render so the panel commits before the parent's effects, and the trap now waits for its
container across a bounded number of frames rather than silently doing nothing. The trap also pulls
focus back when it has escaped the container, instead of only handling the wrap at the first and last
node.

**The toast live region did not exist until the first toast.** Each toast declared `role="status"` and
`aria-live` on an element that was being inserted in the same tick, and the provider mounted no live
region at all beforehand. `role="alert"` is reliably announced on insertion; `role="status"` is not.
The viewport is now a persistent polite live region owned by `ToastProvider`, and only assertive toasts
declare their own semantics, so a polite toast is announced by a region that already existed.

**The dialog took focus and then quietly lost it.** With the trap engaged and Tab correctly wrapped,
the audit still found `document.activeElement` on `document.body` with the dialog open. Trapping Tab
only defends the one route that fires a key event, and focus has another: when the focused element is
removed from the DOM the browser resets focus to the body, with no keystroke for the handler to
intercept. From there the next Tab starts at the top of the page, outside the dialog. The trigger here
was React StrictMode remounting the freshly mounted `Portal`, so the host was appended, detached and
re-appended, and the detach dropped focus. The trap belongs to `Modal`, which was already mounted, so
its effect never re-ran to repair it. Detaching on unmount is correct and `Portal` still does it, so
the fix went into the trap: a `focusout` with a null `relatedTarget` rechecks on the next frame and
pulls focus back only if it genuinely ended up nowhere. That guard is worth having regardless of
StrictMode, because any dialog whose focused control unmounts on a state change hits the same bug in
production.

None of those is a subtle grey area. All three are the difference between a component that works and
one that only photographs well, and none would have been caught by a contrast matrix, a type checker
or a code review. The third is the one that makes the argument best: two of the three assertions
around it passed, `aria-modal` was correct, the focus ring was drawn on the right element for a
moment, and the bug was still there.

---

## Repository layout

```
packages/tokens/src/          primitives.json, semantic.json, component.json, contrast.json,
                              themes/*.json, density/compact.json
packages/tokens/tooling/      build-tokens.ts
packages/tokens/build/        generated and committed output
packages/ui/src/components/   one directory per component: tsx, css, meta.ts
packages/ui/src/lib/          focus trap, portal, presence, controllable state, compose-refs
packages/ui/tooling/          extract-props.ts, lint-css-tokens.ts
tooling/keyboard-audit.py     55 browser-driven keyboard and ARIA assertions
packages/web/src/web/         the documentation site
design.md                     design direction: themes, typography, motion, anti-patterns
CONTRIBUTING.md               proposal flow, lifecycle stages, deprecation policy, review checklist
```

`tooling/` rather than `scripts/`, and `build/` rather than `dist/`, because both of the conventional
names are gitignored in this template and generated output is committed here on purpose.

---

Built by Jeremy Maendel. Forefront Industries, Delray Beach FL.
