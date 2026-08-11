import type { ComponentMeta } from "../../lib/meta";

export const selectMeta: ComponentMeta = {
	name: "Select",
	slug: "select",
	status: "beta",
	category: "Forms",
	since: "1.0.0",
	summary: "Single-select listbox with typeahead, built on the ARIA combobox pattern.",
	description:
		"The one component where the native element was not enough: a native select cannot render a description under an option or match the token system across platforms. Everything native select gives away for free is rebuilt here, including typeahead, wrapping arrow navigation, aria-activedescendant, scroll-into-view and a hidden input for plain form posts. Beta until option groups and multi-select land, since both will change the props.",
	tokens: [
		"select.menu-max-height",
		"select.option-height",
		"select.menu-padding",
		"select.menu-offset",
		"control.height.*",
		"control.padding-x.*",
		"elevation.overlay",
		"z-index.popover",
	],
	anatomy: [
		{ part: "Trigger", description: "role=combobox with aria-expanded and aria-controls. Keeps focus throughout.", required: true },
		{ part: "Value", description: "Selected label, or the placeholder in the placeholder colour.", required: true },
		{ part: "Chevron", description: "Rotates on open. Decorative.", required: true },
		{ part: "Listbox", description: "role=listbox, always in the DOM so aria-controls stays valid.", required: true },
		{ part: "Option", description: "role=option with aria-selected, and an optional description line.", required: true },
		{ part: "Hidden input", description: "Rendered when name is set, so the value posts in a plain HTML form.", required: false },
	],
	keyboard: [
		{ keys: "Enter / Space / Arrow Down", action: "Opens the menu at the selected option." },
		{ keys: "Arrow Up", action: "Opens the menu at the last option." },
		{ keys: "Arrow Down / Arrow Up (open)", action: "Moves the active option, wrapping at both ends." },
		{ keys: "Home / End", action: "Jumps to the first or last enabled option." },
		{ keys: "Enter / Space (open)", action: "Selects the active option and closes." },
		{ keys: "Escape", action: "Closes without changing the selection and returns focus to the trigger." },
		{ keys: "Tab", action: "Selects the active option and moves to the next control." },
		{ keys: "Printable characters", action: "Typeahead. Characters accumulate for 500ms, then reset." },
	],
	accessibility: [
		{
			title: "Focus never moves into the listbox",
			detail:
				"The trigger keeps DOM focus and points at the active option with aria-activedescendant. Moving real focus into the list severs the combobox relationship, and the symptom is a screen reader that stops announcing the selection while the user arrows through it.",
		},
		{
			title: "The listbox stays in the DOM while collapsed",
			detail:
				"It is hidden with the hidden attribute rather than removed, so the id referenced by aria-controls always resolves. Removing the node leaves a dangling reference that some assistive technology reports as a broken relationship.",
		},
		{
			title: "Typeahead accumulates rather than resetting per key",
			detail:
				"Characters build a 500ms query, so typing 'sa' finds San Diego instead of jumping to Sacramento and then to Argentina. Repeated presses of a single letter cycle through matches, which is what native select does.",
		},
		{
			title: "One active state for pointer and keyboard",
			detail:
				"Hovering an option sets the same active index the arrow keys use. Two separate highlight states is how you end up with a mouse hover and a keyboard cursor on different rows and Enter selecting the wrong one.",
		},
		{
			title: "Selection is committed on pointerdown",
			detail:
				"Click arrives after the browser has already blurred the trigger, and mousedown moves focus before the value is committed. Pointerdown with preventDefault keeps focus on the trigger and commits in one step.",
		},
		{
			title: "The menu flips but does not portal",
			detail:
				"It renders next to its trigger so it inherits the theme attribute and needs no scroll synchronisation, and it flips above the trigger when space runs out. The known limitation is a consumer with overflow: hidden between the field and the viewport, which will clip it. Documented rather than hidden.",
		},
	],
	guidance: {
		do: [
			"Set name when the field is inside a plain HTML form.",
			"Use the description line for the consequence of an option, not for marketing copy.",
			"Keep the list under about fifteen options, or add a search field instead.",
			"Preselect a sensible default rather than showing a placeholder.",
		],
		dont: [
			"Do not use this for two or three options. Use a RadioGroup, which needs no interaction to be read.",
			"Do not put a Select inside a container with overflow: hidden.",
			"Do not use it for multi-select. That is not implemented yet, on purpose.",
			"Do not disable options without explaining why somewhere the user can see.",
		],
	},
	related: ["RadioGroup", "Input"],
};
