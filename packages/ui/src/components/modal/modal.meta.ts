import type { ComponentMeta } from "../../lib/meta";

export const modalMeta: ComponentMeta = {
	name: "Modal",
	slug: "modal",
	status: "stable",
	category: "Containment",
	since: "1.0.0",
	summary: "A dialog that takes focus and blocks the page behind it.",
	description:
		"Focus trap, scroll lock, Escape handling and focus restore, all authored rather than borrowed. Three width steps, a required title that becomes the accessible name, and a single onClose handler covering all three dismissal routes so none of them can be forgotten.",
	tokens: [
		"modal.padding",
		"modal.gap",
		"modal.radius",
		"modal.width-sm",
		"modal.width-md",
		"modal.width-lg",
		"modal.offset",
		"elevation.modal",
		"z-index.modal",
	],
	anatomy: [
		{ part: "Backdrop", description: "Scrim over the page. A sibling of the panel, not its parent.", required: true },
		{ part: "Viewport", description: "The scroll container. The panel itself never scrolls.", required: true },
		{ part: "Panel", description: "role=dialog with aria-modal=true.", required: true },
		{ part: "Title", description: "An h2, referenced by aria-labelledby.", required: true },
		{ part: "Description", description: "Referenced by aria-describedby when present.", required: false },
		{ part: "Close button", description: "Labelled 'Close dialog'. Can be hidden, but Escape still works.", required: false },
		{ part: "Body", description: "Content region.", required: false },
		{ part: "Footer", description: "Actions, primary last on the trailing edge.", required: false },
	],
	keyboard: [
		{ keys: "Escape", action: "Closes the dialog." },
		{ keys: "Tab", action: "Cycles forward through focusable content, wrapping at the end." },
		{ keys: "Shift + Tab", action: "Cycles backward, wrapping at the start." },
	],
	accessibility: [
		{
			title: "aria-modal and a real focus trap, together",
			detail:
				"aria-modal tells assistive technology the page behind is unavailable. The trap makes that true for keyboard users. Shipping one without the other is the most common dialog defect in production, and it is why this component owns both.",
		},
		{
			title: "Focus goes somewhere deliberate on open, and comes back on close",
			detail:
				"Focus moves to the first element marked data-fds-autofocus, otherwise the first focusable node, otherwise the panel. On close it returns to the trigger, guarded by a connected-node check because the trigger is often unmounted by then.",
		},
		{
			title: "The backdrop is a sibling",
			detail:
				"Nesting the panel inside a clickable backdrop forces every inner click to stop propagation, and one missed handler closes the dialog while the user is selecting text. Separating them removes the class of bug entirely.",
		},
		{
			title: "Escape is captured on the document",
			detail:
				"The listener runs in the capture phase, so a consumer's keydown handler cannot swallow Escape. Set dismissOnBackdrop to false for unsaved work, but never remove Escape.",
		},
		{
			title: "The viewport scrolls, not the panel",
			detail:
				"A panel with internal scrolling hides its own footer actions on a short viewport. The scroll container is the full-height viewport, so long dialogs push their footer down the page where it stays reachable.",
		},
	],
	guidance: {
		do: [
			"Write the title as the decision being made, not the feature name.",
			"Put the primary action last in the footer, matching platform reading order.",
			"Set dismissOnBackdrop to false when the dialog holds unsaved input.",
			"Mark the field a user should start in with data-fds-autofocus.",
		],
		dont: [
			"Do not open a modal from inside another modal. Replace the content instead.",
			"Do not use a modal for a message with no decision. That is a Toast.",
			"Do not remove the close button and the footer actions at the same time.",
			"Do not put a form longer than one screen in a dialog.",
		],
	},
	related: ["Card", "Toast"],
};
