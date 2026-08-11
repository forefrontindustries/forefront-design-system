import { useMemo, useState } from "react";
import { themes, contrastRequirements, contrastExemptions, manifest } from "@forefront/tokens";
import { componentMeta } from "@forefront/ui/meta";
import { Badge } from "@forefront/ui";
import { PageHeader, Section } from "../components/docs/shell";
import { Code, NotesBlock } from "../components/docs/blocks";
import { contrast } from "../lib/contrast";

/**
 * This page renders the contrast contract. It does not define one.
 *
 * The pair list, the per-pair threshold and the rule each threshold comes from all
 * live in packages/tokens/src/contrast.json, which the token build reads on every
 * run. The build computes every requirement in every theme and exits non-zero on a
 * violation, so these rows are the reason the build passed rather than a report
 * about it. A docs page holding its own copy of the pair list is a page that
 * drifts, and a drifted accessibility table is worse than no table, because it
 * reads as verification while verifying nothing.
 *
 * The ratios below are recomputed in the browser from the same resolved token
 * values the components consume, which means the number on screen and the number
 * the gate enforced are produced by two independent implementations of the same
 * WCAG formula. They agreeing is the point.
 */

const gate = manifest.contrast;

const principles = [
	{
		title: "An interactive boundary is not decoration, and the tokens now say so",
		detail:
			"border.default and border.strong used to sit on inputs, checkboxes and secondary buttons as well as on card edges. One token cannot be both a quiet separator and the only thing identifying a control, and holding the quiet version to 3:1 would have made every card edge shout. The system split border.control and border.control-hover out as contrast-guaranteed tokens and left border.default decorative, which is why the exempt table below is short and honest instead of long and convenient.",
	},
	{
		title: "The focus ring is centralized and not overridable",
		detail:
			"Width, offset and colour come from focus.* in tier 3. A component cannot set its own, which is why the ring is identical on a button, an input, a tab and a card. The library contains exactly two outline: none declarations, on the inner element of Input and on the link overlay of an interactive Card. Both are there because the ring is drawn on the wrapper instead, and both have their replacement ring in the same file. The count is stated rather than the intention, because the count is the part you can check.",
	},
	{
		title: "Disabled is a token pair, never opacity",
		detail:
			"Every disabled state uses surface.disabled with text.disabled. Fading enabled colours to 40% produces a ratio nobody measured and a different ratio in each theme, which is why the pair is audited above instead.",
	},
	{
		title: "Reduced motion is handled once, at the token layer",
		detail:
			"prefers-reduced-motion zeroes every duration primitive, so a component cannot opt back in. End states are preserved: the loading spinner becomes a static ring, the toast progress rail is not rendered, and nothing becomes invisible.",
	},
	{
		title: "Colour is never the only signal",
		detail:
			"Badges always render text alongside a tone. Invalid fields change border colour, thicken the border and render a message. Switches move the thumb as well as changing the track colour.",
	},
	{
		title: "Live regions match severity",
		detail:
			"Toast uses role=alert with assertive politeness for danger and warning, role=status with polite for everything else. Making every notification assertive is how users learn to ignore the region.",
	},
	{
		title: "Nothing is announced that is not also behaviourally true",
		detail:
			"Modal sets aria-modal AND traps focus. Select keeps aria-activedescendant AND never moves DOM focus into the listbox. Announcing a relationship the behaviour does not honour is worse than announcing nothing, because it removes the user's ability to work around it.",
	},
];

function shortPath(path: string) {
	return path.replace("color.", "");
}

/**
 * The swatch has to show the pair the way a component draws it, not as two chips
 * side by side. A boundary token rendered as a filled square looks fine at any
 * ratio, which is exactly the illusion that let a 1.25:1 control border ship.
 */
function ContrastSwatch({
	foreground,
	background,
	kind,
}: {
	foreground: string | undefined;
	background: string | undefined;
	kind: "text" | "fill" | "boundary";
}) {
	const base = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: "4.5rem",
		height: "1.9rem",
		borderRadius: "var(--fds-radius-sm)",
		background,
		fontSize: "var(--fds-font-size-30)",
	} as const;

	if (kind === "text") {
		return (
			<span
				style={{
					...base,
					padding: "0 0.6rem",
					color: foreground,
					border: "1px solid var(--fds-color-border-subtle)",
				}}
			>
				Sample
			</span>
		);
	}

	if (kind === "fill") {
		return (
			<span style={{ ...base, padding: "0.3rem", border: "1px solid var(--fds-color-border-subtle)" }}>
				<span
					style={{
						display: "block",
						width: "100%",
						height: "100%",
						borderRadius: "var(--fds-radius-xs)",
						background: foreground,
					}}
					aria-hidden="true"
				/>
			</span>
		);
	}

	return <span style={{ ...base, border: `2px solid ${foreground}` }} aria-hidden="true" />;
}

export default function AccessibilityPage() {
	const [themeName, setThemeName] = useState(themes[0]!.name);
	const theme = themes.find((item) => item.name === themeName) ?? themes[0]!;

	const values = useMemo(
		() => new Map(theme.tokens.map((token) => [token.path, token.resolved])),
		[theme],
	);

	const rows = useMemo(
		() =>
			contrastRequirements.map((requirement) => {
				const foreground = values.get(requirement.foreground);
				const background = values.get(requirement.background);
				const result = foreground && background ? contrast(foreground, background) : null;
				return {
					...requirement,
					foregroundValue: foreground,
					backgroundValue: background,
					result,
					passes: result ? result.ratio >= requirement.min : false,
				};
			}),
		[values],
	);

	const exemptRows = useMemo(
		() =>
			contrastExemptions.map((exemption) => {
				const foreground = values.get(exemption.foreground);
				const background = values.get(exemption.background);
				const result = foreground && background ? contrast(foreground, background) : null;
				return { ...exemption, foregroundValue: foreground, backgroundValue: background, result };
			}),
		[values],
	);

	const failures = rows.filter((row) => !row.passes);
	const tightest = rows
		.filter((row) => row.result)
		.reduce(
			(worst, row) =>
				!worst || row.result!.ratio / row.min < worst.result!.ratio / worst.min ? row : worst,
			null as (typeof rows)[number] | null,
		);

	const keyboardTotal = componentMeta.reduce((sum, meta) => sum + meta.keyboard.length, 0);
	const uniqueRules = new Set(contrastRequirements.map((requirement) => requirement.rule)).size;

	return (
		<>
			<PageHeader
				eyebrow="Foundations"
				title="Accessibility"
				lede="The contrast contract is a build gate, not a page. Every pair a component renders is declared once in the token package with the threshold it has to clear, and the build fails on a violation, so no theme can be merged with an inaccessible pairing."
			/>

			<div className="stat-row" style={{ marginBlockStart: "var(--fds-space-10)" }}>
				<div className="stat">
					<div className="stat__value">{gate.requirements}</div>
					<div className="stat__label">Declared requirements</div>
				</div>
				<div className="stat">
					<div className="stat__value">{gate.checksRun}</div>
					<div className="stat__label">Checks run at build time</div>
				</div>
				<div className="stat">
					<div className="stat__value">{gate.failures}</div>
					<div className="stat__label">Build failures allowed</div>
				</div>
				<div className="stat">
					<div className="stat__value">{keyboardTotal}</div>
					<div className="stat__label">Documented key bindings</div>
				</div>
				<div className="stat">
					<div className="stat__value">55</div>
					<div className="stat__label">Browser-driven keyboard assertions</div>
				</div>
			</div>

			<Section
				number="01"
				title="How the gate works"
				subtitle="The interesting part of an accessible system is not the numbers, it is what happens to a pull request that breaks them."
			>
				<p className="prose">
					A colour audit that lives in a spreadsheet is a snapshot of one afternoon. This one lives in{" "}
					<span className="mono">packages/tokens/src/contrast.json</span> and is read by the token build, so
					adding a theme means satisfying {gate.requirements} declared pairs before the build will emit CSS at
					all. Two rules do the enforcing. The first walks every requirement in every theme, resolves the
					aliases, composites any translucent value over its backdrop, and errors when the measured ratio is
					below the declared minimum. The second is the one that matters more: any token in a foreground group,
					meaning <span className="mono">text</span>, <span className="mono">border</span> or{" "}
					<span className="mono">icon</span>, that the contract never measures is itself a build error.
				</p>
				<p className="prose">
					That second rule is what stops the gate being decorative. Without it, a contributor can add a token,
					never declare where it is drawn, and ship an unmeasured colour into a system that advertises itself as
					audited. With it, the contributor has two options: declare the surface the token sits on and clear the
					threshold, or name it as an exemption and write down why it carries none. Both are recorded. When this
					rule was first switched on it rejected six tokens and found a seventh,{" "}
					<span className="mono">text.inverse</span>, that could not name any surface it was drawn on because
					nothing rendered it. It was deleted. A contract token that cannot answer where it is used is not a
					contract token.
				</p>
				<Code standalone>{`# both of these are errors, not warnings

error [contrast] "color.icon.accent" is a foreground token that the contrast
  contract never measures. Add it to requirements in contrast.json with the
  surface it is drawn on, or add it to exempt with the reason it carries no
  threshold.

error [contrast:forefront-dark] color.text.on-accent on
  color.surface.accent-bold-active is 3.64:1, below the required 4.5:1
  (Primary button label, pressed). SC 1.4.3 Contrast (Minimum)`}</Code>
				<p className="demo__caption">
					Both of those are real output from this repository. The second one is why the pressed state of the
					primary button in the dark themes is a lighter blue than its hover state: in a dark theme the bold
					accent fill is the light element, so a press that darkened it moved the fill toward the canvas and
					took the label with it. The fix was the token, not the threshold.
				</p>
			</Section>

			<Section
				number="02"
				title="Contrast matrix"
				subtitle="Rows come from the contract. Ratios are recomputed here in the browser from the resolved token values, so this table and the build gate are two independent implementations agreeing."
			>
				<div className="control-row" style={{ marginBlockEnd: "var(--fds-space-7)" }}>
					<div className="segmented" role="group" aria-label="Theme to audit">
						{themes.map((item) => (
							<button
								key={item.name}
								type="button"
								className="segmented__option"
								aria-pressed={themeName === item.name}
								onClick={() => setThemeName(item.name)}
							>
								{item.label}
							</button>
						))}
					</div>
					{failures.length === 0 ? (
						<Badge tone="success" dot>
							{rows.length} of {rows.length} pass
						</Badge>
					) : (
						<Badge tone="danger" dot>
							{failures.length} failing
						</Badge>
					)}
					{tightest ? (
						<span className="mono mono--subtle">
							tightest: {shortPath(tightest.foreground)} on {shortPath(tightest.background)} at{" "}
							{tightest.result!.ratio.toFixed(2)}:1 against {tightest.min}:1
						</span>
					) : null}
				</div>

				<div className="table-wrap">
					<table className="data">
						<caption>
							{theme.label}: {theme.description}
						</caption>
						<thead>
							<tr>
								<th scope="col">Sample</th>
								<th scope="col">Pair</th>
								<th scope="col">Used for</th>
								<th scope="col">Ratio</th>
								<th scope="col">Required</th>
								<th scope="col">Result</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={`${row.foreground}-${row.background}`}>
									<td>
										<ContrastSwatch
											foreground={row.foregroundValue}
											background={row.backgroundValue}
											kind={
												row.min >= 4.5
													? "text"
													: row.foreground.startsWith("color.surface.")
														? "fill"
														: "boundary"
											}
										/>
									</td>
									<td>
										<span className="mono" style={{ whiteSpace: "normal" }}>
											{shortPath(row.foreground)}
										</span>
										<br />
										<span className="mono mono--subtle" style={{ whiteSpace: "normal" }}>
											on {shortPath(row.background)}
										</span>
									</td>
									<td>
										{row.usage}
										<br />
										<span className="mono mono--subtle" style={{ whiteSpace: "normal" }}>
											{row.rule}
										</span>
									</td>
									<td>
										<span className="mono">{row.result ? `${row.result.ratio.toFixed(2)}:1` : "n/a"}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{row.min}:1</span>
									</td>
									<td>
										{row.passes ? (
											<Badge tone="success" variant="subtle">
												Pass
											</Badge>
										) : (
											<Badge tone="danger" variant="subtle">
												Fail
											</Badge>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<p className="demo__caption">
					{uniqueRules} distinct rules are cited across the {rows.length} requirements, because a single global
					threshold hides the reasoning. Text sits at 4.5:1 under SC 1.4.3. Boundaries, focus rings and
					interface icons sit at 3:1 under SC 1.4.11. Two thresholds are house rules rather than WCAG: disabled
					labels are held to 3:1 where WCAG exempts inactive controls entirely, and placeholders are held to the
					full 4.5:1 rather than the common 3:1, because a placeholder is text carrying meaning and not
					decoration.
				</p>
			</Section>

			<Section
				number="03"
				title="Exempt pairs, named on purpose"
				subtitle="A pair missing from an audit is indistinguishable from a pair nobody thought about, so the decorative ones are listed with the reason they carry no threshold."
			>
				<div className="table-wrap">
					<table className="data">
						<caption>
							{exemptRows.length} exemptions in {theme.label}. Their ratios are shown so you can see how
							quiet they are, not because a threshold applies.
						</caption>
						<thead>
							<tr>
								<th scope="col">Pair</th>
								<th scope="col">Used for</th>
								<th scope="col">Ratio</th>
								<th scope="col">Why it carries no threshold</th>
							</tr>
						</thead>
						<tbody>
							{exemptRows.map((row) => (
								<tr key={`${row.foreground}-${row.background}`}>
									<td>
										<span className="mono" style={{ whiteSpace: "normal" }}>
											{shortPath(row.foreground)}
										</span>
										<br />
										<span className="mono mono--subtle" style={{ whiteSpace: "normal" }}>
											on {shortPath(row.background)}
										</span>
									</td>
									<td>{row.usage}</td>
									<td>
										<span className="mono mono--subtle">
											{row.result ? `${row.result.ratio.toFixed(2)}:1` : "n/a"}
										</span>
									</td>
									<td>{row.reason}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				number="04"
				title="The keyboard audit, and the two bugs it found"
				subtitle="Contrast is the part of accessibility that can be checked from a stylesheet. Behaviour is the part that has to be driven."
			>
				<p className="prose">
					<span className="mono">tooling/keyboard-audit.py</span> drives Chrome against this site and makes 55
					assertions about behaviour rather than markup. That distinction is the whole value of it.{" "}
					<span className="mono">aria-modal="true"</span> is trivial to assert and proves nothing. Whether Tab
					can escape an open dialog is the actual question, so the audit presses the keys and reads back{" "}
					<span className="mono">document.activeElement</span>. It exits non-zero on a failed assertion or a
					console error, so it can gate a pull request the same way the token build does.
				</p>
				<p className="prose">
					It found two bugs in this library. Both were invisible to review, and both would have survived any
					number of screenshots.
				</p>
				<NotesBlock
					notes={[
						{
							title: "The focus trap was not running at all",
							detail:
								"Portal returned null until its own mount effect had run, which put the dialog panel one commit later than the parent's effects. Modal's focus trap therefore ran against a null ref, bailed on its guard clause, and never re-ran because its dependency array had not changed. The dialog opened, looked right, reported aria-modal and a valid accessible name, locked background scrolling, and left focus behind it with the whole page still tabbable. The portal host is now created during render so the panel commits first, the trap waits for its container across a bounded number of frames instead of silently doing nothing, and it pulls focus back when focus has escaped rather than only handling the wrap at the first and last node.",
						},
						{
							title: "The toast live region did not exist until the first toast",
							detail:
								"Each toast declared role=status and aria-live on an element being inserted in the same tick, and the provider mounted no live region beforehand. role=alert is reliably announced on insertion; role=status is not. The viewport is now a persistent polite live region owned by ToastProvider, and only assertive toasts declare their own semantics, so a polite toast is announced by a region that already existed when the content arrived.",
						},
					]}
				/>
				<p className="demo__caption">
					Neither of those is a grey area. Both are the difference between a component that works and one that
					photographs well, and neither would have been caught by a contrast matrix, a type checker or a code
					review.
				</p>
			</Section>

			<Section
				number="05"
				title="Principles the code enforces"
				subtitle="Each of these is checkable, either by a lint rule, by the token build, or by reading one file."
			>
				<NotesBlock notes={principles} />
			</Section>

			<Section
				number="06"
				title="How to verify it yourself"
				subtitle="The claim is only useful if you can reproduce it."
			>
				<p className="prose">
					Put the keyboard away from the mouse and walk this list on any component page. Every component in the
					system was taken through it, and the keyboard tables on the component pages are the record of what
					each one supports.
				</p>
				<Code standalone>{`1  Tab through the page. Every interactive element takes focus, in visual order.
2  Look for the ring on each stop. Same width, same offset, same colour, everywhere.
3  Open the Select. Arrow, Home, End, type two letters, press Escape. Focus never
   leaves the trigger and the selection is announced.
4  Open the Modal. Tab past the last element: focus wraps. Press Escape: focus
   returns to the button that opened it.
5  Arrow through the Tabs. One tab stop for the list, and the panel is reachable
   with a single Tab press after activation.
6  Fire a Toast, then tab towards its action. The timer pauses on focus.
7  Turn on Reduce Motion in the OS. Nothing moves, nothing disappears, and the
   spinner becomes a static ring.
8  Switch to Forefront Light. Re-run steps 2 to 6. Same behaviour, different values.
9  Break it on purpose: point a theme's border.control at a primitive two steps
   lighter and run bun run tokens:build. It should refuse.

Or skip all of it and run bun run audit:keyboard, which does steps 1 to 7 in a
real browser and fails the build if any of them regress.`}</Code>
			</Section>
		</>
	);
}
