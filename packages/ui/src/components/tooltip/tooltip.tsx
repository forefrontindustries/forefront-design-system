import {
	cloneElement,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type CSSProperties,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
	type Ref,
} from "react";
import { composeRefs } from "../../lib/compose-refs";
import { cx } from "../../lib/cx";
import { useEscapeKey } from "../../lib/focus";
import { Portal } from "../../lib/portal";
import { usePresence } from "../../lib/use-presence";
import "./tooltip.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
	/**
	 * Tooltip text. Plain text only: a tooltip is unreachable by pointer, so
	 * anything interactive inside it cannot be used.
	 */
	content: ReactNode;
	/**
	 * Preferred side. The tooltip flips to the opposite side when there is not
	 * enough room in the viewport.
	 * @default "top"
	 */
	placement?: TooltipPlacement;
	/**
	 * Delay in milliseconds before showing on hover. Keyboard focus always shows
	 * immediately, because a keyboard user has already committed to the element.
	 * @default 200
	 */
	delay?: number;
	/**
	 * Disables the tooltip without changing the tree, for cases where the hint is
	 * only relevant in some states.
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * The trigger. Must be a single element that can receive focus, because
	 * hover-only hints do not exist for keyboard or screen reader users.
	 */
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}

interface Position {
	top: number;
	left: number;
	placement: TooltipPlacement;
}

const GAP = 8;

function computePosition(
	trigger: DOMRect,
	tooltip: DOMRect,
	preferred: TooltipPlacement,
): Position {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	// Flip to the opposite side when the preferred side does not fit. This is
	// deliberately flip-only: no shifting, no arrow tracking, no full collision
	// engine. A design system that ships its own floating library owes consumers
	// maintenance of it forever, and 90% of tooltips only ever need a flip.
	let placement = preferred;
	const fits = {
		top: trigger.top - tooltip.height - GAP > 0,
		bottom: trigger.bottom + tooltip.height + GAP < viewportHeight,
		left: trigger.left - tooltip.width - GAP > 0,
		right: trigger.right + tooltip.width + GAP < viewportWidth,
	};
	const opposite: Record<TooltipPlacement, TooltipPlacement> = {
		top: "bottom",
		bottom: "top",
		left: "right",
		right: "left",
	};
	if (!fits[placement] && fits[opposite[placement]]) placement = opposite[placement];

	let top = 0;
	let left = 0;
	switch (placement) {
		case "top":
			top = trigger.top - tooltip.height - GAP;
			left = trigger.left + trigger.width / 2 - tooltip.width / 2;
			break;
		case "bottom":
			top = trigger.bottom + GAP;
			left = trigger.left + trigger.width / 2 - tooltip.width / 2;
			break;
		case "left":
			top = trigger.top + trigger.height / 2 - tooltip.height / 2;
			left = trigger.left - tooltip.width - GAP;
			break;
		case "right":
			top = trigger.top + trigger.height / 2 - tooltip.height / 2;
			left = trigger.right + GAP;
			break;
	}

	// Clamp inside the viewport so a tooltip on a screen-edge element stays
	// readable instead of being cut in half.
	left = Math.min(Math.max(GAP, left), viewportWidth - tooltip.width - GAP);
	top = Math.min(Math.max(GAP, top), viewportHeight - tooltip.height - GAP);

	return { top, left, placement };
}

/**
 * A short hint attached to a focusable element.
 *
 * Tooltips are supplementary by definition. They are invisible on touch, they
 * cannot be reached with a pointer, and they disappear on blur, so the content
 * inside one must never be the only place information exists. The component
 * enforces the part it can: the trigger keeps `aria-describedby`, and Escape
 * dismisses.
 */
export function Tooltip({
	content,
	placement = "top",
	delay = 200,
	disabled = false,
	children,
}: TooltipProps) {
	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState<Position | null>(null);
	const { mounted, status } = usePresence(open, "fast");
	const triggerRef = useRef<HTMLElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const id = `fds-tooltip-${useId()}`;

	const show = useCallback(
		(immediate: boolean) => {
			if (disabled) return;
			if (timer.current) clearTimeout(timer.current);
			if (immediate || delay === 0) setOpen(true);
			else timer.current = setTimeout(() => setOpen(true), delay);
		},
		[delay, disabled],
	);

	const hide = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		setOpen(false);
	}, []);

	useEscapeKey(open, hide);

	// Measure after mount, before the transition starts, so the tooltip never
	// paints at 0,0 and slides into place.
	useEffect(() => {
		if (!mounted) return;
		const triggerNode = triggerRef.current;
		const tooltipNode = tooltipRef.current;
		if (!triggerNode || !tooltipNode) return;

		const update = () =>
			setPosition(
				computePosition(triggerNode.getBoundingClientRect(), tooltipNode.getBoundingClientRect(), placement),
			);
		update();

		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		};
	}, [mounted, placement, content]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const childRef = (children.props as { ref?: Ref<HTMLElement> }).ref;

	const trigger = cloneElement(children, {
		ref: composeRefs(triggerRef, childRef),
		"aria-describedby": open ? id : children.props["aria-describedby"],
		onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
			children.props.onMouseEnter?.(event);
			show(false);
		},
		onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
			children.props.onMouseLeave?.(event);
			hide();
		},
		onFocus: (event: React.FocusEvent<HTMLElement>) => {
			children.props.onFocus?.(event);
			show(true);
		},
		onBlur: (event: React.FocusEvent<HTMLElement>) => {
			children.props.onBlur?.(event);
			hide();
		},
	} as HTMLAttributes<HTMLElement> & { ref: Ref<HTMLElement> });

	const style: CSSProperties = position
		? { top: position.top, left: position.left }
		: { top: 0, left: 0, visibility: "hidden" };

	return (
		<>
			{trigger}
			{mounted ? (
				<Portal>
					<div
						ref={tooltipRef}
						id={id}
						role="tooltip"
						style={style}
						className={cx(
							"fds-tooltip",
							`fds-tooltip--${position?.placement ?? placement}`,
							`is-${status}`,
						)}
					>
						{content}
					</div>
				</Portal>
			) : null}
		</>
	);
}
