import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";

export interface FieldProps {
  label: string;
  /** Helper text shown under the control. Announced through aria-describedby. */
  hint?: ReactNode;
  /** Error text. When present the control is marked invalid and the hint is replaced. */
  error?: ReactNode;
  required?: boolean;
  /** Render prop so the label, hint, and error wiring is handed to any control. */
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

/**
 * Field.
 *
 * The one place label, hint, error, and control ids get wired together. Consumers cannot
 * forget aria-describedby or aria-invalid, because Field passes them in.
 */
export function Field({ label, hint, error, required = false, children }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="fds-field">
      <label className="fds-field-label" htmlFor={id}>
        {label}
        {required ? (
          <span className="fds-field-required" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="fds-visually-hidden"> required</span> : null}
      </label>
      {children({ id, describedBy: message ? messageId : undefined, invalid: Boolean(error) })}
      {message ? (
        <span
          className="fds-field-message"
          id={messageId}
          data-tone={error ? "danger" : undefined}
          role={error ? "alert" : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return <input {...props} ref={ref} className="fds-input" />;
});

export interface TextFieldProps extends Omit<InputProps, "id" | "aria-describedby" | "aria-invalid"> {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
}

/** Field plus Input, for the common case. */
export function TextField({ label, hint, error, required, ...rest }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <Input
          {...rest}
          id={id}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
        />
      )}
    </Field>
  );
}
