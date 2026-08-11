import type { ComponentMeta } from "../../lib/meta";

export const switchMeta: ComponentMeta = {
	name: "Switch",
	slug: "switch",
	status: "stable",
	category: "Forms",
	since: "1.0.0",
	summary: "Immediate on or off, with no save step.",
	description:
		"A native checkbox with role=switch. The role produces the on/off announcement, the native element keeps form participation and label association. Use a Checkbox instead when the change only takes effect after the form is submitted.",
	tokens: [
		"switch.width",
		"switch.height",
		"switch.thumb-size",
		"switch.thumb-inset",
		"control.border-width",
		"focus.ring-*",
	],
	anatomy: [
		{ part: "Track", description: "The native input. Colour carries the state.", required: true },
		{ part: "Thumb", description: "Translates across the track. The movement is the affordance.", required: true },
		{ part: "Label", description: "Names the setting, not the current state.", required: false },
		{ part: "Description", description: "What changes when it is on.", required: false },
	],
	keyboard: [
		{ keys: "Tab", action: "Moves focus to the switch." },
		{ keys: "Space", action: "Toggles the switch." },
	],
	accessibility: [
		{
			title: "role=switch on a native input, not a button",
			detail:
				"A div or button with aria-checked would require rebuilding form participation, label association and click handling. Putting the role on a checkbox keeps all of it and still announces on and off instead of checked and unchecked.",
		},
		{
			title: "State is not communicated by colour alone",
			detail:
				"The thumb position changes as well as the track colour, so the state survives greyscale, high contrast mode and colour blindness.",
		},
		{
			title: "The label never changes with the state",
			detail:
				"A label that flips between Enabled and Disabled makes it impossible to tell whether it describes the current state or the action. Name the setting and let the control carry the state.",
		},
	],
	guidance: {
		do: [
			"Apply the change immediately and show a Toast if the write can fail.",
			"Label the setting: 'Weekly digest', not 'Enable weekly digest'.",
			"Use labelPosition end for settings lists where the switches align on the right edge.",
		],
		dont: [
			"Do not put a switch in a form that has a Save button.",
			"Do not use a switch for a destructive action. Use a Button with confirmation.",
			"Do not change the label text when the state changes.",
		],
	},
	related: ["Checkbox", "Toast"],
};
