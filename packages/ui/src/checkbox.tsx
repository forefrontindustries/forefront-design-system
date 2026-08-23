import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useEffect, useRef } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  label: ReactNode;
  /** Tri-state. Sets the DOM indeterminate flag, which cannot be expressed in JSX alone. */
  indeterminate?: boolean;
}

/**
 * Checkbox.
 *
 * A real input, visually hidden and styled through its sibling box. Native semantics,
 * native keyboard, native form participation. Nothing is reimplemented with divs.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className="fds-checkbox">
      <input
        {...rest}
        type="checkbox"
        className="fds-checkbox-input fds-visually-hidden"
        aria-checked={indeterminate ? "mixed" : undefined}
        ref={(node) => {
          inner.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
      />
      <span className="fds-checkbox-box" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" focusable="false">
          {indeterminate ? (
            <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path
              d="M2.5 6.4 4.7 8.6 9.5 3.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
});
