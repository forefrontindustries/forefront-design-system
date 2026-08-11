import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { Portal } from "../../lib/portal";
import { prefersReducedMotion, usePresence } from "../../lib/use-presence";
import "./toast.css";

export type ToastTone = "neutral" | "success" | "warning" | "danger";
export type ToastPlacement = "top-end" | "top-center" | "bottom-end" | "bottom-center";

export interface ToastOptions {
	/** Short summary. One line. */
	title: ReactNode;
	/** Optional second line with detail or a next step. */
	description?: ReactNode;
	/**
	 * Semantic tone. Danger and warning are announced assertively, the rest
	 * politely.
	 * @default "neutral"
	 */
	tone?: ToastTone;
	/**
	 * Auto-dismiss delay in milliseconds. Pass 0 to require a manual dismiss,
	 * which is the right choice for anything the user has to act on.
	 * @default 5000
	 */
	duration?: number;
	/** A single action. Keep it to one: a toast is not a dialog. */
	action?: { label: string; onClick: () => void };
}

export interface ToastRecord extends ToastOptions {
	id: string;
}

interface ToastContextValue {
	/** Queues a toast and returns its id. */
	toast: (options: ToastOptions) => string;
	/** Removes a toast early. */
	dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast() requires a <ToastProvider> above it in the tree.");
	return context;
}

export interface ToastProviderProps {
	/**
	 * Where the stack sits. Bottom placements keep it away from the top-of-page
	 * controls a user is usually reading.
	 * @default "bottom-end"
	 */
	placement?: ToastPlacement;
	/**
	 * Maximum visible toasts. Older ones are dropped when the limit is reached,
	 * because a stack of nine notifications is a log file, not feedback.
	 * @default 3
	 */
	max?: number;
	children: ReactNode;
}

/**
 * Provides the toast queue and renders the viewport.
 *
 * The interesting problems in a toast system are not visual. They are: which
 * live region politeness to use so a message is heard without interrupting, how
 * to stop the timer running out while someone is still reading, and how to keep
 * the dismiss button reachable. All three are handled here.
 */
export function ToastProvider({ placement = "bottom-end", max = 3, children }: ToastProviderProps) {
	const [toasts, setToasts] = useState<ToastRecord[]>([]);
	const counter = useRef(0);

	const dismiss = useCallback((id: string) => {
		setToasts((current) => current.filter((item) => item.id !== id));
	}, []);

	const toast = useCallback(
		(options: ToastOptions) => {
			counter.current += 1;
			const id = `fds-toast-${counter.current}`;
			setToasts((current) => {
				const next = [...current, { ...options, id }];
				return next.length > max ? next.slice(next.length - max) : next;
			});
			return id;
		},
		[max],
	);

	const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Portal>
				{/* The viewport is a landmark region with a name, so a screen reader
				    user can navigate back to notifications they heard but did not
				    finish reading. An ordered list gives them a count.

				    It is also the live region, and it is mounted with the provider
				    rather than with the first toast. That ordering is the whole
				    point: aria-live is only reliable on a node that already existed
				    when the content arrived. role="alert" is the one exception that
				    is announced on insertion, which is why assertive toasts still
				    carry it themselves and polite ones are announced by this
				    container instead of declaring role="status" on a node that
				    appeared in the same tick. */}
				<ol
					className={cx("fds-toast-viewport", `fds-toast-viewport--${placement}`)}
					role="region"
					aria-label="Notifications"
					aria-live="polite"
					aria-relevant="additions text"
					tabIndex={-1}
				>
					{toasts.map((item) => (
						<ToastItem key={item.id} toast={item} onDismiss={dismiss} />
					))}
				</ol>
			</Portal>
		</ToastContext.Provider>
	);
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
	const { title, description, tone = "neutral", duration = 5000, action, id } = toast;
	const [open, setOpen] = useState(true);
	const { mounted, status } = usePresence(open, "moderate");
	const remaining = useRef(duration);
	const startedAt = useRef<number>(Date.now());
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const close = useCallback(() => setOpen(false), []);

	const clear = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
	}, []);

	const start = useCallback(() => {
		if (duration <= 0) return;
		clear();
		startedAt.current = Date.now();
		timer.current = setTimeout(close, remaining.current);
	}, [clear, close, duration]);

	// Pausing banks the time already spent. Restarting the full duration on every
	// mouse move is how a toast becomes impossible to dismiss by hovering it, and
	// resetting to zero is how it vanishes mid-sentence.
	const pause = useCallback(() => {
		if (duration <= 0 || !timer.current) return;
		remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
		clear();
	}, [clear, duration]);

	useEffect(() => {
		start();
		return clear;
	}, [start, clear]);

	// Unmount happens after the exit transition, which the presence hook owns.
	useEffect(() => {
		if (!mounted) onDismiss(id);
	}, [mounted, onDismiss, id]);

	if (!mounted) return null;

	const assertive = tone === "danger" || tone === "warning";

	return (
		<li
			className={cx("fds-toast", `fds-toast--${tone}`, `is-${status}`)}
			// Politeness follows severity: an error interrupts, a confirmation
			// waits for a pause in speech. Making everything assertive trains
			// people to ignore the region.
			//
			// Only the assertive case declares its own live semantics. A polite
			// toast inherits the announcement from the persistent viewport region,
			// because declaring role="status" and aria-live on an element that is
			// being inserted right now is the version of this that silently fails
			// to announce in some screen reader and browser pairings.
			role={assertive ? "alert" : undefined}
			aria-live={assertive ? "assertive" : undefined}
			aria-atomic="true"
			onMouseEnter={pause}
			onMouseLeave={start}
			// Focus pauses the timer too, so a keyboard user tabbing to the action
			// button does not lose the toast out from under them.
			onFocus={pause}
			onBlur={start}
		>
			<span className="fds-toast__marker" aria-hidden="true" />
			<div className="fds-toast__content">
				<p className="fds-toast__title">{title}</p>
				{description ? <p className="fds-toast__description">{description}</p> : null}
				{action ? (
					<button
						type="button"
						className="fds-toast__action"
						onClick={() => {
							action.onClick();
							close();
						}}
					>
						{action.label}
					</button>
				) : null}
			</div>
			<button type="button" className="fds-toast__close" onClick={close} aria-label="Dismiss notification">
				<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
					<path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</svg>
			</button>
			{duration > 0 && !prefersReducedMotion() ? (
				<span
					className="fds-toast__timer"
					style={{ animationDuration: `${duration}ms` }}
					aria-hidden="true"
				/>
			) : null}
		</li>
	);
}
