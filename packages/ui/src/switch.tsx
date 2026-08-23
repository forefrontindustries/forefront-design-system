import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  label: ReactNode;
}

/**
 * Switch.
 *
 * role="switch" on a native checkbox: assistive tech announces on/off instead of
 * checked/unchecked, and the input still submits with the form.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ label, ...rest }, ref) {
  return (
    <label className="fds-switch">
      {/*
        A native checkbox exposes its own checkedness as aria-checked, so an explicit
        aria-checked here would duplicate platform state and go stale on uncontrolled use.
      */}
      {/* oxlint-disable-next-line jsx-a11y/role-has-required-aria-props */}
      <input {...rest} ref={ref} type="checkbox" role="switch" className="fds-switch-input fds-visually-hidden" />
      <span className="fds-switch-track" aria-hidden="true">
        <span className="fds-switch-thumb" />
      </span>
      <span>{label}</span>
    </label>
  );
});
