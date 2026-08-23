import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, blocks activation, and keeps the button in the tab order so screen readers hear the busy state. */
  loading?: boolean;
  /** Required when the button renders an icon with no visible text. */
  "aria-label"?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

/**
 * Button.
 *
 * Accessibility contract:
 *  - always a real <button>, so Enter and Space work without extra handlers
 *  - loading uses aria-busy plus aria-disabled instead of the disabled attribute,
 *    so focus is not silently dropped mid-interaction
 *  - focus ring comes from the shared token rule in styles.css, never from the variant
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, iconStart, iconEnd, children, disabled, onClick, type = "button", ...rest },
  ref,
) {
  const inert = disabled || loading;

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className="fds-button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (inert) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {loading ? <span className="fds-spinner" aria-hidden="true" /> : iconStart}
      {children}
      {loading ? null : iconEnd}
    </button>
  );
});
