import { primitives } from "@forefront/tokens";
import { PageHeader, Section } from "../../components/docs/shell";
import { Code } from "../../components/docs/blocks";

/** Typography foundations, rendered with the live tokens so the specimen cannot drift from the ramp. */
export default function TypographyPage() {
	const sizes = primitives.filter((token) => token.path.startsWith("font.size."));
	const weights = primitives.filter((token) => token.path.startsWith("font.weight."));
	const lineHeights = primitives.filter((token) => token.path.startsWith("font.line-height."));
	const tracking = primitives.filter((token) => token.path.startsWith("font.tracking."));

	return (
		<>
			<PageHeader
				eyebrow="Foundations"
				title="Typography"
				lede="Three roles, not three fonts: display, body and mono. The display face is theme-owned, which is why switching to Signal changes the headings on this page as well as the colours."
			/>

			<Section
				number="01"
				title="Roles"
				subtitle="Semantic font tokens sit in tier 2, so a theme can change the display face without touching a component."
			>
				<div style={{ display: "grid", gap: "var(--fds-space-6)" }}>
					{[
						{
							token: "font.display",
							sample: "Systems, not screens",
							note: "Fraunces in the Forefront themes, Instrument Serif in Signal. Docs headings and marketing surfaces. No component uses it, because a component that changes typeface with the theme is a component that reflows.",
							style: { fontFamily: "var(--fds-font-display)", fontSize: "var(--fds-font-size-100)" },
						},
						{
							token: "font.body",
							sample: "Public Sans carries every component and every paragraph.",
							note: "Chosen over Inter deliberately. Inter is the default choice, and defaulting is the opposite of the job.",
							style: { fontFamily: "var(--fds-font-body)", fontSize: "var(--fds-font-size-60)" },
						},
						{
							token: "font.mono",
							sample: "--fds-color-surface-accent-bold: #5793ca;",
							note: "JetBrains Mono. Every token value, prop name and code sample. Token values in a proportional face are a documentation bug: 0 and O have to be distinguishable when someone is copying a hex by eye.",
							style: { fontFamily: "var(--fds-font-mono)", fontSize: "var(--fds-font-size-50)" },
						},
					].map((role) => (
						<div className="panel" key={role.token} style={{ padding: "var(--fds-space-8)" }}>
							<p className="mono mono--subtle" style={{ margin: "0 0 var(--fds-space-5)" }}>
								{role.token}
							</p>
							<p style={{ margin: 0, lineHeight: "var(--fds-font-line-height-tight)", ...role.style }}>
								{role.sample}
							</p>
							<p
								style={{
									margin: "var(--fds-space-6) 0 0",
									maxWidth: "68ch",
									fontSize: "var(--fds-font-size-30)",
									color: "var(--fds-color-text-subtle)",
									lineHeight: "var(--fds-font-line-height-relaxed)",
								}}
							>
								{role.note}
							</p>
						</div>
					))}
				</div>
			</Section>

			<Section
				number="02"
				title="Size ramp"
				subtitle="Numbered rather than named. t-shirt sizes run out at the fourth heading level and then you get sm-2."
			>
				<div className="table-wrap">
					<table className="data">
						<caption>
							Components only consume <span className="mono">30</span>, <span className="mono">40</span>,{" "}
							<span className="mono">50</span> and <span className="mono">60</span>. Everything above is
							editorial, which is why a card title cannot accidentally become a page title.
						</caption>
						<thead>
							<tr>
								<th scope="col">Token</th>
								<th scope="col">Value</th>
								<th scope="col">Specimen</th>
							</tr>
						</thead>
						<tbody>
							{sizes.map((token) => (
								<tr key={token.path}>
									<td>
										<span className="mono">{token.path}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{token.value}</span>
									</td>
									<td>
										<span
											style={{
												fontSize: token.value,
												lineHeight: "var(--fds-font-line-height-snug)",
												letterSpacing: "var(--fds-font-tracking-tight)",
												color: "var(--fds-color-text-primary)",
											}}
										>
											Grid alignment is a promise
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section number="03" title="Weight, line height, tracking">
				<div
					style={{
						display: "grid",
						gap: "var(--fds-space-7)",
						gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
					}}
				>
					<div className="table-wrap">
						<table className="data">
							<caption>Weight</caption>
							<tbody>
								{weights.map((token) => (
									<tr key={token.path}>
										<td>
											<span className="mono">{token.path.split(".").pop()}</span>
										</td>
										<td>
											<span className="mono mono--subtle">{token.value}</span>
										</td>
										<td>
											<span style={{ fontWeight: Number(token.value) }}>Forefront</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="table-wrap">
						<table className="data">
							<caption>Line height</caption>
							<tbody>
								{lineHeights.map((token) => (
									<tr key={token.path}>
										<td>
											<span className="mono">{token.path.split(".").pop()}</span>
										</td>
										<td>
											<span className="mono mono--subtle">{token.value}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="table-wrap">
						<table className="data">
							<caption>Tracking</caption>
							<tbody>
								{tracking.map((token) => (
									<tr key={token.path}>
										<td>
											<span className="mono">{token.path.split(".").pop()}</span>
										</td>
										<td>
											<span className="mono mono--subtle">{token.value}</span>
										</td>
										<td>
											<span style={{ letterSpacing: token.value }}>Forefront</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Section>

			<Section number="04" title="Rules that are actually enforced">
				<Code standalone>{`Display face is theme-owned          font.display, never referenced by a component
Body copy measure                    68ch maximum. Long-form docs use line-height relaxed
Component text                       sizes 30 to 60 only
Density never shrinks text below     13px (font.size.30)
Uppercase always gets                tracking.wide or wider
Numerals in tables                   font.mono, so columns align without a monospace hack`}</Code>
				<p className="prose" style={{ marginBlockStart: "var(--fds-space-7)" }}>
					The density rule is the one people push back on. Compact density changes control heights and insets
					and stops there. Shrinking type to fit more rows trades an accessibility floor for information
					density, and that trade should be a product decision with a name on it, not a side effect of a
					density attribute.
				</p>
			</Section>
		</>
	);
}
