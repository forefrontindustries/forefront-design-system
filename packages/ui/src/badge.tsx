import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "className"> {
  tone?: BadgeTone;
  /** Shows the leading dot. Keep it on when the badge carries status meaning. */
  dot?: boolean;
  children: ReactNode;
}

/**
 * Badge.
 *
 * Accessibility contract: tone is never the only signal. The label always carries the
 * meaning in text, so colour-blind users and screen readers get the same information.
 */
export function Badge({ tone = "neutral", dot = false, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className="fds-badge" data-tone={tone}>
      {dot ? <span className="fds-badge-dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
