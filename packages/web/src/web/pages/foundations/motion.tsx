import { useEffect, useState } from "react";
import { primitives } from "@forefront/tokens";
import { Badge, Button, prefersReducedMotion } from "@forefront/ui";
import { PageHeader, Section } from "../../components/docs/shell";
import { Code, NotesBlock } from "../../components/docs/blocks";

/** Motion foundations, with a lab that runs the real token values. */
export default function MotionPage() {
	const durations = primitives.filter((token) => token.path.startsWith("duration."));
	const easings = primitives.filter((token) => token.path.startsWith("easing."));

	const [duration, setDuration] = useState("duration.moderate");
	const [easing, setEasing] = useState("easing.standard");
	const [away, setAway] = useState(false);
	const [reduced, setReduced] = useState(false);

	// Read the media query on mount and keep it live, so the note below reflects
	// the visitor's own OS setting rather than describing it in the abstract.
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);
		const listener = () => setReduced(query.matches);
		query.addEventListener("change", listener);
		return () => query.removeEventListener("change", listener);
	}, []);

	const durationValue = durations.find((token) => token.path === duration)?.value ?? "200ms";
	const easingValue = easings.find((token) => token.path === easing)?.value ?? "linear";

	const notes = [
		{
			title: "Reduced motion is a token-layer concern",
			detail:
				"The media query zeroes all five duration primitives inside the generated stylesheet. Because every animated property in the library reads a duration token, motion is disabled system-wide and no component can opt back in, not even by accident in a hotfix.",
		},
		{
			title: "End states are preserved, never the animation",
			detail:
				"Zeroing a duration removes the transit, not the destination. A modal still appears, a switch thumb still moves to the other side instantly, and nothing becomes invisible or unreachable. The two continuous animations in the library degrade explicitly: the button spinner becomes a static ring, and the toast progress rail is not rendered at all.",
		},
		{
			title: "Exits are faster than entrances",
			detail:
				"Entrances use entrance easing at moderate, exits use exit easing at fast. An exit that takes as long as an entrance feels like the interface is arguing with you, because the decision has already been made.",
		},
		{
			title: "Only composited properties animate",
			detail:
				"Opacity and transform, plus colour on hover states. Nothing in the library animates height, width or layout position, which is why the components hold 60fps in a long table and why reduced motion cannot cause a reflow.",
		},
		{
			title: "The presence hook checks the media query in JavaScript too",
			detail:
				"Overlays stay mounted for the length of their exit animation. If that timeout ignored the media query, a reduced-motion user would sit through a 200ms delay watching nothing happen, so the hook collapses the wait to zero to match the token layer.",
		},
	];

	return (
		<>
			<PageHeader
				eyebrow="Foundations"
				title="Motion"
				lede="Five durations, six curves, and one rule that outranks all of them: if the user asked for less motion, there is none."
				trailing={
					reduced ? (
						<Badge tone="warning" dot>
							Reduce motion is on in your OS
						</Badge>
					) : (
						<Badge tone="neutral" dot>
							Reduce motion is off
						</Badge>
					)
				}
			/>

			<Section
				number="01"
				title="Motion lab"
				subtitle="Pick a token pair and replay. These are the real values the components use, read from the generated model."
			>
				<div className="demo">
					<div
						className="demo__stage demo__stage--column"
						style={{ gap: "var(--fds-space-8)" }}
					>
						<div
							style={{
								position: "relative",
								height: "4.5rem",
								borderRadius: "var(--fds-radius-surface)",
								border: "var(--fds-border-width-thin) dashed var(--fds-color-border-default)",
								background: "var(--fds-color-surface-sunken)",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									position: "absolute",
									top: "50%",
									left: away ? "calc(100% - 4rem)" : "0.75rem",
									width: "3.25rem",
									height: "3.25rem",
									marginTop: "-1.625rem",
									borderRadius: "var(--fds-radius-surface)",
									background: "var(--fds-color-surface-accent-bold)",
									opacity: away ? 1 : 0.55,
									transitionProperty: "left, opacity",
									transitionDuration: prefersReducedMotion() ? "0ms" : durationValue,
									transitionTimingFunction: easingValue,
								}}
							/>
						</div>

						<div className="control-row">
							<div className="segmented" role="group" aria-label="Duration token">
								{durations.map((token) => (
									<button
										key={token.path}
										type="button"
										className="segmented__option"
										aria-pressed={duration === token.path}
										onClick={() => setDuration(token.path)}
									>
										{token.path.split(".").pop()} / {token.value}
									</button>
								))}
							</div>
						</div>

						<div className="control-row">
							<div className="segmented" role="group" aria-label="Easing token">
								{easings.map((token) => (
									<button
										key={token.path}
										type="button"
										className="segmented__option"
										aria-pressed={easing === token.path}
										onClick={() => setEasing(token.path)}
									>
										{token.path.split(".").pop()}
									</button>
								))}
							</div>
							<Button variant="secondary" onClick={() => setAway((value) => !value)}>
								Replay
							</Button>
						</div>
					</div>
					<div className="demo__bar">
						<span>
							transition: left {durationValue} {easingValue}
						</span>
						<span>{prefersReducedMotion() ? "forced to 0ms by your OS setting" : "live"}</span>
					</div>
				</div>
			</Section>

			<Section number="02" title="The ramp">
				<div
					style={{
						display: "grid",
						gap: "var(--fds-space-7)",
						gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
					}}
				>
					<div className="table-wrap">
						<table className="data">
							<caption>Duration</caption>
							<thead>
								<tr>
									<th scope="col">Token</th>
									<th scope="col">Value</th>
									<th scope="col">Used for</th>
								</tr>
							</thead>
							<tbody>
								{[
									["duration.instant", "State changes that must not be perceived as motion"],
									["duration.fast", "Hover, focus, checkbox and switch state"],
									["duration.moderate", "Overlay entrances, tab panel changes"],
									["duration.slow", "Large surface transitions"],
									["duration.slower", "Continuous animation only, such as the spinner"],
								].map(([path, usage]) => (
									<tr key={path}>
										<td>
											<span className="mono">{path!.replace("duration.", "")}</span>
										</td>
										<td>
											<span className="mono mono--subtle">
												{durations.find((token) => token.path === path)?.value}
											</span>
										</td>
										<td>{usage}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="table-wrap">
						<table className="data">
							<caption>Easing</caption>
							<thead>
								<tr>
									<th scope="col">Token</th>
									<th scope="col">Curve</th>
									<th scope="col">Used for</th>
								</tr>
							</thead>
							<tbody>
								{[
									["easing.linear", "Progress rails and spinners only"],
									["easing.standard", "Colour and state changes"],
									["easing.emphasized", "Movement the user should notice"],
									["easing.entrance", "Anything arriving on screen"],
									["easing.exit", "Anything leaving"],
									["easing.spring", "Reserved. Nothing in the library uses it yet"],
								].map(([path, usage]) => (
									<tr key={path}>
										<td>
											<span className="mono">{path!.replace("easing.", "")}</span>
										</td>
										<td>
											<span className="mono mono--subtle" style={{ whiteSpace: "normal" }}>
												{easings.find((token) => token.path === path)?.value}
											</span>
										</td>
										<td>{usage}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Section>

			<Section number="03" title="Rules" subtitle="Written as they are implemented, not as an aspiration.">
				<NotesBlock notes={notes} />
				<div style={{ marginBlockStart: "var(--fds-space-8)" }}>
					<Code standalone>{`/* Generated into tokens.css, inside @layer fds.component */
@media (prefers-reduced-motion: reduce) {
	:root {
		--fds-duration-instant: 0ms;
		--fds-duration-fast: 0ms;
		--fds-duration-moderate: 0ms;
		--fds-duration-slow: 0ms;
		--fds-duration-slower: 0ms;
	}
}`}</Code>
				</div>
			</Section>
		</>
	);
}
