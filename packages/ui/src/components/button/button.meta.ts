import type { ComponentMeta } from "../../lib/meta";

export const buttonMeta: ComponentMeta = {
	name: "Button",
	slug: "button",
	status: "stable",
	category: "Actions",
	since: "1.0.0",
	summary: "Triggers an action in the current view.",
	description:
		"Five variants covering one level of hierarchy each, three sizes shared with the other controls, and a loading state that stays focusable. Use a link, not a button, when the result is a new URL: assistive technology announces the two differently and keyboard users expect different keys to activate them.",
	tokens: [
		"control.height.*",
		"control.padding-x.*",
		"control.gap.*",
		"control.font-size.*",
		"control.radius",
		"control.border-width",
		"button.font-weight",
		"button.icon-size",
		"focus.ring-*",
	],
	anatomy: [
		{ part: "Container", description: "The button element itself. Never a div.", required: true },
		{
			part: "Leading icon",
			description: "Optional, decorative, hidden from assistive technology with aria-hidden.",
			required: false,
		},
		{
			part: "Label",
			description: "The accessible name. Required even when the button looks icon-only.",
			required: true,
		},
		{ part: "Trailing icon", description: "Optional, for disclosure or direction.", required: false },
		{
			part: "Spinner",
			description: "Replaces the leading icon while loading. Static under reduced motion.",
			required: false,
		},
	],
	keyboard: [
		{ keys: "Tab", action: "Moves focus to the button." },
		{ keys: "Enter", action: "Activates the button." },
		{ keys: "Space", action: "Activates the button." },
	],
	accessibility: [
		{
			title: "Loading does not remove the button from the tab order",
			detail:
				"A disabled element cannot hold focus, so disabling on submit throws a keyboard user back to the top of the document. Loading sets aria-disabled and aria-busy instead, guards the click handler, and leaves focus where the user put it.",
		},
		{
			title: "Disabled state is a colour change, not an opacity change",
			detail:
				"Disabled buttons use surface.disabled and text.disabled, which are contrast-checked pairs. Fading the enabled colours to 40% produces a ratio nobody has measured and it changes per theme.",
		},
		{
			title: "Icons are always decorative",
			detail:
				"Icon slots render with aria-hidden. The label carries the accessible name, so an icon-only button still needs visible or visually hidden text rather than a title attribute.",
		},
		{
			title: "The focus ring is not overridable",
			detail:
				"Ring width, offset and colour come from focus.* in tier 3. Components cannot set their own, which is why the ring looks identical on a button, an input and a tab.",
		},
	],
	guidance: {
		do: [
			"Use exactly one primary button per view or per form step.",
			"Keep labels to a verb and an object: Save changes, Delete project.",
			"Reach for loading rather than disabled while a request is in flight.",
			"Pair danger with a confirmation step when the action cannot be undone.",
		],
		dont: [
			"Do not use a button to navigate. Render an anchor so middle click, copy link and screen reader announcements behave.",
			"Do not put two primary buttons side by side. The hierarchy is the point of the variant.",
			"Do not swap the label for the word Loading. That destroys the accessible name mid-interaction.",
			"Do not add a title attribute in place of a real label.",
		],
	},
	related: ["Badge", "Tabs"],
};
