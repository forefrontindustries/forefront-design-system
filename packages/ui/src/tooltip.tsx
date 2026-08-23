import type { ReactElement, ReactNode } from "react";
import { cloneElement, useId, useState } from "react";

export interface TooltipProps {
  /** Short text. A tooltip is never the only place information lives. */
  content: ReactNode;
  children: ReactElement<{ "aria-describedby"?: string }>;
}

/**
 * Tooltip.
 *
 * Accessibility contract:
 *  - opens on hover AND on keyboard focus, so it is not mouse-only
 *  - Escape dismisses it while the trigger keeps focus (WCAG 1.4.13)
 *  - wired with aria-describedby, so the text is announced instead of guessed at
 *  - never holds interactive content, because it cannot be reached with a pointer
 */
export function Tooltip({ content, children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    // The wrapper only carries hover and focus plumbing for the trigger it wraps, so it is
    // marked presentational: the accessible name and description stay on the trigger itself.
    <span
      role="presentation"
      className="fds-tooltip-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      {cloneElement(children, { "aria-describedby": id })}
      <span className="fds-tooltip" role="tooltip" id={id} hidden={!open}>
        {content}
      </span>
    </span>
  );
}
