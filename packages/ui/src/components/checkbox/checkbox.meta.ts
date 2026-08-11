import type { ComponentMeta } from "../../lib/meta";

export const checkboxMeta: ComponentMeta = {
	name: "Checkbox",
	slug: "checkbox",
	status: "stable",
	category: "Forms",
	since: "1.0.0",
	summary: "Binary or mixed choice, with a real native input underneath.",
	description:
		"The visible box is the native input styled with appearance: none, so form association, autofill and the browser's own hit target all survive. Supports the mixed state through the indeterminate DOM property, which is the only way assistive technology announces partial selection.",
	tokens: ["checkbox.size", "checkbox.radius", "control.border-width", "field.gap", "focus.ring-*"],
	anatomy: [
		{ part: "Box", description: "The native input with appearance: none.", required: true },
		{ part: "Check glyph", description: "Shown when checked. Fades in, never scales.", required: false },
		{ part: "Dash glyph", description: "Shown in the mixed state.", required: false },
		{ part: "Label", description: "A real <label for>, so the text is part of the hit target.", required: false },
		{ part: "Description", description: "Explains the consequence of ticking the box.", required: false },
	],
	keyboard: [
		{ keys: "Tab", action: "Moves focus to the checkbox." },
		{ keys: "Space", action: "Toggles between checked and unchecked." },
	],
	accessibility: [
		{
			title: "Mixed state is set on the DOM property, not an attribute",
			detail:
				"There is no indeterminate HTML attribute, so it is written on every commit through a ref. That is what puts the element in :indeterminate and makes the announcement 'mixed' rather than 'unchecked'.",
		},
		{
			title: "The label is part of the hit target",
			detail:
				"Because the label uses htmlFor, clicking the text toggles the box. This matters most on touch, where an 18px square is below every recommended minimum on its own.",
		},
		{
			title: "Never nest a checkbox inside its own label text",
			detail:
				"A sibling label with htmlFor keeps the accessible name predictable. Wrapping the input in the label works in browsers but produces duplicated announcements in some screen reader and browser pairings.",
		},
	],
	guidance: {
		do: [
			"Use the mixed state for a parent checkbox that governs a partially selected list.",
			"Write labels as the positive statement being agreed to.",
			"Group related checkboxes in a fieldset with a legend when they answer one question.",
		],
		dont: [
			"Do not use a checkbox for something that takes effect immediately. That is a Switch.",
			"Do not rely on the mixed state as a third selectable value. Users cannot select it.",
			"Do not hide the label and rely on surrounding copy.",
		],
	},
	related: ["Radio", "Switch"],
};
