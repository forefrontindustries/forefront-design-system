import type { ComponentMeta } from "../../lib/meta";

export const tooltipMeta: ComponentMeta = {
	name: "Tooltip",
	slug: "tooltip",
	status: "beta",
	category: "Feedback",
	since: "1.0.0",
	summary: "A short hint attached to a focusable element.",
	description:
		"Portalled, viewport-clamped, and flips to the opposite side when the preferred one does not fit. Keyboard focus shows it immediately while hover waits out the delay. Status is beta because the positioning is flip-only: no shifting and no arrow, which is enough for the current surface area but will need revisiting for nested overlays.",
	tokens: [
		"tooltip.padding-x",
		"tooltip.padding-y",
		"tooltip.max-width",
		"tooltip.font-size",
		"tooltip.radius",
		"tooltip.offset",
		"elevation.overlay",
		"z-index.tooltip",
	],
	anatomy: [
		{ part: "Trigger", description: "The consumer's own element, cloned to attach handlers and aria-describedby.", required: true },
		{ part: "Bubble", description: "role=tooltip, portalled to the body, never a pointer target.", required: true },
	],
	keyboard: [
		{ keys: "Tab", action: "Focusing the trigger shows the tooltip immediately, with no delay." },
		{ keys: "Escape", action: "Dismisses the tooltip while the trigger keeps focus." },
	],
	accessibility: [
		{
			title: "Never the only source of information",
			detail:
				"Tooltips do not exist on touch, cannot be reached with a pointer, and vanish on blur. Anything a user must have in order to complete the task belongs in visible copy or in a field description.",
		},
		{
			title: "The trigger has to be focusable",
			detail:
				"Attaching a tooltip to a span or an icon excludes keyboard and screen reader users entirely. If the trigger is decorative, either make it a real button or move the text into the interface.",
		},
		{
			title: "Escape dismisses without moving focus",
			detail:
				"WCAG 1.4.13 requires hover and focus content to be dismissible without moving the pointer or focus. The Escape handler is registered on the document in the capture phase for exactly that.",
		},
		{
			title: "aria-describedby, not aria-label",
			detail:
				"The tooltip supplements the trigger's own name rather than replacing it. Using aria-label here would overwrite the visible label, which breaks voice control users who speak what they see.",
		},
		{
			title: "The bubble is pointer-events: none",
			detail:
				"A tooltip the mouse can enter is a popover, and a popover needs focus management this component does not have. Keeping it inert prevents that half-built state.",
		},
	],
	guidance: {
		do: [
			"Keep the text to one short sentence.",
			"Use it to explain an icon-only button that already has an accessible name.",
			"Attach it to buttons, links and form controls.",
		],
		dont: [
			"Do not put links, buttons or form fields inside a tooltip.",
			"Do not use a tooltip for validation messages. Those belong in the field.",
			"Do not attach one to a non-focusable element.",
			"Do not rely on it for anything a touch user needs.",
		],
	},
	related: ["Modal", "Badge"],
};
