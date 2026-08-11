/**
 * Every component's metadata, in the order the docs navigation shows them.
 *
 * Exported as a separate entry point so the docs site can import documentation
 * without importing components, and so a CI check can assert that a new
 * component was registered here before it ships.
 */

import { badgeMeta } from "./components/badge/badge.meta";
import { buttonMeta } from "./components/button/button.meta";
import { cardMeta } from "./components/card/card.meta";
import { checkboxMeta } from "./components/checkbox/checkbox.meta";
import { inputMeta } from "./components/input/input.meta";
import { modalMeta } from "./components/modal/modal.meta";
import { radioMeta } from "./components/radio/radio.meta";
import { selectMeta } from "./components/select/select.meta";
import { switchMeta } from "./components/switch/switch.meta";
import { tabsMeta } from "./components/tabs/tabs.meta";
import { toastMeta } from "./components/toast/toast.meta";
import { tooltipMeta } from "./components/tooltip/tooltip.meta";
import type { ComponentMeta } from "./lib/meta";

export const componentMeta: ComponentMeta[] = [
	buttonMeta,
	badgeMeta,
	inputMeta,
	selectMeta,
	checkboxMeta,
	radioMeta,
	switchMeta,
	cardMeta,
	tabsMeta,
	modalMeta,
	tooltipMeta,
	toastMeta,
];

export const componentMetaBySlug: Record<string, ComponentMeta> = Object.fromEntries(
	componentMeta.map((meta) => [meta.slug, meta]),
);

export {
	badgeMeta,
	buttonMeta,
	cardMeta,
	checkboxMeta,
	inputMeta,
	modalMeta,
	radioMeta,
	selectMeta,
	switchMeta,
	tabsMeta,
	toastMeta,
	tooltipMeta,
};
