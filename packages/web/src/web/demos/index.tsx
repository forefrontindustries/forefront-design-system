import type { ReactNode } from "react";
import {
	BadgeExamples,
	BadgePlayground,
	ButtonExamples,
	ButtonPlayground,
	CardExamples,
	CardPlayground,
	TabsExamples,
	TabsPlayground,
} from "./basics";
import {
	CheckboxExamples,
	CheckboxPlayground,
	InputExamples,
	InputPlayground,
	RadioExamples,
	RadioPlayground,
	SelectExamples,
	SelectPlayground,
	SwitchExamples,
	SwitchPlayground,
} from "./forms";
import {
	ModalExamples,
	ModalPlayground,
	ToastExamples,
	ToastPlayground,
	TooltipExamples,
	TooltipPlayground,
} from "./overlays";

/**
 * Demo registry, keyed by component slug.
 *
 * Composition only: the demos themselves live in sibling files grouped by
 * family. `interfaces` lists which generated interfaces get a prop table, in the
 * order they should appear, which is how compound components document every part
 * they expose rather than only the root.
 */

export interface ComponentDemos {
	playground: () => ReactNode;
	examples: () => ReactNode;
	interfaces: string[];
}

export const demos: Record<string, ComponentDemos> = {
	button: { playground: ButtonPlayground, examples: ButtonExamples, interfaces: ["ButtonProps"] },
	badge: { playground: BadgePlayground, examples: BadgeExamples, interfaces: ["BadgeProps"] },
	input: { playground: InputPlayground, examples: InputExamples, interfaces: ["InputProps"] },
	select: { playground: SelectPlayground, examples: SelectExamples, interfaces: ["SelectProps"] },
	checkbox: { playground: CheckboxPlayground, examples: CheckboxExamples, interfaces: ["CheckboxProps"] },
	radio: {
		playground: RadioPlayground,
		examples: RadioExamples,
		interfaces: ["RadioGroupProps", "RadioProps"],
	},
	switch: { playground: SwitchPlayground, examples: SwitchExamples, interfaces: ["SwitchProps"] },
	card: {
		playground: CardPlayground,
		examples: CardExamples,
		interfaces: ["CardProps", "CardTitleProps"],
	},
	tabs: {
		playground: TabsPlayground,
		examples: TabsExamples,
		interfaces: ["TabsProps", "TabListProps", "TabProps", "TabPanelProps"],
	},
	modal: { playground: ModalPlayground, examples: ModalExamples, interfaces: ["ModalProps"] },
	tooltip: { playground: TooltipPlayground, examples: TooltipExamples, interfaces: ["TooltipProps"] },
	toast: {
		playground: ToastPlayground,
		examples: ToastExamples,
		interfaces: ["ToastOptions", "ToastProviderProps"],
	},
};
