import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./card.css";

export type CardVariant = "raised" | "outlined" | "sunken";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Surface treatment. Raised sits above the canvas with elevation, outlined
	 * uses a border and no shadow, sunken recedes for read-only detail.
	 * @default "outlined"
	 */
	variant?: CardVariant;
	/**
	 * Adds hover and focus-within affordances for cards that contain a primary
	 * link. It does not make the card itself clickable: see the accessibility
	 * notes for why.
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * Removes the internal padding so the card can hold a full-bleed image or a
	 * table that draws its own insets.
	 * @default false
	 */
	flush?: boolean;
	children: ReactNode;
}

/**
 * A surface that groups related content.
 *
 * The whole card is never turned into a button or a link. A clickable card
 * either swallows the links inside it, producing nested interactive elements, or
 * gets a click handler on a div, which no keyboard reaches. When a card needs to
 * be one target, put a real anchor in the title and let it stretch with
 * `CardLinkOverlay`: the accessible name stays on the link, the pointer target
 * covers the card.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
	{ variant = "outlined", interactive = false, flush = false, className, children, ...rest },
	ref,
) {
	return (
		<div
			{...rest}
			ref={ref}
			className={cx(
				"fds-card",
				`fds-card--${variant}`,
				interactive && "is-interactive",
				flush && "fds-card--flush",
				className,
			)}
		>
			{children}
		</div>
	);
});

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

/** Title row. Holds the heading and any trailing badge or action. */
export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
	{ className, children, ...rest },
	ref,
) {
	return (
		<div {...rest} ref={ref} className={cx("fds-card__header", className)}>
			{children}
		</div>
	);
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	/**
	 * Heading level. Set it to match the surrounding document outline rather than
	 * accepting the default, because a page of h3 cards under an h1 skips a
	 * level for screen reader navigation.
	 * @default 3
	 */
	level?: 2 | 3 | 4 | 5 | 6;
	children: ReactNode;
}

/** The card heading. Renders a real heading element at the level you pass. */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
	{ level = 3, className, children, ...rest },
	ref,
) {
	const Tag = `h${level}` as const;
	return (
		<Tag {...rest} ref={ref} className={cx("fds-card__title", className)}>
			{children}
		</Tag>
	);
});

/** Body copy and content. */
export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(function CardBody(
	{ className, children, ...rest },
	ref,
) {
	return (
		<div {...rest} ref={ref} className={cx("fds-card__body", className)}>
			{children}
		</div>
	);
});

/** Actions and metadata, separated by a hairline rule. */
export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
	{ className, children, ...rest },
	ref,
) {
	return (
		<div {...rest} ref={ref} className={cx("fds-card__footer", className)}>
			{children}
		</div>
	);
});
