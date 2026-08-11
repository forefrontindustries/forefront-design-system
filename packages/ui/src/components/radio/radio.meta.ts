import type { ComponentMeta } from "../../lib/meta";

export const radioMeta: ComponentMeta = {
	name: "RadioGroup",
	slug: "radio",
	status: "stable",
	category: "Forms",
	since: "1.0.0",
	summary: "Mutually exclusive options, grouped in a fieldset with a legend.",
	description:
		"Uses a shared input name so the browser provides the whole keyboard model: one tab stop for the group, arrow keys to move and select inside it. No roving tabindex, no key handlers, nothing to get wrong. Radio throws if rendered outside a RadioGroup, because a lone radio cannot be deselected.",
	tokens: ["radio.size", "radio.dot-size", "control.border-width", "field.gap", "focus.ring-*"],
	anatomy: [
		{ part: "Fieldset", description: "Groups the options and carries the disabled state.", required: true },
		{ part: "Legend", description: "The question the options answer. This is the group's accessible name.", required: false },
		{ part: "Circle", description: "The native radio input with appearance: none.", required: true },
		{ part: "Dot", description: "Scales in when selected.", required: false },
		{ part: "Option label", description: "A real <label for>.", required: true },
		{ part: "Option description", description: "Consequence of choosing this option.", required: false },
	],
	keyboard: [
		{ keys: "Tab", action: "Moves focus into the group, landing on the selected option." },
		{ keys: "Arrow Down / Arrow Right", action: "Selects the next option." },
		{ keys: "Arrow Up / Arrow Left", action: "Selects the previous option." },
	],
	accessibility: [
		{
			title: "The browser owns the keyboard model",
			detail:
				"A named radio set is a single tab stop with arrow key selection, provided for free. Rebuilding it with role=radiogroup and manual tabindex is the most common way a design system breaks radios, usually by leaving every option in the tab order.",
		},
		{
			title: "The legend is the group name",
			detail:
				"Screen readers announce the legend before each option, so it should read as a question. A heading placed above the fieldset is not associated with anything.",
		},
		{
			title: "Selection is not reversible",
			detail:
				"There is no way to clear a radio group with the keyboard or the mouse. If no answer is a valid answer, add an explicit option for it rather than expecting the user to unselect.",
		},
	],
	guidance: {
		do: [
			"Keep the option count between two and about six. Past that, use a Select.",
			"Include an explicit 'None' or 'No preference' option when empty is valid.",
			"Preselect the safest option when there is a sensible default.",
		],
		dont: [
			"Do not use horizontal layout for options longer than two or three words.",
			"Do not use a radio group for a yes/no question. That is one Checkbox.",
			"Do not render Radio outside a RadioGroup. It throws on purpose.",
		],
	},
	related: ["Checkbox", "Select"],
};
