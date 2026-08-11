import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { FieldFrame, useField, type FieldMessages } from "../field/field";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
	extends FieldMessages,
		Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "className"> {
	/**
	 * Control height, shared with Button and Select.
	 * @default "md"
	 */
	size?: InputSize;
	/** Decorative icon rendered inside the leading edge of the field. */
	iconStart?: ReactNode;
	/** Decorative icon or unit rendered inside the trailing edge of the field. */
	iconEnd?: ReactNode;
	/**
	 * Fills the width of its container. Fields are full width by default because
	 * a form column is the normal case.
	 * @default true
	 */
	fullWidth?: boolean;
	/** Class applied to the outer field wrapper, not the input element. */
	className?: string;
	/** Class applied to the input element itself. */
	inputClassName?: string;
}

/**
 * Single-line text entry.
 *
 * The invalid state is derived from the `error` prop rather than exposed as a
 * separate boolean. Two sources of truth for validity is how you end up with a
 * red border and no message, which tells a colour blind user nothing at all.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		size = "md",
		label,
		description,
		error,
		required,
		iconStart,
		iconEnd,
		fullWidth = true,
		className,
		inputClassName,
		disabled,
		id,
		...rest
	},
	ref,
) {
	const field = useField({ id, description, error, required });

	return (
		<FieldFrame
			field={field}
			label={label}
			description={description}
			error={error}
			required={required}
			className={cx(fullWidth && "fds-field--full", className)}
		>
			<div
				className={cx(
					"fds-input",
					`fds-input--${size}`,
					field.invalid && "is-invalid",
					disabled && "is-disabled",
				)}
			>
				{iconStart ? (
					<span className="fds-input__adornment" aria-hidden="true">
						{iconStart}
					</span>
				) : null}
				<input
					{...rest}
					{...field.aria}
					ref={ref}
					required={required}
					disabled={disabled}
					className={cx("fds-input__control", inputClassName)}
				/>
				{iconEnd ? (
					<span className="fds-input__adornment" aria-hidden="true">
						{iconEnd}
					</span>
				) : null}
			</div>
		</FieldFrame>
	);
});
