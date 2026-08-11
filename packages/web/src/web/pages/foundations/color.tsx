import { useState } from "react";
import { primitives, themes } from "@forefront/tokens";
import { PageHeader, Section } from "../../components/docs/shell";

/** Colour foundations: the ramps, the semantic mapping, and the same token across all four themes. */
export default function ColorPage() {
	const [themeName, setThemeName] = useState(themes[0]!.name);
	const theme = themes.find((item) => item.name === themeName) ?? themes[0]!;

	const colorPrimitives = primitives.filter((token) => token.type === "color");
	const families = [...new Set(colorPrimitives.map((token) => token.path.split(".")[1]!))];

	const semanticColors = theme.tokens.filter((token) => token.type === "color");
	const semanticGroups = [...new Set(semanticColors.map((token) => token.path.split(".")[1]!))];

	const comparison = [
		"color.surface.canvas",
		"color.surface.raised",
		"color.surface.accent-bold",
		"color.text.primary",
		"color.text.accent",
		"color.border.focus",
	];

	return (
		<>
			<PageHeader
				eyebrow="Foundations"
				title="Color and theming"
				lede="Two neutral families, two accents, three status hues. Dark themes are built on a blue-tinted ink ramp rather than pure grey, and pure black is never a surface."
			/>

			<Section
				number="01"
				title="Primitives"
				subtitle="Tier 1. The only literals in the system, and never referenced from a component: the CSS lint rejects that outright."
			>
				{families.map((family) => {
					const steps = colorPrimitives.filter((token) => token.path.startsWith(`color.${family}.`));
					return (
						<div key={family} style={{ marginBlockEnd: "var(--fds-space-9)" }}>
							<h3 className="subhead" style={{ marginBlockStart: 0 }}>
								color.{family}
							</h3>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: `repeat(auto-fit, minmax(5.5rem, 1fr))`,
									gap: "var(--fds-space-4)",
								}}
							>
								{steps.map((token) => (
									<div key={token.path}>
										<div className="swatch" style={{ background: token.value }} />
										<p
											className="mono mono--subtle"
											style={{ margin: "var(--fds-space-3) 0 0", whiteSpace: "normal" }}
										>
											{token.path.split(".").slice(2).join(".")}
											<br />
											{token.value}
										</p>
									</div>
								))}
							</div>
						</div>
					);
				})}

				<p className="demo__caption">
					Fourteen ramp steps were deleted during the build of this system because nothing referenced them. An
					unreferenced primitive is not free: it is a choice the next person has to consider, and a colour a
					theme might quietly start using without a semantic name.
				</p>
			</Section>

			<Section
				number="02"
				title="Semantic mapping"
				subtitle="Tier 2. This is the layer components speak. Switch the theme and every value below changes while every name stays the same."
			>
				<div className="control-row" style={{ marginBlockEnd: "var(--fds-space-7)" }}>
					<div className="segmented" role="group" aria-label="Theme">
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
				</div>

				{semanticGroups.map((group) => (
					<div key={group} style={{ marginBlockEnd: "var(--fds-space-9)" }}>
						<h3 className="subhead" style={{ marginBlockStart: 0 }}>
							color.{group}
						</h3>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
								gap: "var(--fds-space-5)",
							}}
						>
							{semanticColors
								.filter((token) => token.path.startsWith(`color.${group}.`))
								.map((token) => (
									<div
										key={token.path}
										style={{
											border: "var(--fds-border-width-thin) solid var(--fds-color-border-subtle)",
											borderRadius: "var(--fds-radius-surface)",
											overflow: "hidden",
										}}
									>
										<div style={{ height: "3rem", background: token.resolved }} />
										<div style={{ padding: "var(--fds-space-5)" }}>
											<p className="mono" style={{ margin: 0, whiteSpace: "normal" }}>
												{token.path.split(".").slice(1).join(".")}
											</p>
											<p
												className="mono mono--subtle"
												style={{ margin: "var(--fds-space-2) 0 0", whiteSpace: "normal" }}
											>
												{token.alias ?? "literal"} &rarr; {token.resolved}
											</p>
											{token.description ? (
												<p
													style={{
														margin: "var(--fds-space-4) 0 0",
														fontSize: "var(--fds-font-size-30)",
														color: "var(--fds-color-text-subtle)",
														lineHeight: "var(--fds-font-line-height-relaxed)",
													}}
												>
													{token.description}
												</p>
											) : null}
										</div>
									</div>
								))}
						</div>
					</div>
				))}
			</Section>

			<Section
				number="03"
				title="One name, four answers"
				subtitle="The argument for the contract, in one table. Both themes answer every name, and the build refuses a theme that skips one."
			>
				<div className="table-wrap">
					<table className="data">
						<thead>
							<tr>
								<th scope="col">Semantic token</th>
								{themes.map((item) => (
									<th scope="col" key={item.name}>
										{item.label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{comparison.map((path) => (
								<tr key={path}>
									<td>
										<span className="mono">{path.replace("color.", "")}</span>
									</td>
									{themes.map((item) => {
										const token = item.tokens.find((entry) => entry.path === path);
										return (
											<td key={item.name}>
												<span
													style={{
														display: "inline-flex",
														alignItems: "center",
														gap: "var(--fds-space-4)",
													}}
												>
													<span
														className="swatch"
														style={{ width: "1.75rem", height: "1.75rem", background: token?.resolved }}
													/>
													<span className="mono mono--subtle" style={{ whiteSpace: "normal" }}>
														{token?.alias}
														<br />
														{token?.resolved}
													</span>
												</span>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section number="04" title="Rules" subtitle="Short, because a colour system with fifteen rules has none.">
				<div className="guidance">
					<div className="guidance__col guidance__col--do">
						<h3 className="guidance__title">Do</h3>
						<ul>
							<li>Reach for a semantic name first. If none fits, the gap is in the contract.</li>
							<li>Use accent for action, focus and selection only.</li>
							<li>
								Pair every bold surface with its matching <span className="mono">on-*</span> text token.
							</li>
							<li>Check both dark and light before merging. The switcher is one click.</li>
						</ul>
					</div>
					<div className="guidance__col guidance__col--dont">
						<h3 className="guidance__title">Do not</h3>
						<ul>
							<li>Reference a tier 1 colour from a component. The lint fails the build.</li>
							<li>Use accent as a large fill behind body copy.</li>
							<li>Introduce a hue for one feature. Status hues are the vocabulary.</li>
							<li>
								Use <span className="mono">#000</span> as a surface. The ink ramp bottoms out at{" "}
								<span className="mono">#04050a</span> for a reason.
							</li>
						</ul>
					</div>
				</div>
			</Section>
		</>
	);
}
