import type { ComponentMeta } from "../../lib/meta";

export const badgeMeta: ComponentMeta = {
	name: "Badge",
	slug: "badge",
	status: "stable",
	category: "Feedback",
	since: "1.0.0",
	summary: "Short, non-interactive status or category label.",
	description:
		"Six tones across two weights. Tone maps to the same semantic pair used by text and borders, so a success badge and success helper text cannot drift to different greens. Not focusable and not dismissible: a badge with a close button is a chip, which is a different component with a keyboard model.",
	tokens: [
		"badge.height",
		"badge.padding-x",
		"badge.font-size",
		"badge.font-weight",
		"badge.dot-size",
		"radius.pill",
	],
	anatomy: [
		{ part: "Container", description: "A span. Never a button, never focusable.", required: true },
		{ part: "Status dot", description: "Optional. Inherits the text colour through currentColor.", required: false },
		{ part: "Label", description: "One or two words. Long badges are a layout problem.", required: true },
	],
	keyboard: [{ keys: "None", action: "Badge is not interactive and takes no focus." }],
	accessibility: [
		{
			title: "Colour is never the only signal",
			detail:
				"Every tone renders text, so the meaning survives greyscale. The dot is an addition to the label, not a replacement for it. A row of bare coloured dots is not a status system.",
		},
		{
			title: "Abbreviations get an srLabel",
			detail:
				"When the visible label is shortened for space, srLabel supplies the full text as visually hidden content and the abbreviation is hidden from assistive technology. That avoids screen readers spelling out truncated words.",
		},
		{
			title: "Bold tones use audited text pairs",
			detail:
				"Each filled tone is paired with an on-* text token rather than plain white. Those pairs are the ones checked on the accessibility page for all four themes.",
		},
	],
	guidance: {
		do: [
			"Keep labels to one or two words.",
			"Use the dot for live state such as Active or Syncing.",
			"Use bold sparingly, for the one status that should be read first in a row.",
		],
		dont: [
			"Do not put interactive content inside a badge.",
			"Do not use a badge as a button. It has no focus state, on purpose.",
			"Do not encode meaning in tone alone.",
			"Do not stack more than three badges in one cell.",
		],
	},
	related: ["Button", "Toast"],
};
