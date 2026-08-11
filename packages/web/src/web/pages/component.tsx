import { Link, useParams } from "wouter";
import { componentMetaBySlug } from "@forefront/ui/meta";
import { PageHeader, Section } from "../components/docs/shell";
import {
	AnatomyTable,
	GuidanceBlock,
	KeyboardTable,
	NotesBlock,
	PropTable,
	StatusPill,
	TokenList,
} from "../components/docs/blocks";
import { demos } from "../demos";

/**
 * One page template for all twelve components, driven by the component's own
 * meta file plus the generated API. Documentation that lives beside the code
 * cannot drift from it, and a fixed section order means a reader who has learned
 * one page has learned all of them.
 */
export default function ComponentPage() {
	const { slug } = useParams<{ slug: string }>();
	const meta = componentMetaBySlug[slug ?? ""];
	const demo = demos[slug ?? ""];

	if (!meta) {
		return (
			<>
				<PageHeader
					eyebrow="Not found"
					title="No such component"
					lede="This slug is not in the registry. The navigation is generated from the same source, so a broken link here means a component was renamed without updating its meta file."
				/>
				<p className="prose" style={{ marginBlockStart: "var(--fds-space-8)" }}>
					<Link href="/components/button" className="text-link">
						Back to Button
					</Link>
				</p>
			</>
		);
	}

	const Playground = demo?.playground;
	const Examples = demo?.examples;

	return (
		<>
			<PageHeader
				eyebrow={`${meta.category} / since ${meta.since}`}
				title={meta.name}
				lede={meta.summary}
				trailing={<StatusPill status={meta.status} />}
			/>

			<p className="prose" style={{ marginBlockStart: "var(--fds-space-7)" }}>
				{meta.description}
			</p>

			{meta.deprecation ? (
				<div
					className="panel"
					style={{
						marginBlockStart: "var(--fds-space-7)",
						padding: "var(--fds-space-7)",
						borderColor: "var(--fds-color-border-danger)",
					}}
				>
					<p style={{ margin: 0 }}>
						Deprecated. Use <span className="mono">{meta.deprecation.replacement}</span> instead. Removed in{" "}
						{meta.deprecation.removeIn}. {meta.deprecation.reason}
					</p>
				</div>
			) : null}

			<Section
				number="01"
				title="Playground"
				subtitle="Controls are generated from the TypeScript types, not configured by hand. Add a variant to the union and it appears here."
				id="playground"
			>
				{Playground ? <Playground /> : <p className="prose">No playground registered for this component.</p>}
			</Section>

			<Section number="02" title="Anatomy" id="anatomy">
				<AnatomyTable parts={meta.anatomy} />
			</Section>

			<Section
				number="03"
				title="Examples"
				subtitle="Each example exists to show a decision, not to fill the page."
				id="examples"
			>
				{Examples ? <Examples /> : null}
			</Section>

			<Section
				number="04"
				title="API"
				subtitle="Generated from the source declarations by the TypeScript compiler API."
				id="api"
			>
				{demo?.interfaces.map((name) => <PropTable key={name} interfaceName={name} />)}
			</Section>

			<Section
				number="05"
				title="Accessibility"
				subtitle="What this component does for you, and what it still expects from the consumer."
				id="accessibility"
			>
				<NotesBlock notes={meta.accessibility} />
				<div style={{ marginBlockStart: "var(--fds-space-9)" }}>
					<KeyboardTable bindings={meta.keyboard} />
				</div>
			</Section>

			<Section number="06" title="Guidance" id="guidance">
				<GuidanceBlock guidance={meta.guidance} />
			</Section>

			<Section
				number="07"
				title="Tokens"
				subtitle="Tier 3 and tier 2 only. The CSS lint fails the build on a hex literal or a tier 1 colour reference."
				id="tokens"
			>
				<TokenList tokens={meta.tokens} />
				{meta.related.length > 0 ? (
					<p className="prose" style={{ marginBlockStart: "var(--fds-space-8)" }}>
						Related:{" "}
						{meta.related.map((name, index) => {
							const target = Object.values(componentMetaBySlug).find((item) => item.name === name);
							return (
								<span key={name}>
									{index > 0 ? ", " : ""}
									{target ? (
										<Link href={`/components/${target.slug}`} className="text-link">
											{name}
										</Link>
									) : (
										name
									)}
								</span>
							);
						})}
					</p>
				) : null}
			</Section>
		</>
	);
}
