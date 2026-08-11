import type { Ref } from "react";

/**
 * Merges several refs into one callback ref.
 *
 * Needed wherever the library clones a consumer's element and has to attach its
 * own ref without stealing theirs. Tooltip is the case that forced it: the
 * trigger belongs to the consumer, but the tooltip needs its bounding box.
 */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void {
	return (node: T | null) => {
		for (const ref of refs) {
			if (!ref) continue;
			if (typeof ref === "function") ref(node);
			else (ref as { current: T | null }).current = node;
		}
	};
}
