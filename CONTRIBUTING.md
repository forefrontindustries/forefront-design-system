# Contributing

This document is the governance model, not a setup guide. Setup is three commands and lives in the
[README](./README.md).

The short version: **the system says no more often than it says yes.** A design system's value comes
from the number of decisions it removes, and every component added is a decision handed back to every
consumer. A proposal that gets declined with a written reason is a successful proposal, because the
reason becomes precedent and the next person does not have to relitigate it.

---

## Lifecycle stages

The status pill next to a component's name in the docs navigation is a contract with consumers. It
states how much risk they are taking on, so it has to be accurate even when accuracy is unflattering.

| Status | What it promises | Breaking changes |
| --- | --- | --- |
| `alpha` | The API is a proposal. Use it in one place, expect to rewrite. | Any release, no notice. |
| `beta` | Behaviour and accessibility are done. The API is still moving. | Minor release, noted in the changelog. |
| `stable` | The API is settled. Additive changes only. | A deprecation release first, then removal. |
| `deprecated` | A replacement exists and is named. | Removed on a stated date, not "eventually". |

Current state: **10 stable, 2 beta, 0 alpha, 0 deprecated.**

Select is beta because option groups and multi-select will both change its props. Tooltip is beta
because its positioning is flip-only, which is enough for the current surface area and not enough for
nested overlays. Marking them stable so the table looks tidier would be the first small lie the system
tells, and a status field nobody trusts is worse than no status field.

### Deprecation policy

A deprecation has three required parts, and a pull request missing any of them is not a deprecation, it
is an abandonment:

1. **The replacement, named.** "Use Card with the interactive prop", not "use something else".
2. **A codemod or a written migration**, whichever is cheaper for the consumer rather than for us.
3. **A removal date.** Not a release number that may never ship, and not "eventually". A deprecation
   without an end date is a permanent maintenance cost that everyone has agreed to stop discussing.

The deprecation ships in one release. Removal happens in a later one. Both appear in the changelog.

---

## Getting a change in

The order matters. The proposal is cheap and the implementation is not, so the expensive part happens
last.

### 1. Open a proposal issue

State the problem, the surfaces it appears in, what you tried with the existing components, and why
composition did not work. Include screenshots of the real product rather than a mockup of the component
you would like to exist. A proposal that describes a solution without describing the problem cannot be
evaluated, only agreed or disagreed with.

### 2. Design review

One maintainer plus one designer. The outcome is one of three things:

- **Compose from existing.** Most proposals end here, and that is the system working.
- **Extend an existing component.** A new variant or prop on something that already exists.
- **Accept as new.** A new component, entering at `alpha`.

A new variant needs **two unrelated consumers**. One consumer is a one-off and belongs in that
product's code. Two is a pattern. Skipping this is how a system ends up with nine button variants and
no one able to say which to use, which costs more than the duplication it was avoiding.

### 3. Tokens before components

If the change needs a value the contract does not expose, that is a **separate pull request**. Tokens
land first, get reviewed on their own merits, and the component change stays readable afterwards.

A new `text`, `border` or `icon` token also needs an entry in
`packages/tokens/src/contrast.json`, either a measured requirement naming the surface it is drawn on, or
a named exemption stating why it carries no threshold. The build rejects the token otherwise. This is
deliberately not a review comment: reviewers miss things, and a contrast contract that only covers what
someone remembered to check is a contract that gets smaller every month.

Expect to be asked which tier the value belongs in:

- A literal value, and only a literal value, goes in **tier 1**.
- A name whose value depends on the theme goes in **tier 2**, in `semantic.json`, with a description
  and no value. Then every theme supplies it. Every one of them, or the build fails.
- Shared geometry that does not vary by theme goes in **tier 3**.
- A density override may only restate a tier 3 token. If your change needs density to alter a colour,
  the change is wrong.

### 4. Implementation

```
packages/ui/src/components/<name>/
  <name>.tsx        forwardRef, documented props, no third-party primitives
  <name>.css        @layer fds.components, tier 2 and tier 3 tokens only
  <name>.meta.ts    status, anatomy, keyboard contract, accessibility notes, guidance
```

Register the export in `src/index.ts` and the meta in `src/meta.ts`.

The meta file is not documentation garnish. The docs site reads it, so a component cannot ship
undocumented keyboard support, and the keyboard table on the component page is a promise the reviewer
can test against.

### 5. Docs

Add a demo to `packages/web/src/web/demos/` and register it in `demos/index.tsx`. The prop table
generates itself from the TypeScript declarations, and the playground controls generate themselves from
the same output, so adding a variant to a union needs no documentation change at all.

Each demo should exist to show a decision rather than to fill the page. Three demos that each make a
point beat eight that show the same component at different sizes.

### 6. Checks

```bash
bun run tokens:build     # token pipeline, eight validation rules, contrast gate
bun run api:build        # regenerate the component API from the types
bun run lint             # conventions, CSS token contract, oxlint
bun run typecheck        # every package
bun run build            # production build
bun run audit:keyboard   # 55 keyboard and ARIA assertions, needs the dev server up
```

All six must pass. `tokens:build` and `api:build` write committed files, so run them before pushing
rather than after review asks you to.

`audit:keyboard` is the one people skip, and it is the one that catches the failures nothing else can
see. It found a focus trap that never engaged and a toast live region that did not exist yet, both of
which had passed review and looked correct in every screenshot. If your component adds a keyboard
interaction, add assertions for it to `tooling/keyboard-audit.py` in the same pull request.

---

## Review checklist

This is what a reviewer reads, in order. Anything unchecked is a request for changes rather than a
comment, because a checklist whose items are negotiable is a document that gets skimmed.

**Behaviour**

- [ ] Every interactive element is reachable by Tab, in visual order.
- [ ] Focus is visible on every stop, using the shared ring rather than a local one.
- [ ] The arrow key model matches the ARIA pattern for the role.
- [ ] Escape dismisses anything that overlays content.
- [ ] Focus returns to the trigger when an overlay closes.
- [ ] Controlled and uncontrolled usage both work.
- [ ] Nothing animates a layout property.
- [ ] Every ARIA relationship announced is also behaviourally true.

**Contract**

- [ ] No hex literals or tier 1 colour references in the CSS. The lint enforces it, so this line is
      about the cases the lint cannot see, like a colour smuggled in through an inline style.
- [ ] No new tier 3 token unless density or system-wide sizing genuinely needs it.
- [ ] Checked in both themes and both densities, not just the default.
- [ ] Disabled state uses `surface.disabled` with `text.disabled`, never opacity.
- [ ] Every prop has a JSDoc line and a documented default.
- [ ] The meta file has anatomy, keyboard, accessibility notes and guidance.
- [ ] No third-party primitive introduced.

**Accessibility**

Accessibility is not a review comment. It is a merge condition. A component that ships with a keyboard
gap does not get fixed later, it gets worked around by every consumer, and each workaround is a
different behaviour for the same control.

- [ ] Walked with the keyboard only, mouse physically out of reach.
- [ ] Walked with a screen reader, and what was announced matches what the meta file claims.
- [ ] Reduced motion on: nothing moves, nothing disappears, every end state is still reachable.
- [ ] Any new colour pair is in the contrast contract and the build passes.

---

## Principles behind the process

**The system says no more often than it says yes.** Every component added is a decision handed back to
every consumer. Declining with a written reason creates precedent, and precedent is what keeps the
system small enough to learn.

**A variant needs two unrelated consumers.** One is a one-off. Two is a pattern. This rule exists
because the alternative is a nine-variant button and no way to choose between them.

**Tokens are reviewed separately from components.** A pull request that adds a colour and a component
at once gets reviewed as a component, and the colour goes in unexamined. Colour is the thing four
themes have to agree on, so it gets its own conversation.

**Accessibility is enforced by machines wherever a machine can do it.** The contrast contract, the CSS
token lint and the generated prop tables all exist because a human reviewer at 5pm is not a control.
Every rule that can become a build failure should be one, and the rules that cannot are the ones the
checklist above is for.

**Deprecation has a stated end.** A deprecation without a removal date is a permanent cost that
everybody has agreed to stop talking about.

---

## Repository layout

```
packages/tokens/src/          primitives.json, semantic.json, component.json, contrast.json,
                              themes/*.json, density/compact.json   <- the only hand-edited tokens
packages/tokens/tooling/      build-tokens.ts
packages/tokens/build/        generated and committed: css, ts, figma payload, manifest
packages/ui/src/lib/          focus trap, portal, presence, controllable state, compose-refs, cx
packages/ui/src/components/   one directory per component: tsx + css + meta.ts
packages/ui/tooling/          extract-props.ts, lint-css-tokens.ts
packages/web/src/web/         the documentation site, which consumes the packages as a product would
```

Generated files are committed on purpose. A fresh clone renders the docs with no build step, a reviewer
can read the output on GitHub instead of trusting a description of it, and no generated file carries a
timestamp, so rebuilding never produces a diff.

Note the directory names: `tooling/` rather than `scripts/`, and `build/` rather than `dist/`. Both of
the conventional names are gitignored in this template, and generated output has to be committed here.
