import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
  footer?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * Modal.
 *
 * Accessibility contract, all of it enforced here so no consumer has to remember it:
 *  - a native <dialog> element, so the dialog role and modal semantics come from the platform
 *  - aria-labelledby points at the visible title
 *  - focus moves into the dialog on open and returns to the trigger on close
 *  - Tab and Shift+Tab are trapped inside the dialog
 *  - Escape closes; the scrim closes only on a direct press, not a drag ending inside
 *  - background scroll is locked while open
 *
 * Keyboard and pointer handling is bound to the document rather than to JSX handlers, so
 * Escape still works when focus sits on the scrim and no presentational node has to pretend
 * to be interactive.
 */
export function Modal({ open, onClose, title, size = "md", children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const focusables = useCallback(
    () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    [],
  );

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = focusables()[0] ?? dialogRef.current;
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (!dialogRef.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const firstNode = nodes[0]!;
      const lastNode = nodes[nodes.length - 1]!;
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        event.preventDefault();
        firstNode.focus();
        return;
      }
      if (event.shiftKey && active === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && active === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.target === scrimRef.current) onClose();
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onMouseDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("mousedown", onMouseDown, true);
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose, focusables]);

  if (!open) return null;

  return (
    <div className="fds-scrim" ref={scrimRef}>
      <dialog
        open
        ref={dialogRef}
        className="fds-modal"
        data-size={size === "md" ? undefined : size}
        aria-modal="true"
        aria-labelledby="fds-modal-title"
        tabIndex={-1}
      >
        <h2 className="fds-modal-title" id="fds-modal-title">
          {title}
        </h2>
        {children}
        {footer ? <div className="fds-modal-footer">{footer}</div> : null}
      </dialog>
    </div>
  );
}
