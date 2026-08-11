import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "subtle" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
	/**
	 * Visual weight. One primary button per view: the variant is a statement
	 * about hierarchy, not a color picker.
	 * @default "primary"
	 */
	variant?: ButtonVariant;
	/**
	 * Control height, shared with Input and Select through the `control.*`
	 * tokens so a button and a field line up on the same row.
	 * @default "md"
	 */
	size?: ButtonSize;
	/**
	 * Shows a progress indicator and blocks activation while keeping the button
	 * focusable. Prefer this over swapping the label to "Loading...", which
	 * loses the accessible name.
	 * @default false
	 */
	loading?: boolean;
	/** Icon before the label. Decorative: it is hidden from assistive tech. */
	iconStart?: ReactNode;
	/** Icon after the label. Decorative: it is hidden from assistive tech. */
	iconEnd?: ReactNode;
	/**
	 * Stretches to the width of the container. Use inside narrow columns and
	 * mobile sheets, not in toolbars.
	 * @default false
	 */
	fullWidth?: boolean;
	/** Button label. Required, including for icon-only buttons. */
	children?: ReactNode;
}

/**
 * Triggers an action in the current view.
 *
 * `loading` is intentionally not the same thing as `disabled`. A disabled
 * button is removed from the tab order, so a keyboard user who submits a form
 * loses their place the moment the request starts. Loading keeps the element
 * focusable, announces itself with `aria-busy`, and refuses activation through
 * `aria-disabled` plus a guarded click handler.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		variant = "primary",
		size = "md",
		loading = false,
		iconStart,
		iconEnd,
		fullWidth = false,
		className,
		children,
		disabled,
		type = "button",
		onClick,
		...rest
	},
	ref,
) {
	const inert = disabled === true || loading;

	return (
		<button
			{...rest}
			ref={ref}
			type={type}
			className={cx(
				"fds-button",
				`fds-button--${variant}`,
				`fds-button--${size}`,
				fullWidth && "fds-button--full",
				loading && "is-loading",
				className,
			)}
			disabled={disabled}
			aria-disabled={loading || undefined}
			aria-busy={loading || undefined}
			onClick={(event) => {
				if (inert) {
					event.preventDefault();
					return;
				}
				onClick?.(event);
			}}
		>
			{loading ? (
				<span className="fds-button__spinner" aria-hidden="true" />
			) : iconStart ? (
				<span className="fds-button__icon" aria-hidden="true">
					{iconStart}
				</span>
			) : null}
			<span className="fds-button__label">{children}</span>
			{iconEnd && !loading ? (
				<span className="fds-button__icon" aria-hidden="true">
					{iconEnd}
				</span>
			) : null}
		</button>
	);
});
