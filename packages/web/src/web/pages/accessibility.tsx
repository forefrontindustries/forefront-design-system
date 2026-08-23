import { contrastPairs, manifest } from "../lib/ds";

const themeLabels: Record<string, string> = {
  "forefront-dark": "Forefront Dark",
  "forefront-light": "Forefront Light",
};

export default function Accessibility() {
  const themes = [...new Set(contrastPairs.map((pair) => pair.theme))];
  const failing = contrastPairs.filter((pair) => !pair.passes);

  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Foundations</p>
        <h1 className="d-h1">Accessibility as a build gate</h1>
        <p className="d-lead">
          Accessibility here is not a review step that someone remembers to do. Contrast is measured on every build,
          for every theme, and a failing pair stops the release with the ratio printed next to the token names.
        </p>
      </section>

      <section className="d-section">
        <div className="d-grid">
          <div className="d-stat">
            <span className="d-eyebrow">Pairs measured</span>
            <strong className="d-display">{contrastPairs.length}</strong>
            <span className="d-muted">across {themes.length} themes</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Failing</span>
            <strong className="d-display">{failing.length}</strong>
            <span className="d-muted">build blocks at one</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Standard</span>
            <strong className="d-display">AA</strong>
            <span className="d-muted">WCAG 2.2, 4.5:1 text and 3:1 non text</span>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">What the gate checks</h2>
        <p className="d-body">
          The checker walks the semantic contract for each theme, resolves every alias down to its literal, and
          measures the pairs that actually appear together in the component layer. It uses relative luminance from
          WCAG 2.2 rather than a perceptual approximation, so the numbers match what an auditor will measure.
        </p>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Theme</th>
                <th scope="col">Pair</th>
                <th scope="col">Used for</th>
                <th scope="col">Values</th>
                <th scope="col">Ratio</th>
                <th scope="col">Required</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {contrastPairs.map((pair) => (
                <tr key={`${pair.theme}-${pair.label}`}>
                  <td className="d-mono d-muted">{themeLabels[pair.theme] ?? pair.theme}</td>
                  <td className="d-token-name">{pair.label}</td>
                  <td>{pair.note}</td>
                  <td className="d-mono d-muted">
                    <span className="d-swatch" style={{ background: pair.fgValue }} aria-hidden="true" />
                    <span className="d-swatch" style={{ background: pair.bgValue }} aria-hidden="true" />
                    {pair.fgValue} on {pair.bgValue}
                  </td>
                  <td className="d-mono">{pair.ratio.toFixed(2)}:1</td>
                  <td className="d-mono d-muted">{pair.required.toFixed(1)}:1</td>
                  <td>
                    <span className="d-tier-pill" data-tier={pair.passes ? "1" : "3"}>
                      {pair.passes ? "pass" : "fail"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="d-body d-muted">
          Generated from <code>manifest.json</code> at build {new Date(manifest.builtAt as string).toISOString().slice(0, 10)}.
          This table cannot drift, because nobody types it.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">What the components guarantee</h2>
        <div className="d-grid-2">
          <div className="d-panel">
            <h3 className="d-h3">Focus is never invisible</h3>
            <p style={{ margin: 0 }}>
              Every interactive element uses the same two token focus ring, drawn with <code>outline</code> and an
              offset so it survives overflow clipping. Focus visibility is a token decision, not a per component one.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Labels are wired, not remembered</h3>
            <p style={{ margin: 0 }}>
              <code>Field</code> hands the control its id, <code>aria-describedby</code>, and{" "}
              <code>aria-invalid</code> through a render prop. A consumer cannot forget the wiring because they never
              write it.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Keyboard models follow APG</h3>
            <p style={{ margin: 0 }}>
              Tabs use roving tabindex with arrow, Home, and End. Modal traps focus, closes on Escape, locks scroll,
              and returns focus to the trigger. Tooltip opens on hover and focus and closes on Escape.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">One live region, correct politeness</h3>
            <p style={{ margin: 0 }}>
              Toasts share a single live region. Danger is assertive, everything else polite, and every toast has a
              real dismiss button so auto dismiss alone never becomes the only exit.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Motion respects the user</h3>
            <p style={{ margin: 0 }}>
              The token build emits a <code>prefers-reduced-motion</code> block that zeroes every duration token, so
              reduced motion is handled once at the token layer instead of in each component.
            </p>
          </div>
          <div className="d-panel">
            <h3 className="d-h3">Storybook fails on violations</h3>
            <p style={{ margin: 0 }}>
              The a11y addon runs in error mode, so an axe violation in any story is a red test in CI rather than a
              note somebody reads later.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Known limits</h2>
        <p className="d-body">
          Automated checks catch contrast, naming, wiring, and the obvious axe rules. They do not catch reading order
          in a complex layout, a label that is technically present but meaningless, or a focus order that is valid but
          confusing. Those are review items, and the pull request template asks for them explicitly.
        </p>
      </section>
    </>
  );
}
