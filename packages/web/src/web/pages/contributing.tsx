import { componentMeta } from "@forefront/ui/meta";
import { PageHeader, Section } from "../components/docs/shell";
import { Code, NotesBlock, StatusPill } from "../components/docs/blocks";

/**
 * Governance. The part of a design system that decides whether it is still
 * usable in three years, and the part that is usually a paragraph saying "open a
 * PR".
 */
export default function ContributingPage() {
	const byStatus = {
		stable: componentMeta.filter((meta) => meta.status === "stable").length,
		beta: componentMeta.filter((meta) => meta.status === "beta").length,
		alpha: componentMeta.filter((meta) => meta.status === "alpha").length,
		deprecated: componentMeta.filter((meta) => meta.status === "deprecated").length,
	};

	const principles = [
		{
			title: "The system says no more often than it says yes",
			detail:
				"Every component added is a component to maintain, test, theme and migrate. A system with forty components and four maintainers is a system where twelve components are quietly broken. The default answer to a new component is a composition of existing ones.",
		},
		{
			title: "A variant needs two unrelated consumers",
			detail:
				"One team needing a slightly different button is a one-off. Two teams needing the same slightly different button is a gap in the system. Waiting for the second consumer is what keeps the variant list from becoming a changelog of individual deadlines.",
		},
		{
			title: "Accessibility is not a review comment",
			detail:
				"A component cannot reach beta without a keyboard table and an accessibility section in its meta file, because those are the fields the docs render. Missing them is a broken page, not a note in a review.",
		},
		{
			title: "Deprecation has a stated end",
			detail:
				"A deprecation without a removal version is a permanent second way to do the thing. Each deprecated export carries a replacement and a version, and the docs page renders both in a banner.",
		},
	];

	return (
		<>
			<PageHeader
				eyebrow="Overview"
				title="Contributing and governance"
				lede="How a change gets in, how a component earns the word stable, and how something leaves without breaking three products."
			/>

			<div className="stat-row" style={{ marginBlockStart: "var(--fds-space-10)" }}>
				<div className="stat">
					<div className="stat__value">{byStatus.stable}</div>
					<div className="stat__label">Stable</div>
				</div>
				<div className="stat">
					<div className="stat__value">{byStatus.beta}</div>
					<div className="stat__label">Beta</div>
				</div>
				<div className="stat">
					<div className="stat__value">{byStatus.alpha}</div>
					<div className="stat__label">Alpha</div>
				</div>
				<div className="stat">
					<div className="stat__value">{byStatus.deprecated}</div>
					<div className="stat__label">Deprecated</div>
				</div>
			</div>

			<Section
				number="01"
				title="Lifecycle"
				subtitle="The status pill in the navigation is the contract. It tells a consumer how much risk they are taking on."
			>
				<div className="table-wrap">
					<table className="data">
						<thead>
							<tr>
								<th scope="col">Status</th>
								<th scope="col">Means</th>
								<th scope="col">Breaking changes</th>
								<th scope="col">Requirements to enter</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<StatusPill status="alpha" />
								</td>
								<td>Shape is still being explored. Ship behind a flag or in one surface.</td>
								<td>Any time, without notice.</td>
								<td>Works, is keyboard operable, has a meta file.</td>
							</tr>
							<tr>
								<td>
									<StatusPill status="beta" />
								</td>
								<td>API shape settled, edge cases still moving.</td>
								<td>Changelog entry, no deprecation window.</td>
								<td>Full keyboard table, accessibility notes, generated prop table, both themes checked.</td>
							</tr>
							<tr>
								<td>
									<StatusPill status="stable" />
								</td>
								<td>Safe to adopt broadly.</td>
								<td>Deprecation release first, then removal.</td>
								<td>
									Two unrelated consumers in production, both themes checked, both densities checked,
									do and do-not guidance written.
								</td>
							</tr>
							<tr>
								<td>
									<StatusPill status="deprecated" />
								</td>
								<td>Still works, receives no feature work.</td>
								<td>Removed in the stated version.</td>
								<td>A named replacement and a removal version, both rendered on the page.</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p className="prose" style={{ marginBlockStart: "var(--fds-space-8)" }}>
					Select and Tooltip are beta in this release, and the pages say why. Select is beta because option
					groups and multi-select will both change its props. Tooltip is beta because its positioning is
					flip-only, which is enough for the current surface area and not enough for nested overlays. Marking
					them stable to make the table look tidier would be the first small lie the system tells.
				</p>
			</Section>

			<Section
				number="02"
				title="Getting a change in"
				subtitle="The order matters: the proposal is cheap, the implementation is not."
			>
				<Code standalone>{`1  Open a proposal issue
   What problem, what surfaces it appears in, what you tried with existing
   components, and why composition did not work. Screenshots of the real
   product, not a mockup of the component you want.

2  Design review
   One maintainer plus one designer. Outcome is one of: compose from existing,
   extend an existing component, or accept as new.

3  Tokens before components
   If the change needs a value the contract does not expose, that is a separate
   pull request. Tokens land first, they are reviewed on their own merits, and
   the component change stays readable. A new text, border or icon token also
   needs an entry in contrast.json, either a measured requirement or a named
   exemption. The build rejects it otherwise, so this is not a review comment.

4  Implementation
   src/components/<name>/
     <name>.tsx        forwardRef, documented props, no third-party primitives
     <name>.css        @layer fds.components, tier 2 and tier 3 tokens only
     <name>.meta.ts    status, anatomy, keyboard, accessibility notes, guidance
   Register the export in src/index.ts and the meta in src/meta.ts.

5  Docs
   Add a demo to packages/web/src/web/demos/ and register it in demos/index.tsx.
   The prop table generates itself. The playground controls generate themselves.

6  Checks
   bun run tokens:build     token pipeline, eight validation rules, contrast gate
   bun run api:build        regenerate the component API from the types
   bun run lint             conventions, CSS token contract, oxlint
   bun run typecheck        every package
   bun run build            production build
   bun run audit:keyboard   55 keyboard and ARIA assertions in a real browser`}</Code>
			</Section>

			<Section
				number="03"
				title="Review checklist"
				subtitle="What a reviewer actually reads, in order. Anything unchecked is a request for changes, not a comment."
			>
				<div className="guidance">
					<div className="guidance__col guidance__col--do">
						<h3 className="guidance__title">Behaviour</h3>
						<ul>
							<li>Every interactive element reachable by Tab, in visual order.</li>
							<li>Focus visible on every stop, using the shared ring.</li>
							<li>Arrow key model matches the ARIA pattern for the role.</li>
							<li>Escape dismisses anything that overlays content.</li>
							<li>Focus returns to the trigger when an overlay closes.</li>
							<li>Controlled and uncontrolled both work.</li>
							<li>No animation on layout properties.</li>
						</ul>
					</div>
					<div className="guidance__col guidance__col--dont">
						<h3 className="guidance__title">Contract</h3>
						<ul>
							<li>No hex literals or tier 1 colour references in CSS. The lint enforces it.</li>
							<li>No new tier 3 token unless density or system-wide sizing needs it.</li>
							<li>Checked in both themes and both densities.</li>
							<li>Disabled state uses the token pair, never opacity.</li>
							<li>Every prop has a JSDoc line and a documented default.</li>
							<li>Meta file has anatomy, keyboard, accessibility and guidance.</li>
							<li>No third-party primitive introduced.</li>
						</ul>
					</div>
				</div>
			</Section>

			<Section number="04" title="Principles behind the process">
				<NotesBlock notes={principles} />
			</Section>

			<Section
				number="05"
				title="Repository layout"
				subtitle="Two published packages and a documentation site that consumes them exactly as a product would."
			>
				<Code standalone>{`packages/
  tokens/                     @forefront/tokens
    src/                      DTCG JSON source, the only hand-edited files
    src/contrast.json         the contrast contract the build enforces
    tooling/build-tokens.ts    the pipeline
    build/                    generated and committed: css, ts, figma, manifest

  ui/                         @forefront/ui
    src/lib/                  focus trap, presence, controllable state, cx
    src/components/<name>/    tsx + css + meta.ts
    tooling/extract-props.ts  TypeScript compiler API to API JSON
    tooling/lint-css-tokens.ts enforces the token contract in CSS

  web/                        the documentation site
    src/web/pages/            routes
    src/web/demos/            live examples, one file per component family
    src/web/generated/        committed component API JSON

Generated files are committed on purpose. A fresh clone renders the docs with no
build step, a reviewer can read the output on GitHub, and no generated file
carries a timestamp so rebuilding never produces a diff.`}</Code>
			</Section>
		</>
	);
}
