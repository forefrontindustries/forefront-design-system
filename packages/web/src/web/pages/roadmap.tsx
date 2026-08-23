import { manifest } from "../lib/ds";

interface Item {
  title: string;
  detail: string;
  size: "S" | "M" | "L";
}

const NET_NEW: Item[] = [
  { title: "Select, Combobox, DatePicker", size: "L", detail: "The three highest demand form controls. Each needs a full APG keyboard model, so they ship one at a time rather than as a batch." },
  { title: "Data table primitives", size: "L", detail: "Header, row, cell, sort control, and a sticky column pattern. Compact density is the reason this exists." },
  { title: "Third theme: high contrast", size: "M", detail: "The contrast gate already exists, so a high contrast theme is a value table plus a build run rather than a project." },
  { title: "Icon set with token sizing", size: "M", detail: "Icons are currently consumer supplied. A sized, currentColor set removes the most common off system asset." },
  { title: "Motion tokens applied to components", size: "S", detail: "Duration and easing tokens exist and are already reduced motion aware. Components do not consume them yet." },
];

const MIGRATIONS: Item[] = [
  { title: "React Native consumption proof", size: "L", detail: "The native artifact is generated and typed but not yet consumed by a real Expo surface. Until it is, multi platform is a claim rather than a fact." },
  { title: "Figma variable import round trip", size: "M", detail: "Import the generated variables into a live file and document the exact steps, including what happens on a rename." },
  { title: "Token coverage scanner", size: "M", detail: "Extend the literal value lint into a report that scores a consumer repo, so adoption becomes a number." },
  { title: "Codemod harness", size: "S", detail: "One shared runner so every future breaking change can ship with a migration instead of instructions." },
];

const DEPRECATIONS: Item[] = [
  { title: "Direct primitive consumption", size: "M", detail: "The lint blocks literals but still allows a component to consume a tier 1 colour. Next step is failing on that too, which forces the semantic layer to stay complete." },
  { title: "Legacy compact overrides outside tier 3", size: "S", detail: "Already blocked at build time. The rule stays until the last scraped override is confirmed clean, then the exemption list is deleted." },
];

function Column({ title, eyebrow, items, tier }: { title: string; eyebrow: string; items: Item[]; tier: string }) {
  return (
    <div className="d-panel">
      <span className="d-tier-pill" data-tier={tier}>
        {eyebrow}
      </span>
      <h2 className="d-h2">{title}</h2>
      <div className="d-stack">
        {items.map((item) => (
          <div className="d-rule" key={item.title}>
            <div className="d-row">
              <h3 className="d-h3">{item.title}</h3>
              <span className="d-mono d-muted">{item.size}</span>
            </div>
            <p style={{ margin: 0 }}>{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Roadmap() {
  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Operating the system</p>
        <h1 className="d-h1">Roadmap</h1>
        <p className="d-lead">
          Three tracks, kept separate on purpose. Net new work is what teams ask for, migrations are what make the
          system real in production, and deprecations are what keep it from turning into an archive. A roadmap that
          only lists new components is a roadmap that will collapse under its own surface area.
        </p>
      </section>

      <section className="d-section">
        <div className="d-grid">
          <div className="d-stat">
            <span className="d-eyebrow">Shipped</span>
            <strong className="d-display">v{manifest.version as string}</strong>
            <span className="d-muted">
              {(manifest.counts as Record<string, number>).primitives} primitives,{" "}
              {(manifest.counts as Record<string, number>).contract} contract tokens, 10 components
            </span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Next</span>
            <strong className="d-display">v1.1</strong>
            <span className="d-muted">Select, high contrast theme, motion applied</span>
          </div>
          <div className="d-stat">
            <span className="d-eyebrow">Then</span>
            <strong className="d-display">v1.2</strong>
            <span className="d-muted">table primitives, native consumption proof</span>
          </div>
        </div>
      </section>

      <section className="d-section">
        <div className="d-grid-2">
          <Column tier="1" eyebrow="net new" title="Build" items={NET_NEW} />
          <Column tier="2" eyebrow="migrations" title="Prove and adopt" items={MIGRATIONS} />
        </div>
        <div className="d-grid-2">
          <Column tier="3" eyebrow="deprecations" title="Remove" items={DEPRECATIONS} />
          <div className="d-panel">
            <span className="d-tier-pill">how this is prioritised</span>
            <h2 className="d-h2">Ordering rules</h2>
            <div className="d-stack">
              <div className="d-rule">
                <h3 className="d-h3">Blocking beats requested</h3>
                <p style={{ margin: 0 }}>
                  A missing control that forces a team to build their own outranks a nice addition to something that
                  already works.
                </p>
              </div>
              <div className="d-rule">
                <h3 className="d-h3">Proof beats breadth</h3>
                <p style={{ margin: 0 }}>
                  One platform consuming the system for real is worth more than a third platform artifact nobody has
                  imported.
                </p>
              </div>
              <div className="d-rule">
                <h3 className="d-h3">Enforcement beats documentation</h3>
                <p style={{ margin: 0 }}>
                  If a rule matters, it becomes a build gate. A guideline that is only written down decays at the speed
                  of hiring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
