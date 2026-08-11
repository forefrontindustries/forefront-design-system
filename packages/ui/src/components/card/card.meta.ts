import type { ComponentMeta } from "../../lib/meta";

export const cardMeta: ComponentMeta = {
	name: "Card",
	slug: "card",
	status: "stable",
	category: "Containment",
	since: "1.0.0",
	summary: "A surface that groups related content, with header, body and footer slots.",
	description:
		"Three surface treatments and an interactive mode that adds hover and focus-within affordances without making the container itself clickable. CardTitle renders a real heading at the level you pass, because a page of cards is also a document outline.",
	tokens: ["card.padding", "card.gap", "card.radius", "elevation.raised", "elevation.none"],
	anatomy: [
		{ part: "Container", description: "The surface. A div, never a button or an anchor.", required: true },
		{ part: "Header", description: "Title row, with space for a trailing badge or action.", required: false },
		{ part: "Title", description: "A real h2 to h6, chosen with the level prop.", required: false },
		{ part: "Body", description: "Content region.", required: false },
		{ part: "Footer", description: "Actions or metadata, above a hairline rule.", required: false },
	],
	keyboard: [
		{
			keys: "Tab",
			action: "Moves through the interactive elements inside the card. The card itself is not a tab stop.",
		},
	],
	accessibility: [
		{
			title: "The card is never the interactive element",
			detail:
				"A click handler on the container is unreachable by keyboard, and wrapping the card in an anchor swallows every link and button inside it into one nested interactive mess. Neither is available here.",
		},
		{
			title: "Use the stretched link pattern for whole-card targets",
			detail:
				"Put fds-card__link on a real anchor in the title. The anchor keeps the accessible name and the keyboard behaviour, its pseudo-element covers the card for pointer users, and the card draws the focus ring through :focus-within.",
		},
		{
			title: "Heading level is a prop because the outline matters",
			detail:
				"CardTitle defaults to h3 but takes any level from h2 to h6. Screen reader users navigate by heading, so a grid of cards under an h1 should be h2, not whatever the default happened to be.",
		},
	],
	guidance: {
		do: [
			"Set the title level to fit the page outline.",
			"Use outlined as the default and reserve raised for content that floats above a list.",
			"Use flush for full-bleed media or a table that draws its own padding.",
		],
		dont: [
			"Do not attach onClick to the card container.",
			"Do not nest cards. Use a sunken region inside one card instead.",
			"Do not put more than one primary action in a card footer.",
		],
	},
	related: ["Modal", "Tabs"],
};
