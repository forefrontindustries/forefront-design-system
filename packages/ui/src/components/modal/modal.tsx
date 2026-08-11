import { useCallback, useId, useRef, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { useEscapeKey, useFocusTrap, useScrollLock } from "../../lib/focus";
import { Portal } from "../../lib/portal";
import { usePresence } from "../../lib/use-presence";
import "./modal.css";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
	/** Whether the dialog is open. The component is fully controlled. */
	open: boolean;
	/**
	 * Called for every dismissal route: the close button, Escape, and the
	 * backdrop. One handler means a consumer cannot accidentally support two of
	 * the three.
	 */
	onClose: () => void;
	/** Dialog title. Becomes the accessible name through aria-labelledby. */
	title: ReactNode;
	/** Optional supporting line, wired to aria-describedby. */
	description?: ReactNode;
	/**
	 * Width step. Anything wider than lg is a page, not a dialog.
	 * @default "md"
	 */
	size?: ModalSize;
	/** Footer actions. The primary action goes last, on the trailing edge. */
	footer?: ReactNode;
	/**
	 * Set to false for dialogs holding unsaved work, so a stray click cannot
	 * discard it.
	 * @default true
	 */
	dismissOnBackdrop?: boolean;
	/**
	 * Hides the close button. Only for flows that must be resolved through the
	 * footer actions, and Escape still works.
	 * @default false
	 */
	hideCloseButton?: boolean;
	/** Dialog content. */
	children?: ReactNode;
	className?: string;
}

/**
 * A modal dialog that takes focus and blocks the page behind it.
 *
 * Built on a div with role="dialog" rather than the native `<dialog>` element,
 * for one reason: the top layer cannot be styled or animated consistently across
 * browsers yet, and the native element's backdrop ignores the token system. What
 * that costs is that the focus trap, the scroll lock, the Escape handler and the
 * focus restore all have to be authored. They are, in `lib/focus.ts`, and they
 * are shared with every other overlay so the behaviour cannot diverge.
 *
 * `aria-modal="true"` tells assistive technology the rest of the page is
 * unavailable, which is the announcement half. The focus trap is the behavioural
 * half. Shipping one without the other is the most common dialog bug in the
 * wild.
 */
export function Modal({
	open,
	onClose,
	title,
	description,
	size = "md",
	footer,
	dismissOnBackdrop = true,
	hideCloseButton = false,
	children,
	className,
}: ModalProps) {
	const { mounted, status } = usePresence(open, "moderate");
	const panelRef = useRef<HTMLDivElement | null>(null);
	const generatedId = useId();
	const titleId = `fds-modal-${generatedId}-title`;
	const descriptionId = `fds-modal-${generatedId}-description`;

	const handleEscape = useCallback(() => onClose(), [onClose]);

	useFocusTrap(panelRef, open && mounted);
	useScrollLock(open);
	useEscapeKey(open, handleEscape);

	if (!mounted) return null;

	return (
		<Portal>
			<div className={cx("fds-modal", `is-${status}`)} data-fds-overlay="modal">
				{/* The backdrop is a sibling, not a parent. Nesting the panel inside a
				    clickable backdrop means every click inside the dialog has to be
				    stopped from propagating, and one forgotten stopPropagation closes
				    the dialog on a text selection. */}
				<div
					className="fds-modal__backdrop"
					onClick={dismissOnBackdrop ? onClose : undefined}
					aria-hidden="true"
				/>
				<div className="fds-modal__viewport">
					<div
						ref={panelRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						aria-describedby={description ? descriptionId : undefined}
						className={cx("fds-modal__panel", `fds-modal__panel--${size}`, className)}
					>
						<div className="fds-modal__header">
							<div className="fds-modal__heading">
								<h2 className="fds-modal__title" id={titleId}>
									{title}
								</h2>
								{description ? (
									<p className="fds-modal__description" id={descriptionId}>
										{description}
									</p>
								) : null}
							</div>
							{hideCloseButton ? null : (
								<button
									type="button"
									className="fds-modal__close"
									onClick={onClose}
									aria-label="Close dialog"
								>
									<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
										<path
											d="M4 4l8 8M12 4l-8 8"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							)}
						</div>
						{children ? <div className="fds-modal__body">{children}</div> : null}
						{footer ? <div className="fds-modal__footer">{footer}</div> : null}
					</div>
				</div>
			</div>
		</Portal>
	);
}
