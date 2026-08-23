import { densityOverrides, manifest, tokens } from "../lib/ds";

export default function Theming() {
  const contract = Object.keys(tokens.contract);
  const themeEntries = Object.entries(
    tokens.themes as Record<string, { label: string; isDefault?: boolean; aliases: Record<string, string> }>,
  );

  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Foundations</p>
        <h1 className="d-h1">Theming and density</h1>
        <p className="d-lead">
          Theming is one DOM write and no JavaScript in the render path. Density is a second attribute that only ever
          touches component geometry, so it can never change a colour or break a contrast ratio.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">How a consumer switches</h2>
        <div className="d-panel-flat">
          <pre>
            <code>{`import "@forefront/tokens/css";

document.documentElement.setAttribute("data-fds-theme", "forefront-light");
document.documentElement.setAttribute("data-fds-density", "compact");`}</code>
          </pre>
        </div>
        <p className="d-body">
          The default theme is also emitted on <code>:root</code>, so an app that never sets the attribute still gets a
          complete, valid theme. That is the difference between a system with a default and a system that breaks when
          someone forgets a wrapper.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Theme completeness</h2>
        <p className="d-body">
          A theme is a value table over the semantic contract, nothing more. It cannot invent a token, and it cannot
          skip one. Both are build errors with the token name in the message.
        </p>
        <div className="d-grid-2">
          {themeEntries.map(([name, theme]) => {
            const coverage = (manifest.coverage as Record<string, { supplied: number; required: number }>)[name];
            return (
              <div className="d-panel" key={name}>
                <div className="d-row">
                  <h3 className="d-h3">{theme.label}</h3>
                  {theme.isDefault ? <span className="d-tier-pill">default</span> : null}
                </div>
                <p className="d-mono d-muted">data-fds-theme=&quot;{name}&quot;</p>
                <p style={{ margin: 0 }}>
                  Supplies {coverage?.supplied ?? 0} of {coverage?.required ?? contract.length} contract tokens.
                </p>
                <div className="d-row">
                  {["color-surface-canvas", "color-surface-raised", "color-text-primary", "color-text-accent", "color-border-default"].map(
                    (token) => (
                      <span
                        key={token}
                        className="d-swatch"
                        title={`${token} -> ${theme.aliases[token] ?? ""}`}
                        style={{ background: `var(--fds-${token})` }}
                      />
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Adding a theme</h2>
        <div className="d-flow">
          <div className="d-step">
            <span className="d-step-index">01</span>
            <h3 className="d-h3">Copy the contract</h3>
            <p style={{ margin: 0 }}>
              Start from an existing theme file. All {contract.length} names must appear. Values are alias references
              into tier 1, never literals.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">02</span>
            <h3 className="d-h3">Run the build</h3>
            <p style={{ margin: 0 }}>
              <code>bun run tokens:build</code> tells you every missing or extra token by name before anything is
              emitted.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">03</span>
            <h3 className="d-h3">Clear the contrast gate</h3>
            <p style={{ margin: 0 }}>
              The new theme is measured against WCAG 2.2 AA automatically. A failing pair blocks the release with the
              measured ratio.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">04</span>
            <h3 className="d-h3">Ship a changeset</h3>
            <p style={{ margin: 0 }}>
              A new theme is a minor release. The changeset is what writes it into the changelog.
            </p>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h2">Density</h2>
        <p className="d-body">
          Compact exists for data-dense surfaces: tables, admin panels, anything where vertical rhythm matters more
          than comfort. It overrides {densityOverrides[0]?.overrides ? Object.keys(densityOverrides[0].overrides).length : 0}{" "}
          tier 3 tokens and touches nothing else. That restriction is enforced, not encouraged.
        </p>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Component token</th>
                <th scope="col">Comfortable</th>
                <th scope="col">Compact</th>
              </tr>
            </thead>
            <tbody>
              {densityOverrides.flatMap((density) =>
                Object.entries(density.overrides).map(([name, value]) => (
                  <tr key={`${density.name}-${name}`}>
                    <td className="d-token-name">{name}</td>
                    <td className="d-mono">
                      {(tokens.component as Record<string, { value: string }>)[name]?.value ?? ""}
                    </td>
                    <td className="d-mono">{value}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
        <p className="d-body d-muted">
          Toggle compact density in the top bar of this site and watch the controls change while every colour, contrast
          ratio, and focus ring stays exactly where it was.
        </p>
      </section>
    </>
  );
}
