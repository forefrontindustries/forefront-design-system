import { Link } from "wouter";
import { Badge, Button, Card } from "@forefront/ui";
import { manifest } from "../lib/ds";

export default function Overview() {
  const counts = manifest.counts;

  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Forefront Design System</p>
        <h1 className="d-display">
          One source of truth for tokens, components, and the rules that keep them honest.
        </h1>
        <p className="d-lead">
          Three token tiers, two themes, five build targets, and a set of rules CI refuses to let anyone break. This
          site is generated from the same token model the components consume, so nothing on it can drift from the code.
        </p>
        <div className="d-row">
          <Link href="/architecture">
            <Button size="lg">Read the architecture</Button>
          </Link>
          <Link href="/tokens">
            <Button size="lg" variant="secondary">
              Open the token explorer
            </Button>
          </Link>
          <a href="/storybook/" className="fds-button" data-variant="ghost" data-size="lg">
            Storybook
          </a>
        </div>
      </section>

      <section className="d-grid">
        <div className="d-panel">
          <span className="d-stat">{counts.primitives}</span>
          <h2 className="d-h3">Primitives</h2>
          <p className="d-body d-muted">
            Tier 1. The only place a literal value exists in the entire system. Nothing in a product reads these
            directly.
          </p>
        </div>
        <div className="d-panel">
          <span className="d-stat">{counts.contract}</span>
          <h2 className="d-h3">Semantic contract tokens</h2>
          <p className="d-body d-muted">
            Tier 2. Names with intent and no value. Themes supply the values, which is what makes theme completeness a
            build-time check instead of a design review.
          </p>
        </div>
        <div className="d-panel">
          <span className="d-stat">{counts.component}</span>
          <h2 className="d-h3">Component tokens</h2>
          <p className="d-body d-muted">
            Tier 3. Control geometry: heights, padding, radii, gaps. Density remaps this tier and only this tier.
          </p>
        </div>
        <div className="d-panel">
          <span className="d-stat">{counts.cssCustomProperties}</span>
          <h2 className="d-h3">Emitted custom properties</h2>
          <p className="d-body d-muted">
            Compiled from {counts.primitives + counts.contract + counts.component} source tokens into CSS, TypeScript,
            Tailwind, React Native, Figma Variables, and Material 3 roles.
          </p>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h1">What this repo is trying to prove</h2>
        <p className="d-body">
          A design system is not a component library with a nice website. It is a contract between design and
          engineering, plus the machinery that keeps both sides from quietly breaking it. Every claim below is
          enforced somewhere in the repo, not asserted here.
        </p>
        <div className="d-grid-2">
          <Card title="The contract is checkable">
            <p style={{ margin: 0 }}>
              A theme that forgets a single semantic token fails CI with the token name. A semantic token with a literal
              value fails CI. An undocumented contract token fails CI.
            </p>
          </Card>
          <Card title="Accessibility is a gate, not a review comment">
            <p style={{ margin: 0 }}>
              {manifest.accessibility?.checked ?? 0} foreground and background pairs are measured against WCAG 2.2 AA on
              every build, in every theme. A new theme physically cannot ship an unreadable state.
            </p>
          </Card>
          <Card title="Multi platform is a build target, not a port">
            <p style={{ margin: 0 }}>
              Web CSS, a Tailwind bridge, a typed TypeScript model, unitless React Native dp values, a Figma Variables
              payload with real alias references, and a Material 3 role bridge. One source, six outputs.
            </p>
          </Card>
          <Card title="Contribution has a shape">
            <p style={{ margin: 0 }}>
              A written contribution model, a governance model with a decision record, semantic versioning through
              Changesets, and a public roadmap split into net-new, migrations, and deprecations.
            </p>
          </Card>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h1">Start where you are</h2>
        <div className="d-flow">
          <div className="d-step">
            <span className="d-step-index">01</span>
            <h3 className="d-h3">Designer</h3>
            <p style={{ margin: 0 }}>
              Read Architecture, then Theming. The Figma Variables payload in the build output is the file to import.
            </p>
            <Link href="/architecture">Architecture</Link>
          </div>
          <div className="d-step">
            <span className="d-step-index">02</span>
            <h3 className="d-h3">Engineer</h3>
            <p style={{ margin: 0 }}>
              Install the tokens package, import the CSS once, set two attributes on the html element. Components are
              plain React with no styling props.
            </p>
            <Link href="/components">Components</Link>
          </div>
          <div className="d-step">
            <span className="d-step-index">03</span>
            <h3 className="d-h3">Contributor</h3>
            <p style={{ margin: 0 }}>
              Read the contribution model and the governance model before opening a PR. The review checklist is short
              and the CI gates are not negotiable.
            </p>
            <Link href="/contribution">Contribution model</Link>
          </div>
          <div className="d-step">
            <span className="d-step-index">04</span>
            <h3 className="d-h3">Learning tokens</h3>
            <p style={{ margin: 0 }}>
              The Learn track walks through tokens, the git and PR workflow, and how a release actually happens, using
              this repo as the worked example.
            </p>
            <Link href="/learn">Learn track</Link>
          </div>
        </div>
      </section>

      <section className="d-section">
        <h2 className="d-h1">Current state</h2>
        <div className="d-row">
          <Badge tone="success" dot>
            v{manifest.version} stable
          </Badge>
          <Badge tone="info">Built {manifest.builtAt}</Badge>
          <Badge tone="accent" dot>
            {manifest.themes.length} themes, all complete
          </Badge>
          <Badge tone="neutral">{manifest.rules.enforced.length} enforced rules</Badge>
        </div>
        <p className="d-body d-muted">
          The build refuses to emit artifacts when any enforced rule fails, so a red CI run means no consumer ever sees
          the broken state.
        </p>
      </section>
    </>
  );
}
