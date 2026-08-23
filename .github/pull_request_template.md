## What changed

<!-- One or two sentences. What a consuming team would want to know. -->

## Track

<!-- See CONTRIBUTING.md -->

- [ ] Fix (bug, missing aria attribute, wrong alias target, docs correction)
- [ ] Extend (new variant, size, token in an existing group, story)
- [ ] Contract change (new semantic token, rename, removal, new theme, new platform target)

## Version impact

<!-- See VERSIONING.md for the house interpretation -->

- [ ] patch
- [ ] minor
- [ ] major
- [ ] no published package touched

## Gates

- [ ] `bun run tokens:validate` passes
- [ ] `bun run tokens:build` run and generated artifacts committed
- [ ] `bun run tokens:contrast` passes for every theme
- [ ] `bun run lint:tokens` passes (no literal colour, length, or duration values)
- [ ] `bun run typecheck` passes
- [ ] Storybook builds and the a11y run is clean

## Changeset

- [ ] `bunx changeset` added, naming the package, the bump, and the changelog line
- [ ] For a token change, the entry lists which platform artifacts it touches

## Accessibility

Keyboard path (how to reach it, operate it, and leave it):

<!-- Automated checks do not cover this. Describe it. -->

- [ ] Focus is visible at every step
- [ ] Keyboard model matches the WAI-ARIA authoring practice for this pattern
- [ ] Accessible name is correct and not just present
- [ ] No focus trap without an escape

## Themes

- [ ] Verified in `forefront-dark` and `forefront-light`
- [ ] Verified in compact density
- [ ] Theme parity does not apply, because:

## Migration

<!-- Required for a contract change. Show before and after. Say whether a codemod ships with it. -->
