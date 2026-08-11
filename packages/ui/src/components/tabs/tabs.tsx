import {
	createContext,
	useCallback,
	useContext,
	useId,
	useRef,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/use-controllable-state";
import "./tabs.css";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivation = "automatic" | "manual";

interface TabsContextValue {
	value: string | undefined;
	select: (value: string) => void;
	baseId: string;
	orientation: TabsOrientation;
	activation: TabsActivation;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
	const context = useContext(TabsContext);
	if (!context) throw new Error(`<${component}> must be rendered inside <Tabs>.`);
	return context;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Selected tab value. Provide with onChange for a controlled Tabs. */
	value?: string;
	/** Initially selected value for an uncontrolled Tabs. */
	defaultValue?: string;
	/** Fired with the newly selected value. */
	onChange?: (value: string) => void;
	/**
	 * Layout direction. Vertical also changes which arrow keys navigate, because
	 * the keyboard model has to match what the user sees.
	 * @default "horizontal"
	 */
	orientation?: TabsOrientation;
	/**
	 * Automatic selects on arrow key. Manual moves focus only and waits for Enter
	 * or Space. Use manual when a panel is expensive to render, so arrowing past
	 * three tabs does not fire three requests.
	 * @default "automatic"
	 */
	activation?: TabsActivation;
	children: ReactNode;
}

/**
 * Switches between sibling panels within one view.
 *
 * The whole keyboard model is authored here: roving tabindex so the tab list is
 * a single tab stop, arrow keys that wrap, Home and End, and both activation
 * modes from the ARIA pattern. Tabs are not navigation. If each panel deserves
 * its own URL, use links.
 */
export function Tabs({
	value,
	defaultValue,
	onChange,
	orientation = "horizontal",
	activation = "automatic",
	className,
	children,
	...rest
}: TabsProps) {
	const generated = useId();
	const [selected, setSelected] = useControllableState<string | undefined>({
		value,
		defaultValue,
		onChange: onChange as ((next: string | undefined) => void) | undefined,
	});

	const select = useCallback((next: string) => setSelected(next), [setSelected]);

	return (
		<TabsContext.Provider
			value={{
				value: selected,
				select,
				baseId: `fds-tabs-${generated}`,
				orientation,
				activation,
			}}
		>
			<div {...rest} className={cx("fds-tabs", `fds-tabs--${orientation}`, className)}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Names the tab list for assistive technology. Required: a tablist with no
	 * name is announced as an unlabelled group of tabs.
	 */
	"aria-label": string;
	children: ReactNode;
}

/** The row or column of tab triggers. One tab stop, arrow keys inside. */
export function TabList({ className, children, ...rest }: TabListProps) {
	const { orientation } = useTabsContext("TabList");
	const listRef = useRef<HTMLDivElement | null>(null);

	return (
		<div
			{...rest}
			ref={listRef}
			role="tablist"
			aria-orientation={orientation}
			className={cx("fds-tabs__list", className)}
		>
			{children}
		</div>
	);
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
	/** Identifies the tab and its panel. Must match the TabPanel value. */
	value: string;
	/** Optional count or status rendered after the label. */
	badge?: ReactNode;
	children: ReactNode;
}

/** A single tab trigger. */
export function Tab({ value, badge, className, disabled, children, ...rest }: TabProps) {
	const { value: selected, select, baseId, orientation, activation } = useTabsContext("Tab");
	const isSelected = selected === value;

	function moveFocus(current: HTMLElement, direction: 1 | -1 | "first" | "last") {
		const list = current.closest("[role='tablist']");
		if (!list) return;
		// The DOM is the source of truth for order. Keeping a registry of tabs in
		// React state means conditional tabs desynchronise it, and the arrow keys
		// start skipping items that are no longer there.
		const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>("[role='tab']:not([disabled])"));
		if (tabs.length === 0) return;

		const index = tabs.indexOf(current as HTMLButtonElement);
		let next: HTMLButtonElement | undefined;
		if (direction === "first") next = tabs[0];
		else if (direction === "last") next = tabs[tabs.length - 1];
		else next = tabs[(index + direction + tabs.length) % tabs.length];
		if (!next) return;

		next.focus();
		// Automatic activation follows focus, which is the pattern users expect
		// for cheap panels. Manual activation waits for Enter or Space.
		if (activation === "automatic") {
			const nextValue = next.getAttribute("data-value");
			if (nextValue) select(nextValue);
		}
	}

	return (
		<button
			{...rest}
			type="button"
			role="tab"
			id={`${baseId}-tab-${value}`}
			data-value={value}
			aria-selected={isSelected}
			aria-controls={`${baseId}-panel-${value}`}
			// Roving tabindex: exactly one tab is reachable with Tab, and the arrow
			// keys move within the list. Leaving every tab at tabIndex 0 turns a
			// six-tab list into six tab stops between the content above and below.
			tabIndex={isSelected ? 0 : -1}
			disabled={disabled}
			className={cx("fds-tabs__tab", isSelected && "is-selected", className)}
			onClick={(event) => {
				rest.onClick?.(event);
				select(value);
			}}
			onKeyDown={(event) => {
				rest.onKeyDown?.(event);
				const horizontal = orientation === "horizontal";
				const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
				const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
				const current = event.currentTarget;

				switch (event.key) {
					case nextKey:
						event.preventDefault();
						moveFocus(current, 1);
						break;
					case prevKey:
						event.preventDefault();
						moveFocus(current, -1);
						break;
					case "Home":
						event.preventDefault();
						moveFocus(current, "first");
						break;
					case "End":
						event.preventDefault();
						moveFocus(current, "last");
						break;
					case "Enter":
					case " ":
						event.preventDefault();
						select(value);
						break;
					default:
						break;
				}
			}}
		>
			<span className="fds-tabs__tab-label">{children}</span>
			{badge ? <span className="fds-tabs__tab-badge">{badge}</span> : null}
		</button>
	);
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
	/** Must match the Tab value it belongs to. */
	value: string;
	/**
	 * Keeps the panel mounted while hidden, preserving scroll position and form
	 * state at the cost of rendering everything up front.
	 * @default false
	 */
	keepMounted?: boolean;
	children: ReactNode;
}

/** The content region for one tab. */
export function TabPanel({ value, keepMounted = false, className, children, ...rest }: TabPanelProps) {
	const { value: selected, baseId } = useTabsContext("TabPanel");
	const isSelected = selected === value;

	if (!isSelected && !keepMounted) return null;

	return (
		<div
			{...rest}
			role="tabpanel"
			id={`${baseId}-panel-${value}`}
			aria-labelledby={`${baseId}-tab-${value}`}
			hidden={!isSelected}
			// The panel is focusable so that after activating a tab, the next Tab
			// press lands in the content it just revealed rather than jumping past
			// it. This follows the ARIA pattern's guidance for panels whose first
			// element is not interactive.
			tabIndex={0}
			className={cx("fds-tabs__panel", className)}
		>
			{children}
		</div>
	);
}
