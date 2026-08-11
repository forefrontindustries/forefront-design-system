/**
 * Class name joiner.
 *
 * Deliberately 8 lines instead of a dependency. The library has one runtime
 * dependency (React) and that is a feature: a design system that drags four
 * utility packages into every consumer's bundle stops being neutral
 * infrastructure.
 */
export type ClassValue = string | number | false | null | undefined;

export function cx(...values: ClassValue[]): string | undefined {
	let out = "";
	for (const value of values) {
		if (!value && value !== 0) continue;
		out = out ? `${out} ${value}` : String(value);
	}
	return out || undefined;
}
