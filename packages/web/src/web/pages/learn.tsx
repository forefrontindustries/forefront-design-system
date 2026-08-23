export default function Learn() {
  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Start here</p>
        <h1 className="d-h1">The learn track</h1>
        <p className="d-lead">
          This page is the teaching layer of the repo. It explains why the token tiers exist, how a change actually
          travels from a branch to a published version, and what a maintainer is expected to check. Read it once, then
          use it as a reference while working.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Lesson 1: why tokens have tiers</h2>
        <p className="d-body">
          A flat list of variables looks fine at twenty tokens and collapses at three hundred. The tier model exists
          so every value has exactly one job and one owner.
        </p>
        <div className="d-flow">
          <div className="d-step">
            <span className="d-step-index">T1</span>
            <h3 className="d-h3">Primitives are the palette</h3>
            <p style={{ margin: 0 }}>
              Raw literals with no opinion: <code>color-blue-400</code>, <code>space-4</code>,{" "}
              <code>duration-fast</code>. A primitive never references anything. Nothing in the product should consume
              one directly.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">T2</span>
            <h3 className="d-h3">Semantic tokens are the contract</h3>
            <p style={{ margin: 0 }}>
              Names describe intent: <code>color-text-primary</code>, <code>color-surface-raised</code>. They carry no
              value of their own. A theme supplies the values, which is why a theme can never be half finished.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">T3</span>
            <h3 className="d-h3">Component tokens are geometry</h3>
            <p style={{ margin: 0 }}>
              <code>button-height-md</code>, <code>card-padding</code>. They reference tier 1 or tier 2 and are the
              only tier density is allowed to touch. That restriction is what keeps compact mode from breaking
              contrast.
            </p>
          </div>
        </div>
        <p className="d-body">
          The single rule that makes the model hold: references only ever point up one tier. Component to semantic or
          primitive, semantic to primitive, primitive to nothing. The validator rejects anything else, so the
          architecture is enforced by the build rather than by memory.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Lesson 2: reading a token change</h2>
        <p className="d-body">
          Three questions tell you the blast radius of any token edit, and they map exactly to the version bump.
        </p>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Change</th>
                <th scope="col">Who feels it</th>
                <th scope="col">Bump</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New primitive added</td>
                <td>Nobody until a semantic token points at it</td>
                <td className="d-mono">patch</td>
              </tr>
              <tr>
                <td>New semantic token added</td>
                <td>Every theme must supply it or the build fails</td>
                <td className="d-mono">minor</td>
              </tr>
              <tr>
                <td>Theme repoints an existing semantic token</td>
                <td>Every surface using that token shifts visually</td>
                <td className="d-mono">minor</td>
              </tr>
              <tr>
                <td>Semantic token renamed or removed</td>
                <td>Consumer code stops resolving</td>
                <td className="d-mono">major</td>
              </tr>
              <tr>
                <td>Component token value changed</td>
                <td>Geometry of one component shifts</td>
                <td className="d-mono">minor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Lesson 3: the git workflow, concretely</h2>
        <div className="d-panel-flat">
          <pre>
            <code>{`# 1. branch from main, named for the change
git switch -c tokens/add-warning-surface

# 2. edit the token source, never the build output
#    packages/tokens/src/semantic.json
#    packages/tokens/src/themes/*.json

# 3. run the gates locally, in this order
bun run tokens:validate    # structure, tiers, naming, aliases
bun run tokens:build       # emits all 7 platform artifacts
bun run tokens:contrast    # WCAG check across every theme
bun run lint:tokens        # no literal values in component CSS

# 4. describe the change for the changelog
bunx changeset             # pick the package, pick the bump, write the line

# 5. commit, push, open the pull request
git add -A && git commit -m "feat(tokens): add warning surface pair"
git push -u origin tokens/add-warning-surface`}</code>
          </pre>
        </div>
        <p className="d-body">
          Two habits matter more than the commands. Never edit files in <code>packages/tokens/build</code>, because
          they are regenerated and your change disappears. Never skip the changeset, because the changelog is the part
          a consuming team actually reads.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Lesson 4: what a reviewer looks for</h2>
        <div className="d-grid-2">
          <div className="d-panel">
            <h3 className="d-h3">Is the name about intent</h3>
            <p style={{ margin: 0 }}>
              <code>color-text-danger</code> survives a rebrand. <code>color-text-red</code> does not. If the name
              describes the pixel instead of the purpose, it belongs in tier 1.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Does every theme still work</h3>
            <p style={{ margin: 0 }}>
              A new semantic token is a change to every theme at once. The build says so, but the reviewer should
              still look at whether the light theme value was chosen or just copied.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Is the component reaching too far</h3>
            <p style={{ margin: 0 }}>
              A component consuming a primitive colour directly is the first crack in a design system. It means the
              semantic layer is missing a name.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Is the keyboard path complete</h3>
            <p style={{ margin: 0 }}>
              Reach it with Tab, operate it with the keys the APG specifies, see focus at every step, and leave
              without a trap. Automated checks do not cover this.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Lesson 5: keeping Figma and code honest</h2>
        <p className="d-body">
          Code is the source of truth in this system, so the sync direction is one way. The token build emits{" "}
          <code>tokens.figma.json</code> with real <code>VARIABLE_ALIAS</code> references, which means the semantic
          layer imports into Figma as variables that point at primitives rather than as flattened hex values. A
          designer changing a theme in Figma sees the same indirection a developer sees in CSS.
        </p>
        <p className="d-body">
          The practical rule: a token is proposed in Figma and merged in the repo. The import is regenerated from the
          release, never hand assembled, so a variable that exists in Figma but not in the contract is a bug with an
          obvious cause.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Lesson 6: using AI without laundering mistakes</h2>
        <p className="d-body">
          AI is useful in a design system exactly where the work is mechanical and verifiable: drafting a component
          from an existing one, writing the first pass of a migration codemod, summarising a diff into a changeset
          line, generating story permutations, or scanning a codebase for hardcoded values that should be tokens.
        </p>
        <p className="d-body">
          It is not useful for deciding what a token means. That is the part of the job that requires knowing the
          product. The safeguard is the same either way: the machine checks stay authoritative, so an AI written
          change still has to pass validation, contrast, the literal value lint, and the a11y run before it can ship.
        </p>
      </section>
    </>
  );
}
