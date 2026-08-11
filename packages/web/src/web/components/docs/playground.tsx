import { useMemo, useState, type ReactNode } from "react";
import { Input, Switch } from "@forefront/ui";
import { Code, findInterface, type PropDoc } from "./blocks";

/**
 * Live prop playground.
 *
 * The controls are not configured. They are derived from the generated component
 * API, which is itself derived from the TypeScript declarations: a union of
 * string literals becomes a segmented control, a boolean becomes a Switch, a
 * number or string becomes an Input. Adding a variant to a component type puts a
 * new option in this playground with no docs change at all, and renaming a prop
 * breaks the playground loudly instead of leaving a stale control behind.
 *
 * Props whose type is structural, a ReactNode or a callback are marked
 * unsupported by the extractor and excluded here rather than faked with a text
 * box that produces invalid values.
 */

export type PlaygroundValues = Record<string, string | number | boolean | undefined>;

export function Playground({
	interfaceName,
	componentName,
	props: exposed,
	initial = {},
	children: renderChild,
	code,
}: {
	/** Generated interface to read control metadata from. */
	interfaceName: string;
	/** Name used in the generated snippet. */
	componentName: string;
	/** Props to expose, in the order the controls should appear. */
	props: string[];
	/** Starting values. Anything omitted starts at the documented default. */
	initial?: PlaygroundValues;
	/** Renders the component with the current values. */
	children: (values: PlaygroundValues) => ReactNode;
	/** Overrides the generated snippet, for compound components. */
	code?: (values: PlaygroundValues) => string;
}) {
	const found = findInterface(interfaceName);
	const docs = useMemo(() => {
		if (!found) return [];
		const byName = new Map(found.doc.props.map((prop) => [prop.name, prop]));
		return exposed
			.map((name) => byName.get(name))
			.filter((prop): prop is PropDoc => Boolean(prop) && prop!.control.kind !== "unsupported");
	}, [found, exposed]);

	const [values, setValues] = useState<PlaygroundValues>(() => {
		const seed: PlaygroundValues = {};
		for (const prop of docs) {
			const fallback = prop.defaultValue?.replace(/^["']|["']$/g, "");
			if (prop.control.kind === "boolean") seed[prop.name] = fallback === "true";
			else if (fallback && fallback !== "undefined") seed[prop.name] = fallback;
		}
		return { ...seed, ...initial };
	});

	const set = (name: string, value: string | number | boolean | undefined) =>
		setValues((current) => ({ ...current, [name]: value }));

	const snippet = code
		? code(values)
		: buildSnippet(componentName, values, docs);

	return (
		<div className="demo" style={{ marginBlockEnd: "var(--fds-space-8)" }}>
			<div className="demo__stage demo__stage--center" style={{ minHeight: "9rem" }}>
				{renderChild(values)}
			</div>

			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "var(--fds-space-7)",
					padding: "var(--fds-space-7)",
					borderBlockStart: "var(--fds-border-width-thin) solid var(--fds-color-border-subtle)",
					backgroundColor: "var(--fds-color-surface-sunken)",
				}}
			>
				{docs.length === 0 ? (
					<p className="demo__caption" style={{ margin: 0 }}>
						This component has no scalar props to edit. Its API is composition, not configuration.
					</p>
				) : null}

				{docs.map((prop) => (
					<div key={prop.name} style={{ minWidth: "12rem" }}>
						<p
							className="brand__meta"
							style={{ marginBlockEnd: "var(--fds-space-4)", textTransform: "none" }}
						>
							{prop.name}
						</p>

						{prop.control.kind === "enum" ? (
							<div className="segmented" role="group" aria-label={prop.name}>
								{prop.control.options?.map((option) => (
									<button
										key={option}
										type="button"
										className="segmented__option"
										aria-pressed={values[prop.name] === option}
										onClick={() => set(prop.name, option)}
									>
										{option}
									</button>
								))}
							</div>
						) : null}

						{prop.control.kind === "boolean" ? (
							<Switch
								label={values[prop.name] ? "on" : "off"}
								checked={Boolean(values[prop.name])}
								onChange={(event) => set(prop.name, event.currentTarget.checked)}
							/>
						) : null}

						{prop.control.kind === "text" || prop.control.kind === "number" ? (
							<Input
								size="sm"
								type={prop.control.kind === "number" ? "number" : "text"}
								value={String(values[prop.name] ?? "")}
								onChange={(event) =>
									set(
										prop.name,
										prop.control.kind === "number"
											? Number(event.currentTarget.value)
											: event.currentTarget.value,
									)
								}
							/>
						) : null}
					</div>
				))}
			</div>

			<Code>{snippet}</Code>
		</div>
	);
}

function buildSnippet(componentName: string, values: PlaygroundValues, docs: PropDoc[]): string {
	const parts: string[] = [];
	for (const prop of docs) {
		const value = values[prop.name];
		if (value === undefined || value === "") continue;
		const defaultValue = prop.defaultValue?.replace(/^["']|["']$/g, "");
		if (typeof value === "boolean") {
			if (value === (defaultValue === "true")) continue;
			parts.push(value ? prop.name : `${prop.name}={false}`);
			continue;
		}
		if (String(value) === defaultValue) continue;
		parts.push(typeof value === "number" ? `${prop.name}={${value}}` : `${prop.name}="${value}"`);
	}

	if (parts.length === 0) return `<${componentName} />`;
	if (parts.length <= 2) return `<${componentName} ${parts.join(" ")} />`;
	return `<${componentName}\n\t${parts.join("\n\t")}\n/>`;
}
