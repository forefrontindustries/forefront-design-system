export default function Governance() {
  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Operating the system</p>
        <h1 className="d-h1">Governance</h1>
        <p className="d-lead">
          Governance is the answer to one question: when two teams disagree, what happens next? Written down, it is a
          five minute conversation. Undocumented, it is a fork.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Ownership</h2>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">Owner</th>
                <th scope="col">Decides</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="d-token-name">packages/tokens</td>
                <td>System maintainers plus design lead</td>
                <td>Contract names, tier rules, theme values, platform targets</td>
              </tr>
              <tr>
                <td className="d-token-name">packages/ui</td>
                <td>System maintainers</td>
                <td>Component API, keyboard model, variant set</td>
              </tr>
              <tr>
                <td className="d-token-name">packages/web</td>
                <td>System maintainers</td>
                <td>Documentation structure and adoption content</td>
              </tr>
              <tr>
                <td className="d-token-name">.github</td>
                <td>System maintainers</td>
                <td>CI gates, release process, templates</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="d-body">
          <code>CODEOWNERS</code> encodes this, so review requests route automatically instead of depending on someone
          knowing who to ask.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Decision rights</h2>
        <div className="d-grid">
          <div className="d-panel">
            <h3 className="d-h3">Consumer teams decide</h3>
            <p style={{ margin: 0 }}>
              Which components to adopt and when, how to compose them, what lives in their own repo. Nobody is forced
              to migrate on a system release schedule.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Maintainers decide</h3>
            <p style={{ margin: 0 }}>
              Whether something enters the system, what the API looks like, and when a deprecation lands. The bar is
              multi team use, not preference.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Design lead decides</h3>
            <p style={{ margin: 0 }}>
              Semantic naming and theme values. Naming is the part of a token system that is expensive to change later,
              so it gets one owner rather than a vote.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">When there is a real disagreement</h2>
        <div className="d-flow">
          <div className="d-step">
            <span className="d-step-index">01</span>
            <h3 className="d-h3">Write the use case, not the solution</h3>
            <p style={{ margin: 0 }}>
              Most disagreements dissolve here, because two teams describing the same problem usually reveal a missing
              semantic token rather than a missing component.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">02</span>
            <h3 className="d-h3">Ship an escape hatch first</h3>
            <p style={{ margin: 0 }}>
              The blocked team gets an unblocking path immediately: compose locally with tokens. Nobody waits on
              governance to ship product.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">03</span>
            <h3 className="d-h3">Decide in the open, with a date</h3>
            <p style={{ margin: 0 }}>
              The proposal thread carries the decision and the reason. A decision without a written reason gets
              relitigated every quarter.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">04</span>
            <h3 className="d-h3">Fold the local version back in</h3>
            <p style={{ margin: 0 }}>
              If the escape hatch is still in use two releases later, that is evidence, and the pattern gets promoted.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Deprecation policy</h2>
        <div className="d-list">
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              1
            </span>
            <p style={{ margin: 0 }}>
              Nothing is removed in the release that deprecates it. Deprecation ships in a minor with a replacement
              named in the changelog.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              2
            </span>
            <p style={{ margin: 0 }}>
              A deprecated token or prop keeps working for at least one minor cycle, and the docs mark it with a
              Deprecated badge sourced from the token model.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              3
            </span>
            <p style={{ margin: 0 }}>
              Removal happens only in a major, and only with a migration note that shows the before and after.
            </p>
          </div>
          <div className="d-check">
            <span className="d-check-mark" aria-hidden="true">
              4
            </span>
            <p style={{ margin: 0 }}>
              Where the change is mechanical, the major ships a codemod. A migration that requires hand editing three
              hundred call sites will not happen.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Health metrics</h2>
        <p className="d-body">
          Adoption is the only real measure of a design system, so it gets tracked like a product metric rather than
          assumed.
        </p>
        <div className="d-grid">
          <div className="d-stat">
            <span className="d-eyebrow">Token coverage</span>
            <strong className="d-display">Ratio</strong>
            <span className="d-muted">token backed declarations over total in consumer CSS</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Component adoption</span>
            <strong className="d-display">Per surface</strong>
            <span className="d-muted">system component versus local reimplementation</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Escape hatches</span>
            <strong className="d-display">Count</strong>
            <span className="d-muted">each one is a backlog item, not a failure</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Time to review</span>
            <strong className="d-display">Median</strong>
            <span className="d-muted">the number that predicts whether teams contribute again</span>
          </div>
        </div>
      </section>
    </>
  );
}
