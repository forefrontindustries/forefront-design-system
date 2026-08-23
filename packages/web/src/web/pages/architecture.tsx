import { manifest, tokens } from "../lib/ds";

const TIERS = [
  {
    tier: 1,
    name: "Primitives",
    file: "src/primitives.json",
    rule: "The only tier where a literal value is legal.",
    body: "Raw values with no opinion about use: the colour ramps, the spacing scale, radii, font sizes, weights, easings, durations, elevations, z-index. A primitive name says what it is, never where it goes. color-blue-500 is a primitive. color-text-accent is not.",
    forbidden: "Products never read tier 1. If a product needs color-ink-850, the system is missing a semantic token.",
  },
  {
    tier: 2,
    name: "Semantic contract",
    file: "src/semantic.json + src/themes/*.json",
    rule: "Has no value at all. On purpose.",
    body: "Each entry is a name, a type, and a written description of intent. The value lives in a theme file. That split is what turns theming from a convention into something a machine can verify: a theme is complete when it supplies all 66 contract tokens, and CI can say exactly which one is missing.",
    forbidden: "A literal in semantic.json fails the build with rule semantic-literal. An undocumented contract token fails with contract-token-undocumented.",
  },
  {
    tier: 3,
    name: "Component tokens",
    file: "src/component.json + src/density/compact.json",
    rule: "Geometry only. Never colour.",
    body: "Control heights, horizontal padding, gaps, component radii, switch and checkbox measurements, modal widths, toast sizing. These are the values density remaps, which is why density can never change a colour or break contrast.",
    forbidden: "A density override that touches a colour fails with density-changes-colour. An override outside tier 3 fails with density-outside-tier-3.",
  },
];

export default function Architecture() {
  const sample = "color-text-accent";
  const dark = (tokens.themes as Record<string, { aliases: Record<string, string> }>)["forefront-dark"]?.aliases;

  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Architecture</p>
        <h1 className="d-h1">Three tiers, one direction of reference</h1>
        <p className="d-lead">
          Every token in the system sits in exactly one tier, and reference only ever flows downward. That single
          constraint is what makes the rest of the machinery possible: theming, density, multi platform output, and a
          contrast gate that cannot be argued with.
        </p>
      </section>

      <section className="d-section">
        <div className="d-panel-flat">
          <pre>
            <code>{`component token        semantic contract token        primitive
control-radius   ->    (n/a, geometry)          ->    radius-md        0.375rem
color-text-accent      color-text-accent        ->    color-blue-400   #6aa9e9
                       (value supplied by theme)`}</code>
          </pre>
          <p className="d-body d-muted">
            A component reads the tier above it and stops. It never reaches two tiers down, and nothing ever reaches
            upward. Alias depth is capped and enforced, so a chain cannot quietly become six hops of indirection nobody
            can follow.
          </p>
        </div>
      </section>

      {TIERS.map((tier) => (
        <section className="d-section" key={tier.tier}>
          <div className="d-row">
            <span className="d-tier-pill" data-tier={tier.tier}>
              Tier {tier.tier}
            </span>
            <h2 className="d-h2">{tier.name}</h2>
          </div>
          <p className="d-body">{tier.body}</p>
          <div className="d-grid-2">
            <div className="d-panel-flat">
              <h3 className="d-h3">The rule</h3>
              <p style={{ margin: 0 }}>{tier.rule}</p>
            </div>
            <div className="d-panel-flat">
              <h3 className="d-h3">What CI rejects</h3>
              <p style={{ margin: 0 }}>{tier.forbidden}</p>
            </div>
          </div>
          <p className="d-mono d-muted">{tier.file}</p>
        </section>
      ))}

      <section className="d-section">
        <h2 className="d-h1">A worked example</h2>
        <p className="d-body">
          Take <code>{sample}</code>. The contract file says what it is for and nothing about how it looks. Each theme
          points it at a primitive. The component stylesheet only ever writes the contract name.
        </p>
        <div className="d-panel-flat">
          <pre>
            <code>{`// src/semantic.json  (tier 2, no value)
"${sample}": {
  "$type": "color",
  "$description": "${(tokens.contract as Record<string, { description?: string }>)[sample]?.description ?? ""}"
}

// src/themes/forefront-dark.json  (theme supplies the value)
"${sample}": "${dark?.[sample] ?? ""}"

// packages/ui/src/styles.css  (component reads the contract)
.fds-button[data-variant="ghost"] {
  color: var(--fds-${sample});
}`}</code>
          </pre>
        </div>
        <p className="d-body d-muted">
          Add a third theme tomorrow and the button does not change. Miss one contract token in that theme and the build
          fails before anyone sees it.
        </p>
      </section>

      <section className="d-section">
        <h2 className="d-h1">Rules the build enforces</h2>
        <p className="d-body">
          These are not lint suggestions. <code>bun run tokens:validate</code> exits non-zero and the build refuses to
          write artifacts, so a broken state cannot reach a consumer.
        </p>
        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Rule</th>
                <th scope="col">Severity</th>
                <th scope="col">What it catches</th>
              </tr>
            </thead>
            <tbody>
              {manifest.rules.enforced.map((rule) => (
                <tr key={rule}>
                  <td className="d-token-name">{rule}</td>
                  <td>error</td>
                  <td>{RULE_NOTES[rule] ?? "Structural violation of the tier model."}</td>
                </tr>
              ))}
              {manifest.rules.warnings.map((rule) => (
                <tr key={rule}>
                  <td className="d-token-name">{rule}</td>
                  <td>warning</td>
                  <td>{RULE_NOTES[rule] ?? "Hygiene signal, does not block a release."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

const RULE_NOTES: Record<string, string> = {
  "theme-missing-contract-token": "A theme does not supply every contract token. Names the exact token and theme.",
  "theme-extra-token": "A theme supplies a token that is not in the contract, which means a private value nobody documented.",
  "semantic-literal": "A tier 2 token carries a literal value instead of leaving it to the themes.",
  "contract-token-undocumented": "A contract token has no written intent, so consumers would have to guess from its name.",
  "alias-unresolved": "An alias points at a token that does not exist, usually a rename that missed a reference.",
  "alias-circular": "Two aliases point at each other. Caught before it becomes an infinite loop at build time.",
  "alias-too-deep": "A reference chain exceeds the depth cap, which is how token systems become unreadable.",
  "density-outside-tier-3": "A density override touches a primitive or a semantic token instead of component geometry.",
  "density-changes-colour": "A density override changes a colour, which would let a density mode break contrast.",
  "single-default-theme": "Zero or two themes claim to be the default, leaving :root ambiguous.",
  "unreferenced-colour-primitive": "A colour primitive no theme points at. Dead weight, but harmless to ship.",
};
