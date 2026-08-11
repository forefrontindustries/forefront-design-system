/**
 * @forefront/ui public surface.
 *
 * Composition only. Every export is re-exported from a sibling module, which
 * keeps the entry point readable as an inventory of the system and means adding
 * a component is a one-line diff here.
 */

export { Button } from "./components/button/button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./components/button/button";

export { Input } from "./components/input/input";
export type { InputProps, InputSize } from "./components/input/input";

export { Select } from "./components/select/select";
export type { SelectOption, SelectProps, SelectSize } from "./components/select/select";

export { Checkbox } from "./components/checkbox/checkbox";
export type { CheckboxProps } from "./components/checkbox/checkbox";

export { Radio, RadioGroup } from "./components/radio/radio";
export type { RadioGroupProps, RadioProps } from "./components/radio/radio";

export { Switch } from "./components/switch/switch";
export type { SwitchProps } from "./components/switch/switch";

export { Badge } from "./components/badge/badge";
export type { BadgeProps, BadgeTone, BadgeVariant } from "./components/badge/badge";

export { Card, CardBody, CardFooter, CardHeader, CardTitle } from "./components/card/card";
export type { CardProps, CardSectionProps, CardTitleProps, CardVariant } from "./components/card/card";

export { Modal } from "./components/modal/modal";
export type { ModalProps, ModalSize } from "./components/modal/modal";

export { Tooltip } from "./components/tooltip/tooltip";
export type { TooltipPlacement, TooltipProps } from "./components/tooltip/tooltip";

export { Tab, TabList, TabPanel, Tabs } from "./components/tabs/tabs";
export type {
	TabListProps,
	TabPanelProps,
	TabProps,
	TabsActivation,
	TabsOrientation,
	TabsProps,
} from "./components/tabs/tabs";

export { ToastProvider, useToast } from "./components/toast/toast";
export type { ToastOptions, ToastPlacement, ToastRecord, ToastTone } from "./components/toast/toast";

// Internal building blocks, exported because a consumer building a component
// that is not in the system still needs the same field wiring and focus
// behaviour. Using them is how a bespoke control stays consistent with the rest.
export { FieldFrame, useField } from "./components/field/field";
export type { FieldAria, FieldFrameProps, FieldMessages, UseFieldResult } from "./components/field/field";
export { cx } from "./lib/cx";
export type { ClassValue } from "./lib/cx";
export { getFocusable, useEscapeKey, useFocusTrap, useScrollLock } from "./lib/focus";
export { Portal } from "./lib/portal";
export { composeRefs } from "./lib/compose-refs";
export { prefersReducedMotion, presenceDuration, usePresence } from "./lib/use-presence";
export type { PresenceSpeed } from "./lib/use-presence";
export { useControllableState } from "./lib/use-controllable-state";

export type {
	AccessibilityNote,
	AnatomyPart,
	ComponentCategory,
	ComponentMeta,
	ComponentStatus,
	Guidance,
	KeyboardBinding,
} from "./lib/meta";
