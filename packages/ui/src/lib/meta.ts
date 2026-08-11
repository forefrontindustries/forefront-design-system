/**
 * Component metadata contract.
 *
 * Every component ships a `.meta.ts` file next to its implementation. The docs
 * site renders from these objects, which means documentation lives in the same
 * pull request as the code and cannot rot independently of it. The prop tables
 * are NOT here: those are generated from the TypeScript types by
 * `tooling/extract-props.ts`, because hand-maintained prop tables are wrong
 * within two releases.
 */

/**
 * Lifecycle status. Consumers read this to decide how much risk they are
 * taking on, so the definitions are strict:
 *
 * - `alpha`: API will change without a deprecation window. Ship behind a flag.
 * - `beta`: API is stable in shape, edge cases still moving. Breaking changes
 *   get a changelog entry but no deprecation period.
 * - `stable`: breaking changes require a deprecation release first.
 * - `deprecated`: still works, no longer accepts feature work, has a stated
 *   replacement and removal version.
 */
export type ComponentStatus = "alpha" | "beta" | "stable" | "deprecated";

export type ComponentCategory = "Actions" | "Forms" | "Feedback" | "Containment" | "Navigation";

export interface AnatomyPart {
	/** Label shown in the anatomy diagram. */
	part: string;
	/** What the part is for, and whether it is required. */
	description: string;
	/** Whether the part renders unconditionally. */
	required: boolean;
}

export interface KeyboardBinding {
	keys: string;
	action: string;
}

export interface AccessibilityNote {
	title: string;
	detail: string;
}

export interface Guidance {
	do: string[];
	dont: string[];
}

export interface ComponentMeta {
	/** Exported component name, used as the docs route slug source. */
	name: string;
	/** URL slug under /components. */
	slug: string;
	status: ComponentStatus;
	category: ComponentCategory;
	/** Version the component reached its current status in. */
	since: string;
	/** One sentence. Shown in the component index and page header. */
	summary: string;
	/** Two or three sentences on what problem it solves and when not to use it. */
	description: string;
	/** Tier 3 tokens the component reads. Rendered as a table on the docs page. */
	tokens: string[];
	anatomy: AnatomyPart[];
	keyboard: KeyboardBinding[];
	accessibility: AccessibilityNote[];
	guidance: Guidance;
	/** Sibling components a reader is probably comparing this against. */
	related: string[];
	/** Only set when status is `deprecated`. */
	deprecation?: { replacement: string; removeIn: string; reason: string };
}
