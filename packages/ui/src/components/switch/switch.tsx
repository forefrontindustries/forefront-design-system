import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { useField } from "../field/field";
import "./switch.css";

export interface SwitchProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "className"> {
	/** Label text. Describe the thing being switched, not the current state. */
	label?: ReactNode;
	/** Secondary line explaining what changes when it is on. */
	description?: ReactNode;
	/**
	 * Places the control after the label, right aligned, for settings rows.
	 * @default "start"
	 */
	labelPosition?: "start" | "end";
	className?: string;
}

/**
 * Immediate on or off, applied without a save step.
 *
 * Implemented as `input[type="checkbox"]` with `role="switch"` rather than a
 * button with `aria-checked`. The role gives the on/off announcement, and the
 * native input keeps form participation, label association and the browser's
 * own click handling. A button would need all three rebuilt by hand for no
 * gain.
 *
 * If the change needs a Save button to take effect, use a Checkbox. A switch
 * that does not act immediately is a lie about state.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
	{ label, description, labelPosition = "start", className, disabled, id, ...rest },
	ref,
) {
	const field = useField({ id, description });

	return (
		<div
			className={cx(
				"fds-switch",
				labelPosition === "end" && "fds-switch--label-end",
				disabled && "is-disabled",
				className,
			)}
		>
			<span className="fds-switch__track-wrap">
				<input
					{...rest}
					{...field.aria}
					ref={ref}
					type="checkbox"
					role="switch"
					disabled={disabled}
					className="fds-switch__input"
				/>
				<span className="fds-switch__thumb" aria-hidden="true" />
			</span>
			{label ? (
				<label className="fds-switch__label" htmlFor={field.controlId}>
					{label}
				</label>
			) : null}
			{description ? (
				<p className="fds-switch__description" id={field.descriptionId}>
					{description}
				</p>
			) : null}
		</div>
	);
});
