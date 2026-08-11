import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/use-controllable-state";
import { FieldFrame, useField, type FieldMessages } from "../field/field";
import "./select.css";

export interface SelectOption {
	/** Submitted value. */
	value: string;
	/** Visible text. Also what typeahead matches against. */
	label: string;
	/** Secondary line inside the option row. */
	description?: string;
	/** Removed from keyboard navigation as well as from pointer interaction. */
	disabled?: boolean;
}

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends FieldMessages {
	/** Options in display order. */
	options: SelectOption[];
	/** Selected value, for a controlled Select. */
	value?: string;
	/** Initial value, for an uncontrolled Select. */
	defaultValue?: string;
	/** Fired with the newly selected value. */
	onChange?: (value: string) => void;
	/**
	 * Text shown when nothing is selected.
	 * @default "Select an option"
	 */
	placeholder?: string;
	/**
	 * Control height, shared with Button and Input.
	 * @default "md"
	 */
	size?: SelectSize;
	/** Disables the control. */
	disabled?: boolean;
	/**
	 * Renders a hidden input so the value posts with a plain HTML form
	 * submission. Without a name, the value only exists in React state.
	 */
	name?: string;
	/**
	 * Fills the container width.
	 * @default true
	 */
	fullWidth?: boolean;
	/** Rendered inside the trigger before the value. */
	iconStart?: ReactNode;
	className?: string;
	/** Id for the trigger. Generated when omitted, and used to derive the label, description and error ids. */
	id?: string;
}

/**
 * Single-select from a list of options.
 *
 * This is the one component where the native element was not good enough: a
 * native `select` cannot render a description under an option and cannot be
 * styled to match the token system on every platform. Everything that comes free
 * with `select` therefore had to be rebuilt, and the list is longer than most
 * people expect: the full ARIA combobox wiring, roving `aria-activedescendant`,
 * arrow and Home and End navigation, printable-character typeahead with a reset
 * timer, Escape and outside-click dismissal, scrolling the active option into
 * view, flipping the menu when the viewport runs out, and a hidden input so the
 * value still posts in a plain form.
 *
 * Focus stays on the trigger the entire time the menu is open. That is the part
 * people get wrong: moving DOM focus into the list breaks the relationship
 * between the combobox and its active option, and screen readers stop announcing
 * the selection.
 */
export function Select({
	options,
	value,
	defaultValue,
	onChange,
	placeholder = "Select an option",
	size = "md",
	disabled = false,
	name,
	fullWidth = true,
	iconStart,
	label,
	description,
	error,
	required,
	className,
	id,
}: SelectProps) {
	const field = useField({ id, description, error, required });
	const [selected, setSelected] = useControllableState<string | undefined>({
		value,
		defaultValue,
		onChange: onChange as ((next: string | undefined) => void) | undefined,
	});
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [above, setAbove] = useState(false);

	const rootRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);
	const typeahead = useRef<{ query: string; timer: ReturnType<typeof setTimeout> | null }>({
		query: "",
		timer: null,
	});

	const listId = `fds-select-${useId()}`;
	const selectedOption = options.find((option) => option.value === selected);
	const enabledIndexes = options.map((option, index) => (option.disabled ? -1 : index)).filter((i) => i >= 0);

	const optionId = (index: number) => `${listId}-option-${index}`;

	const openMenu = useCallback(
		(startAt: "selected" | "first" | "last") => {
			if (disabled) return;
			const selectedIndex = options.findIndex((option) => option.value === selected);
			let next: number;
			if (startAt === "selected" && selectedIndex >= 0) next = selectedIndex;
			else if (startAt === "last") next = enabledIndexes[enabledIndexes.length - 1] ?? -1;
			else next = enabledIndexes[0] ?? -1;

			// Flip above the trigger when the menu would run off the bottom. The
			// menu stays in the DOM next to its trigger rather than in a portal, so
			// it inherits the theme attribute and needs no scroll synchronisation.
			// The cost is that a consumer with overflow: hidden between here and the
			// viewport will clip it, which is documented rather than hidden.
			const rect = triggerRef.current?.getBoundingClientRect();
			if (rect) {
				const spaceBelow = window.innerHeight - rect.bottom;
				setAbove(spaceBelow < 240 && rect.top > spaceBelow);
			}

			setActiveIndex(next);
			setOpen(true);
		},
		[disabled, enabledIndexes, options, selected],
	);

	const closeMenu = useCallback((refocus = true) => {
		setOpen(false);
		setActiveIndex(-1);
		if (refocus) triggerRef.current?.focus();
	}, []);

	const commit = useCallback(
		(index: number) => {
			const option = options[index];
			if (!option || option.disabled) return;
			setSelected(option.value);
			closeMenu();
		},
		[closeMenu, options, setSelected],
	);

	const move = useCallback(
		(direction: 1 | -1 | "first" | "last") => {
			if (enabledIndexes.length === 0) return;
			if (direction === "first") {
				setActiveIndex(enabledIndexes[0]!);
				return;
			}
			if (direction === "last") {
				setActiveIndex(enabledIndexes[enabledIndexes.length - 1]!);
				return;
			}
			const position = enabledIndexes.indexOf(activeIndex);
			// Wrapping matches the native select on every platform the team ships
			// to, and it means End is never the only way to reach the last option.
			const nextPosition =
				position === -1
					? direction === 1
						? 0
						: enabledIndexes.length - 1
					: (position + direction + enabledIndexes.length) % enabledIndexes.length;
			setActiveIndex(enabledIndexes[nextPosition]!);
		},
		[activeIndex, enabledIndexes],
	);

	/**
	 * Printable-character typeahead. Characters accumulate for 500ms so "sa"
	 * finds San Diego rather than jumping to Sacramento and then Argentina, and
	 * the search starts after the active option so repeated presses of one letter
	 * cycle through the matches.
	 */
	const search = useCallback(
		(character: string) => {
			const state = typeahead.current;
			if (state.timer) clearTimeout(state.timer);
			state.query += character.toLowerCase();
			state.timer = setTimeout(() => {
				state.query = "";
			}, 500);

			const query = state.query;
			const startFrom = activeIndex >= 0 ? activeIndex : 0;
			const ordered = [
				...options.slice(startFrom + (query.length > 1 ? 0 : 1)),
				...options.slice(0, startFrom + (query.length > 1 ? 0 : 1)),
			];
			const match = ordered.find(
				(option) => !option.disabled && option.label.toLowerCase().startsWith(query),
			);
			if (!match) return;
			const index = options.indexOf(match);
			if (open) setActiveIndex(index);
			else setSelected(match.value);
		},
		[activeIndex, open, options, setSelected],
	);

	// Keep the active option visible. block: nearest scrolls the minimum amount,
	// so arrowing through a long list does not jump the menu around.
	useEffect(() => {
		if (!open || activeIndex < 0) return;
		const node = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`);
		node?.scrollIntoView({ block: "nearest" });
	});

	// Outside interaction closes without refocusing: the user is already on their
	// way somewhere else, and stealing focus back is disorienting.
	useEffect(() => {
		if (!open) return;
		function onPointerDown(event: PointerEvent) {
			if (!rootRef.current?.contains(event.target as Node)) closeMenu(false);
		}
		document.addEventListener("pointerdown", onPointerDown, true);
		return () => document.removeEventListener("pointerdown", onPointerDown, true);
	}, [open, closeMenu]);

	useEffect(
		() => () => {
			if (typeahead.current.timer) clearTimeout(typeahead.current.timer);
		},
		[],
	);

	function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
		if (disabled) return;

		if (!open) {
			switch (event.key) {
				case "ArrowDown":
				case "Enter":
				case " ":
					event.preventDefault();
					openMenu("selected");
					return;
				case "ArrowUp":
					event.preventDefault();
					openMenu("last");
					return;
				case "Home":
					event.preventDefault();
					openMenu("first");
					return;
				case "End":
					event.preventDefault();
					openMenu("last");
					return;
				default:
					if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
						event.preventDefault();
						search(event.key);
					}
					return;
			}
		}

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				move(1);
				break;
			case "ArrowUp":
				event.preventDefault();
				move(-1);
				break;
			case "Home":
				event.preventDefault();
				move("first");
				break;
			case "End":
				event.preventDefault();
				move("last");
				break;
			case "Enter":
			case " ":
				event.preventDefault();
				commit(activeIndex);
				break;
			case "Escape":
				event.preventDefault();
				closeMenu();
				break;
			case "Tab":
				// APG: Tab selects the active option and moves on. Not preventing
				// default is deliberate, so focus continues to the next control.
				commit(activeIndex);
				break;
			default:
				if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
					event.preventDefault();
					search(event.key);
				}
				break;
		}
	}

	return (
		<FieldFrame
			field={field}
			label={label}
			description={description}
			error={error}
			required={required}
			className={cx(fullWidth && "fds-field--full", className)}
		>
			<div className={cx("fds-select", above && "is-above")} ref={rootRef}>
				<button
					ref={triggerRef}
					type="button"
					role="combobox"
					id={field.controlId}
					className={cx(
						"fds-select__trigger",
						`fds-select__trigger--${size}`,
						open && "is-open",
						field.invalid && "is-invalid",
					)}
					disabled={disabled}
					aria-expanded={open}
					aria-controls={listId}
					aria-haspopup="listbox"
					aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
					aria-describedby={field.aria["aria-describedby"]}
					aria-invalid={field.aria["aria-invalid"]}
					aria-errormessage={field.aria["aria-errormessage"]}
					aria-required={field.aria["aria-required"]}
					onClick={() => (open ? closeMenu() : openMenu("selected"))}
					onKeyDown={onKeyDown}
				>
					{iconStart ? (
						<span className="fds-select__adornment" aria-hidden="true">
							{iconStart}
						</span>
					) : null}
					<span className={cx("fds-select__value", !selectedOption && "is-placeholder")}>
						{selectedOption?.label ?? placeholder}
					</span>
					<svg className="fds-select__chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
						<path
							d="M4 6.5l4 4 4-4"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				{/* The listbox is always rendered so its id is a valid aria-controls
				    target even while collapsed, and hidden with the hidden attribute
				    rather than removed, which keeps the relationship stable. */}
				<ul
					ref={listRef}
					id={listId}
					role="listbox"
					aria-labelledby={label ? field.labelId : undefined}
					className="fds-select__menu"
					hidden={!open}
					tabIndex={-1}
				>
					{options.map((option, index) => (
						<li
							key={option.value}
							id={optionId(index)}
							role="option"
							aria-selected={option.value === selected}
							aria-disabled={option.disabled || undefined}
							className={cx(
								"fds-select__option",
								index === activeIndex && "is-active",
								option.value === selected && "is-selected",
								option.disabled && "is-disabled",
							)}
							// Pointer down rather than click: mousedown would move focus
							// off the trigger before the value is committed, and click
							// arrives after the browser has already blurred it.
							onPointerDown={(event) => {
								event.preventDefault();
								commit(index);
							}}
							onPointerEnter={() => !option.disabled && setActiveIndex(index)}
						>
							<span className="fds-select__option-check" aria-hidden="true">
								<svg viewBox="0 0 16 16" focusable="false">
									<path
										d="M3.5 8.4l3 3 6-6.4"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="fds-select__option-text">
								<span className="fds-select__option-label">{option.label}</span>
								{option.description ? (
									<span className="fds-select__option-description">{option.description}</span>
								) : null}
							</span>
						</li>
					))}
					{options.length === 0 ? <li className="fds-select__empty">No options</li> : null}
				</ul>

				{name ? <input type="hidden" name={name} value={selected ?? ""} /> : null}
			</div>
		</FieldFrame>
	);
}
