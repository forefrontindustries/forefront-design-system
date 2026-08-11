import type { ComponentMeta } from "../../lib/meta";

export const inputMeta: ComponentMeta = {
	name: "Input",
	slug: "input",
	status: "stable",
	category: "Forms",
	since: "1.0.0",
	summary: "Single-line text entry with label, helper text and validation message.",
	description:
		"Wraps a native input so browser autofill, password managers and mobile keyboards keep working. Validity is derived from the error prop, so it is impossible to render a red field with no explanation. Use a native textarea for multi-line entry rather than growing this component.",
	tokens: [
		"control.height.*",
		"control.padding-x.*",
		"control.font-size.*",
		"control.radius",
		"input.min-width",
		"input.invalid-border-width",
		"field.gap",
		"field.label-font-size",
		"field.message-font-size",
		"focus.ring-*",
	],
	anatomy: [
		{ part: "Label", description: "A real <label for>. Clicking it focuses the control.", required: false },
		{ part: "Field", description: "The bordered box. Carries hover, focus and invalid states.", required: true },
		{ part: "Leading adornment", description: "Decorative icon or unit, aria-hidden.", required: false },
		{ part: "Control", description: "The native input element.", required: true },
		{ part: "Trailing adornment", description: "Decorative icon, unit or counter.", required: false },
		{ part: "Description", description: "Helper text, referenced by aria-describedby.", required: false },
		{
			part: "Error",
			description: "Validation message, referenced by both aria-describedby and aria-errormessage.",
			required: false,
		},
	],
	keyboard: [
		{ keys: "Tab", action: "Moves focus into the field." },
		{ keys: "Escape", action: "Native behaviour only. The component does not intercept it." },
	],
	accessibility: [
		{
			title: "The error id is referenced twice, deliberately",
			detail:
				"aria-errormessage is the correct attribute for a validation message, but support is still uneven. The id is also placed in aria-describedby so the message is announced everywhere. A message some users never hear is not an acceptable failure mode.",
		},
		{
			title: "Placeholder is not a label",
			detail:
				"The placeholder token is text.placeholder, which is intentionally not contrast-checked as body copy, because placeholder text disappears the moment someone types. Every field needs a label, visible or visually hidden.",
		},
		{
			title: "The focus ring lives on the wrapper",
			detail:
				"The visible field is the bordered box, not the bare input, so the ring is drawn with :focus-within and the inner element clears its own outline. One of two places in the library where outline: none appears, the other being the link overlay on an interactive Card, and in both the replacement ring is in the same file.",
		},
		{
			title: "Invalid state is not colour alone",
			detail:
				"An invalid field changes border colour, thickens the border by one step, and always renders a text message. Colour is the third signal, not the only one.",
		},
	],
	guidance: {
		do: [
			"Always pass a label, even when the design shows none. Use a visually hidden label in that case.",
			"Put format requirements in description before validation, not only in the error.",
			"Set inputMode and autoComplete for real-world data like phone numbers and postal codes.",
			"Validate on blur or submit, not on every keystroke.",
		],
		dont: [
			"Do not use the placeholder as the label.",
			"Do not set an invalid style without an error message.",
			"Do not disable a field to communicate that it is not ready. Explain why in the description instead.",
			"Do not use this for multi-line entry.",
		],
	},
	related: ["Select", "Checkbox"],
};
