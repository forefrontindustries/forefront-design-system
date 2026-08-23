# Contributing

A design system with no contribution path becomes a bottleneck. One with no review becomes a junk
drawer. This model splits changes into three tracks so the process matches the risk.

## Three tracks

| Track | Scope | Process | Release |
| --- | --- | --- | --- |
| **Fix** | Bug, missing aria attribute, wrong alias target, docs correction | Pull request directly, one maintainer approval | patch |
| **Extend** | New variant, new size, new token in an existing group, new story | Issue with the use case first, then a pull request. One maintainer plus one design approval | minor |
| **Change the contract** | New semantic token, rename, removal, new theme, new platform target | Written proposal, two maintainer approvals, migration note | minor or major |

## The intake question

Before anything gets built: **is this pattern used by more than one team on more than one surface?**

If yes, it belongs in the system. If no, it belongs in the product repo, and the system's job is to
make sure the tokens it needs already exist.

| Request | Lives in | Why |
| --- | --- | --- |
| Third button variant for marketing pages | System | Buttons are shared surface area. One off variants multiply. |
| Pricing table layout | Product | One surface, one team. Should consume Card and tokens. |
| Brand gradient for a campaign | Product | Campaign lifespan is shorter than a release cycle. |
| Warning surface colour pair | System | It is a semantic state every theme must answer. |

## Local loop

```bash
bun install

bun run tokens:build       # regenerate every platform artifact
bun run tokens:validate    # tier, naming, alias, and theme completeness rules
bun run tokens:contrast    # WCAG 2.2 AA across every theme
bun run lint:tokens        # no literal values in component or docs CSS
bun run typecheck          # every package
bun run dev                # docs site on 4200

cd packages/ui && bun run storybook   # 6006, a11y addon in error mode
```

CI runs exactly these commands in this order, so a green local run is a green pull request.

## Editing tokens

Token source lives in `packages/tokens/src`:

```
src/primitives.json          tier 1, literals only
src/semantic.json            tier 2, names plus $description, no values
src/themes/*.json            value tables over the contract
src/component.json           tier 3, geometry
src/density/compact.json     tier 3 overrides only
```

Rules that will fail your build, by name:

- `semantic-literal` — a semantic token carrying a value instead of an alias
- `theme-missing-contract-token` / `theme-extra-token` — a theme that is not exactly the contract
- `contract-token-undocumented` — a semantic token with no `$description` explaining its intent
- `alias-unresolved` / `alias-circular` / `alias-too-deep` — broken or indirect reference chains
- `density-outside-tier-3` / `density-changes-colour` — density touching anything but geometry
- `single-default-theme` — zero or multiple themes claiming `$default`

**Never edit anything in `packages/tokens/build`.** It is generated, and your change disappears on
the next build.

## Pull request requirements

1. **A changeset.** `bunx changeset`, pick the package and bump, write the line that will appear in
   the changelog. CI blocks a package change with no changeset.
2. **A story for every new state.** Storybook is where the axe run happens.
3. **Token-only styling.** `bun run lint:tokens` fails on a raw colour, length, or duration in
   `packages/ui/src` or `packages/web/src/web`.
4. **A keyboard note.** How to reach it, operate it, and leave it. Reviewers check this by hand.
5. **Both themes verified.** Screenshot both, or say why theme parity does not apply.

## Commit convention

Conventional Commits, scoped by package:

```
feat(tokens): add warning surface pair
fix(ui): restore focus ring on ghost button
docs(web): document the density restriction
chore(ci): run storybook build on pull requests
```

## Response commitments

- Triage and label within 2 business days
- First substantive review response within 3 business days
- Weekly release cadence, immediate for a fix

These exist because adoption is a trust problem before it is a technical one. A team that waits two
weeks for a review forks the component and does not come back.
