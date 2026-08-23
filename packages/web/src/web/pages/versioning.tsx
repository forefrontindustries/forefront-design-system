import { manifest } from "../lib/ds";

export default function Versioning() {
  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Operating the system</p>
        <h1 className="d-h1">Versioning and releases</h1>
        <p className="d-lead">
          Consuming teams do not read commits. They read version numbers and changelogs, and they decide whether to
          trust the system based on whether those two things told the truth last time.
        </p>
      </section>

      <section className="d-section">
        <div className="d-grid">
          <div className="d-stat">
            <span className="d-eyebrow">Current tokens version</span>
            <strong className="d-display">{manifest.version as string}</strong>
            <span className="d-muted">semver, published from main</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Tool</span>
            <strong className="d-display">Changesets</strong>
            <span className="d-muted">one changeset per user visible change</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Cadence</span>
            <strong className="d-display">Weekly</strong>
            <span className="d-muted">fixes ship immediately</span>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">What each bump means here</h2>
        <p className="d-body">
          Semver for a design system needs a house interpretation, because a colour change breaks nothing at compile
          time and everything visually. This is the interpretation this repo uses.
        </p>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Bump</th>
                <th scope="col">Means</th>
                <th scope="col">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="d-mono">major</td>
                <td>A consumer must change code to upgrade</td>
                <td>Semantic token removed or renamed, component prop removed, keyboard behaviour changed</td>
              </tr>
              <tr>
                <td className="d-mono">minor</td>
                <td>Additive, or visual change with no code change</td>
                <td>New component, new variant, new semantic token, theme value repointed, new platform artifact</td>
              </tr>
              <tr>
                <td className="d-mono">patch</td>
                <td>Fix with no intended visual or API change</td>
                <td>Missing aria attribute, wrong alias target, docs correction, focus ring not showing</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="d-body">
          One deliberate strictness: a rename is a major even when a deprecated alias is kept, because the alias is a
          courtesy and the contract change is the fact.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">The release pipeline</h2>
        <div className="d-flow">
          <div className="d-step">
            <span className="d-step-index">01</span>
            <h3 className="d-h3">Changeset on the branch</h3>
            <p style={{ margin: 0 }}>
              <code>bunx changeset</code> writes a markdown file naming the package, the bump, and the line that will
              appear in the changelog. CI fails a package change with no changeset.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">02</span>
            <h3 className="d-h3">Merge to main</h3>
            <p style={{ margin: 0 }}>
              Every gate runs: validate, build, contrast, literal value lint, typecheck, Storybook build with a11y in
              error mode.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">03</span>
            <h3 className="d-h3">Version pull request</h3>
            <p style={{ margin: 0 }}>
              The release workflow opens a pull request that bumps versions and rewrites{" "}
              <code>CHANGELOG.md</code>. Nobody hand edits a version number.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">04</span>
            <h3 className="d-h3">Merge to publish</h3>
            <p style={{ margin: 0 }}>
              Merging the version pull request tags the release, publishes the packages, and deploys the docs site and
              Storybook.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">What a good changelog entry looks like</h2>
        <div className="d-grid-2">
          <div className="d-panel">
            <span className="d-tier-pill" data-tier="1">
              good
            </span>
            <p style={{ margin: 0 }}>
              minor: add <code>color-surface-warning</code> and <code>color-text-warning</code>. Both themes supply
              values. Use these instead of composing warning states from primitives.
            </p>
          </div>
          <div className="d-panel">
            <span className="d-tier-pill" data-tier="3">
              bad
            </span>
            <p style={{ margin: 0 }}>
              minor: token updates. This tells a consuming team nothing, so they either read the diff or skip the
              upgrade. Usually they skip.
            </p>
          </div>
        </div>
        <p className="d-body">
          The rule for the entry: name what changed, name the replacement if something went away, and say what the
          reader should now do. Three sentences at most.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Multi platform release notes</h2>
        <p className="d-body">
          One token change fans out to seven artifacts, and consumers upgrade on different clocks. Web picks up CSS on
          the next deploy, React Native picks up resolved numbers on the next app build, Figma picks up variables when
          a designer imports. The changelog therefore states which artifacts a change touches, so a mobile engineer can
          tell at a glance whether a release affects them at all.
        </p>
      </section>
    </>
  );
}
