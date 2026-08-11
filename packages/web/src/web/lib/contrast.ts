/**
 * WCAG 2.1 contrast maths, run in the browser against resolved token values.
 *
 * The accessibility page computes every audited pair live from the token model
 * rather than rendering a table someone typed once. A claimed ratio is worth
 * nothing: the number has to come from the same source the components read, so
 * that changing a theme value changes the audit in the same commit.
 */

export interface ContrastResult {
	ratio: number;
	/** Passes 4.5:1, the threshold for body text. */
	aaText: boolean;
	/** Passes 3:1, the threshold for large text and non-text UI components. */
	aaLarge: boolean;
	/** Passes 7:1. */
	aaaText: boolean;
}

interface Rgb {
	r: number;
	g: number;
	b: number;
	a: number;
}

function parseColor(value: string): Rgb | null {
	const input = value.trim().toLowerCase();

	if (input.startsWith("#")) {
		const hex = input.slice(1);
		const expand = (part: string) => Number.parseInt(part.repeat(2), 16);
		if (hex.length === 3 || hex.length === 4) {
			return {
				r: expand(hex[0]!),
				g: expand(hex[1]!),
				b: expand(hex[2]!),
				a: hex.length === 4 ? expand(hex[3]!) / 255 : 1,
			};
		}
		if (hex.length === 6 || hex.length === 8) {
			return {
				r: Number.parseInt(hex.slice(0, 2), 16),
				g: Number.parseInt(hex.slice(2, 4), 16),
				b: Number.parseInt(hex.slice(4, 6), 16),
				a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
			};
		}
		return null;
	}

	const rgb = input.match(/^rgba?\(([^)]+)\)$/);
	if (rgb) {
		const parts = rgb[1]!.split(/[,/\s]+/).filter(Boolean).map(Number);
		if (parts.length < 3 || parts.some(Number.isNaN)) return null;
		return { r: parts[0]!, g: parts[1]!, b: parts[2]!, a: parts[3] ?? 1 };
	}

	return null;
}

/**
 * Flattens a translucent colour over an opaque backdrop.
 *
 * Needed because several border tokens are alpha values. Measuring an alpha
 * colour as if it were opaque reports a ratio the user never sees.
 */
function composite(foreground: Rgb, backdrop: Rgb): Rgb {
	if (foreground.a >= 1) return foreground;
	return {
		r: foreground.r * foreground.a + backdrop.r * (1 - foreground.a),
		g: foreground.g * foreground.a + backdrop.g * (1 - foreground.a),
		b: foreground.b * foreground.a + backdrop.b * (1 - foreground.a),
		a: 1,
	};
}

function relativeLuminance({ r, g, b }: Rgb): number {
	const channel = (value: number) => {
		const srgb = value / 255;
		return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(foreground: string, background: string): ContrastResult | null {
	const fg = parseColor(foreground);
	const bg = parseColor(background);
	if (!fg || !bg) return null;

	const backdrop = composite(bg, { r: 255, g: 255, b: 255, a: 1 });
	const front = composite(fg, backdrop);

	const l1 = relativeLuminance(front);
	const l2 = relativeLuminance(backdrop);
	const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

	return {
		ratio: Math.round(ratio * 100) / 100,
		aaText: ratio >= 4.5,
		aaLarge: ratio >= 3,
		aaaText: ratio >= 7,
	};
}
