import { useState, type ReactNode } from "react";
import type { AccessibilityNote, ComponentStatus, Guidance, KeyboardBinding } from "@forefront/ui";
import componentApi from "../../generated/component-api.json";

/**
 * The repeated pieces of a documentation page.
 *
 * Every component page renders the same blocks in the same order. That
 * consistency is itself an argument for the system: a reader who has read one
 * component page knows where to find the keyboard table on all twelve.
 */

export function StatusPill({ status }: { status: ComponentStatus }) {
	return <span className={`pill pill--${status}`}>{status}</span>;
}

export function Code({ children, standalone = false }: { children: string; standalone?: boolean }) {
	return (
		<pre className={`code${standalone ? " code--standalone" : ""}`}>
			<code>{children}</code>
		</pre>
	);
}

/**
 * A live example with its source underneath.
 *
 * The source is authored next to the demo rather than serialised from the
 * rendered React tree. Serialising produces output nobody would write by hand,
 * and the snippet is the thing people copy, so it has to read like real code.
 */
export function Demo({
	title,
	caption,
	code,
	layout = "row",
	children,
}: {
	title: string;
	caption?: string;
	code?: string;
	layout?: "row" | "column" | "center";
	children: ReactNode;
}) {
	const [showCode, setShowCode] = useState(false);

	return (
		<figure style={{ margin: "0 0 var(--fds-space-8)" }}>
			<div className="demo">
				<div
					className={`demo__stage${layout === "column" ? " demo__stage--column" : ""}${
						layout === "center" ? " demo__stage--center" : ""
					}`}
				>
					{children}
				</div>
				<div className="demo__bar">
					<span>{title}</span>
					{code ? (
						<button
							type="button"
							className="segmented__option"
							aria-pressed={showCode}
							onClick={() => setShowCode((value) => !value)}
						>
							{showCode ? "Hide code" : "Show code"}
						</button>
					) : null}
				</div>
				{code && showCode ? <Code>{code}</Code> : null}
			</div>
			{caption ? <figcaption className="demo__caption">{caption}</figcaption> : null}
		</figure>
	);
}

export function GuidanceBlock({ guidance }: { guidance: Guidance }) {
	return (
		<div className="guidance">
			<div className="guidance__col guidance__col--do">
				<h3 className="guidance__title">Do</h3>
				<ul>
					{guidance.do.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>
			<div className="guidance__col guidance__col--dont">
				<h3 className="guidance__title">Do not</h3>
				<ul>
					{guidance.dont.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export function NotesBlock({ notes }: { notes: AccessibilityNote[] }) {
	return (
		<div className="notes">
			{notes.map((note, index) => (
				<div className="note" key={note.title}>
					<span className="note__index" aria-hidden="true">
						{String(index + 1).padStart(2, "0")}
					</span>
					<div>
						<h3 className="note__title">{note.title}</h3>
						<p className="note__detail">{note.detail}</p>
					</div>
				</div>
			))}
		</div>
	);
}

export function KeyboardTable({ bindings }: { bindings: KeyboardBinding[] }) {
	return (
		<div className="table-wrap">
			<table className="data">
				<caption>Keyboard interaction</caption>
				<thead>
					<tr>
						<th scope="col">Keys</th>
						<th scope="col">Result</th>
					</tr>
				</thead>
				<tbody>
					{bindings.map((binding) => (
						<tr key={binding.keys}>
							<td>
								<span className="mono">{binding.keys}</span>
							</td>
							<td>{binding.action}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function AnatomyTable({
	parts,
}: {
	parts: { part: string; description: string; required: boolean }[];
}) {
	return (
		<div className="table-wrap">
			<table className="data">
				<caption>Anatomy</caption>
				<thead>
					<tr>
						<th scope="col">Part</th>
						<th scope="col">Always rendered</th>
						<th scope="col">Role</th>
					</tr>
				</thead>
				<tbody>
					{parts.map((part) => (
						<tr key={part.part}>
							<td>{part.part}</td>
							<td>
								<span className="mono mono--subtle">{part.required ? "yes" : "optional"}</span>
							</td>
							<td>{part.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function TokenList({ tokens }: { tokens: string[] }) {
	return (
		<div className="table-wrap">
			<table className="data">
				<caption>
					Tokens this component reads. Nothing else: the CSS lint rejects hex literals and tier 1 colour
					references in component stylesheets.
				</caption>
				<tbody>
					{tokens.map((token) => (
						<tr key={token}>
							<td>
								<span className="mono">{token}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* --------------------------------------------------------------- prop table */

type ApiFile = {
	source: string;
	interfaces: {
		name: string;
		description: string;
		extends: string[];
		props: {
			name: string;
			type: string;
			required: boolean;
			description: string;
			defaultValue: string | null;
			control: { kind: string; options?: string[] };
		}[];
	}[];
};

const apiFiles = componentApi.files as Record<string, ApiFile>;

export type PropDoc = ApiFile["interfaces"][number]["props"][number];
export type InterfaceDoc = ApiFile["interfaces"][number];

/** Looks up a generated interface by name across every component file. */
export function findInterface(name: string): { doc: InterfaceDoc; source: string } | null {
	for (const file of Object.values(apiFiles)) {
		const doc = file.interfaces.find((item) => item.name === name);
		if (doc) return { doc, source: file.source };
	}
	return null;
}

export function PropTable({ interfaceName }: { interfaceName: string }) {
	const found = findInterface(interfaceName);
	if (!found) {
		return (
			<p className="prose">
				No generated documentation found for <code>{interfaceName}</code>. Run{" "}
				<code>bun run api:build</code>.
			</p>
		);
	}

	const { doc, source } = found;

	return (
		<div style={{ marginBlockEnd: "var(--fds-space-8)" }}>
			<div className="table-wrap">
				<table className="data">
					<caption>
						<span className="mono">{doc.name}</span> generated from{" "}
						<span className="mono mono--subtle">{source}</span> by the TypeScript compiler API. Hand-written
						prop tables are wrong within two releases.
					</caption>
					<thead>
						<tr>
							<th scope="col">Prop</th>
							<th scope="col">Type</th>
							<th scope="col">Default</th>
							<th scope="col">Notes</th>
						</tr>
					</thead>
					<tbody>
						{doc.props.map((prop) => (
							<tr key={prop.name}>
								<td>
									<span className="mono">{prop.name}</span>
									{prop.required ? (
										<>
											{" "}
											<span className="required-dot" title="Required">
												*
											</span>
										</>
									) : null}
								</td>
								<td>
									<span className="mono mono--subtle" style={{ whiteSpace: "normal" }}>
										{prop.type}
									</span>
								</td>
								<td>
									<span className="mono mono--subtle">{prop.defaultValue ?? "–"}</span>
								</td>
								<td>{prop.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{doc.extends.length > 0 ? (
				<p className="demo__caption">
					Also accepts every prop of <span className="mono">{doc.extends.join(", ")}</span>, forwarded to the
					underlying element. Those are not listed: 250 inherited DOM attributes in a table is noise, and the
					React types already document them.
				</p>
			) : null}
			<p className="demo__caption">
				<span className="required-dot">*</span> required prop.
			</p>
		</div>
	);
}
