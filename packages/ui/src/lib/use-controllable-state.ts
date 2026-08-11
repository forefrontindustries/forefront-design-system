import { useCallback, useRef, useState } from "react";

/**
 * One state hook for every component that can be either controlled or
 * uncontrolled.
 *
 * The rule this enforces: a component is controlled when the `value` prop is
 * not `undefined`, decided once on first render and then locked. Components
 * that re-derive controlled-ness every render silently swap modes when a
 * consumer's value goes momentarily undefined, and the resulting bug reports
 * arrive as "the switch randomly stops working".
 */
export function useControllableState<T>(options: {
	value: T | undefined;
	defaultValue: T;
	onChange?: (value: T) => void;
}): [T, (next: T | ((current: T) => T)) => void] {
	const { value, defaultValue, onChange } = options;
	const isControlled = useRef(value !== undefined).current;
	const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
	const current = isControlled ? (value as T) : uncontrolled;

	const currentRef = useRef(current);
	currentRef.current = current;

	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const setValue = useCallback(
		(next: T | ((prev: T) => T)) => {
			const resolved =
				typeof next === "function" ? (next as (prev: T) => T)(currentRef.current) : next;
			if (Object.is(resolved, currentRef.current)) return;
			if (!isControlled) setUncontrolled(resolved);
			onChangeRef.current?.(resolved);
		},
		[isControlled],
	);

	return [current, setValue];
}
