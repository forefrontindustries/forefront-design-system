import type { ComponentMeta } from "../../lib/meta";

export const tabsMeta: ComponentMeta = {
	name: "Tabs",
	slug: "tabs",
	status: "stable",
	category: "Navigation",
	since: "1.0.0",
	summary: "Switches between sibling panels inside one view.",
	description:
		"Roving tabindex, wrapping arrow keys, Home and End, both ARIA activation modes, and a horizontal or vertical orientation that changes which arrows navigate. Tabs are not site navigation: if a panel deserves its own URL and browser history entry, use links instead.",
	tokens: [
		"tabs.trigger-height",
		"tabs.trigger-padding-x",
		"tabs.indicator-thickness",
		"tabs.gap",
		"border.subtle",
		"focus.ring-*",
	],
	anatomy: [
		{ part: "Tab list", description: "role=tablist with a required aria-label.", required: true },
		{ part: "Tab", description: "role=tab, one of which is the single tab stop.", required: true },
		{ part: "Indicator", description: "A pseudo-element on the selected tab, not a sliding bar.", required: true },
		{ part: "Count badge", description: "Optional number or status after the label.", required: false },
		{ part: "Tab panel", description: "role=tabpanel, labelled by its tab.", required: true },
	],
	keyboard: [
		{ keys: "Tab", action: "Enters the tab list at the selected tab, then leaves it for the panel." },
		{ keys: "Arrow Right / Arrow Left", action: "Moves between tabs in horizontal orientation, wrapping at the ends." },
		{ keys: "Arrow Down / Arrow Up", action: "Moves between tabs in vertical orientation." },
		{ keys: "Home / End", action: "Jumps to the first or last enabled tab." },
		{ keys: "Enter / Space", action: "Activates the focused tab in manual activation mode." },
	],
	accessibility: [
		{
			title: "Roving tabindex makes the list one tab stop",
			detail:
				"Only the selected tab has tabIndex 0; the rest are -1 and reachable with the arrow keys. Leaving every tab at 0 turns a six-tab list into six tab stops a keyboard user has to walk through to reach the content.",
		},
		{
			title: "Both activation modes exist for a reason",
			detail:
				"Automatic activation follows focus and is what users expect from cheap panels. Manual activation moves focus only, so arrowing past three tabs does not fire three network requests. Use manual when a panel is expensive.",
		},
		{
			title: "Tab order comes from the DOM, not from React state",
			detail:
				"Arrow navigation queries the live tablist for enabled tabs. A registry held in state desynchronises the moment a tab renders conditionally, and the symptom is arrow keys skipping items.",
		},
		{
			title: "The panel is focusable",
			detail:
				"After activating a tab, the next Tab press should land in the revealed content. Since the first element in a panel is often not interactive, the panel itself takes tabIndex 0, following the ARIA pattern's guidance.",
		},
		{
			title: "The tab list needs a name",
			detail:
				"aria-label is a required prop. An unnamed tablist is announced as a bare group of tabs, which tells a screen reader user nothing about what they are switching between.",
		},
	],
	guidance: {
		do: [
			"Keep labels to one or two words so the list does not scroll.",
			"Use manual activation for panels that fetch data.",
			"Set keepMounted on a panel that holds form state a user should not lose.",
			"Use vertical orientation for settings-style navigation in a wide layout.",
		],
		dont: [
			"Do not use tabs for steps in a sequence. That is a wizard, and it needs Back and Next.",
			"Do not use tabs when each panel should be linkable. Use routes.",
			"Do not nest one set of tabs inside another.",
			"Do not hide required form fields behind an unselected tab.",
		],
	},
	related: ["Card", "Select"],
};
