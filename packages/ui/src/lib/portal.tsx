import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into a host element appended to `document.body`.
 *
 * The host is created during the first client render and rendered into
 * immediately, while it is still detached. The effect below then attaches it to
 * the body. That ordering matters more than it looks:
 *
 * React flushes child effects before parent effects, so the sequence for an
 * overlay is commit the panel into the detached host, attach the host here, then
 * run the parent component's own effects. By the time Modal's focus trap runs,
 * its ref is populated AND the node is in the document, so `focus()` lands.
 *
 * The earlier version of this component kept a `mounted` flag in state and
 * returned null until its own mount effect had run, which pushed the panel one
 * whole commit later than the parent's effects. The focus trap ran against a
 * null ref, bailed, and never re-ran because its dependencies had not changed.
 * The dialog opened with a visible focus ring nowhere and the page behind it
 * still tabbable. Nothing about that was visible in a screenshot, which is the
 * argument for driving the keyboard in a test rather than reviewing overlays by
 * eye.
 *
 * `typeof document` is still guarded so a server render produces nothing rather
 * than throwing, which is the reason the flag existed in the first place.
 */
export function Portal({ children }: { children: ReactNode }) {
	const [host] = useState<HTMLElement | null>(() =>
		typeof document === "undefined" ? null : document.createElement("div"),
	);

	useEffect(() => {
		if (!host) return;
		host.setAttribute("data-fds-portal", "");
		document.body.appendChild(host);
		return () => {
			host.remove();
		};
	}, [host]);

	if (!host) return null;
	return createPortal(children, host);
}
