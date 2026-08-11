import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { useField, type FieldMessages } from "../field/field";
import "./checkbox.css";

export interface CheckboxProps
	extends FieldMessages,
		Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "className"> {
	/**
	 * Renders the mixed state. Maps to the native `indeterminate` DOM property,
	 * which is what puts the element in `:indeterminate` and makes assistive
	 * technology announce "mixed".
	 * @default false
	 */
	indeterminate?: boolean;
	/** Class applied to the outer wrapper. */
	className?: string;
}

/**
 * Binary or mixed choice inside a form.
 *
 * The visible box is the native input with `appearance: none`, not a div with a
 * hidden input behind it. Keeping the real control on screen means the browser
 * still handles form association, autofill, `:indeterminate`, and the native
 * click target that mobile Safari grows for you.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ indeterminate = false, label, description, error, required, className, disabled, id, ...rest },
	ref,
) {
	const field = useField({ id, description, error, required });
	const innerRef = useRef<HTMLInputElement | null>(null);

	// The indeterminate state has no HTML attribute, only a DOM property, so it
	// has to be written on every commit. React does not do this for you.
	useEffect(() => {
		if (innerRef.current) innerRef.current.indeterminate = indeterminate;
	}, [indeterminate]);

	return (
		<div
			className={cx(
				"fds-field",
				"fds-field--inline",
				field.invalid && "is-invalid",
				disabled && "is-disabled",
				className,
			)}
		>
			<span className="fds-checkbox">
				<input
					{...rest}
					{...field.aria}
					ref={(node) => {
						innerRef.current = node;
						if (typeof ref === "function") ref(node);
						else if (ref) ref.current = node;
					}}
					type="checkbox"
					required={required}
					disabled={disabled}
					aria-checked={indeterminate ? "mixed" : undefined}
					className="fds-checkbox__input"
				/>
				<svg className="fds-checkbox__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
					<path
						d="M3.5 8.4l3 3 6-6.4"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<svg className="fds-checkbox__dash" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
					<path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</span>
			{label ? (
				<label className="fds-field__label" htmlFor={field.controlId} id={field.labelId}>
					{label}
					{required ? (
						<span className="fds-field__required" aria-hidden="true">
							*
						</span>
					) : null}
				</label>
			) : null}
			{description ? (
				<p className="fds-field__description" id={field.descriptionId}>
					{description}
				</p>
			) : null}
			{field.invalid ? (
				<p className="fds-field__error" id={field.errorId}>
					{error}
				</p>
			) : null}
		</div>
	);
});
