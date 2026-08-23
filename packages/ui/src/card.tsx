import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "title"> {
  /** Rendered as the card heading. Pass headingLevel to keep the document outline correct. */
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  elevation?: "raised" | "none";
  children?: ReactNode;
}

/**
 * Card.
 *
 * A container, not a control. If the whole card should be clickable, wrap the heading
 * text in a link instead of putting onClick on the card, so the target stays reachable
 * by keyboard and readable in a link list.
 */
export function Card({ title, headingLevel = 3, elevation = "raised", children, ...rest }: CardProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div {...rest} className="fds-card" data-elevation={elevation === "none" ? "none" : undefined}>
      {title ? <Heading className="fds-card-title">{title}</Heading> : null}
      {children}
    </div>
  );
}
