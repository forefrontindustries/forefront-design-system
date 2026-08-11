import type { ComponentMeta } from "../../lib/meta";

export const toastMeta: ComponentMeta = {
	name: "Toast",
	slug: "toast",
	status: "stable",
	category: "Feedback",
	since: "1.0.0",
	summary: "Transient confirmation or error, queued through a provider and a hook.",
	description:
		"ToastProvider owns the queue and the viewport; useToast() returns toast() and dismiss(). Politeness follows severity, the auto-dismiss timer banks remaining time on hover and focus instead of restarting, and the progress rail is suppressed under reduced motion.",
	tokens: [
		"toast.width",
		"toast.padding",
		"toast.gap",
		"toast.radius",
		"toast.viewport-offset",
		"elevation.overlay",
		"z-index.toast",
	],
	anatomy: [
		{ part: "Viewport", description: "A named landmark region holding an ordered list of toasts.", required: true },
		{ part: "Tone marker", description: "A rail carrying the semantic colour. The surface stays neutral.", required: true },
		{ part: "Title", description: "One line summarising what happened.", required: true },
		{ part: "Description", description: "Detail or next step.", required: false },
		{ part: "Action", description: "At most one, such as Undo.", required: false },
		{ part: "Dismiss button", description: "Labelled 'Dismiss notification'.", required: true },
		{ part: "Progress rail", description: "Shows remaining time. Hidden under reduced motion.", required: false },
	],
	keyboard: [
		{ keys: "Tab", action: "Reaches the action and the dismiss button, pausing the timer on arrival." },
		{ keys: "Enter / Space", action: "Activates the focused action or dismiss button." },
	],
	accessibility: [
		{
			title: "Politeness follows severity",
			detail:
				"Danger and warning carry role=alert with aria-live assertive so they interrupt. Neutral and success are announced politely and wait for a gap in speech. Making every toast assertive trains users to tune the region out.",
		},
		{
			title: "The live region is mounted with the provider, not with the first toast",
			detail:
				"aria-live is only dependable on a node that already existed when the content arrived, so the viewport is a persistent polite live region rendered by ToastProvider even when nothing is queued. role=alert is the one role reliably announced on insertion, which is why assertive toasts declare it themselves and polite toasts inherit the announcement from the viewport rather than declaring role=status on an element that appeared in the same tick.",
		},
		{
			title: "The timer banks time instead of restarting",
			detail:
				"Hover and focus subtract the elapsed time and stop the clock; leaving resumes with what is left. Restarting the full duration makes a hovered toast impossible to outlast, and resetting to zero makes it vanish mid-sentence.",
		},
		{
			title: "Focus pauses the timer as well as hover",
			detail:
				"A keyboard user tabbing towards the Undo button would otherwise watch it disappear on the way. Pausing on focus is the keyboard equivalent of hovering.",
		},
		{
			title: "Anything requiring action gets duration 0",
			detail:
				"WCAG 2.2.1 expects time limits to be adjustable. Auto-dismiss is acceptable for a confirmation nobody has to read, and not acceptable for a message the user has to act on. Pass duration 0 for those.",
		},
		{
			title: "The viewport is a named region",
			detail:
				"role=region with aria-label Notifications lets a screen reader user navigate back to a message they heard but did not finish. An ordered list gives them a count of what is waiting.",
		},
		{
			title: "The tone is a rail, not a tinted panel",
			detail:
				"A fully tinted danger surface fails contrast against body text in two of the four themes. Keeping one neutral surface leaves one background to audit rather than four per theme.",
		},
	],
	guidance: {
		do: [
			"Write the title as what happened: 'Invoice sent', not 'Success'.",
			"Use duration 0 for errors and anything with an action the user must take.",
			"Keep the queue to three visible toasts.",
			"Pair a destructive action with an Undo action in the toast.",
		],
		dont: [
			"Do not put two actions in one toast. That is a Modal.",
			"Do not use a toast for validation errors. Those belong beside the field.",
			"Do not stack toasts for one operation. Summarise instead.",
			"Do not put a toast anywhere it can cover the control that triggered it.",
		],
	},
	related: ["Modal", "Badge"],
};
