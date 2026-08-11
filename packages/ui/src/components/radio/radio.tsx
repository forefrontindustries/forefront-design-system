import {
	createContext,
	forwardRef,
	useContext,
	useId,
	type InputHTMLAttributes,
	type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/use-controllable-state";
import { useField, type FieldMessages } from "../field/field";
import "./radio.css";

interface RadioGroupContextValue {
	name: string;
	value: string | undefined;
	onSelect: (value: string) => void;
	disabled: boolean;
	invalid: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends FieldMessages {
	/** Selected value. Provide with onChange for a controlled group. */
	value?: string;
	/** Initial selected value for an uncontrolled group. */
	defaultValue?: string;
	/** Fired with the newly selected value. */
	onChange?: (value: string) => void;
	/**
	 * Shared input name. Generated when omitted, which is what makes arrow key
	 * navigation work without any JavaScript.
	 */
	name?: string;
	/** Disables every radio in the group. */
	disabled?: boolean;
	/**
	 * Row layout. Only use it for two or three short options.
	 * @default "vertical"
	 */
	orientation?: "vertical" | "horizontal";
	className?: string;
	children: ReactNode;
}

/**
 * A set of mutually exclusive options.
 *
 * Grouping happens through a `fieldset` with a `legend` and a shared input
 * name, so roving tabindex is not needed: the browser already treats a named
 * radio set as one tab stop with arrow key navigation inside it. Reimplementing
 * that in JavaScript is the most common way a design system breaks radios.
 */
export function RadioGroup({
	value,
	defaultValue,
	onChange,
	name,
	disabled = false,
	orientation = "vertical",
	label,
	description,
	error,
	required,
	className,
	children,
}: RadioGroupProps) {
	const generatedName = useId();
	const legendId = `fds-radio-group-${useId()}-legend`;
	const field = useField({ description, error, required });
	const [selected, setSelected] = useControllableState<string | undefined>({
		value,
		defaultValue,
		onChange: onChange as ((next: string | undefined) => void) | undefined,
	});

	const describedBy = [description ? field.descriptionId : null, field.invalid ? field.errorId : null]
		.filter(Boolean)
		.join(" ");

	return (
		<fieldset
			className={cx("fds-radio-group", `fds-radio-group--${orientation}`, className)}
			// A fieldset maps to role="group", which announces as "grouping" and says
			// nothing about the set being mutually exclusive. radiogroup is a permitted
			// role on fieldset and is the more precise answer, and because the radios
			// themselves are untouched native inputs the browser's own arrow key
			// handling and single-tab-stop behaviour still do the work.
			role="radiogroup"
			aria-labelledby={label ? legendId : undefined}
			aria-describedby={describedBy || undefined}
			aria-required={required || undefined}
			aria-invalid={field.invalid || undefined}
			disabled={disabled}
		>
			{label ? (
				<legend className="fds-radio-group__legend" id={legendId}>
					{label}
					{required ? (
						<span className="fds-field__required" aria-hidden="true">
							*
						</span>
					) : null}
				</legend>
			) : null}
			{description ? (
				<p className="fds-field__description" id={field.descriptionId}>
					{description}
				</p>
			) : null}
			<div className="fds-radio-group__items">
				<RadioGroupContext.Provider
					value={{
						name: name ?? `fds-radio-${generatedName}`,
						value: selected,
						onSelect: setSelected,
						disabled,
						invalid: field.invalid,
					}}
				>
					{children}
				</RadioGroupContext.Provider>
			</div>
			{field.invalid ? (
				<p className="fds-field__error" id={field.errorId}>
					{error}
				</p>
			) : null}
		</fieldset>
	);
}

export interface RadioProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "className" | "value"> {
	/** The value submitted when this option is selected. Required. */
	value: string;
	/** Option label. */
	label: ReactNode;
	/** Secondary line under the label, for explaining the consequence of the choice. */
	description?: ReactNode;
	className?: string;
}

/**
 * One option inside a RadioGroup. Rendering it outside a group throws, because
 * a lone radio is a checkbox with worse ergonomics: it cannot be unselected.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
	{ value, label, description, className, disabled, id, ...rest },
	ref,
) {
	const group = useContext(RadioGroupContext);
	if (!group) {
		throw new Error("<Radio> must be rendered inside a <RadioGroup>. A single radio cannot be deselected.");
	}
	const generated = useId();
	const controlId = id ?? `fds-radio-${generated}`;
	const descriptionId = `${controlId}-description`;
	const isDisabled = disabled || group.disabled;

	return (
		<div className={cx("fds-radio", isDisabled && "is-disabled", className)}>
			<span className="fds-radio__control">
				<input
					{...rest}
					ref={ref}
					id={controlId}
					type="radio"
					className="fds-radio__input"
					name={group.name}
					value={value}
					checked={group.value === value}
					disabled={isDisabled}
					aria-describedby={description ? descriptionId : undefined}
					aria-invalid={group.invalid || undefined}
					onChange={(event) => {
						group.onSelect(value);
						rest.onChange?.(event);
					}}
				/>
				<span className="fds-radio__dot" aria-hidden="true" />
			</span>
			<label className="fds-radio__label" htmlFor={controlId}>
				{label}
			</label>
			{description ? (
				<p className="fds-radio__description" id={descriptionId}>
					{description}
				</p>
			) : null}
		</div>
	);
});
