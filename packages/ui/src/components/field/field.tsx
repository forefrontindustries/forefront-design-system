import { useId, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./field.css";

/**
 * Shared form field scaffolding.
 *
 * Input, Select, Checkbox, Radio and Switch all label, describe and error
 * through this one module. It is internal on purpose: the moment each control
 * wires its own `aria-describedby`, one of them forgets, and the bug is
 * invisible to everyone who does not use a screen reader.
 */

export interface FieldMessages {
	/** Visible label. Omit only when an ancestor already labels the control. */
	label?: ReactNode;
	/** Helper text, always rendered above the error. */
	description?: ReactNode;
	/** Validation message. Presence of this prop is what puts the field in the invalid state. */
	error?: ReactNode;
	/** Marks the control as required and renders the required affordance. */
	required?: boolean;
}

export interface FieldAria {
	id: string;
	"aria-describedby": string | undefined;
	"aria-invalid": true | undefined;
	"aria-errormessage": string | undefined;
	"aria-required": true | undefined;
}

export interface UseFieldResult {
	controlId: string;
	labelId: string;
	descriptionId: string;
	errorId: string;
	invalid: boolean;
	/** Spread onto the control element. */
	aria: FieldAria;
}

export function useField(options: {
	id?: string;
	description?: ReactNode;
	error?: ReactNode;
	required?: boolean;
}): UseFieldResult {
	const generated = useId();
	const controlId = options.id ?? `fds-field-${generated}`;
	const descriptionId = `${controlId}-description`;
	const errorId = `${controlId}-error`;
	const invalid = options.error != null && options.error !== false && options.error !== "";

	const describedBy = [options.description ? descriptionId : null, invalid ? errorId : null]
		.filter(Boolean)
		.join(" ");

	return {
		controlId,
		labelId: `${controlId}-label`,
		descriptionId,
		errorId,
		invalid,
		aria: {
			id: controlId,
			// The error id appears in BOTH aria-describedby and aria-errormessage.
			// aria-errormessage is the correct attribute and is what a modern
			// screen reader should use, but support is still uneven, and a
			// validation message that some users never hear is not an acceptable
			// failure mode. The duplication is a deliberate belt-and-braces call.
			"aria-describedby": describedBy || undefined,
			"aria-invalid": invalid || undefined,
			"aria-errormessage": invalid ? errorId : undefined,
			"aria-required": options.required || undefined,
		},
	};
}

export interface FieldFrameProps extends FieldMessages {
	/** The result of useField(), which owns the generated ids and the invalid flag. */
	field: UseFieldResult;
	/** Renders the label as a sibling caption instead of a <label for>. Used by Radio groups, which label a fieldset. */
	labelAs?: "label" | "span";
	className?: string;
	children: ReactNode;
}

export function FieldFrame({
	field,
	label,
	description,
	error,
	required,
	labelAs = "label",
	className,
	children,
}: FieldFrameProps) {
	const LabelTag = labelAs;
	return (
		<div className={cx("fds-field", field.invalid && "is-invalid", className)}>
			{label ? (
				<LabelTag
					className="fds-field__label"
					id={field.labelId}
					{...(labelAs === "label" ? { htmlFor: field.controlId } : {})}
				>
					{label}
					{required ? (
						<span className="fds-field__required" aria-hidden="true">
							*
						</span>
					) : null}
				</LabelTag>
			) : null}
			{children}
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
}
