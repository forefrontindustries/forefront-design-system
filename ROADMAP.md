# Roadmap

Three tracks, kept separate on purpose. Net-new is what teams ask for, migrations are what make the
system real in production, and deprecations are what keep it from turning into an archive. A roadmap
that only lists new components will collapse under its own surface area.

Current: **v1.0.0** - 134 primitives, 66 contract tokens, 67 component tokens, 17 density overrides,
2 themes, 7 platform artifacts, 10 components.

## Ordering rules

1. **Blocking beats requested.** A missing control that forces a team to build their own outranks a
   nice addition to something that already works.
2. **Proof beats breadth.** One platform consuming the system for real is worth more than a third
   platform artifact nobody has imported.
3. **Enforcement beats documentation.** If a rule matters, it becomes a build gate. A guideline that
   is only written down decays at the speed of hiring.

## Net-new

| Item | Size | Notes |
| --- | --- | --- |
| Select, Combobox, DatePicker | L | The three highest-demand form controls. Each needs a full APG keyboard model, so they ship one at a time. Target v1.1 through v1.3. |
| Data table primitives | L | Header, row, cell, sort control, sticky column. Compact density is the reason this exists. Target v1.2. |
| High contrast theme | M | The contrast gate already exists, so this is a value table plus a build run. Target v1.1. |
| Icon set with token sizing | M | Icons are consumer-supplied today. A sized `currentColor` set removes the most common off-system asset. Target v1.2. |
| Motion tokens applied to components | S | Duration and easing tokens exist and are already reduced-motion aware. Components do not consume them yet. Target v1.1. |

## Migrations and adoption

| Item | Size | Notes |
| --- | --- | --- |
| React Native consumption proof | L | The native artifact is generated and typed but not yet consumed by a real Expo surface. Until it is, multi-platform is a claim rather than a fact. |
| Figma variable import round trip | M | Import the generated variables into a live file and document the exact steps, including what happens on a rename. |
| Token coverage scanner | M | Extend the literal-value lint into a report that scores a consumer repo, so adoption becomes a number instead of a feeling. |
| Codemod harness | S | One shared runner so every future breaking change can ship with a migration instead of instructions. |

## Deprecations

| Item | Size | Notes |
| --- | --- | --- |
| Direct primitive consumption in components | M | The lint blocks literals but still allows a component to consume a tier 1 colour. Next step is failing on that too, which forces the semantic layer to stay complete. |
| Legacy compact overrides outside tier 3 | S | Already blocked at build time. The rule stays until the last recovered override is confirmed clean, then the exemption list is deleted. |

## Explicitly not planned

- A CSS-in-JS runtime. Theming is two attributes and zero JavaScript in the render path, and that is
  the point.
- Per-team theme forks. Themes are values over one shared contract. A fork of the contract is a fork
  of the system.
- Component-level colour props. If a surface needs a colour that is not in the semantic contract, the
  contract is missing a name and that is the actual fix.
