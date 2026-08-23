# Governance

Governance answers one question: when two teams disagree, what happens next? Written down it is a
five minute conversation. Undocumented it is a fork.

## Ownership

| Area | Owner | Decides |
| --- | --- | --- |
| `packages/tokens` | System maintainers plus design lead | Contract names, tier rules, theme values, platform targets |
| `packages/ui` | System maintainers | Component API, keyboard model, variant set |
| `packages/web` | System maintainers | Documentation structure, adoption content |
| `.github` | System maintainers | CI gates, release process, templates |

`CODEOWNERS` encodes this so review requests route automatically instead of depending on someone
knowing who to ask.

## Decision rights

**Consumer teams decide** which components to adopt and when, how to compose them, and what stays in
their own repo. Nobody is forced to migrate on the system's release schedule.

**Maintainers decide** whether something enters the system, what the API looks like, and when a
deprecation lands. The bar for entry is multi-team use, not preference.

**The design lead decides** semantic naming and theme values. Naming is the most expensive thing to
change later in a token system, so it gets one owner rather than a vote.

## Resolving a real disagreement

1. **Write the use case, not the solution.** Most disagreements dissolve here, because two teams
   describing the same problem usually reveals a missing semantic token rather than a missing
   component.
2. **Ship an escape hatch first.** The blocked team gets an unblocking path immediately: compose
   locally using tokens. Nobody waits on governance to ship product.
3. **Decide in the open, with a date.** The proposal thread carries the decision and the reason. A
   decision without a written reason gets relitigated every quarter.
4. **Fold the local version back in.** If the escape hatch is still in use two releases later, that is
   evidence, and the pattern gets promoted into the system.

## Proposal template for contract changes

A contract change means a new semantic token, a rename, a removal, a new theme, or a new platform
target. The proposal issue must answer:

- What surfaces need this, on which platforms
- Which existing token was tried and why it did not fit
- What every theme will supply for it
- What breaks, and what the migration looks like
- Whether the change is minor or major under [VERSIONING.md](./VERSIONING.md)

Two maintainer approvals, one of which must be the design lead for anything touching tier 2 naming.

## Deprecation policy

1. Nothing is removed in the release that deprecates it. Deprecation ships in a minor with the
   replacement named in the changelog.
2. A deprecated token or prop keeps working for at least one minor cycle and is marked deprecated in
   the docs, sourced from the token model.
3. Removal happens only in a major, with a migration note showing before and after.
4. Where the change is mechanical, the major ships a codemod. A migration that requires hand-editing
   three hundred call sites will not happen.

## Health metrics

Adoption is the only real measure of a design system, so it is tracked like a product metric.

| Metric | Definition | Why it matters |
| --- | --- | --- |
| Token coverage | Token-backed declarations over total declarations in consumer CSS | Measures whether the system is actually used or just installed |
| Component adoption | System component versus local reimplementation, per surface | Finds the components that are not good enough yet |
| Escape hatch count | Local overrides in flight | Each one is a backlog item, not a failure |
| Time to first review | Median hours on a contribution pull request | Predicts whether a team contributes a second time |

## Maintainer expectations

- Triage and label every issue within 2 business days
- First substantive review response within 3 business days
- Weekly release cadence, immediate for a fix
- Every hard-fail build rule has a name and an error message that says how to fix it. A gate that
  only says "invalid" is a bug in the gate.
