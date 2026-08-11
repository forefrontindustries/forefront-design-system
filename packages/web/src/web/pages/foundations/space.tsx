import { useState } from "react";
import { componentTokens, densities, primitives, themes } from "@forefront/tokens";
import { Button, Input, Select } from "@forefront/ui";
import { PageHeader, Section } from "../../components/docs/shell";
import { Code } from "../../components/docs/blocks";
import { useTheme } from "../../components/docs/theme";

/** Space, radius, elevation, z-index and the density system. */
export default function SpacePage() {
	const { density, setDensity } = useTheme();
	const [themeName, setThemeName] = useState(themes[0]!.name);
	const theme = themes.find((item) => item.name === themeName) ?? themes[0]!;

	const spaces = primitives.filter((token) => token.path.startsWith("space."));
	const radii = primitives.filter((token) => token.path.startsWith("radius."));
	const zIndex = primitives.filter((token) => token.path.startsWith("z-index."));
	const compact = densities[0];

	const semanticRadii = theme.tokens.filter((token) => token.path.startsWith("radius."));
	const elevations = theme.tokens.filter((token) => token.path.startsWith("elevation."));

	return (
		<>
			<PageHeader
				eyebrow="Foundations"
				title="Space and density"
				lede="A 4px grid with numbered steps, radius owned by the theme, elevation reserved for true overlays, and a density mode that is only allowed to touch geometry."
			/>

			<Section
				number="01"
				title="Space scale"
				subtitle="Numbered, not named. The first four steps are deliberately close together because control internals need 2px resolution and layout does not."
			>
				<div className="table-wrap">
					<table className="data">
						<thead>
							<tr>
								<th scope="col">Token</th>
								<th scope="col">Value</th>
								<th scope="col">Scale</th>
							</tr>
						</thead>
						<tbody>
							{spaces.map((token) => (
								<tr key={token.path}>
									<td>
										<span className="mono">{token.path}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{token.value}</span>
									</td>
									<td style={{ width: "60%" }}>
										<span
											style={{
												display: "block",
												height: "0.5rem",
												width: token.value,
												minWidth: "1px",
												borderRadius: "var(--fds-radius-pill)",
												background: "var(--fds-color-surface-accent-bold)",
											}}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				number="02"
				title="Radius is theme-owned"
				subtitle="Three semantic names, mapped differently per theme. A component asks for control padding, not for 10px."
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

				<div
					style={{
						display: "grid",
						gap: "var(--fds-space-6)",
						gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
					}}
				>
					{semanticRadii.map((token) => (
						<div className="panel" key={token.path} style={{ padding: "var(--fds-space-7)" }}>
							<div
								style={{
									height: "4rem",
									borderRadius: token.resolved,
									border: "var(--fds-border-width-thin) solid var(--fds-color-border-accent)",
									background: "var(--fds-color-surface-accent-subtle)",
								}}
							/>
							<p className="mono" style={{ margin: "var(--fds-space-5) 0 0" }}>
								{token.path}
							</p>
							<p className="mono mono--subtle" style={{ margin: "var(--fds-space-2) 0 0" }}>
								{token.alias} &rarr; {token.resolved}
							</p>
						</div>
					))}
				</div>

				<div className="table-wrap" style={{ marginBlockStart: "var(--fds-space-8)" }}>
					<table className="data">
						<caption>Tier 1 radius ramp. Themes pick from it; components never reference it directly.</caption>
						<tbody>
							{radii.map((token) => (
								<tr key={token.path}>
									<td>
										<span className="mono">{token.path}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{token.value}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				number="03"
				title="Elevation"
				subtitle="Four steps, and three of them are for overlays. Structure comes from hairlines, not shadows: a card with a shadow on a dark surface reads as a smudge."
			>
				<div
					style={{
						display: "grid",
						gap: "var(--fds-space-7)",
						gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",
					}}
				>
					{elevations.map((token) => (
						<div
							key={token.path}
							style={{
								padding: "var(--fds-space-7)",
								borderRadius: "var(--fds-radius-surface)",
								background: "var(--fds-color-surface-raised)",
								border: "var(--fds-border-width-thin) solid var(--fds-color-border-subtle)",
								boxShadow: token.resolved,
							}}
						>
							<p className="mono" style={{ margin: 0 }}>
								{token.path}
							</p>
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
						</div>
					))}
				</div>
				<div className="table-wrap" style={{ marginBlockStart: "var(--fds-space-8)" }}>
					<table className="data">
						<caption>
							Stacking order is a token too, so an overlay author never guesses a number. Tooltip is highest
							because a tooltip on a toast action has to be readable.
						</caption>
						<tbody>
							{zIndex.map((token) => (
								<tr key={token.path}>
									<td>
										<span className="mono">{token.path}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{token.value}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				number="04"
				title="Density"
				subtitle="One attribute, a small override set, and a hard boundary on what it is allowed to change."
			>
				<div className="control-row" style={{ marginBlockEnd: "var(--fds-space-7)" }}>
					<div className="segmented" role="group" aria-label="Density">
						<button
							type="button"
							className="segmented__option"
							aria-pressed={density === "comfortable"}
							onClick={() => setDensity("comfortable")}
						>
							Comfortable
						</button>
						<button
							type="button"
							className="segmented__option"
							aria-pressed={density === "compact"}
							onClick={() => setDensity("compact")}
						>
							Compact
						</button>
					</div>
					<span className="mono mono--subtle">data-fds-density on the html element</span>
				</div>

				<div className="demo">
					<div className="demo__stage">
						<Input label="Account" placeholder="Filter by name" />
						<Select
							label="Status"
							options={[
								{ value: "all", label: "All" },
								{ value: "active", label: "Active" },
								{ value: "churned", label: "Churned" },
							]}
							defaultValue="all"
						/>
						<Button>Apply</Button>
						<Button variant="secondary">Reset</Button>
					</div>
					<div className="demo__bar">
						<span>Same components, same code, one attribute</span>
					</div>
				</div>

				<div className="table-wrap" style={{ marginBlockStart: "var(--fds-space-8)" }}>
					<table className="data">
						<caption>
							{compact?.label}: {compact?.description}
						</caption>
						<thead>
							<tr>
								<th scope="col">Tier 3 token</th>
								<th scope="col">Comfortable</th>
								<th scope="col">Compact</th>
							</tr>
						</thead>
						<tbody>
							{compact?.tokens.map((token) => {
								const base = componentTokens.find((item) => item.path === token.path);
								return (
									<tr key={token.path}>
										<td>
											<span className="mono">{token.path}</span>
										</td>
										<td>
											<span className="mono mono--subtle">{base?.resolved}</span>
										</td>
										<td>
											<span className="mono">{token.value}</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<Code standalone>{`Density may override                 tier 3 only
Density may not change               colour, type below 13px, focus ring geometry
Enforced by                          the token build, which fails on a density
                                     override that targets tier 1 or tier 2`}</Code>
			</Section>
		</>
	);
}
