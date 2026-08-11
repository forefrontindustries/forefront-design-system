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
				lede="Three roles, two self-hosted faces. Outfit carries the display voice, Satoshi carries everything a component renders, and both are the faces jeremymaendel.com already ships. The @font-face rules live in this docs app, not in the library."
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
							sample: "Custom systems to help scale your business.",
							note: "Outfit variable, weight 900 at -0.04em tracking. Headings, display scale and marketing surfaces. No component uses it, because a component that changes typeface with the theme is a component that reflows.",
							style: {
								fontFamily: "var(--fds-font-display)",
								fontSize: "var(--fds-font-size-110)",
								fontWeight: "var(--fds-font-weight-black)",
								letterSpacing: "var(--fds-font-tracking-display)",
							},
						},
						{
							token: "font.body",
							sample: "One face carries every component and every paragraph.",
							note: "Satoshi, weights 400 to 900, normal tracking. Every component text style resolves here, so the body face is the one typographic decision a theme is not allowed to change.",
							style: { fontFamily: "var(--fds-font-body)", fontSize: "var(--fds-font-size-60)" },
						},
						{
							token: "font.mono",
							sample: "--fds-color-surface-accent-bold: #5793ca;",
							note: "System mono stack, the one role with no webfont. Every token value, prop name and code sample. Token values in a proportional face are a documentation bug: 0 and O have to be distinguishable when someone is copying a hex by eye. This role ships zero bytes on purpose, since the brand owns no mono face and inventing one would be a decision the brand never made.",
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
									fontSize: "var(--fds-font-size-50)",
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
				<Code standalone>{`Every family stack ends in           Arial, Helvetica, sans-serif, in that order, never bare sans-serif
Display voice                        weight.black + tracking.display, on font.display only
Display face is theme-owned          font.display, never referenced by a component
@font-face lives in the host app     the library ships zero font rules and cannot fight a host loader
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

			<Section
				number="05"
				title="The fallback that shipped a serif"
				subtitle="A measured failure, kept on the record because the fix is counterintuitive."
			>
				<p className="prose">
					An earlier version of this system deliberately shipped no webfont and leaned on the platform UI
					stack: <span className="mono">-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;,
					sans-serif</span>. That stack renders correctly on a Mac and on Windows and is the standard advice.
					It rendered every heading and paragraph in a serif on the machine that mattered, which was the one
					the work was being reviewed on.
				</p>
				<p className="prose">
					The cause was measured with a canvas glyph-width probe rather than guessed at. On a Linux box with
					no SF and no Segoe, the first three families fall through as expected, and then the terminal
					generic keyword itself resolves to a serif face. The <span className="mono">sans-serif</span>{" "}
					keyword is a request to the font config, not a guarantee, and a font config is free to answer it
					with anything. Only <span className="mono">Arial</span> and{" "}
					<span className="mono">Helvetica</span> measured as genuinely sans on the same machine.
				</p>
				<Code standalone>{`font.family.display   'Outfit', Arial, Helvetica, sans-serif
font.family.sans      'Satoshi', Arial, Helvetica, sans-serif

Rule: a family stack never terminates on the bare sans-serif keyword.
      Two named grotesques go in front of it first.`}</Code>
				<p className="prose">
					Two things changed as a result. Outfit and Satoshi are now self-hosted and preloaded, so the
					rendered face is a decision instead of a negotiation with the host operating system. And every
					family primitive names Arial and Helvetica before the generic keyword, so the worst case is a
					grotesque rather than a coin flip. The <span className="mono">@font-face</span> rules deliberately
					live in this docs app and not in <span className="mono">@forefront/ui</span>: a library that
					injects font loading competes with the host application&apos;s own loading strategy and breaks
					under a strict content security policy that does not whitelist its font origin.
				</p>
			</Section>
		</>
	);
}
