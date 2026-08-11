import { Link } from "wouter";
import manifest from "@forefront/tokens/manifest";
import { componentMeta } from "@forefront/ui/meta";
import { Badge, Card, CardBody, CardHeader, CardTitle } from "@forefront/ui";
import { PageHeader, Section } from "../components/docs/shell";
import { Code, NotesBlock, StatusPill } from "../components/docs/blocks";

const stats = [
	{ value: String(manifest.counts.totalCustomProperties), label: "CSS custom properties emitted" },
	{ value: String(manifest.counts.semanticContract), label: "Semantic contract tokens" },
	{ value: String(manifest.counts.themes), label: "Themes from one contract" },
	{ value: "12", label: "Components, hand-built" },
	{ value: "1", label: "Runtime dependency (React)" },
];

const decisions = [
	{
		title: "No third-party primitives",
		detail:
			"No Radix, no shadcn, no MUI. Every focus trap, roving tabindex, listbox and live region in here is authored. The point of a design systems role is proving the system can be authored rather than configured, and the parts teams outsource are exactly the parts that decide whether a keyboard user can finish the task.",
	},
	{
		title: "Components are plain CSS with custom properties, not Tailwind",
		detail:
			"The library has zero Tailwind dependency so it can be dropped into any consumer, including one that does not use a utility framework. Tailwind is used for the chrome of this documentation site and nowhere else.",
	},
	{
		title: "The semantic tier is a contract, and the build enforces it",
		detail:
			"semantic.json holds no values, only names and descriptions. Each theme supplies every value. A theme that misses a token, adds one, hardcodes a literal instead of aliasing a primitive, or forms a circular alias fails the build rather than shipping a half-themed component.",
	},
	{
		title: "Contrast is a build gate, and an unmeasured colour token is a build error",
		detail:
			"A contrast contract in the token package declares every pair a component actually renders, with the threshold it must clear and the rule that threshold comes from. The build measures all of them in every theme and exits non-zero on a violation. The stricter half of the rule is that any text, border or icon token the contract never measures also fails the build, so a colour cannot enter the system without someone stating where it is drawn. Turning it on rejected six tokens and failed three real pairings that had been shipping.",
	},
	{
		title: "A decorative border and a control boundary are different tokens",
		detail:
			"border.default and border.strong were doing double duty on card edges and on inputs, checkboxes and secondary buttons. That put an interactive boundary below 3:1, a genuine 1.4.11 failure, while any fix strong enough to pass would have made every card edge shout. Splitting contrast-guaranteed border.control and border.control-hover out of them let the decorative tokens stay quiet and the audited ones stay honest. One token cannot carry two accessibility obligations.",
	},
	{
		title: "Reduced motion is enforced at the token layer",
		detail:
			"prefers-reduced-motion zeroes every duration primitive, so no component can opt back into motion by accident. End states are preserved, which means nothing becomes invisible or unusable when motion is off.",
	},
	{
		title: "Keyboard behaviour is audited by a script, not by a reviewer",
		detail:
			"55 assertions drive Chrome against the docs site and read back document.activeElement after real key presses, because asserting that aria-modal is present proves nothing about whether Tab can escape the dialog. Writing it found three bugs that had survived review: a focus trap that never engaged because a portal mounted one commit late, a toast live region that did not exist until the first toast fired, and a dialog that took focus and then silently lost it to the body when its portal host was detached and reattached. All three looked correct in every screenshot, and the third one still rendered a dialog that read as focused while the next Tab landed on the page behind it.",
	},
	{
		title: "Prop tables are generated from the types",
		detail:
			"A script walks the declarations with the TypeScript compiler API and emits the API JSON this site renders. Hand-written prop tables are wrong within two releases, and the playground controls are derived from the same output, so a new variant needs no documentation change at all.",
	},
	{
		title: "Keeping focus inside a dialog is a different problem from trapping Tab",
		detail:
			"Intercepting Tab only defends against the one route that fires a key event. When the focused element is removed from the DOM the browser resets focus to the body, no key was pressed, and from there the next Tab starts at the top of the page outside the dialog. The trap now treats focus loss as a state to recover from: a focusout with no relatedTarget rechecks on the next frame and pulls focus back only if it genuinely ended up nowhere. The bug that forced this was a StrictMode remount detaching the portal host, but any dialog whose focused control unmounts on a state change hits it in production.",
	},
	{
		title: "A font stack that ends in sans-serif is not a sans-serif font stack",
		detail:
			"This system first shipped no webfont and relied on the platform UI stack, which is the standard recommendation and renders correctly on a Mac. It rendered every heading in a serif on the machine it was reviewed on. A canvas glyph-width probe found why: with no SF and no Segoe installed the named families fall through as expected, and then the generic sans-serif keyword itself resolves to a serif face, because the keyword is a request to the host font config rather than a guarantee. Only Arial and Helvetica measured as genuinely sans. Outfit and Satoshi are now self-hosted and preloaded, every family primitive names Arial and Helvetica before the generic keyword, and the @font-face rules live in the docs app rather than in the library so the library cannot fight a host application's loading strategy or break under a strict CSP that does not whitelist its font origin.",
	},
	{
		title: "The library never touches the rem origin, and it had to learn that twice",
		detail:
			"A theme set font-size on the element carrying data-fds-theme, that attribute is applied to the html element, and the theme's own body size was a rem value. Every rem token in the system silently rescaled to 87.5% the moment a theme was applied, including spacing, control heights and focus ring offsets, and nothing looked broken enough to notice. The root now pins font-size: 100% and the body inherits the theme's text size, so a theme can never redefine the unit its own tokens are expressed in. Adjusting the rem origin is a host application decision: the docs site sets 112.5% because its preview frame scales down, and that belongs to the host, not to the tokens.",
	},
	{
		title: "Generated artifacts are committed",
		detail:
			"tokens.css, the typed token model, the Figma Variables payload and the component API are all in the repository. A fresh clone renders without a build step, a reviewer can read the output on GitHub, and none of the files carry a timestamp so rebuilding does not produce a diff.",
	},
];

export default function IndexPage() {
	return (
		<>
			<PageHeader
				eyebrow="Forefront Design System"
				title="A design system with its arguments written down"
				lede="Three token tiers, two themes from one value-less contract, and twelve accessible React components built without a primitives library. This site documents the decisions as carefully as the API, because the decisions are what a team actually has to live with."
			/>

			<div className="stat-row" style={{ marginBlockStart: "var(--fds-space-10)" }}>
				{stats.map((stat) => (
					<div className="stat" key={stat.label}>
						<div className="stat__value">{stat.value}</div>
						<div className="stat__label">{stat.label}</div>
					</div>
				))}
			</div>

			<Section
				number="01"
				title="Architecture"
				subtitle="Three tiers, one direction of reference. Nothing in a component reaches past the tier above it."
			>
				<div className="table-wrap">
					<table className="data">
						<thead>
							<tr>
								<th scope="col">Tier</th>
								<th scope="col">Owns</th>
								<th scope="col">May reference</th>
								<th scope="col">Varies by</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<span className="mono">1. Primitives</span>
								</td>
								<td>
									Raw values. The only place a literal is allowed to exist: {manifest.counts.primitives}{" "}
									of them.
								</td>
								<td>
									<span className="mono mono--subtle">nothing</span>
								</td>
								<td>nothing</td>
							</tr>
							<tr>
								<td>
									<span className="mono">2. Semantic</span>
								</td>
								<td>
									Intent: <span className="mono">surface.raised</span>,{" "}
									<span className="mono">text.on-accent</span>,{" "}
									<span className="mono">border.focus</span>. A value-less contract of{" "}
									{manifest.counts.semanticContract} names.
								</td>
								<td>
									<span className="mono mono--subtle">tier 1 only</span>
								</td>
								<td>theme</td>
							</tr>
							<tr>
								<td>
									<span className="mono">3. Component</span>
								</td>
								<td>
									Geometry: control heights, focus ring width, modal widths.{" "}
									{manifest.counts.componentTokens} tokens.
								</td>
								<td>
									<span className="mono mono--subtle">tier 1 geometry, tier 2 colour</span>
								</td>
								<td>density</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p className="prose" style={{ marginBlockStart: "var(--fds-space-8)" }}>
					One JSON source compiles to four artifacts: the stylesheet the browser reads, a typed model the docs
					and any tooling can query, a Figma Variables payload with real alias references, and a manifest of
					counts and coverage that this site reads so the foundation pages cannot go stale.
				</p>

				<Code standalone>{`packages/tokens/src/
  primitives.json          tier 1, the only literals in the system
  semantic.json            tier 2 contract: names and descriptions, no values
  themes/
    forefront-dark.json    default theme, supplies all 66 contract values
    forefront-light.json   same contract, inverted surfaces and re-picked borders
  component.json           tier 3 geometry
  density/compact.json     overrides a deliberately small slice of tier 3

                       bun run tokens:build

packages/tokens/build/
  tokens.css               ${manifest.counts.totalCustomProperties} custom properties, cascade layers, per-theme blocks
  tokens.ts                typed model with resolved values and alias chains
  tokens.figma.json        3 collections, one mode per theme, VARIABLE_ALIAS refs
  manifest.json            counts, per-theme coverage, unreferenced primitives`}</Code>
			</Section>

			<Section
				number="02"
				title="What the build refuses to do"
				subtitle="A token architecture is a convention until something checks it. These are hard failures, not warnings."
			>
				<div className="table-wrap">
					<table className="data">
						<thead>
							<tr>
								<th scope="col">Rule</th>
								<th scope="col">Why it exists</th>
							</tr>
						</thead>
						<tbody>
							{[
								[
									"A theme is missing a contract token",
									"The component reading it silently falls back to nothing. Half-themed components are how a system loses trust.",
								],
								[
									"A theme adds a token the contract does not declare",
									"Otherwise one theme grows a token the others do not have, and a component starts depending on it.",
								],
								[
									"A semantic token hardcodes a literal",
									"Tier 2 must alias tier 1. A hex in the semantic layer is a value nobody can find later.",
								],
								[
									"An alias cannot resolve, or is circular",
									"Depth-limited resolution catches both, with the chain printed so the fix is obvious.",
								],
								[
									"Density overrides a token outside tier 3",
									"Density is geometry. A density that changes colour is a second theme wearing a disguise.",
								],
								[
									"More than one theme claims to be the default",
									"There is exactly one :root block. Two defaults means the last file wins by filesystem order.",
								],
								[
									"An unreferenced colour primitive exists",
									"A warning, not a failure, and scoped to colour only. Geometry primitives are consumed directly by components, so warning on them would train people to ignore the warning.",
								],
							].map(([rule, why]) => (
								<tr key={rule}>
									<td style={{ minWidth: "18rem" }}>{rule}</td>
									<td>{why}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section number="03" title="Using it" subtitle="Two imports and an attribute.">
				<Code standalone>{`import "@forefront/ui/styles.css";
import { Button, Modal, ToastProvider } from "@forefront/ui";

// The theme attribute goes on <html>, not on a wrapper, so portalled
// overlays inherit it. The default theme is also emitted on :root, so
// a consumer who forgets the attribute still gets a working system.
document.documentElement.setAttribute("data-fds-theme", "forefront-dark");
document.documentElement.setAttribute("data-fds-density", "comfortable");

export function App() {
	return (
		<ToastProvider placement="bottom-end" max={3}>
			<Button variant="primary" size="md">Save changes</Button>
		</ToastProvider>
	);
}`}</Code>
				<p className="prose" style={{ marginBlockStart: "var(--fds-space-7)" }}>
					Every component in the library is themed by attribute, so switching a theme is one DOM write and no
					re-render. Use the switcher in the top bar: it changes accent hue, neutral temperature, radius scale
					and display typeface at once, because a theme that only swaps one colour proves nothing about the
					architecture.
				</p>
			</Section>

			<Section
				number="04"
				title="Components"
				subtitle="Twelve, deliberately. A small set documented properly is worth more than forty with an empty accessibility section."
			>
				<div className="grid-cards">
					{componentMeta.map((meta) => (
						<Card key={meta.slug} variant="outlined" interactive>
							<CardHeader>
								<CardTitle level={3}>
									<Link href={`/components/${meta.slug}`} className="fds-card__link">
										{meta.name}
									</Link>
								</CardTitle>
								<StatusPill status={meta.status} />
							</CardHeader>
							<CardBody>
								<p style={{ margin: 0 }}>{meta.summary}</p>
								<Badge tone="neutral">{meta.category}</Badge>
							</CardBody>
						</Card>
					))}
				</div>
			</Section>

			<Section
				number="05"
				title="Decisions on record"
				subtitle="Every one of these was a fork in the road. They are written down so the next person can disagree with the reasoning rather than guess at it."
			>
				<NotesBlock notes={decisions} />
			</Section>
		</>
	);
}
