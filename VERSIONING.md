# Versioning and release management

Consuming teams do not read commits. They read version numbers and changelogs, and they decide
whether to trust the system based on whether those two things told the truth last time.

Tooling: [Changesets](https://github.com/changesets/changesets). Cadence: weekly, immediate for a
fix.

## House interpretation of semver

Semver needs a house interpretation for a design system, because a colour change breaks nothing at
compile time and everything visually.

| Bump | Means | Examples |
| --- | --- | --- |
| **major** | A consumer must change code to upgrade | Semantic token removed or renamed, component prop removed, keyboard behaviour changed, platform artifact shape changed |
| **minor** | Additive, or a visual change requiring no code change | New component, new variant, new semantic token, theme value repointed, new platform artifact, new theme |
| **patch** | Fix with no intended visual or API change | Missing aria attribute, wrong alias target, docs correction, focus ring not rendering |

One deliberate strictness: **a rename is a major even when a deprecated alias is kept.** The alias is
a courtesy; the contract change is the fact.

## Token change reference

| Change | Who feels it | Bump |
| --- | --- | --- |
| New primitive added | Nobody until a semantic token points at it | patch |
| New semantic token added | Every theme must supply it or the build fails | minor |
| Theme repoints an existing semantic token | Every surface using that token shifts visually | minor |
| Semantic token renamed or removed | Consumer code stops resolving | major |
| Component token value changed | Geometry of one component shifts | minor |
| Density override added | Compact surfaces only | minor |

## Release pipeline

1. **Changeset on the branch.** `bunx changeset` writes a markdown file naming the package, the bump,
   and the changelog line. CI fails a package change with no changeset.
2. **Merge to main.** Every gate runs: `tokens:validate`, `tokens:build`, `tokens:contrast`,
   `lint:tokens`, `typecheck`, web build, Storybook build with the a11y addon in error mode.
3. **Version pull request.** The release workflow opens a pull request that bumps versions and
   rewrites `CHANGELOG.md`. Nobody hand-edits a version number.
4. **Merge to release.** Merging the version pull request lands the version bumps and the changelog,
   and deploys the docs site and Storybook. It does not push to a registry: the packages are
   consumed straight from this repo today, so no release line has been chosen yet. When one is,
   the publish step goes back into `.github/workflows/release.yml` and this line changes with it.

## Writing a changelog entry

Good:

> **minor** add `color-surface-warning` and `color-text-warning`. Both themes supply values. Use
> these instead of composing warning states from primitives. Affects `tokens.css`,
> `tokens.tailwind.css`, `tokens.ts`, `tokens.native.ts`, `tokens.figma.json`.

Bad:

> **minor** token updates.

The rule: name what changed, name the replacement if something went away, say what the reader should
now do. Three sentences at most.

## Multi-platform release notes

One token change fans out to seven artifacts, and consumers upgrade on different clocks. Web picks up
CSS on the next deploy. React Native picks up resolved values on the next app build. Figma picks up
variables when a designer imports. So every entry states which artifacts it touches, and a mobile
engineer can tell at a glance whether a release affects them at all.

## Pre-release channels

Planned, not live, and gated behind the registry decision above:

- `next` for contract changes that need a consumer to try them before they are locked in
- `canary` cut from `main` on every merge, for teams that want to track the edge

Neither channel would skip a gate. A pre-release that fails contrast is still a failed build.
