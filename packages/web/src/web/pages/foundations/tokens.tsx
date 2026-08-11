import { useState } from "react";
import { componentTokens, densities, primitives, themes } from "@forefront/tokens";
import manifest from "@forefront/tokens/manifest";
import { PageHeader, Section } from "../../components/docs/shell";
import { Code } from "../../components/docs/blocks";

/**
 * Token architecture page. Everything on it is read from the generated model or
 * the manifest, so it cannot describe a pipeline the pipeline does not have.
 */
export default function TokensPage() {
	const [themeName, setThemeName] = useState(themes[0]!.name);
	const theme = themes.find((item) => item.name === themeName) ?? themes[0]!;
	const [group, setGroup] = useState("color.surface");

	const groups = [...new Set(theme.tokens.map((token) => token.path.split(".").slice(0, 2).join(".")))];
	const visible = theme.tokens.filter((token) => token.path.startsWith(group));

	return (
		<>
			<PageHeader
				eyebrow="Foundations"
				title="Token architecture"
				lede="DTCG JSON in, four artifacts out, with six validation rules in between that fail the build rather than shipping a half-themed component."
			/>

			<Section
				number="01"
				title="The pipeline"
				subtitle="One source of truth, compiled. The build is 500 lines of TypeScript and no dependencies, because a token pipeline is the last place a team should inherit someone else's abstractions."
			>
				<Code standalone>{`bun run tokens:build

  read      primitives.json, semantic.json, themes/*.json, component.json, density/*.json
  flatten   DTCG traversal with $type inheritance from ancestor groups
  contract  collect the ${manifest.counts.semanticContract} semantic names, with no values attached
  validate  six rules, all hard failures (see below)
  resolve   alias chains to literals, depth-limited, cycle-detecting
  emit      tokens.css        ${manifest.counts.totalCustomProperties} custom properties in cascade layers
            tokens.ts         typed model: resolved values plus the alias chain
            tokens.figma.json 3 collections, VARIABLE_ALIAS references preserved
            manifest.json     counts, coverage, unreferenced primitives

  result    ${manifest.counts.primitives} primitives, ${manifest.counts.semanticContract} semantic x ${manifest.counts.themes} themes, ${manifest.counts.componentTokens} component, ${manifest.counts.densities} densities`}</Code>

				<h3 className="subhead">Why the semantic tier holds no values</h3>
				<p className="prose">
					<span className="inline-code">semantic.json</span> is a contract: names, types and descriptions,
					nothing else. Each theme file supplies every value. That inversion is what makes the coverage check
					possible, and coverage is the only reason four themes stay in step. A semantic layer with default
					values looks friendlier and quietly lets a theme skip a token, which surfaces months later as one
					unstyled hover state in the theme nobody tests.
				</p>

				<Code standalone>{`// semantic.json — the contract. No values.
"surface": {
  "raised": {
    "$type": "color",
    "$description": "Card and panel background sitting above the canvas."
  }
}

// themes/forefront-dark.json — one theme's answer.
"surface": { "raised": { "$value": "{color.ink.850}" } }

// themes/forefront-light.json — a different answer, same name.
"surface": { "raised": { "$value": "{color.slate.0}" } }`}</Code>
			</Section>

			<Section
				number="02"
				title="Theme coverage"
				subtitle="Read from the manifest, which is written by the build. If a theme were incomplete the build would have failed before this page existed."
			>
				<div className="table-wrap">
					<table className="data">
						<thead>
							<tr>
								<th scope="col">Theme</th>
								<th scope="col">Appearance</th>
								<th scope="col">Default</th>
								<th scope="col">Contract coverage</th>
							</tr>
						</thead>
						<tbody>
							{manifest.themes.map((item) => (
								<tr key={item.name}>
									<td>
										<span className="mono">{item.name}</span>
										<br />
										{themes.find((t) => t.name === item.name)?.description}
									</td>
									<td>
										<span className="mono mono--subtle">{item.appearance}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{item.isDefault ? "yes" : "no"}</span>
									</td>
									<td>
										<span className="mono">{item.coverage}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				number="03"
				title="Alias chains"
				subtitle="Every semantic token, its alias, and the literal it resolves to in this theme. The chain is emitted by the build so tooling never has to re-resolve it."
			>
				<div className="control-row" style={{ marginBlockEnd: "var(--fds-space-6)" }}>
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
				<div className="control-row" style={{ marginBlockEnd: "var(--fds-space-7)" }}>
					<div className="segmented" role="group" aria-label="Token group">
						{groups.map((item) => (
							<button
								key={item}
								type="button"
								className="segmented__option"
								aria-pressed={group === item}
								onClick={() => setGroup(item)}
							>
								{item}
							</button>
						))}
					</div>
				</div>

				<div className="table-wrap">
					<table className="data">
						<caption>
							{visible.length} tokens in <span className="mono">{group}</span>, resolved for {theme.label}.
						</caption>
						<thead>
							<tr>
								<th scope="col" />
								<th scope="col">Semantic name</th>
								<th scope="col">Alias</th>
								<th scope="col">Resolves to</th>
								<th scope="col">Intent</th>
							</tr>
						</thead>
						<tbody>
							{visible.map((token) => (
								<tr key={token.path}>
									<td>
										{token.type === "color" ? (
											<span
												className="swatch"
												style={{ width: "2.5rem", height: "1.75rem", background: token.resolved }}
											/>
										) : null}
									</td>
									<td>
										<span className="mono">{token.path}</span>
										<br />
										<span className="mono mono--subtle">{token.cssVar}</span>
									</td>
									<td>
										<span className="mono mono--subtle">{token.alias ?? "literal"}</span>
									</td>
									<td>
										<span className="mono" style={{ whiteSpace: "normal" }}>
											{token.resolved}
										</span>
									</td>
									<td>{token.description}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>

			<Section
				number="04"
				title="Cascade layers"
				subtitle="Override precedence is declared once, in the generated stylesheet, so a consumer can reason about it without reading every file."
			>
				<Code standalone>{`@layer fds.reset, fds.primitives, fds.semantic, fds.component, fds.components, fds.overrides;

fds.reset        minimal, scoped to [data-fds-theme]. Never touches html or body.
fds.primitives   tier 1 on :root
fds.semantic     tier 2 per theme, plus the default theme on :root
fds.component    tier 3, plus the density block, plus reduced motion
fds.components   every component stylesheet
fds.overrides    yours. Empty in this repo, and always wins.`}</Code>
				<p className="prose" style={{ marginBlockStart: "var(--fds-space-7)" }}>
					Consumers get a layer that beats the library without a specificity fight and without{" "}
					<span className="inline-code">!important</span>. That matters more than it sounds: the alternative is
					every adopting team inventing its own escape hatch, and the system losing the ability to change any
					component style safely.
				</p>
			</Section>

			<Section
				number="05"
				title="Figma sync"
				subtitle="The build emits a Figma Variables payload with alias references intact, not a flat list of hex values."
			>
				<p className="prose">
					Three collections: Primitives, Semantic with one mode per theme, and Component with one mode per
					density. Aliases are emitted as <span className="inline-code">VARIABLE_ALIAS</span> references rather
					than resolved literals, which is the whole point. A designer changing{" "}
					<span className="inline-code">color.blue.500</span> in Figma sees every semantic token that points at
					it move, exactly as a developer does in CSS. Flattening the aliases would produce a file that looks
					correct and behaves nothing like the code.
				</p>
				<Code standalone>{`{
  "collections": [
    {
      "name": "Semantic",
      "modes": ["Forefront Dark", "Forefront Light"],
      "variables": [
        {
          "name": "color/surface/accent-bold",
          "type": "COLOR",
          "valuesByMode": {
            "Forefront Dark":  { "type": "VARIABLE_ALIAS", "id": "color/blue/500" },
            "Forefront Light": { "type": "VARIABLE_ALIAS", "id": "color/blue/600" }
          }
        }
      ]
    }
  ]
}`}</Code>
				<p className="prose" style={{ marginBlockStart: "var(--fds-space-7)" }}>
					The direction of travel is code to Figma, deliberately. Design owns the proposal, code owns the
					source, and a token exists once it is in the JSON. Two-way sync sounds better and produces a system
					where nobody can say which side is authoritative during an incident.
				</p>
			</Section>

			<Section
				number="06"
				title="Adding a token"
				subtitle="The workflow, in the order the build will accept it."
			>
				<Code standalone>{`1  Does a primitive already exist? ${primitives.length} do. Reuse before adding.
2  New colour ramp step goes in primitives.json. This is the only file where a
   literal is allowed.
3  Add the name to semantic.json with a $type and a $description that explains
   intent, not appearance. "Background for a destructive action" ages well.
   "Red 600" does not.
4  Add a value to all ${themes.length} theme files. The build fails if you miss one, and the
   error names the theme and the token.
5  Only reach for tier 3 (${componentTokens.length} tokens) when a component needs geometry that
   should be adjustable system-wide, or when density has to override it.
   ${densities.length} density file(s) may only override tier 3.
6  bun run tokens:build && bun run lint:tokens`}</Code>
			</Section>
		</>
	);
}
