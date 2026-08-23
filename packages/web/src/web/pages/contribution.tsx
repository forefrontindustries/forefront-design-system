export default function Contribution() {
  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Operating the system</p>
        <h1 className="d-h1">Contribution model</h1>
        <p className="d-lead">
          A design system with no contribution path becomes a bottleneck, and one with no review becomes a junk drawer.
          This model splits changes into three tracks so the amount of process matches the amount of risk.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Three tracks</h2>
        <div className="d-grid">
          <div className="d-panel">
            <span className="d-tier-pill" data-tier="1">
              Track 1
            </span>
            <h3 className="d-h3">Fix</h3>
            <p style={{ margin: 0 }}>
              A bug, a missing aria attribute, a wrong token reference, a docs correction. Open a pull request directly.
              One maintainer approval, patch release.
            </p>
          </div>
          <div className="d-panel">
            <span className="d-tier-pill" data-tier="2">
              Track 2
            </span>
            <h3 className="d-h3">Extend</h3>
            <p style={{ margin: 0 }}>
              A new variant, a new size, a new token inside an existing group, a new story. Open an issue with the use
              case first so duplicates get caught, then a pull request. One maintainer plus one design approval, minor
              release.
            </p>
          </div>
          <div className="d-panel">
            <span className="d-tier-pill" data-tier="3">
              Track 3
            </span>
            <h3 className="d-h3">Change the contract</h3>
            <p style={{ margin: 0 }}>
              A new semantic token, a rename, a removal, a new theme, a new platform target. Requires a written
              proposal, two maintainer approvals, and a migration note. Minor or major depending on the break.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">The intake question</h2>
        <p className="d-body">
          Before anything gets built, one question decides where it goes: is this pattern used by more than one team on
          more than one surface? If yes, it belongs in the system. If no, it belongs in the product repo, and the
          system's job is to make sure the tokens it needs already exist.
        </p>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Request</th>
                <th scope="col">Lives in</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Third button variant for marketing pages</td>
                <td>System</td>
                <td>Buttons are shared surface area. A one off variant becomes four one off variants.</td>
              </tr>
              <tr>
                <td>Pricing table layout</td>
                <td>Product</td>
                <td>One surface, one team. It should consume Card and tokens, not become a component.</td>
              </tr>
              <tr>
                <td>Brand gradient for a campaign</td>
                <td>Product</td>
                <td>Campaign lifespan is shorter than a release cycle.</td>
              </tr>
              <tr>
                <td>Warning surface colour pair</td>
                <td>System</td>
                <td>It is a semantic state every theme needs to answer.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">What a pull request must carry</h2>
        <div className="d-list">
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              1
            </span>
            <p style={{ margin: 0 }}>
              A changeset. No changeset means no changelog entry, and CI blocks the merge for anything that touches a
              published package.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              2
            </span>
            <p style={{ margin: 0 }}>
              A story for every new state, because Storybook is where the a11y run happens.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              3
            </span>
            <p style={{ margin: 0 }}>
              Token only styling. The literal value lint scans component and docs CSS and fails on a raw colour, length,
              or duration.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              4
            </span>
            <p style={{ margin: 0 }}>
              A keyboard note: how to reach it, operate it, and leave it. Reviewers check this by hand.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              5
            </span>
            <p style={{ margin: 0 }}>
              Both themes screenshotted, or a reason why theme parity does not apply.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Local loop</h2>
        <div className="d-panel-flat">
          <pre>
            <code>{`bun install

bun run tokens:build       # regenerate every platform artifact
bun run tokens:validate     # tier, naming, alias, and theme completeness rules
bun run tokens:contrast     # WCAG 2.2 AA across every theme
bun run lint:tokens         # no literal values in component or docs CSS
bun run typecheck           # every package
bun run dev                 # docs site
cd packages/ui && bun run storybook`}</code>
          </pre>
        </div>
        <p className="d-body d-muted">
          CI runs exactly these commands in this order. There is no check that only exists on the server, which means a
          green local run is a green pull request.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Response commitments</h2>
        <div className="d-grid">
          <div className="d-stat">
            <span className="d-eyebrow">Triage</span>
            <strong className="d-display">2d</strong>
            <span className="d-muted">every issue labelled and routed</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Review</span>
            <strong className="d-display">3d</strong>
            <span className="d-muted">first substantive response on a pull request</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Release</span>
            <strong className="d-display">Weekly</strong>
            <span className="d-muted">or immediately for a fix</span>
          </div>
        </div>
        <p className="d-body">
          These numbers exist because adoption is a trust problem before it is a technical one. A team that waits two
          weeks for a review forks the component and never comes back.
        </p>
      </section>
    </>
  );
}
