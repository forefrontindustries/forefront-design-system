import { manifest } from "../lib/ds";

const TARGETS = [
  {
    file: "tokens.css",
    title: "Web, CSS custom properties",
    body: "Every tier flattened to --fds-* properties. Default theme on :root, each theme behind a data attribute, compact density behind a second one. Includes a real prefers-reduced-motion block that zeroes the duration primitives.",
    snippet: `.checkout-summary {
  background: var(--fds-color-surface-raised);
  border-radius: var(--fds-card-radius);
  padding: var(--fds-card-padding);
}`,
  },
  {
    file: "tokens.tailwind.css",
    title: "Tailwind v4 bridge",
    body: "A @theme inline block that maps the semantic contract into Tailwind's own namespace, so a Tailwind team writes bg-surface-raised and still gets the themed token. No duplicated palette, no second source of truth.",
    snippet: `@import "@forefront/tokens/tailwind";

<div class="bg-surface-raised text-text-primary rounded-card" />`,
  },
  {
    file: "tokens.ts",
    title: "Typed TypeScript model",
    body: "The full token graph with literal types for theme names, contract names, and tiers, plus a token() helper. Autocomplete for token names, and a rename becomes a type error instead of a silent visual bug.",
    snippet: `import { token, type ContractToken } from "@forefront/tokens";

const bg = token("color-surface-raised"); // "var(--fds-color-surface-raised)"`,
  },
  {
    file: "tokens.native.ts",
    title: "React Native",
    body: "Aliases fully resolved (React Native has no cascade and no var()), rem converted to unitless dp, colours as plain strings, and elevation mapped to the shadow fields RN actually reads. One export per theme, because RN themes are objects, not attributes.",
    snippet: `import { themes } from "@forefront/tokens/native";

const t = themes.forefrontDark;
<View style={{ backgroundColor: t.colorSurfaceRaised, padding: t.cardPadding }} />`,
  },
  {
    file: "tokens.figma.json",
    title: "Figma Variables",
    body: "A Variables payload with real VARIABLE_ALIAS references, one mode per theme, and the contract descriptions carried through as variable descriptions. Designers get the same intent text engineers read, in the panel where they pick the value.",
    snippet: `{
  "color-text-accent": {
    "type": "COLOR",
    "description": "Interactive text and links...",
    "valuesByMode": { "forefront-dark": { "type": "VARIABLE_ALIAS", "id": "color-blue-400" } }
  }
}`,
  },
  {
    file: "tokens.md3.css",
    title: "Material 3 bridge",
    body: "Maps 32 Material 3 colour roles, the shape scale, and the type scale onto Forefront tokens, so a Material surface (Compose or @material/web) inherits Forefront theming instead of forking the palette. This is how a system survives a team that already standardised on someone else's framework.",
    snippet: `@import "@forefront/tokens/md3";

md-filled-button { /* reads --md-sys-color-primary, which reads Forefront tokens */ }`,
  },
];

export default function Platforms() {
  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Foundations</p>
        <h1 className="d-h1">One source, six build targets</h1>
        <p className="d-lead">
          The nuance between web, mobile, and a component framework is not cosmetic. CSS has a cascade and React Native
          does not. Tailwind wants its own namespace. Figma wants alias ids. Material 3 wants role names. Each target
          gets an output shaped for how it actually resolves values, from the same token source.
        </p>
      </section>

      <section className="d-section">
        <div className="d-panel-flat">
          <pre>
            <code>{`packages/tokens/src/*.json
        |
        v
  bun run tokens:build   ->  validate rules  ->  WCAG contrast gate
        |
        +-- ${manifest.artifacts.join("\n        +-- ")}`}</code>
          </pre>
          <p className="d-body d-muted">
            The gates run before any file is written. A failing rule means the previous artifacts stay on disk untouched,
            so a broken build cannot half-publish a token set.
          </p>
        </div>
      </section>

      {TARGETS.map((target) => (
        <section className="d-section" key={target.file}>
          <div className="d-row">
            <h2 className="d-h2">{target.title}</h2>
            <span className="d-tier-pill">{target.file}</span>
          </div>
          <p className="d-body">{target.body}</p>
          <div className="d-panel-flat">
            <pre>
              <code>{target.snippet}</code>
            </pre>
          </div>
        </section>
      ))}

      <section className="d-section">
        <h2 className="d-h1">Keeping Figma and code in sync</h2>
        <p className="d-body">
          Code is the source of truth and Figma is a generated consumer, not the other way around. The build emits a
          Variables payload on every run, so the sync direction is unambiguous and a designer never has to ask which
          value is current.
        </p>
        <div className="d-flow">
          <div className="d-step">
            <span className="d-step-index">01</span>
            <h3 className="d-h3">Token change lands in main</h3>
            <p style={{ margin: 0 }}>Through a PR, with a changeset, past the rules and the contrast gate.</p>
          </div>
          <div className="d-step">
            <span className="d-step-index">02</span>
            <h3 className="d-h3">CI publishes the payload</h3>
            <p style={{ margin: 0 }}>
              tokens.figma.json is a build artifact on every release, versioned with the package.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">03</span>
            <h3 className="d-h3">Figma imports it</h3>
            <p style={{ margin: 0 }}>
              Modes map to themes one to one, aliases stay aliases, and descriptions carry the intent text across.
            </p>
          </div>
          <div className="d-step">
            <span className="d-step-index">04</span>
            <h3 className="d-h3">Drift is visible</h3>
            <p style={{ margin: 0 }}>
              A design that needs a value the contract does not have is a contribution with a name, not a local override
              nobody can find later.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
