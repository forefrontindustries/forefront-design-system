import { useEffect } from "react";

/**
 * Focus utilities.
 *
 * Written by hand on purpose. Focus management is the part of a component
 * library that people assume a dependency will handle for them, and it is also
 * the part that decides whether a keyboard user can leave a dialog.
 */

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type='hidden'])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"object",
	"embed",
	"audio[controls]",
	"video[controls]",
	"summary",
	"[tabindex]:not([tabindex='-1'])",
	"[contenteditable='true']",
].join(",");

function isVisible(element: HTMLElement): boolean {
	if (element.hidden) return false;
	if (element.getAttribute("aria-hidden") === "true") return false;
	if (element.closest("[inert]")) return false;
	// offsetParent is null for display:none subtrees. position:fixed elements
	// report null too, so those are checked through their client rects.
	if (element.offsetParent !== null) return true;
	return element.getClientRects().length > 0;
}

/** Focusable descendants of `container`, in document (tab) order. */
export function getFocusable(container: HTMLElement | null): HTMLElement[] {
	if (!container) return [];
	return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);
}

/**
 * Traps Tab inside `container` while `active`, and restores focus to whatever
 * was focused before the trap engaged.
 *
 * Notes on the choices here:
 * - The trap listens in the capture phase so a consumer's own keydown handler
 *   cannot swallow Tab and leak focus out of the dialog.
 * - Focus moves to the first element carrying `data-fds-autofocus`, otherwise
 *   the first focusable node, otherwise the container itself. A dialog that
 *   focuses nothing leaves screen reader users stranded on the page behind it.
 * - Restore is wrapped in a connected-node check because the element that
 *   opened the dialog is often unmounted by the time the dialog closes.
 * - A missing container is retried across frames instead of ignored. A trap that
 *   silently does nothing when its ref has not populated yet is the worst
 *   failure mode available here: the dialog looks correct in every screenshot
 *   while the page behind it stays tabbable. This library hit exactly that bug,
 *   through a portal that mounted one commit late, and a keyboard test caught it
 *   rather than a review. The retry is bounded so a container that never arrives
 *   ends as a no-op rather than a permanent animation frame loop.
 */
const TRAP_ENGAGE_MAX_FRAMES = 30;

export function useFocusTrap(container: React.RefObject<HTMLElement | null>, active: boolean): void {
	useEffect(() => {
		if (!active) return;

		let disposed = false;
		let frame: number | null = null;
		let attempts = 0;
		let release: (() => void) | null = null;

		function engage() {
			if (disposed) return;
			const node = container.current;
			if (!node || !node.isConnected) {
				attempts += 1;
				if (attempts > TRAP_ENGAGE_MAX_FRAMES) return;
				frame = requestAnimationFrame(engage);
				return;
			}
			release = trap(node);
		}

		engage();

		return () => {
			disposed = true;
			if (frame !== null) cancelAnimationFrame(frame);
			release?.();
		};
	}, [active, container]);
}

/** Engages the trap on a live node and returns the teardown. */
function trap(node: HTMLElement): () => void {
	{
		const previouslyFocused = document.activeElement as HTMLElement | null;

		const initial =
			node.querySelector<HTMLElement>("[data-fds-autofocus]") ?? getFocusable(node)[0] ?? node;
		if (initial === node && !node.hasAttribute("tabindex")) node.setAttribute("tabindex", "-1");
		initial.focus({ preventScroll: true });

		function onKeyDown(event: KeyboardEvent) {
			if (event.key !== "Tab") return;
			const focusable = getFocusable(node);
			if (focusable.length === 0) {
				event.preventDefault();
				node.focus({ preventScroll: true });
				return;
			}
			const first = focusable[0]!;
			const last = focusable[focusable.length - 1]!;
			const activeElement = document.activeElement as HTMLElement | null;
			const inside = activeElement ? node.contains(activeElement) : false;

			// Focus that has escaped the container is pulled back in rather than
			// left alone. Only comparing against the first and last node assumes
			// focus is already inside, which is true right up until a click, a
			// programmatic focus call or a browser find bar moves it out.
			if (!inside) {
				event.preventDefault();
				(event.shiftKey ? last : first).focus();
				return;
			}

			if (event.shiftKey && (activeElement === first || activeElement === node)) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}

		document.addEventListener("keydown", onKeyDown, true);
		return () => {
			document.removeEventListener("keydown", onKeyDown, true);
			if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
		};
	}
}

/**
 * Escape handling for overlays, registered on the document in the capture
 * phase so it works no matter where focus currently sits.
 *
 * Every dismissible overlay in the library uses this one hook, which is how
 * Escape stays consistent instead of being reimplemented three times with
 * three different `stopPropagation` habits.
 */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
	useEffect(() => {
		if (!active) return;
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onEscape();
		}
		document.addEventListener("keydown", onKeyDown, true);
		return () => document.removeEventListener("keydown", onKeyDown, true);
	}, [active, onEscape]);
}

/**
 * Locks background scrolling while an overlay is open.
 *
 * The scrollbar width is compensated with padding so opening a modal does not
 * shift the page sideways, and a counter is used so two stacked overlays do
 * not fight over the restore value.
 */
let scrollLocks = 0;
let restoreStyles: { overflow: string; paddingRight: string } | null = null;

export function useScrollLock(active: boolean): void {
	useEffect(() => {
		if (!active) return;
		const body = document.body;
		scrollLocks += 1;
		if (scrollLocks === 1) {
			restoreStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
			const gap = window.innerWidth - document.documentElement.clientWidth;
			body.style.overflow = "hidden";
			if (gap > 0) body.style.paddingRight = `${gap}px`;
		}
		return () => {
			scrollLocks -= 1;
			if (scrollLocks === 0 && restoreStyles) {
				body.style.overflow = restoreStyles.overflow;
				body.style.paddingRight = restoreStyles.paddingRight;
				restoreStyles = null;
			}
		};
	}, [active]);
}
