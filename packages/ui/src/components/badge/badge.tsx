import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./badge.css";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
export type BadgeVariant = "subtle" | "bold";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	/**
	 * Semantic meaning. Tone maps to a token pair, so a success badge is the
	 * same green as success text everywhere in the product.
	 * @default "neutral"
	 */
	tone?: BadgeTone;
	/**
	 * Subtle for dense lists, bold when the badge is the thing you want read
	 * first.
	 * @default "subtle"
	 */
	variant?: BadgeVariant;
	/**
	 * Renders a status dot before the label. Use it when the badge represents a
	 * live state rather than a category.
	 * @default false
	 */
	dot?: boolean;
	/**
	 * Text announced in place of the visible label, for cases where the label is
	 * an abbreviation. Rendered as visually hidden text.
	 */
	srLabel?: string;
	children: ReactNode;
}

/**
 * A short, non-interactive status or category label.
 *
 * Deliberately not focusable and deliberately without an onDismiss prop. A
 * badge with a close button is a chip, which is a different component with a
 * keyboard model, and merging the two produces a control that is a tab stop in
 * half of its uses.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{ tone = "neutral", variant = "subtle", dot = false, srLabel, className, children, ...rest },
	ref,
) {
	return (
		<span
			{...rest}
			ref={ref}
			className={cx("fds-badge", `fds-badge--${tone}`, `fds-badge--${variant}`, className)}
		>
			{dot ? <span className="fds-badge__dot" aria-hidden="true" /> : null}
			{srLabel ? <span className="fds-visually-hidden">{srLabel}</span> : null}
			<span aria-hidden={srLabel ? "true" : undefined}>{children}</span>
		</span>
	);
});
