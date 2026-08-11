import { useEffect, useRef, useState } from "react";

/**
 * Keeps an element mounted long enough to play its exit animation.
 *
 * Without this, every overlay in the library would animate in and then vanish,
 * which reads as a bug. Two details matter:
 *
 * - The duration passed here has to match the CSS. That duplication is real, so
 *   the durations live in one exported map below rather than as magic numbers
 *   scattered across four components.
 * - Under `prefers-reduced-motion` the wait collapses to zero, matching the
 *   token layer, which zeroes every duration custom property. If this hook did
 *   not check the media query, reduced-motion users would sit through a 200ms
 *   delay watching nothing happen.
 */

/** Mirrors the duration primitives. Update both if the token ramp changes. */
export const presenceDuration = {
	fast: 120,
	moderate: 200,
	slow: 320,
} as const;

export type PresenceSpeed = keyof typeof presenceDuration;

export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined" || !window.matchMedia) return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePresence(
	open: boolean,
	speed: PresenceSpeed = "moderate",
): { mounted: boolean; status: "open" | "closed" } {
	const [mounted, setMounted] = useState(open);
	const [status, setStatus] = useState<"open" | "closed">(open ? "open" : "closed");
	const frame = useRef<number | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const duration = prefersReducedMotion() ? 0 : presenceDuration[speed];

		if (open) {
			if (timer.current) clearTimeout(timer.current);
			setMounted(true);
			// One frame of the closed state has to be committed before the open
			// state, or the browser has nothing to transition from.
			frame.current = requestAnimationFrame(() => {
				frame.current = requestAnimationFrame(() => setStatus("open"));
			});
		} else {
			if (frame.current) cancelAnimationFrame(frame.current);
			setStatus("closed");
			timer.current = setTimeout(() => setMounted(false), duration);
		}

		return () => {
			if (frame.current) cancelAnimationFrame(frame.current);
			if (timer.current) clearTimeout(timer.current);
		};
	}, [open, speed]);

	return { mounted, status };
}
