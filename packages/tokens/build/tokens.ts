/**
 * Typed design token model
 *
 * GENERATED FILE. Do not edit by hand.
 * Source: packages/tokens/src/**. Regenerate with `bun run tokens:build`.
 */

export type TokenType =
	| "color"
	| "dimension"
	| "fontFamily"
	| "fontWeight"
	| "number"
	| "shadow"
	| "duration"
	| "cubicBezier";

export interface TokenRecord {
	path: string;
	cssVar: string;
	type: TokenType;
	/** Authored value: a literal at tier 1, an alias at tiers 2 and 3. */
	value: string;
	description: string | null;
}

export interface ResolvedToken {
	path: string;
	cssVar: string;
	type: TokenType;
	alias: string | null;
	/** Alias chain resolved to a literal. Safe to feed to a contrast calculator. */
	resolved: string;
	chain: string[];
	description: string | null;
}

export interface ThemeRecord {
	name: string;
	label: string;
	appearance: "light" | "dark";
	description: string;
	isDefault: boolean;
	tokens: ResolvedToken[];
}

/** Tier 1. Raw values. Never reference these from a component. */
export const primitives = [
  {
    "path": "color.ink.650",
    "cssVar": "--fds-color-ink-650",
    "type": "color",
    "value": "#2a2a35",
    "description": null
  },
  {
    "path": "color.ink.700",
    "cssVar": "--fds-color-ink-700",
    "type": "color",
    "value": "#202a38",
    "description": null
  },
  {
    "path": "color.ink.750",
    "cssVar": "--fds-color-ink-750",
    "type": "color",
    "value": "#0f0f1a",
    "description": null
  },
  {
    "path": "color.ink.800",
    "cssVar": "--fds-color-ink-800",
    "type": "color",
    "value": "#0d1019",
    "description": null
  },
  {
    "path": "color.ink.850",
    "cssVar": "--fds-color-ink-850",
    "type": "color",
    "value": "#0a0c14",
    "description": null
  },
  {
    "path": "color.ink.900",
    "cssVar": "--fds-color-ink-900",
    "type": "color",
    "value": "#0a0a12",
    "description": null
  },
  {
    "path": "color.ink.950",
    "cssVar": "--fds-color-ink-950",
    "type": "color",
    "value": "#07090f",
    "description": null
  },
  {
    "path": "color.ink.1000",
    "cssVar": "--fds-color-ink-1000",
    "type": "color",
    "value": "#000000",
    "description": null
  },
  {
    "path": "color.slate.0",
    "cssVar": "--fds-color-slate-0",
    "type": "color",
    "value": "#ffffff",
    "description": null
  },
  {
    "path": "color.slate.25",
    "cssVar": "--fds-color-slate-25",
    "type": "color",
    "value": "#f8fafc",
    "description": null
  },
  {
    "path": "color.slate.50",
    "cssVar": "--fds-color-slate-50",
    "type": "color",
    "value": "#f1f4f8",
    "description": null
  },
  {
    "path": "color.slate.100",
    "cssVar": "--fds-color-slate-100",
    "type": "color",
    "value": "#e2e7ee",
    "description": null
  },
  {
    "path": "color.slate.200",
    "cssVar": "--fds-color-slate-200",
    "type": "color",
    "value": "#c8ccd4",
    "description": null
  },
  {
    "path": "color.slate.300",
    "cssVar": "--fds-color-slate-300",
    "type": "color",
    "value": "#a4aab4",
    "description": null
  },
  {
    "path": "color.slate.400",
    "cssVar": "--fds-color-slate-400",
    "type": "color",
    "value": "#8b93a1",
    "description": null
  },
  {
    "path": "color.slate.450",
    "cssVar": "--fds-color-slate-450",
    "type": "color",
    "value": "#7d8696",
    "description": null
  },
  {
    "path": "color.slate.500",
    "cssVar": "--fds-color-slate-500",
    "type": "color",
    "value": "#5b6678",
    "description": null
  },
  {
    "path": "color.slate.600",
    "cssVar": "--fds-color-slate-600",
    "type": "color",
    "value": "#3d4453",
    "description": null
  },
  {
    "path": "color.blue.100",
    "cssVar": "--fds-color-blue-100",
    "type": "color",
    "value": "#e6eff8",
    "description": null
  },
  {
    "path": "color.blue.300",
    "cssVar": "--fds-color-blue-300",
    "type": "color",
    "value": "#a3c5e4",
    "description": null
  },
  {
    "path": "color.blue.400",
    "cssVar": "--fds-color-blue-400",
    "type": "color",
    "value": "#7ba8d1",
    "description": null
  },
  {
    "path": "color.blue.500",
    "cssVar": "--fds-color-blue-500",
    "type": "color",
    "value": "#5793ca",
    "description": null
  },
  {
    "path": "color.blue.600",
    "cssVar": "--fds-color-blue-600",
    "type": "color",
    "value": "#2f6da4",
    "description": null
  },
  {
    "path": "color.blue.700",
    "cssVar": "--fds-color-blue-700",
    "type": "color",
    "value": "#1e4c7a",
    "description": null
  },
  {
    "path": "color.blue.800",
    "cssVar": "--fds-color-blue-800",
    "type": "color",
    "value": "#16385a",
    "description": null
  },
  {
    "path": "color.blue.950",
    "cssVar": "--fds-color-blue-950",
    "type": "color",
    "value": "#091825",
    "description": null
  },
  {
    "path": "color.orange.100",
    "cssVar": "--fds-color-orange-100",
    "type": "color",
    "value": "#ffeadb",
    "description": null
  },
  {
    "path": "color.orange.400",
    "cssVar": "--fds-color-orange-400",
    "type": "color",
    "value": "#ff9a55",
    "description": null
  },
  {
    "path": "color.orange.500",
    "cssVar": "--fds-color-orange-500",
    "type": "color",
    "value": "#ff8a3d",
    "description": null
  },
  {
    "path": "color.orange.600",
    "cssVar": "--fds-color-orange-600",
    "type": "color",
    "value": "#c25f18",
    "description": null
  },
  {
    "path": "color.orange.700",
    "cssVar": "--fds-color-orange-700",
    "type": "color",
    "value": "#914712",
    "description": null
  },
  {
    "path": "color.orange.950",
    "cssVar": "--fds-color-orange-950",
    "type": "color",
    "value": "#2a1305",
    "description": null
  },
  {
    "path": "color.green.100",
    "cssVar": "--fds-color-green-100",
    "type": "color",
    "value": "#e3f7ec",
    "description": null
  },
  {
    "path": "color.green.400",
    "cssVar": "--fds-color-green-400",
    "type": "color",
    "value": "#5fd39a",
    "description": null
  },
  {
    "path": "color.green.500",
    "cssVar": "--fds-color-green-500",
    "type": "color",
    "value": "#2eb872",
    "description": null
  },
  {
    "path": "color.green.600",
    "cssVar": "--fds-color-green-600",
    "type": "color",
    "value": "#1a8754",
    "description": null
  },
  {
    "path": "color.green.700",
    "cssVar": "--fds-color-green-700",
    "type": "color",
    "value": "#146c43",
    "description": null
  },
  {
    "path": "color.green.950",
    "cssVar": "--fds-color-green-950",
    "type": "color",
    "value": "#052618",
    "description": null
  },
  {
    "path": "color.red.100",
    "cssVar": "--fds-color-red-100",
    "type": "color",
    "value": "#fdeaeb",
    "description": null
  },
  {
    "path": "color.red.300",
    "cssVar": "--fds-color-red-300",
    "type": "color",
    "value": "#f6a5a8",
    "description": null
  },
  {
    "path": "color.red.400",
    "cssVar": "--fds-color-red-400",
    "type": "color",
    "value": "#ef7b7f",
    "description": null
  },
  {
    "path": "color.red.500",
    "cssVar": "--fds-color-red-500",
    "type": "color",
    "value": "#e4494f",
    "description": null
  },
  {
    "path": "color.red.600",
    "cssVar": "--fds-color-red-600",
    "type": "color",
    "value": "#c92a32",
    "description": null
  },
  {
    "path": "color.red.700",
    "cssVar": "--fds-color-red-700",
    "type": "color",
    "value": "#a41d24",
    "description": null
  },
  {
    "path": "color.red.950",
    "cssVar": "--fds-color-red-950",
    "type": "color",
    "value": "#2e0a0c",
    "description": null
  },
  {
    "path": "color.alpha.light-08",
    "cssVar": "--fds-color-alpha-light-08",
    "type": "color",
    "value": "rgba(255, 255, 255, 0.08)",
    "description": null
  },
  {
    "path": "color.alpha.dark-08",
    "cssVar": "--fds-color-alpha-dark-08",
    "type": "color",
    "value": "rgba(7, 9, 15, 0.08)",
    "description": null
  },
  {
    "path": "color.alpha.scrim-dark",
    "cssVar": "--fds-color-alpha-scrim-dark",
    "type": "color",
    "value": "rgba(4, 5, 10, 0.72)",
    "description": null
  },
  {
    "path": "color.alpha.scrim-cool",
    "cssVar": "--fds-color-alpha-scrim-cool",
    "type": "color",
    "value": "rgba(7, 9, 15, 0.48)",
    "description": null
  },
  {
    "path": "font.family.clash",
    "cssVar": "--fds-font-family-clash",
    "type": "fontFamily",
    "value": "'Clash Display', -apple-system, BlinkMacSystemFont, sans-serif",
    "description": null
  },
  {
    "path": "font.family.satoshi",
    "cssVar": "--fds-font-family-satoshi",
    "type": "fontFamily",
    "value": "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif",
    "description": null
  },
  {
    "path": "font.family.mono",
    "cssVar": "--fds-font-family-mono",
    "type": "fontFamily",
    "value": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    "description": null
  },
  {
    "path": "font.size.10",
    "cssVar": "--fds-font-size-10",
    "type": "dimension",
    "value": "0.6875rem",
    "description": null
  },
  {
    "path": "font.size.20",
    "cssVar": "--fds-font-size-20",
    "type": "dimension",
    "value": "0.75rem",
    "description": null
  },
  {
    "path": "font.size.30",
    "cssVar": "--fds-font-size-30",
    "type": "dimension",
    "value": "0.8125rem",
    "description": null
  },
  {
    "path": "font.size.40",
    "cssVar": "--fds-font-size-40",
    "type": "dimension",
    "value": "0.875rem",
    "description": null
  },
  {
    "path": "font.size.50",
    "cssVar": "--fds-font-size-50",
    "type": "dimension",
    "value": "1rem",
    "description": null
  },
  {
    "path": "font.size.60",
    "cssVar": "--fds-font-size-60",
    "type": "dimension",
    "value": "1.125rem",
    "description": null
  },
  {
    "path": "font.size.70",
    "cssVar": "--fds-font-size-70",
    "type": "dimension",
    "value": "1.3125rem",
    "description": null
  },
  {
    "path": "font.size.80",
    "cssVar": "--fds-font-size-80",
    "type": "dimension",
    "value": "1.5rem",
    "description": null
  },
  {
    "path": "font.size.90",
    "cssVar": "--fds-font-size-90",
    "type": "dimension",
    "value": "1.75rem",
    "description": null
  },
  {
    "path": "font.size.100",
    "cssVar": "--fds-font-size-100",
    "type": "dimension",
    "value": "2.125rem",
    "description": null
  },
  {
    "path": "font.size.110",
    "cssVar": "--fds-font-size-110",
    "type": "dimension",
    "value": "2.625rem",
    "description": null
  },
  {
    "path": "font.size.120",
    "cssVar": "--fds-font-size-120",
    "type": "dimension",
    "value": "3.25rem",
    "description": null
  },
  {
    "path": "font.size.130",
    "cssVar": "--fds-font-size-130",
    "type": "dimension",
    "value": "4rem",
    "description": null
  },
  {
    "path": "font.weight.regular",
    "cssVar": "--fds-font-weight-regular",
    "type": "fontWeight",
    "value": "400",
    "description": null
  },
  {
    "path": "font.weight.medium",
    "cssVar": "--fds-font-weight-medium",
    "type": "fontWeight",
    "value": "500",
    "description": null
  },
  {
    "path": "font.weight.semibold",
    "cssVar": "--fds-font-weight-semibold",
    "type": "fontWeight",
    "value": "600",
    "description": null
  },
  {
    "path": "font.weight.bold",
    "cssVar": "--fds-font-weight-bold",
    "type": "fontWeight",
    "value": "700",
    "description": null
  },
  {
    "path": "font.line-height.tight",
    "cssVar": "--fds-font-line-height-tight",
    "type": "number",
    "value": "1.1",
    "description": null
  },
  {
    "path": "font.line-height.snug",
    "cssVar": "--fds-font-line-height-snug",
    "type": "number",
    "value": "1.25",
    "description": null
  },
  {
    "path": "font.line-height.normal",
    "cssVar": "--fds-font-line-height-normal",
    "type": "number",
    "value": "1.5",
    "description": null
  },
  {
    "path": "font.line-height.relaxed",
    "cssVar": "--fds-font-line-height-relaxed",
    "type": "number",
    "value": "1.65",
    "description": null
  },
  {
    "path": "font.tracking.tighter",
    "cssVar": "--fds-font-tracking-tighter",
    "type": "dimension",
    "value": "-0.03em",
    "description": null
  },
  {
    "path": "font.tracking.tight",
    "cssVar": "--fds-font-tracking-tight",
    "type": "dimension",
    "value": "-0.015em",
    "description": null
  },
  {
    "path": "font.tracking.normal",
    "cssVar": "--fds-font-tracking-normal",
    "type": "dimension",
    "value": "0em",
    "description": null
  },
  {
    "path": "font.tracking.wide",
    "cssVar": "--fds-font-tracking-wide",
    "type": "dimension",
    "value": "0.04em",
    "description": null
  },
  {
    "path": "font.tracking.wider",
    "cssVar": "--fds-font-tracking-wider",
    "type": "dimension",
    "value": "0.12em",
    "description": null
  },
  {
    "path": "space.0",
    "cssVar": "--fds-space-0",
    "type": "dimension",
    "value": "0rem",
    "description": null
  },
  {
    "path": "space.1",
    "cssVar": "--fds-space-1",
    "type": "dimension",
    "value": "0.125rem",
    "description": null
  },
  {
    "path": "space.2",
    "cssVar": "--fds-space-2",
    "type": "dimension",
    "value": "0.25rem",
    "description": null
  },
  {
    "path": "space.3",
    "cssVar": "--fds-space-3",
    "type": "dimension",
    "value": "0.375rem",
    "description": null
  },
  {
    "path": "space.4",
    "cssVar": "--fds-space-4",
    "type": "dimension",
    "value": "0.5rem",
    "description": null
  },
  {
    "path": "space.5",
    "cssVar": "--fds-space-5",
    "type": "dimension",
    "value": "0.75rem",
    "description": null
  },
  {
    "path": "space.6",
    "cssVar": "--fds-space-6",
    "type": "dimension",
    "value": "1rem",
    "description": null
  },
  {
    "path": "space.7",
    "cssVar": "--fds-space-7",
    "type": "dimension",
    "value": "1.25rem",
    "description": null
  },
  {
    "path": "space.8",
    "cssVar": "--fds-space-8",
    "type": "dimension",
    "value": "1.5rem",
    "description": null
  },
  {
    "path": "space.9",
    "cssVar": "--fds-space-9",
    "type": "dimension",
    "value": "2rem",
    "description": null
  },
  {
    "path": "space.10",
    "cssVar": "--fds-space-10",
    "type": "dimension",
    "value": "2.5rem",
    "description": null
  },
  {
    "path": "space.11",
    "cssVar": "--fds-space-11",
    "type": "dimension",
    "value": "3rem",
    "description": null
  },
  {
    "path": "space.12",
    "cssVar": "--fds-space-12",
    "type": "dimension",
    "value": "4rem",
    "description": null
  },
  {
    "path": "space.13",
    "cssVar": "--fds-space-13",
    "type": "dimension",
    "value": "5rem",
    "description": null
  },
  {
    "path": "space.14",
    "cssVar": "--fds-space-14",
    "type": "dimension",
    "value": "6rem",
    "description": null
  },
  {
    "path": "space.15",
    "cssVar": "--fds-space-15",
    "type": "dimension",
    "value": "8rem",
    "description": null
  },
  {
    "path": "radius.none",
    "cssVar": "--fds-radius-none",
    "type": "dimension",
    "value": "0rem",
    "description": null
  },
  {
    "path": "radius.xs",
    "cssVar": "--fds-radius-xs",
    "type": "dimension",
    "value": "0.125rem",
    "description": null
  },
  {
    "path": "radius.sm",
    "cssVar": "--fds-radius-sm",
    "type": "dimension",
    "value": "0.25rem",
    "description": null
  },
  {
    "path": "radius.md",
    "cssVar": "--fds-radius-md",
    "type": "dimension",
    "value": "0.375rem",
    "description": null
  },
  {
    "path": "radius.lg",
    "cssVar": "--fds-radius-lg",
    "type": "dimension",
    "value": "0.625rem",
    "description": null
  },
  {
    "path": "radius.xl",
    "cssVar": "--fds-radius-xl",
    "type": "dimension",
    "value": "0.875rem",
    "description": null
  },
  {
    "path": "radius.2xl",
    "cssVar": "--fds-radius-2xl",
    "type": "dimension",
    "value": "1.25rem",
    "description": null
  },
  {
    "path": "radius.full",
    "cssVar": "--fds-radius-full",
    "type": "dimension",
    "value": "62.4375rem",
    "description": null
  },
  {
    "path": "border-width.none",
    "cssVar": "--fds-border-width-none",
    "type": "dimension",
    "value": "0px",
    "description": null
  },
  {
    "path": "border-width.thin",
    "cssVar": "--fds-border-width-thin",
    "type": "dimension",
    "value": "1px",
    "description": null
  },
  {
    "path": "border-width.medium",
    "cssVar": "--fds-border-width-medium",
    "type": "dimension",
    "value": "2px",
    "description": null
  },
  {
    "path": "border-width.thick",
    "cssVar": "--fds-border-width-thick",
    "type": "dimension",
    "value": "3px",
    "description": null
  },
  {
    "path": "shadow.dark-sm",
    "cssVar": "--fds-shadow-dark-sm",
    "type": "shadow",
    "value": "0 1px 2px rgba(0, 0, 0, 0.4)",
    "description": null
  },
  {
    "path": "shadow.dark-md",
    "cssVar": "--fds-shadow-dark-md",
    "type": "shadow",
    "value": "0 4px 12px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.5)",
    "description": null
  },
  {
    "path": "shadow.dark-lg",
    "cssVar": "--fds-shadow-dark-lg",
    "type": "shadow",
    "value": "0 16px 40px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.5)",
    "description": null
  },
  {
    "path": "shadow.light-sm",
    "cssVar": "--fds-shadow-light-sm",
    "type": "shadow",
    "value": "0 1px 2px rgba(7, 9, 15, 0.08)",
    "description": null
  },
  {
    "path": "shadow.light-md",
    "cssVar": "--fds-shadow-light-md",
    "type": "shadow",
    "value": "0 4px 12px rgba(7, 9, 15, 0.1), 0 1px 2px rgba(7, 9, 15, 0.06)",
    "description": null
  },
  {
    "path": "shadow.light-lg",
    "cssVar": "--fds-shadow-light-lg",
    "type": "shadow",
    "value": "0 16px 40px rgba(7, 9, 15, 0.14), 0 2px 6px rgba(7, 9, 15, 0.08)",
    "description": null
  },
  {
    "path": "shadow.none",
    "cssVar": "--fds-shadow-none",
    "type": "shadow",
    "value": "none",
    "description": null
  },
  {
    "path": "duration.instant",
    "cssVar": "--fds-duration-instant",
    "type": "duration",
    "value": "0ms",
    "description": null
  },
  {
    "path": "duration.fast",
    "cssVar": "--fds-duration-fast",
    "type": "duration",
    "value": "120ms",
    "description": null
  },
  {
    "path": "duration.moderate",
    "cssVar": "--fds-duration-moderate",
    "type": "duration",
    "value": "200ms",
    "description": null
  },
  {
    "path": "duration.slow",
    "cssVar": "--fds-duration-slow",
    "type": "duration",
    "value": "320ms",
    "description": null
  },
  {
    "path": "duration.slower",
    "cssVar": "--fds-duration-slower",
    "type": "duration",
    "value": "480ms",
    "description": null
  },
  {
    "path": "easing.linear",
    "cssVar": "--fds-easing-linear",
    "type": "cubicBezier",
    "value": "linear",
    "description": null
  },
  {
    "path": "easing.standard",
    "cssVar": "--fds-easing-standard",
    "type": "cubicBezier",
    "value": "cubic-bezier(0.2, 0, 0.13, 1)",
    "description": null
  },
  {
    "path": "easing.emphasized",
    "cssVar": "--fds-easing-emphasized",
    "type": "cubicBezier",
    "value": "cubic-bezier(0.3, 0, 0, 1)",
    "description": null
  },
  {
    "path": "easing.entrance",
    "cssVar": "--fds-easing-entrance",
    "type": "cubicBezier",
    "value": "cubic-bezier(0, 0, 0.2, 1)",
    "description": null
  },
  {
    "path": "easing.exit",
    "cssVar": "--fds-easing-exit",
    "type": "cubicBezier",
    "value": "cubic-bezier(0.4, 0, 1, 1)",
    "description": null
  },
  {
    "path": "easing.spring",
    "cssVar": "--fds-easing-spring",
    "type": "cubicBezier",
    "value": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "description": null
  },
  {
    "path": "z-index.base",
    "cssVar": "--fds-z-index-base",
    "type": "number",
    "value": "0",
    "description": null
  },
  {
    "path": "z-index.raised",
    "cssVar": "--fds-z-index-raised",
    "type": "number",
    "value": "10",
    "description": null
  },
  {
    "path": "z-index.sticky",
    "cssVar": "--fds-z-index-sticky",
    "type": "number",
    "value": "100",
    "description": null
  },
  {
    "path": "z-index.overlay",
    "cssVar": "--fds-z-index-overlay",
    "type": "number",
    "value": "1000",
    "description": null
  },
  {
    "path": "z-index.modal",
    "cssVar": "--fds-z-index-modal",
    "type": "number",
    "value": "1100",
    "description": null
  },
  {
    "path": "z-index.popover",
    "cssVar": "--fds-z-index-popover",
    "type": "number",
    "value": "1200",
    "description": null
  },
  {
    "path": "z-index.toast",
    "cssVar": "--fds-z-index-toast",
    "type": "number",
    "value": "1300",
    "description": null
  },
  {
    "path": "z-index.tooltip",
    "cssVar": "--fds-z-index-tooltip",
    "type": "number",
    "value": "1400",
    "description": null
  }
] as const satisfies readonly TokenRecord[];

/** Tier 2 contract plus each theme's resolved values. */
export const themes = [
  {
    "name": "forefront-dark",
    "label": "Forefront Dark",
    "appearance": "dark",
    "description": "The default theme. Blue-tinted ink surfaces with the Forefront brand blue as the single accent. Tight radii, hairline structure.",
    "isDefault": true,
    "tokens": [
      {
        "path": "color.surface.canvas",
        "cssVar": "--fds-color-surface-canvas",
        "type": "color",
        "alias": "color.ink.950",
        "resolved": "#07090f",
        "chain": [
          "color.surface.canvas",
          "color.ink.950"
        ],
        "description": "App background. The furthest-back surface."
      },
      {
        "path": "color.surface.sunken",
        "cssVar": "--fds-color-surface-sunken",
        "type": "color",
        "alias": "color.ink.1000",
        "resolved": "#000000",
        "chain": [
          "color.surface.sunken",
          "color.ink.1000"
        ],
        "description": "Recessed area on the canvas, e.g. a code block or well."
      },
      {
        "path": "color.surface.raised",
        "cssVar": "--fds-color-surface-raised",
        "type": "color",
        "alias": "color.ink.850",
        "resolved": "#0a0c14",
        "chain": [
          "color.surface.raised",
          "color.ink.850"
        ],
        "description": "Card and panel background sitting above the canvas."
      },
      {
        "path": "color.surface.overlay",
        "cssVar": "--fds-color-surface-overlay",
        "type": "color",
        "alias": "color.ink.800",
        "resolved": "#0d1019",
        "chain": [
          "color.surface.overlay",
          "color.ink.800"
        ],
        "description": "Floating surface: modal, popover, tooltip, toast, select menu."
      },
      {
        "path": "color.surface.scrim",
        "cssVar": "--fds-color-surface-scrim",
        "type": "color",
        "alias": "color.alpha.scrim-dark",
        "resolved": "rgba(4, 5, 10, 0.72)",
        "chain": [
          "color.surface.scrim",
          "color.alpha.scrim-dark"
        ],
        "description": "Full-viewport wash behind a modal. Must be translucent."
      },
      {
        "path": "color.surface.control",
        "cssVar": "--fds-color-surface-control",
        "type": "color",
        "alias": "color.ink.850",
        "resolved": "#0a0c14",
        "chain": [
          "color.surface.control",
          "color.ink.850"
        ],
        "description": "Default background for inputs and unfilled controls."
      },
      {
        "path": "color.surface.control-hover",
        "cssVar": "--fds-color-surface-control-hover",
        "type": "color",
        "alias": "color.ink.800",
        "resolved": "#0d1019",
        "chain": [
          "color.surface.control-hover",
          "color.ink.800"
        ],
        "description": "Input or control background on hover."
      },
      {
        "path": "color.surface.disabled",
        "cssVar": "--fds-color-surface-disabled",
        "type": "color",
        "alias": "color.ink.800",
        "resolved": "#0d1019",
        "chain": [
          "color.surface.disabled",
          "color.ink.800"
        ],
        "description": "Background for any disabled control. Never communicate disabled with opacity alone."
      },
      {
        "path": "color.surface.selected",
        "cssVar": "--fds-color-surface-selected",
        "type": "color",
        "alias": "color.blue.950",
        "resolved": "#091825",
        "chain": [
          "color.surface.selected",
          "color.blue.950"
        ],
        "description": "Background for a selected row, option, or tab."
      },
      {
        "path": "color.surface.accent-subtle",
        "cssVar": "--fds-color-surface-accent-subtle",
        "type": "color",
        "alias": "color.blue.950",
        "resolved": "#091825",
        "chain": [
          "color.surface.accent-subtle",
          "color.blue.950"
        ],
        "description": "Low-emphasis accent wash. Safe behind accent text."
      },
      {
        "path": "color.surface.accent-bold",
        "cssVar": "--fds-color-surface-accent-bold",
        "type": "color",
        "alias": "color.blue.500",
        "resolved": "#5793ca",
        "chain": [
          "color.surface.accent-bold",
          "color.blue.500"
        ],
        "description": "High-emphasis accent fill for primary actions."
      },
      {
        "path": "color.surface.accent-bold-hover",
        "cssVar": "--fds-color-surface-accent-bold-hover",
        "type": "color",
        "alias": "color.blue.400",
        "resolved": "#7ba8d1",
        "chain": [
          "color.surface.accent-bold-hover",
          "color.blue.400"
        ],
        "description": "Primary action hover."
      },
      {
        "path": "color.surface.accent-bold-active",
        "cssVar": "--fds-color-surface-accent-bold-active",
        "type": "color",
        "alias": "color.blue.300",
        "resolved": "#a3c5e4",
        "chain": [
          "color.surface.accent-bold-active",
          "color.blue.300"
        ],
        "description": "Primary action pressed."
      },
      {
        "path": "color.surface.neutral-subtle",
        "cssVar": "--fds-color-surface-neutral-subtle",
        "type": "color",
        "alias": "color.ink.800",
        "resolved": "#0d1019",
        "chain": [
          "color.surface.neutral-subtle",
          "color.ink.800"
        ],
        "description": "Low-emphasis neutral fill, e.g. secondary button rest."
      },
      {
        "path": "color.surface.neutral-subtle-hover",
        "cssVar": "--fds-color-surface-neutral-subtle-hover",
        "type": "color",
        "alias": "color.ink.750",
        "resolved": "#0f0f1a",
        "chain": [
          "color.surface.neutral-subtle-hover",
          "color.ink.750"
        ],
        "description": "Secondary button hover."
      },
      {
        "path": "color.surface.neutral-bold",
        "cssVar": "--fds-color-surface-neutral-bold",
        "type": "color",
        "alias": "color.slate.100",
        "resolved": "#e2e7ee",
        "chain": [
          "color.surface.neutral-bold",
          "color.slate.100"
        ],
        "description": "High-emphasis neutral fill."
      },
      {
        "path": "color.surface.success-subtle",
        "cssVar": "--fds-color-surface-success-subtle",
        "type": "color",
        "alias": "color.green.950",
        "resolved": "#052618",
        "chain": [
          "color.surface.success-subtle",
          "color.green.950"
        ],
        "description": "Success wash for badges and inline status."
      },
      {
        "path": "color.surface.success-bold",
        "cssVar": "--fds-color-surface-success-bold",
        "type": "color",
        "alias": "color.green.500",
        "resolved": "#2eb872",
        "chain": [
          "color.surface.success-bold",
          "color.green.500"
        ],
        "description": "Success fill."
      },
      {
        "path": "color.surface.warning-subtle",
        "cssVar": "--fds-color-surface-warning-subtle",
        "type": "color",
        "alias": "color.orange.950",
        "resolved": "#2a1305",
        "chain": [
          "color.surface.warning-subtle",
          "color.orange.950"
        ],
        "description": "Warning wash."
      },
      {
        "path": "color.surface.warning-bold",
        "cssVar": "--fds-color-surface-warning-bold",
        "type": "color",
        "alias": "color.orange.500",
        "resolved": "#ff8a3d",
        "chain": [
          "color.surface.warning-bold",
          "color.orange.500"
        ],
        "description": "Warning fill."
      },
      {
        "path": "color.surface.danger-subtle",
        "cssVar": "--fds-color-surface-danger-subtle",
        "type": "color",
        "alias": "color.red.950",
        "resolved": "#2e0a0c",
        "chain": [
          "color.surface.danger-subtle",
          "color.red.950"
        ],
        "description": "Danger wash."
      },
      {
        "path": "color.surface.danger-bold",
        "cssVar": "--fds-color-surface-danger-bold",
        "type": "color",
        "alias": "color.red.400",
        "resolved": "#ef7b7f",
        "chain": [
          "color.surface.danger-bold",
          "color.red.400"
        ],
        "description": "Destructive action fill."
      },
      {
        "path": "color.surface.danger-bold-hover",
        "cssVar": "--fds-color-surface-danger-bold-hover",
        "type": "color",
        "alias": "color.red.300",
        "resolved": "#f6a5a8",
        "chain": [
          "color.surface.danger-bold-hover",
          "color.red.300"
        ],
        "description": "Destructive action hover."
      },
      {
        "path": "color.surface.info-subtle",
        "cssVar": "--fds-color-surface-info-subtle",
        "type": "color",
        "alias": "color.blue.950",
        "resolved": "#091825",
        "chain": [
          "color.surface.info-subtle",
          "color.blue.950"
        ],
        "description": "Informational wash."
      },
      {
        "path": "color.surface.info-bold",
        "cssVar": "--fds-color-surface-info-bold",
        "type": "color",
        "alias": "color.blue.500",
        "resolved": "#5793ca",
        "chain": [
          "color.surface.info-bold",
          "color.blue.500"
        ],
        "description": "Informational fill."
      },
      {
        "path": "color.text.primary",
        "cssVar": "--fds-color-text-primary",
        "type": "color",
        "alias": "color.slate.25",
        "resolved": "#f8fafc",
        "chain": [
          "color.text.primary",
          "color.slate.25"
        ],
        "description": "Default body and heading text. Must clear 4.5:1 on surface.canvas and surface.raised."
      },
      {
        "path": "color.text.secondary",
        "cssVar": "--fds-color-text-secondary",
        "type": "color",
        "alias": "color.slate.300",
        "resolved": "#a4aab4",
        "chain": [
          "color.text.secondary",
          "color.slate.300"
        ],
        "description": "Supporting text. Must clear 4.5:1 on canvas."
      },
      {
        "path": "color.text.subtle",
        "cssVar": "--fds-color-text-subtle",
        "type": "color",
        "alias": "color.slate.400",
        "resolved": "#8b93a1",
        "chain": [
          "color.text.subtle",
          "color.slate.400"
        ],
        "description": "De-emphasized metadata and helper text. Must clear 4.5:1 on canvas."
      },
      {
        "path": "color.text.placeholder",
        "cssVar": "--fds-color-text-placeholder",
        "type": "color",
        "alias": "color.slate.400",
        "resolved": "#8b93a1",
        "chain": [
          "color.text.placeholder",
          "color.slate.400"
        ],
        "description": "Input placeholder. Must clear 4.5:1 on surface.control, since placeholders carry meaning."
      },
      {
        "path": "color.text.disabled",
        "cssVar": "--fds-color-text-disabled",
        "type": "color",
        "alias": "color.slate.450",
        "resolved": "#7d8696",
        "chain": [
          "color.text.disabled",
          "color.slate.450"
        ],
        "description": "Disabled control label. Exempt from AA by WCAG 1.4.3, but kept at 3:1 as a house rule."
      },
      {
        "path": "color.text.accent",
        "cssVar": "--fds-color-text-accent",
        "type": "color",
        "alias": "color.blue.400",
        "resolved": "#7ba8d1",
        "chain": [
          "color.text.accent",
          "color.blue.400"
        ],
        "description": "Accent-colored text on a neutral surface."
      },
      {
        "path": "color.text.on-accent",
        "cssVar": "--fds-color-text-on-accent",
        "type": "color",
        "alias": "color.ink.950",
        "resolved": "#07090f",
        "chain": [
          "color.text.on-accent",
          "color.ink.950"
        ],
        "description": "Text placed on surface.accent-bold."
      },
      {
        "path": "color.text.on-neutral-bold",
        "cssVar": "--fds-color-text-on-neutral-bold",
        "type": "color",
        "alias": "color.ink.950",
        "resolved": "#07090f",
        "chain": [
          "color.text.on-neutral-bold",
          "color.ink.950"
        ],
        "description": "Text placed on surface.neutral-bold."
      },
      {
        "path": "color.text.on-danger",
        "cssVar": "--fds-color-text-on-danger",
        "type": "color",
        "alias": "color.red.950",
        "resolved": "#2e0a0c",
        "chain": [
          "color.text.on-danger",
          "color.red.950"
        ],
        "description": "Text placed on surface.danger-bold."
      },
      {
        "path": "color.text.success",
        "cssVar": "--fds-color-text-success",
        "type": "color",
        "alias": "color.green.400",
        "resolved": "#5fd39a",
        "chain": [
          "color.text.success",
          "color.green.400"
        ],
        "description": "Success text on a neutral or success-subtle surface."
      },
      {
        "path": "color.text.warning",
        "cssVar": "--fds-color-text-warning",
        "type": "color",
        "alias": "color.orange.400",
        "resolved": "#ff9a55",
        "chain": [
          "color.text.warning",
          "color.orange.400"
        ],
        "description": "Warning text."
      },
      {
        "path": "color.text.danger",
        "cssVar": "--fds-color-text-danger",
        "type": "color",
        "alias": "color.red.400",
        "resolved": "#ef7b7f",
        "chain": [
          "color.text.danger",
          "color.red.400"
        ],
        "description": "Error and validation text."
      },
      {
        "path": "color.text.info",
        "cssVar": "--fds-color-text-info",
        "type": "color",
        "alias": "color.blue.400",
        "resolved": "#7ba8d1",
        "chain": [
          "color.text.info",
          "color.blue.400"
        ],
        "description": "Informational text."
      },
      {
        "path": "color.text.link",
        "cssVar": "--fds-color-text-link",
        "type": "color",
        "alias": "color.blue.400",
        "resolved": "#7ba8d1",
        "chain": [
          "color.text.link",
          "color.blue.400"
        ],
        "description": "Inline link rest state."
      },
      {
        "path": "color.text.link-hover",
        "cssVar": "--fds-color-text-link-hover",
        "type": "color",
        "alias": "color.blue.300",
        "resolved": "#a3c5e4",
        "chain": [
          "color.text.link-hover",
          "color.blue.300"
        ],
        "description": "Inline link hover state."
      },
      {
        "path": "color.border.subtle",
        "cssVar": "--fds-color-border-subtle",
        "type": "color",
        "alias": "color.alpha.light-08",
        "resolved": "rgba(255, 255, 255, 0.08)",
        "chain": [
          "color.border.subtle",
          "color.alpha.light-08"
        ],
        "description": "Hairline that defines structure without drawing attention. The system's default divider."
      },
      {
        "path": "color.border.default",
        "cssVar": "--fds-color-border-default",
        "type": "color",
        "alias": "color.ink.700",
        "resolved": "#202a38",
        "chain": [
          "color.border.default",
          "color.ink.700"
        ],
        "description": "Structural border on a non-interactive container. Decorative by contract: never use it as the boundary of a control, that is what border.control exists for."
      },
      {
        "path": "color.border.strong",
        "cssVar": "--fds-color-border-strong",
        "type": "color",
        "alias": "color.ink.650",
        "resolved": "#2a2a35",
        "chain": [
          "color.border.strong",
          "color.ink.650"
        ],
        "description": "Emphasized decorative border, e.g. a hovered card edge."
      },
      {
        "path": "color.border.control",
        "cssVar": "--fds-color-border-control",
        "type": "color",
        "alias": "color.slate.450",
        "resolved": "#7d8696",
        "chain": [
          "color.border.control",
          "color.slate.450"
        ],
        "description": "Resting boundary of an interactive control: input, select, checkbox, radio, switch track, secondary button. Must clear 3:1 against surface.control, surface.canvas and surface.raised in every theme. Enforced by the build, see contrast.json."
      },
      {
        "path": "color.border.control-hover",
        "cssVar": "--fds-color-border-control-hover",
        "type": "color",
        "alias": "color.slate.400",
        "resolved": "#8b93a1",
        "chain": [
          "color.border.control-hover",
          "color.slate.400"
        ],
        "description": "Boundary of a hovered interactive control. Must clear 3:1 against surface.control-hover and must never be quieter than border.control."
      },
      {
        "path": "color.border.accent",
        "cssVar": "--fds-color-border-accent",
        "type": "color",
        "alias": "color.blue.500",
        "resolved": "#5793ca",
        "chain": [
          "color.border.accent",
          "color.blue.500"
        ],
        "description": "Accent border for selected or active elements."
      },
      {
        "path": "color.border.focus",
        "cssVar": "--fds-color-border-focus",
        "type": "color",
        "alias": "color.blue.400",
        "resolved": "#7ba8d1",
        "chain": [
          "color.border.focus",
          "color.blue.400"
        ],
        "description": "Focus ring color. Must clear 3:1 against every adjacent surface. Never overridden per-component."
      },
      {
        "path": "color.border.success",
        "cssVar": "--fds-color-border-success",
        "type": "color",
        "alias": "color.green.500",
        "resolved": "#2eb872",
        "chain": [
          "color.border.success",
          "color.green.500"
        ],
        "description": "Success border."
      },
      {
        "path": "color.border.warning",
        "cssVar": "--fds-color-border-warning",
        "type": "color",
        "alias": "color.orange.500",
        "resolved": "#ff8a3d",
        "chain": [
          "color.border.warning",
          "color.orange.500"
        ],
        "description": "Warning border."
      },
      {
        "path": "color.border.danger",
        "cssVar": "--fds-color-border-danger",
        "type": "color",
        "alias": "color.red.500",
        "resolved": "#e4494f",
        "chain": [
          "color.border.danger",
          "color.red.500"
        ],
        "description": "Invalid control border."
      },
      {
        "path": "color.border.disabled",
        "cssVar": "--fds-color-border-disabled",
        "type": "color",
        "alias": "color.ink.650",
        "resolved": "#2a2a35",
        "chain": [
          "color.border.disabled",
          "color.ink.650"
        ],
        "description": "Disabled control border."
      },
      {
        "path": "color.icon.primary",
        "cssVar": "--fds-color-icon-primary",
        "type": "color",
        "alias": "color.slate.300",
        "resolved": "#a4aab4",
        "chain": [
          "color.icon.primary",
          "color.slate.300"
        ],
        "description": "Default icon color."
      },
      {
        "path": "color.icon.subtle",
        "cssVar": "--fds-color-icon-subtle",
        "type": "color",
        "alias": "color.slate.400",
        "resolved": "#8b93a1",
        "chain": [
          "color.icon.subtle",
          "color.slate.400"
        ],
        "description": "De-emphasized icon."
      },
      {
        "path": "color.icon.accent",
        "cssVar": "--fds-color-icon-accent",
        "type": "color",
        "alias": "color.blue.400",
        "resolved": "#7ba8d1",
        "chain": [
          "color.icon.accent",
          "color.blue.400"
        ],
        "description": "Accent icon."
      },
      {
        "path": "color.icon.on-accent",
        "cssVar": "--fds-color-icon-on-accent",
        "type": "color",
        "alias": "color.ink.950",
        "resolved": "#07090f",
        "chain": [
          "color.icon.on-accent",
          "color.ink.950"
        ],
        "description": "Icon on an accent-bold fill."
      },
      {
        "path": "elevation.raised",
        "cssVar": "--fds-elevation-raised",
        "type": "shadow",
        "alias": "shadow.dark-sm",
        "resolved": "0 1px 2px rgba(0, 0, 0, 0.4)",
        "chain": [
          "elevation.raised",
          "shadow.dark-sm"
        ],
        "description": "Card resting above the canvas. Most cards should use a border instead."
      },
      {
        "path": "elevation.overlay",
        "cssVar": "--fds-elevation-overlay",
        "type": "shadow",
        "alias": "shadow.dark-md",
        "resolved": "0 4px 12px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.5)",
        "chain": [
          "elevation.overlay",
          "shadow.dark-md"
        ],
        "description": "Popover, tooltip, select menu, toast."
      },
      {
        "path": "elevation.modal",
        "cssVar": "--fds-elevation-modal",
        "type": "shadow",
        "alias": "shadow.dark-lg",
        "resolved": "0 16px 40px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.5)",
        "chain": [
          "elevation.modal",
          "shadow.dark-lg"
        ],
        "description": "Dialog. The highest elevation in the system."
      },
      {
        "path": "elevation.none",
        "cssVar": "--fds-elevation-none",
        "type": "shadow",
        "alias": "shadow.none",
        "resolved": "none",
        "chain": [
          "elevation.none",
          "shadow.none"
        ],
        "description": "Explicit no-shadow, so components can opt out without hardcoding `none`."
      },
      {
        "path": "radius.control",
        "cssVar": "--fds-radius-control",
        "type": "dimension",
        "alias": "radius.sm",
        "resolved": "0.25rem",
        "chain": [
          "radius.control",
          "radius.sm"
        ],
        "description": "Buttons, inputs, checkboxes, badges. Theme-owned, so a future theme can change control geometry without touching a component."
      },
      {
        "path": "radius.surface",
        "cssVar": "--fds-radius-surface",
        "type": "dimension",
        "alias": "radius.lg",
        "resolved": "0.625rem",
        "chain": [
          "radius.surface",
          "radius.lg"
        ],
        "description": "Cards and panels."
      },
      {
        "path": "radius.overlay",
        "cssVar": "--fds-radius-overlay",
        "type": "dimension",
        "alias": "radius.xl",
        "resolved": "0.875rem",
        "chain": [
          "radius.overlay",
          "radius.xl"
        ],
        "description": "Modals, popovers, toasts."
      },
      {
        "path": "radius.pill",
        "cssVar": "--fds-radius-pill",
        "type": "dimension",
        "alias": "radius.full",
        "resolved": "62.4375rem",
        "chain": [
          "radius.pill",
          "radius.full"
        ],
        "description": "Fully rounded, for pill badges and switches."
      },
      {
        "path": "font.display",
        "cssVar": "--fds-font-display",
        "type": "fontFamily",
        "alias": "font.family.clash",
        "resolved": "'Clash Display', -apple-system, BlinkMacSystemFont, sans-serif",
        "chain": [
          "font.display",
          "font.family.clash"
        ],
        "description": "Editorial headings. Theme-owned."
      },
      {
        "path": "font.body",
        "cssVar": "--fds-font-body",
        "type": "fontFamily",
        "alias": "font.family.satoshi",
        "resolved": "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif",
        "chain": [
          "font.body",
          "font.family.satoshi"
        ],
        "description": "All UI and body text."
      },
      {
        "path": "font.mono",
        "cssVar": "--fds-font-mono",
        "type": "fontFamily",
        "alias": "font.family.mono",
        "resolved": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        "chain": [
          "font.mono",
          "font.family.mono"
        ],
        "description": "Token values, code, and numeric tables."
      }
    ]
  },
  {
    "name": "forefront-light",
    "label": "Forefront Light",
    "appearance": "light",
    "description": "Light counterpart to forefront-dark. Accent steps down the blue ramp so contrast on white stays above 4.5:1, which is why accent-bold is blue.600 here and blue.500 in the dark theme.",
    "isDefault": false,
    "tokens": [
      {
        "path": "color.surface.canvas",
        "cssVar": "--fds-color-surface-canvas",
        "type": "color",
        "alias": "color.slate.25",
        "resolved": "#f8fafc",
        "chain": [
          "color.surface.canvas",
          "color.slate.25"
        ],
        "description": "App background. The furthest-back surface."
      },
      {
        "path": "color.surface.sunken",
        "cssVar": "--fds-color-surface-sunken",
        "type": "color",
        "alias": "color.slate.50",
        "resolved": "#f1f4f8",
        "chain": [
          "color.surface.sunken",
          "color.slate.50"
        ],
        "description": "Recessed area on the canvas, e.g. a code block or well."
      },
      {
        "path": "color.surface.raised",
        "cssVar": "--fds-color-surface-raised",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.surface.raised",
          "color.slate.0"
        ],
        "description": "Card and panel background sitting above the canvas."
      },
      {
        "path": "color.surface.overlay",
        "cssVar": "--fds-color-surface-overlay",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.surface.overlay",
          "color.slate.0"
        ],
        "description": "Floating surface: modal, popover, tooltip, toast, select menu."
      },
      {
        "path": "color.surface.scrim",
        "cssVar": "--fds-color-surface-scrim",
        "type": "color",
        "alias": "color.alpha.scrim-cool",
        "resolved": "rgba(7, 9, 15, 0.48)",
        "chain": [
          "color.surface.scrim",
          "color.alpha.scrim-cool"
        ],
        "description": "Full-viewport wash behind a modal. Must be translucent."
      },
      {
        "path": "color.surface.control",
        "cssVar": "--fds-color-surface-control",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.surface.control",
          "color.slate.0"
        ],
        "description": "Default background for inputs and unfilled controls."
      },
      {
        "path": "color.surface.control-hover",
        "cssVar": "--fds-color-surface-control-hover",
        "type": "color",
        "alias": "color.slate.25",
        "resolved": "#f8fafc",
        "chain": [
          "color.surface.control-hover",
          "color.slate.25"
        ],
        "description": "Input or control background on hover."
      },
      {
        "path": "color.surface.disabled",
        "cssVar": "--fds-color-surface-disabled",
        "type": "color",
        "alias": "color.slate.50",
        "resolved": "#f1f4f8",
        "chain": [
          "color.surface.disabled",
          "color.slate.50"
        ],
        "description": "Background for any disabled control. Never communicate disabled with opacity alone."
      },
      {
        "path": "color.surface.selected",
        "cssVar": "--fds-color-surface-selected",
        "type": "color",
        "alias": "color.blue.100",
        "resolved": "#e6eff8",
        "chain": [
          "color.surface.selected",
          "color.blue.100"
        ],
        "description": "Background for a selected row, option, or tab."
      },
      {
        "path": "color.surface.accent-subtle",
        "cssVar": "--fds-color-surface-accent-subtle",
        "type": "color",
        "alias": "color.blue.100",
        "resolved": "#e6eff8",
        "chain": [
          "color.surface.accent-subtle",
          "color.blue.100"
        ],
        "description": "Low-emphasis accent wash. Safe behind accent text."
      },
      {
        "path": "color.surface.accent-bold",
        "cssVar": "--fds-color-surface-accent-bold",
        "type": "color",
        "alias": "color.blue.600",
        "resolved": "#2f6da4",
        "chain": [
          "color.surface.accent-bold",
          "color.blue.600"
        ],
        "description": "High-emphasis accent fill for primary actions."
      },
      {
        "path": "color.surface.accent-bold-hover",
        "cssVar": "--fds-color-surface-accent-bold-hover",
        "type": "color",
        "alias": "color.blue.700",
        "resolved": "#1e4c7a",
        "chain": [
          "color.surface.accent-bold-hover",
          "color.blue.700"
        ],
        "description": "Primary action hover."
      },
      {
        "path": "color.surface.accent-bold-active",
        "cssVar": "--fds-color-surface-accent-bold-active",
        "type": "color",
        "alias": "color.blue.800",
        "resolved": "#16385a",
        "chain": [
          "color.surface.accent-bold-active",
          "color.blue.800"
        ],
        "description": "Primary action pressed."
      },
      {
        "path": "color.surface.neutral-subtle",
        "cssVar": "--fds-color-surface-neutral-subtle",
        "type": "color",
        "alias": "color.slate.50",
        "resolved": "#f1f4f8",
        "chain": [
          "color.surface.neutral-subtle",
          "color.slate.50"
        ],
        "description": "Low-emphasis neutral fill, e.g. secondary button rest."
      },
      {
        "path": "color.surface.neutral-subtle-hover",
        "cssVar": "--fds-color-surface-neutral-subtle-hover",
        "type": "color",
        "alias": "color.slate.100",
        "resolved": "#e2e7ee",
        "chain": [
          "color.surface.neutral-subtle-hover",
          "color.slate.100"
        ],
        "description": "Secondary button hover."
      },
      {
        "path": "color.surface.neutral-bold",
        "cssVar": "--fds-color-surface-neutral-bold",
        "type": "color",
        "alias": "color.ink.900",
        "resolved": "#0a0a12",
        "chain": [
          "color.surface.neutral-bold",
          "color.ink.900"
        ],
        "description": "High-emphasis neutral fill."
      },
      {
        "path": "color.surface.success-subtle",
        "cssVar": "--fds-color-surface-success-subtle",
        "type": "color",
        "alias": "color.green.100",
        "resolved": "#e3f7ec",
        "chain": [
          "color.surface.success-subtle",
          "color.green.100"
        ],
        "description": "Success wash for badges and inline status."
      },
      {
        "path": "color.surface.success-bold",
        "cssVar": "--fds-color-surface-success-bold",
        "type": "color",
        "alias": "color.green.600",
        "resolved": "#1a8754",
        "chain": [
          "color.surface.success-bold",
          "color.green.600"
        ],
        "description": "Success fill."
      },
      {
        "path": "color.surface.warning-subtle",
        "cssVar": "--fds-color-surface-warning-subtle",
        "type": "color",
        "alias": "color.orange.100",
        "resolved": "#ffeadb",
        "chain": [
          "color.surface.warning-subtle",
          "color.orange.100"
        ],
        "description": "Warning wash."
      },
      {
        "path": "color.surface.warning-bold",
        "cssVar": "--fds-color-surface-warning-bold",
        "type": "color",
        "alias": "color.orange.600",
        "resolved": "#c25f18",
        "chain": [
          "color.surface.warning-bold",
          "color.orange.600"
        ],
        "description": "Warning fill."
      },
      {
        "path": "color.surface.danger-subtle",
        "cssVar": "--fds-color-surface-danger-subtle",
        "type": "color",
        "alias": "color.red.100",
        "resolved": "#fdeaeb",
        "chain": [
          "color.surface.danger-subtle",
          "color.red.100"
        ],
        "description": "Danger wash."
      },
      {
        "path": "color.surface.danger-bold",
        "cssVar": "--fds-color-surface-danger-bold",
        "type": "color",
        "alias": "color.red.600",
        "resolved": "#c92a32",
        "chain": [
          "color.surface.danger-bold",
          "color.red.600"
        ],
        "description": "Destructive action fill."
      },
      {
        "path": "color.surface.danger-bold-hover",
        "cssVar": "--fds-color-surface-danger-bold-hover",
        "type": "color",
        "alias": "color.red.700",
        "resolved": "#a41d24",
        "chain": [
          "color.surface.danger-bold-hover",
          "color.red.700"
        ],
        "description": "Destructive action hover."
      },
      {
        "path": "color.surface.info-subtle",
        "cssVar": "--fds-color-surface-info-subtle",
        "type": "color",
        "alias": "color.blue.100",
        "resolved": "#e6eff8",
        "chain": [
          "color.surface.info-subtle",
          "color.blue.100"
        ],
        "description": "Informational wash."
      },
      {
        "path": "color.surface.info-bold",
        "cssVar": "--fds-color-surface-info-bold",
        "type": "color",
        "alias": "color.blue.600",
        "resolved": "#2f6da4",
        "chain": [
          "color.surface.info-bold",
          "color.blue.600"
        ],
        "description": "Informational fill."
      },
      {
        "path": "color.text.primary",
        "cssVar": "--fds-color-text-primary",
        "type": "color",
        "alias": "color.ink.950",
        "resolved": "#07090f",
        "chain": [
          "color.text.primary",
          "color.ink.950"
        ],
        "description": "Default body and heading text. Must clear 4.5:1 on surface.canvas and surface.raised."
      },
      {
        "path": "color.text.secondary",
        "cssVar": "--fds-color-text-secondary",
        "type": "color",
        "alias": "color.slate.600",
        "resolved": "#3d4453",
        "chain": [
          "color.text.secondary",
          "color.slate.600"
        ],
        "description": "Supporting text. Must clear 4.5:1 on canvas."
      },
      {
        "path": "color.text.subtle",
        "cssVar": "--fds-color-text-subtle",
        "type": "color",
        "alias": "color.slate.500",
        "resolved": "#5b6678",
        "chain": [
          "color.text.subtle",
          "color.slate.500"
        ],
        "description": "De-emphasized metadata and helper text. Must clear 4.5:1 on canvas."
      },
      {
        "path": "color.text.placeholder",
        "cssVar": "--fds-color-text-placeholder",
        "type": "color",
        "alias": "color.slate.500",
        "resolved": "#5b6678",
        "chain": [
          "color.text.placeholder",
          "color.slate.500"
        ],
        "description": "Input placeholder. Must clear 4.5:1 on surface.control, since placeholders carry meaning."
      },
      {
        "path": "color.text.disabled",
        "cssVar": "--fds-color-text-disabled",
        "type": "color",
        "alias": "color.slate.450",
        "resolved": "#7d8696",
        "chain": [
          "color.text.disabled",
          "color.slate.450"
        ],
        "description": "Disabled control label. Exempt from AA by WCAG 1.4.3, but kept at 3:1 as a house rule."
      },
      {
        "path": "color.text.accent",
        "cssVar": "--fds-color-text-accent",
        "type": "color",
        "alias": "color.blue.700",
        "resolved": "#1e4c7a",
        "chain": [
          "color.text.accent",
          "color.blue.700"
        ],
        "description": "Accent-colored text on a neutral surface."
      },
      {
        "path": "color.text.on-accent",
        "cssVar": "--fds-color-text-on-accent",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.text.on-accent",
          "color.slate.0"
        ],
        "description": "Text placed on surface.accent-bold."
      },
      {
        "path": "color.text.on-neutral-bold",
        "cssVar": "--fds-color-text-on-neutral-bold",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.text.on-neutral-bold",
          "color.slate.0"
        ],
        "description": "Text placed on surface.neutral-bold."
      },
      {
        "path": "color.text.on-danger",
        "cssVar": "--fds-color-text-on-danger",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.text.on-danger",
          "color.slate.0"
        ],
        "description": "Text placed on surface.danger-bold."
      },
      {
        "path": "color.text.success",
        "cssVar": "--fds-color-text-success",
        "type": "color",
        "alias": "color.green.700",
        "resolved": "#146c43",
        "chain": [
          "color.text.success",
          "color.green.700"
        ],
        "description": "Success text on a neutral or success-subtle surface."
      },
      {
        "path": "color.text.warning",
        "cssVar": "--fds-color-text-warning",
        "type": "color",
        "alias": "color.orange.700",
        "resolved": "#914712",
        "chain": [
          "color.text.warning",
          "color.orange.700"
        ],
        "description": "Warning text."
      },
      {
        "path": "color.text.danger",
        "cssVar": "--fds-color-text-danger",
        "type": "color",
        "alias": "color.red.700",
        "resolved": "#a41d24",
        "chain": [
          "color.text.danger",
          "color.red.700"
        ],
        "description": "Error and validation text."
      },
      {
        "path": "color.text.info",
        "cssVar": "--fds-color-text-info",
        "type": "color",
        "alias": "color.blue.700",
        "resolved": "#1e4c7a",
        "chain": [
          "color.text.info",
          "color.blue.700"
        ],
        "description": "Informational text."
      },
      {
        "path": "color.text.link",
        "cssVar": "--fds-color-text-link",
        "type": "color",
        "alias": "color.blue.700",
        "resolved": "#1e4c7a",
        "chain": [
          "color.text.link",
          "color.blue.700"
        ],
        "description": "Inline link rest state."
      },
      {
        "path": "color.text.link-hover",
        "cssVar": "--fds-color-text-link-hover",
        "type": "color",
        "alias": "color.blue.800",
        "resolved": "#16385a",
        "chain": [
          "color.text.link-hover",
          "color.blue.800"
        ],
        "description": "Inline link hover state."
      },
      {
        "path": "color.border.subtle",
        "cssVar": "--fds-color-border-subtle",
        "type": "color",
        "alias": "color.alpha.dark-08",
        "resolved": "rgba(7, 9, 15, 0.08)",
        "chain": [
          "color.border.subtle",
          "color.alpha.dark-08"
        ],
        "description": "Hairline that defines structure without drawing attention. The system's default divider."
      },
      {
        "path": "color.border.default",
        "cssVar": "--fds-color-border-default",
        "type": "color",
        "alias": "color.slate.200",
        "resolved": "#c8ccd4",
        "chain": [
          "color.border.default",
          "color.slate.200"
        ],
        "description": "Structural border on a non-interactive container. Decorative by contract: never use it as the boundary of a control, that is what border.control exists for."
      },
      {
        "path": "color.border.strong",
        "cssVar": "--fds-color-border-strong",
        "type": "color",
        "alias": "color.slate.300",
        "resolved": "#a4aab4",
        "chain": [
          "color.border.strong",
          "color.slate.300"
        ],
        "description": "Emphasized decorative border, e.g. a hovered card edge."
      },
      {
        "path": "color.border.control",
        "cssVar": "--fds-color-border-control",
        "type": "color",
        "alias": "color.slate.450",
        "resolved": "#7d8696",
        "chain": [
          "color.border.control",
          "color.slate.450"
        ],
        "description": "Resting boundary of an interactive control: input, select, checkbox, radio, switch track, secondary button. Must clear 3:1 against surface.control, surface.canvas and surface.raised in every theme. Enforced by the build, see contrast.json."
      },
      {
        "path": "color.border.control-hover",
        "cssVar": "--fds-color-border-control-hover",
        "type": "color",
        "alias": "color.slate.500",
        "resolved": "#5b6678",
        "chain": [
          "color.border.control-hover",
          "color.slate.500"
        ],
        "description": "Boundary of a hovered interactive control. Must clear 3:1 against surface.control-hover and must never be quieter than border.control."
      },
      {
        "path": "color.border.accent",
        "cssVar": "--fds-color-border-accent",
        "type": "color",
        "alias": "color.blue.600",
        "resolved": "#2f6da4",
        "chain": [
          "color.border.accent",
          "color.blue.600"
        ],
        "description": "Accent border for selected or active elements."
      },
      {
        "path": "color.border.focus",
        "cssVar": "--fds-color-border-focus",
        "type": "color",
        "alias": "color.blue.600",
        "resolved": "#2f6da4",
        "chain": [
          "color.border.focus",
          "color.blue.600"
        ],
        "description": "Focus ring color. Must clear 3:1 against every adjacent surface. Never overridden per-component."
      },
      {
        "path": "color.border.success",
        "cssVar": "--fds-color-border-success",
        "type": "color",
        "alias": "color.green.600",
        "resolved": "#1a8754",
        "chain": [
          "color.border.success",
          "color.green.600"
        ],
        "description": "Success border."
      },
      {
        "path": "color.border.warning",
        "cssVar": "--fds-color-border-warning",
        "type": "color",
        "alias": "color.orange.600",
        "resolved": "#c25f18",
        "chain": [
          "color.border.warning",
          "color.orange.600"
        ],
        "description": "Warning border."
      },
      {
        "path": "color.border.danger",
        "cssVar": "--fds-color-border-danger",
        "type": "color",
        "alias": "color.red.600",
        "resolved": "#c92a32",
        "chain": [
          "color.border.danger",
          "color.red.600"
        ],
        "description": "Invalid control border."
      },
      {
        "path": "color.border.disabled",
        "cssVar": "--fds-color-border-disabled",
        "type": "color",
        "alias": "color.slate.200",
        "resolved": "#c8ccd4",
        "chain": [
          "color.border.disabled",
          "color.slate.200"
        ],
        "description": "Disabled control border."
      },
      {
        "path": "color.icon.primary",
        "cssVar": "--fds-color-icon-primary",
        "type": "color",
        "alias": "color.slate.600",
        "resolved": "#3d4453",
        "chain": [
          "color.icon.primary",
          "color.slate.600"
        ],
        "description": "Default icon color."
      },
      {
        "path": "color.icon.subtle",
        "cssVar": "--fds-color-icon-subtle",
        "type": "color",
        "alias": "color.slate.500",
        "resolved": "#5b6678",
        "chain": [
          "color.icon.subtle",
          "color.slate.500"
        ],
        "description": "De-emphasized icon."
      },
      {
        "path": "color.icon.accent",
        "cssVar": "--fds-color-icon-accent",
        "type": "color",
        "alias": "color.blue.700",
        "resolved": "#1e4c7a",
        "chain": [
          "color.icon.accent",
          "color.blue.700"
        ],
        "description": "Accent icon."
      },
      {
        "path": "color.icon.on-accent",
        "cssVar": "--fds-color-icon-on-accent",
        "type": "color",
        "alias": "color.slate.0",
        "resolved": "#ffffff",
        "chain": [
          "color.icon.on-accent",
          "color.slate.0"
        ],
        "description": "Icon on an accent-bold fill."
      },
      {
        "path": "elevation.raised",
        "cssVar": "--fds-elevation-raised",
        "type": "shadow",
        "alias": "shadow.light-sm",
        "resolved": "0 1px 2px rgba(7, 9, 15, 0.08)",
        "chain": [
          "elevation.raised",
          "shadow.light-sm"
        ],
        "description": "Card resting above the canvas. Most cards should use a border instead."
      },
      {
        "path": "elevation.overlay",
        "cssVar": "--fds-elevation-overlay",
        "type": "shadow",
        "alias": "shadow.light-md",
        "resolved": "0 4px 12px rgba(7, 9, 15, 0.1), 0 1px 2px rgba(7, 9, 15, 0.06)",
        "chain": [
          "elevation.overlay",
          "shadow.light-md"
        ],
        "description": "Popover, tooltip, select menu, toast."
      },
      {
        "path": "elevation.modal",
        "cssVar": "--fds-elevation-modal",
        "type": "shadow",
        "alias": "shadow.light-lg",
        "resolved": "0 16px 40px rgba(7, 9, 15, 0.14), 0 2px 6px rgba(7, 9, 15, 0.08)",
        "chain": [
          "elevation.modal",
          "shadow.light-lg"
        ],
        "description": "Dialog. The highest elevation in the system."
      },
      {
        "path": "elevation.none",
        "cssVar": "--fds-elevation-none",
        "type": "shadow",
        "alias": "shadow.none",
        "resolved": "none",
        "chain": [
          "elevation.none",
          "shadow.none"
        ],
        "description": "Explicit no-shadow, so components can opt out without hardcoding `none`."
      },
      {
        "path": "radius.control",
        "cssVar": "--fds-radius-control",
        "type": "dimension",
        "alias": "radius.sm",
        "resolved": "0.25rem",
        "chain": [
          "radius.control",
          "radius.sm"
        ],
        "description": "Buttons, inputs, checkboxes, badges. Theme-owned, so a future theme can change control geometry without touching a component."
      },
      {
        "path": "radius.surface",
        "cssVar": "--fds-radius-surface",
        "type": "dimension",
        "alias": "radius.lg",
        "resolved": "0.625rem",
        "chain": [
          "radius.surface",
          "radius.lg"
        ],
        "description": "Cards and panels."
      },
      {
        "path": "radius.overlay",
        "cssVar": "--fds-radius-overlay",
        "type": "dimension",
        "alias": "radius.xl",
        "resolved": "0.875rem",
        "chain": [
          "radius.overlay",
          "radius.xl"
        ],
        "description": "Modals, popovers, toasts."
      },
      {
        "path": "radius.pill",
        "cssVar": "--fds-radius-pill",
        "type": "dimension",
        "alias": "radius.full",
        "resolved": "62.4375rem",
        "chain": [
          "radius.pill",
          "radius.full"
        ],
        "description": "Fully rounded, for pill badges and switches."
      },
      {
        "path": "font.display",
        "cssVar": "--fds-font-display",
        "type": "fontFamily",
        "alias": "font.family.clash",
        "resolved": "'Clash Display', -apple-system, BlinkMacSystemFont, sans-serif",
        "chain": [
          "font.display",
          "font.family.clash"
        ],
        "description": "Editorial headings. Theme-owned."
      },
      {
        "path": "font.body",
        "cssVar": "--fds-font-body",
        "type": "fontFamily",
        "alias": "font.family.satoshi",
        "resolved": "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif",
        "chain": [
          "font.body",
          "font.family.satoshi"
        ],
        "description": "All UI and body text."
      },
      {
        "path": "font.mono",
        "cssVar": "--fds-font-mono",
        "type": "fontFamily",
        "alias": "font.family.mono",
        "resolved": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        "chain": [
          "font.mono",
          "font.family.mono"
        ],
        "description": "Token values, code, and numeric tables."
      }
    ]
  }
] as unknown as ThemeRecord[];

/** Tier 3. Component geometry. */
export const componentTokens = [
  {
    "path": "control.height.sm",
    "cssVar": "--fds-control-height-sm",
    "type": "dimension",
    "alias": null,
    "resolved": "1.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.height.md",
    "cssVar": "--fds-control-height-md",
    "type": "dimension",
    "alias": null,
    "resolved": "2.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.height.lg",
    "cssVar": "--fds-control-height-lg",
    "type": "dimension",
    "alias": null,
    "resolved": "2.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.padding-x.sm",
    "cssVar": "--fds-control-padding-x-sm",
    "type": "dimension",
    "alias": "space.4",
    "resolved": "0.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.padding-x.md",
    "cssVar": "--fds-control-padding-x-md",
    "type": "dimension",
    "alias": "space.5",
    "resolved": "0.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.padding-x.lg",
    "cssVar": "--fds-control-padding-x-lg",
    "type": "dimension",
    "alias": "space.6",
    "resolved": "1rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.gap.sm",
    "cssVar": "--fds-control-gap-sm",
    "type": "dimension",
    "alias": "space.2",
    "resolved": "0.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.gap.md",
    "cssVar": "--fds-control-gap-md",
    "type": "dimension",
    "alias": "space.3",
    "resolved": "0.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.gap.lg",
    "cssVar": "--fds-control-gap-lg",
    "type": "dimension",
    "alias": "space.4",
    "resolved": "0.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.font-size.sm",
    "cssVar": "--fds-control-font-size-sm",
    "type": "dimension",
    "alias": "font.size.30",
    "resolved": "0.8125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.font-size.md",
    "cssVar": "--fds-control-font-size-md",
    "type": "dimension",
    "alias": "font.size.40",
    "resolved": "0.875rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.font-size.lg",
    "cssVar": "--fds-control-font-size-lg",
    "type": "dimension",
    "alias": "font.size.50",
    "resolved": "1rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.border-width",
    "cssVar": "--fds-control-border-width",
    "type": "dimension",
    "alias": "border-width.thin",
    "resolved": "1px",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "control.radius",
    "cssVar": "--fds-control-radius",
    "type": "dimension",
    "alias": "radius.control",
    "resolved": "0.25rem",
    "themeDependent": true,
    "description": null
  },
  {
    "path": "focus.ring-width",
    "cssVar": "--fds-focus-ring-width",
    "type": "dimension",
    "alias": "border-width.medium",
    "resolved": "2px",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "focus.ring-offset",
    "cssVar": "--fds-focus-ring-offset",
    "type": "dimension",
    "alias": "border-width.medium",
    "resolved": "2px",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "focus.ring-color",
    "cssVar": "--fds-focus-ring-color",
    "type": "color",
    "alias": "color.border.focus",
    "resolved": "#7ba8d1",
    "themeDependent": true,
    "description": null
  },
  {
    "path": "button.font-weight",
    "cssVar": "--fds-button-font-weight",
    "type": "fontWeight",
    "alias": "font.weight.medium",
    "resolved": "500",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "button.icon-size",
    "cssVar": "--fds-button-icon-size",
    "type": "dimension",
    "alias": null,
    "resolved": "1em",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "input.min-width",
    "cssVar": "--fds-input-min-width",
    "type": "dimension",
    "alias": null,
    "resolved": "10rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "input.invalid-border-width",
    "cssVar": "--fds-input-invalid-border-width",
    "type": "dimension",
    "alias": "border-width.thin",
    "resolved": "1px",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "checkbox.size",
    "cssVar": "--fds-checkbox-size",
    "type": "dimension",
    "alias": null,
    "resolved": "1.125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "checkbox.radius",
    "cssVar": "--fds-checkbox-radius",
    "type": "dimension",
    "alias": "radius.xs",
    "resolved": "0.125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "radio.size",
    "cssVar": "--fds-radio-size",
    "type": "dimension",
    "alias": null,
    "resolved": "1.125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "radio.dot-size",
    "cssVar": "--fds-radio-dot-size",
    "type": "dimension",
    "alias": null,
    "resolved": "0.4375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "switch.width",
    "cssVar": "--fds-switch-width",
    "type": "dimension",
    "alias": null,
    "resolved": "2.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "switch.height",
    "cssVar": "--fds-switch-height",
    "type": "dimension",
    "alias": null,
    "resolved": "1.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "switch.thumb-size",
    "cssVar": "--fds-switch-thumb-size",
    "type": "dimension",
    "alias": null,
    "resolved": "0.875rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "switch.thumb-inset",
    "cssVar": "--fds-switch-thumb-inset",
    "type": "dimension",
    "alias": null,
    "resolved": "0.1875rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "badge.height",
    "cssVar": "--fds-badge-height",
    "type": "dimension",
    "alias": null,
    "resolved": "1.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "badge.padding-x",
    "cssVar": "--fds-badge-padding-x",
    "type": "dimension",
    "alias": "space.3",
    "resolved": "0.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "badge.font-size",
    "cssVar": "--fds-badge-font-size",
    "type": "dimension",
    "alias": "font.size.20",
    "resolved": "0.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "badge.font-weight",
    "cssVar": "--fds-badge-font-weight",
    "type": "fontWeight",
    "alias": "font.weight.semibold",
    "resolved": "600",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "badge.dot-size",
    "cssVar": "--fds-badge-dot-size",
    "type": "dimension",
    "alias": null,
    "resolved": "0.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "card.padding",
    "cssVar": "--fds-card-padding",
    "type": "dimension",
    "alias": "space.8",
    "resolved": "1.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "card.gap",
    "cssVar": "--fds-card-gap",
    "type": "dimension",
    "alias": "space.5",
    "resolved": "0.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "card.radius",
    "cssVar": "--fds-card-radius",
    "type": "dimension",
    "alias": "radius.surface",
    "resolved": "0.625rem",
    "themeDependent": true,
    "description": null
  },
  {
    "path": "modal.padding",
    "cssVar": "--fds-modal-padding",
    "type": "dimension",
    "alias": "space.8",
    "resolved": "1.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "modal.gap",
    "cssVar": "--fds-modal-gap",
    "type": "dimension",
    "alias": "space.6",
    "resolved": "1rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "modal.radius",
    "cssVar": "--fds-modal-radius",
    "type": "dimension",
    "alias": "radius.overlay",
    "resolved": "0.875rem",
    "themeDependent": true,
    "description": null
  },
  {
    "path": "modal.width-sm",
    "cssVar": "--fds-modal-width-sm",
    "type": "dimension",
    "alias": null,
    "resolved": "24rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "modal.width-md",
    "cssVar": "--fds-modal-width-md",
    "type": "dimension",
    "alias": null,
    "resolved": "34rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "modal.width-lg",
    "cssVar": "--fds-modal-width-lg",
    "type": "dimension",
    "alias": null,
    "resolved": "48rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "modal.offset",
    "cssVar": "--fds-modal-offset",
    "type": "dimension",
    "alias": "space.9",
    "resolved": "2rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tooltip.padding-x",
    "cssVar": "--fds-tooltip-padding-x",
    "type": "dimension",
    "alias": "space.4",
    "resolved": "0.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tooltip.padding-y",
    "cssVar": "--fds-tooltip-padding-y",
    "type": "dimension",
    "alias": "space.3",
    "resolved": "0.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tooltip.max-width",
    "cssVar": "--fds-tooltip-max-width",
    "type": "dimension",
    "alias": null,
    "resolved": "16rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tooltip.font-size",
    "cssVar": "--fds-tooltip-font-size",
    "type": "dimension",
    "alias": "font.size.30",
    "resolved": "0.8125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tooltip.offset",
    "cssVar": "--fds-tooltip-offset",
    "type": "dimension",
    "alias": "space.4",
    "resolved": "0.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tooltip.radius",
    "cssVar": "--fds-tooltip-radius",
    "type": "dimension",
    "alias": "radius.md",
    "resolved": "0.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tabs.indicator-thickness",
    "cssVar": "--fds-tabs-indicator-thickness",
    "type": "dimension",
    "alias": "border-width.medium",
    "resolved": "2px",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tabs.trigger-padding-x",
    "cssVar": "--fds-tabs-trigger-padding-x",
    "type": "dimension",
    "alias": "space.5",
    "resolved": "0.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tabs.trigger-height",
    "cssVar": "--fds-tabs-trigger-height",
    "type": "dimension",
    "alias": null,
    "resolved": "2.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "tabs.gap",
    "cssVar": "--fds-tabs-gap",
    "type": "dimension",
    "alias": "space.2",
    "resolved": "0.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "toast.width",
    "cssVar": "--fds-toast-width",
    "type": "dimension",
    "alias": null,
    "resolved": "22rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "toast.padding",
    "cssVar": "--fds-toast-padding",
    "type": "dimension",
    "alias": "space.5",
    "resolved": "0.75rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "toast.gap",
    "cssVar": "--fds-toast-gap",
    "type": "dimension",
    "alias": "space.4",
    "resolved": "0.5rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "toast.viewport-offset",
    "cssVar": "--fds-toast-viewport-offset",
    "type": "dimension",
    "alias": "space.7",
    "resolved": "1.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "toast.radius",
    "cssVar": "--fds-toast-radius",
    "type": "dimension",
    "alias": "radius.overlay",
    "resolved": "0.875rem",
    "themeDependent": true,
    "description": null
  },
  {
    "path": "select.menu-max-height",
    "cssVar": "--fds-select-menu-max-height",
    "type": "dimension",
    "alias": null,
    "resolved": "18rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "select.option-height",
    "cssVar": "--fds-select-option-height",
    "type": "dimension",
    "alias": null,
    "resolved": "2.125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "select.menu-padding",
    "cssVar": "--fds-select-menu-padding",
    "type": "dimension",
    "alias": "space.2",
    "resolved": "0.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "select.menu-offset",
    "cssVar": "--fds-select-menu-offset",
    "type": "dimension",
    "alias": "space.2",
    "resolved": "0.25rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "field.gap",
    "cssVar": "--fds-field-gap",
    "type": "dimension",
    "alias": "space.3",
    "resolved": "0.375rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "field.label-font-size",
    "cssVar": "--fds-field-label-font-size",
    "type": "dimension",
    "alias": "font.size.30",
    "resolved": "0.8125rem",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "field.label-font-weight",
    "cssVar": "--fds-field-label-font-weight",
    "type": "fontWeight",
    "alias": "font.weight.medium",
    "resolved": "500",
    "themeDependent": false,
    "description": null
  },
  {
    "path": "field.message-font-size",
    "cssVar": "--fds-field-message-font-size",
    "type": "dimension",
    "alias": "font.size.30",
    "resolved": "0.8125rem",
    "themeDependent": false,
    "description": null
  }
];

export interface ContrastRequirement {
	foreground: string;
	background: string;
	/** Minimum ratio this pair has to clear in every theme for the build to pass. */
	min: number;
	usage: string;
	rule: string;
}

export interface ContrastExemption {
	foreground: string;
	background: string;
	usage: string;
	/** Why this pair deliberately carries no threshold. */
	reason: string;
}

/**
 * The contrast contract, from src/contrast.json.
 *
 * The build measures every requirement against every theme and exits non-zero on a
 * violation, which is why the accessibility page can render these rows as verified
 * rather than as a claim. Reading the same source in both places is deliberate: a
 * docs table with its own copy of the pair list is a table that drifts.
 */
export const contrastRequirements = [
  {
    "foreground": "color.text.primary",
    "background": "color.surface.canvas",
    "min": 4.5,
    "usage": "Body copy on the page background",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.primary",
    "background": "color.surface.raised",
    "min": 4.5,
    "usage": "Body copy in a card",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.primary",
    "background": "color.surface.overlay",
    "min": 4.5,
    "usage": "Body copy in a modal, toast or menu",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.primary",
    "background": "color.surface.control",
    "min": 4.5,
    "usage": "Value typed into an input",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.secondary",
    "background": "color.surface.canvas",
    "min": 4.5,
    "usage": "Supporting copy",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.secondary",
    "background": "color.surface.raised",
    "min": 4.5,
    "usage": "Card body copy",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.subtle",
    "background": "color.surface.canvas",
    "min": 4.5,
    "usage": "Metadata and table captions",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.subtle",
    "background": "color.surface.raised",
    "min": 4.5,
    "usage": "Field descriptions",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.placeholder",
    "background": "color.surface.control",
    "min": 4.5,
    "usage": "Input placeholder",
    "rule": "SC 1.4.3, applied in full. Placeholder text is text, and the common practice of holding it to 3:1 treats a hint as decoration."
  },
  {
    "foreground": "color.text.accent",
    "background": "color.surface.canvas",
    "min": 4.5,
    "usage": "Accent text and links",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.link",
    "background": "color.surface.raised",
    "min": 4.5,
    "usage": "Links inside a card",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.on-accent",
    "background": "color.surface.accent-bold",
    "min": 4.5,
    "usage": "Primary button label",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.on-accent",
    "background": "color.surface.accent-bold-hover",
    "min": 4.5,
    "usage": "Primary button label, hovered",
    "rule": "SC 1.4.3. Hover states are audited too, because a label that dips below the threshold on hover is unreadable exactly while it is being used."
  },
  {
    "foreground": "color.text.on-accent",
    "background": "color.surface.accent-bold-active",
    "min": 4.5,
    "usage": "Primary button label, pressed",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.on-danger",
    "background": "color.surface.danger-bold",
    "min": 4.5,
    "usage": "Danger button label",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.on-danger",
    "background": "color.surface.danger-bold-hover",
    "min": 4.5,
    "usage": "Danger button label, hovered",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.on-neutral-bold",
    "background": "color.surface.neutral-bold",
    "min": 4.5,
    "usage": "Tooltip text and bold badge",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.success",
    "background": "color.surface.success-subtle",
    "min": 4.5,
    "usage": "Success badge, subtle tone",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.warning",
    "background": "color.surface.warning-subtle",
    "min": 4.5,
    "usage": "Warning badge, subtle tone",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.danger",
    "background": "color.surface.danger-subtle",
    "min": 4.5,
    "usage": "Danger badge, subtle tone",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.danger",
    "background": "color.surface.raised",
    "min": 4.5,
    "usage": "Field error message",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.info",
    "background": "color.surface.info-subtle",
    "min": 4.5,
    "usage": "Info badge, subtle tone",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.border.focus",
    "background": "color.surface.canvas",
    "min": 3,
    "usage": "Focus ring on the page background",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.focus",
    "background": "color.surface.raised",
    "min": 3,
    "usage": "Focus ring inside a card",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.focus",
    "background": "color.surface.overlay",
    "min": 3,
    "usage": "Focus ring inside a modal",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.control",
    "background": "color.surface.control",
    "min": 3,
    "usage": "Resting boundary of an input, select or checkbox, measured against its own fill",
    "rule": "SC 1.4.11. For an empty text field or an unchecked checkbox the border is the only thing identifying the control, so it is held to the component threshold and not treated as decoration."
  },
  {
    "foreground": "color.border.control",
    "background": "color.surface.canvas",
    "min": 3,
    "usage": "Control boundary against the page behind it",
    "rule": "SC 1.4.11. Both sides of a boundary are measured, because a border that only clears the threshold against its inner fill disappears against the page."
  },
  {
    "foreground": "color.border.control",
    "background": "color.surface.raised",
    "min": 3,
    "usage": "Control boundary inside a card",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.control-hover",
    "background": "color.surface.control-hover",
    "min": 3,
    "usage": "Hovered control boundary",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.accent",
    "background": "color.surface.control",
    "min": 3,
    "usage": "Boundary of a checked checkbox or radio",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.danger",
    "background": "color.surface.control",
    "min": 3,
    "usage": "Boundary of an invalid field",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.surface.accent-bold",
    "background": "color.surface.canvas",
    "min": 3,
    "usage": "Filled primary button against the page",
    "rule": "SC 1.4.11. A solid button carries no border, so its fill is the boundary."
  },
  {
    "foreground": "color.icon.primary",
    "background": "color.surface.canvas",
    "min": 3,
    "usage": "Interface icon on the page background",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.icon.on-accent",
    "background": "color.surface.accent-bold",
    "min": 3,
    "usage": "Icon inside a primary button",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.text.link-hover",
    "background": "color.surface.canvas",
    "min": 4.5,
    "usage": "Inline link, hovered",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.text.link-hover",
    "background": "color.surface.overlay",
    "min": 4.5,
    "usage": "Toast action link, hovered",
    "rule": "SC 1.4.3 Contrast (Minimum)"
  },
  {
    "foreground": "color.surface.danger-bold",
    "background": "color.surface.canvas",
    "min": 3,
    "usage": "Filled destructive button against the page",
    "rule": "SC 1.4.11. Measured on the resting fill, which is what identifies the control. Hover and pressed fills are audited for label legibility instead, since the boundary has already been established by the time a pointer is on it."
  },
  {
    "foreground": "color.border.success",
    "background": "color.surface.success-subtle",
    "min": 3,
    "usage": "Success badge boundary",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.success",
    "background": "color.surface.overlay",
    "min": 3,
    "usage": "Success status bar on a toast",
    "rule": "SC 1.4.11. The bar is the only non-text carrier of the toast's status, so it is measured rather than treated as trim."
  },
  {
    "foreground": "color.border.warning",
    "background": "color.surface.warning-subtle",
    "min": 3,
    "usage": "Warning badge boundary",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.border.warning",
    "background": "color.surface.overlay",
    "min": 3,
    "usage": "Warning status bar on a toast",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.icon.subtle",
    "background": "color.surface.control",
    "min": 3,
    "usage": "Select chevron and input affix icon",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.icon.subtle",
    "background": "color.surface.overlay",
    "min": 3,
    "usage": "Modal and toast dismiss icon",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.icon.accent",
    "background": "color.surface.canvas",
    "min": 3,
    "usage": "Accent icon on the page background",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.icon.accent",
    "background": "color.surface.raised",
    "min": 3,
    "usage": "Accent icon inside a card",
    "rule": "SC 1.4.11 Non-text Contrast"
  },
  {
    "foreground": "color.text.disabled",
    "background": "color.surface.disabled",
    "min": 3,
    "usage": "Disabled control label",
    "rule": "Self-imposed floor. WCAG exempts inactive controls entirely, which is how disabled states end up at 1.8:1 and unreadable. The system holds 3:1 so a disabled field can still be read before someone asks why it is disabled."
  },
  {
    "foreground": "color.border.disabled",
    "background": "color.surface.disabled",
    "min": 1.2,
    "usage": "Disabled control boundary",
    "rule": "Self-imposed floor. Deliberately low: a disabled control should recede. The floor only guarantees the shape stays perceivable rather than dissolving into the background."
  }
] as unknown as ContrastRequirement[];

/** Pairs with no threshold, named so an absent pair is never mistaken for an untested one. */
export const contrastExemptions = [
  {
    "foreground": "color.border.subtle",
    "background": "color.surface.canvas",
    "usage": "Default divider and hairline rule",
    "reason": "Purely decorative separator. Nothing is identified by it and no information is lost if it is invisible, which is the SC 1.4.11 exemption. It stays quiet on purpose, and the audited border.control token exists so that quietness never leaks onto an interactive boundary."
  },
  {
    "foreground": "color.border.subtle",
    "background": "color.surface.raised",
    "usage": "Card and modal edge",
    "reason": "Decorative. The card is identified by its fill and its content, not by its edge."
  },
  {
    "foreground": "color.border.default",
    "background": "color.surface.raised",
    "usage": "Structural border on non-interactive containers",
    "reason": "Decorative container edge. This token used to sit on inputs and checkboxes as well, which is what put an interactive boundary at 1.25:1 in the dark themes. Splitting border.control out of it is what let this one stay decorative."
  },
  {
    "foreground": "color.border.strong",
    "background": "color.surface.raised",
    "usage": "Hovered card edge",
    "reason": "Decorative emphasis on a container whose fill and content already identify it."
  }
] as unknown as ContrastExemption[];

/** Density modes. Each restates a subset of tier 3. */
export const densities = [
  {
    "name": "compact",
    "label": "Compact",
    "description": "Compact density for data-dense surfaces. It overrides a deliberately small slice of tier 3: control heights, insets, and container padding. It never changes font sizes below 13px and never changes focus ring geometry, because shrinking either one trades accessibility for information density.",
    "tokens": [
      {
        "path": "control.height.sm",
        "cssVar": "--fds-control-height-sm",
        "alias": null,
        "value": "1.5rem"
      },
      {
        "path": "control.height.md",
        "cssVar": "--fds-control-height-md",
        "alias": null,
        "value": "1.875rem"
      },
      {
        "path": "control.height.lg",
        "cssVar": "--fds-control-height-lg",
        "alias": null,
        "value": "2.375rem"
      },
      {
        "path": "control.padding-x.sm",
        "cssVar": "--fds-control-padding-x-sm",
        "alias": "space.3",
        "value": "{space.3}"
      },
      {
        "path": "control.padding-x.md",
        "cssVar": "--fds-control-padding-x-md",
        "alias": "space.4",
        "value": "{space.4}"
      },
      {
        "path": "control.padding-x.lg",
        "cssVar": "--fds-control-padding-x-lg",
        "alias": "space.5",
        "value": "{space.5}"
      },
      {
        "path": "badge.height",
        "cssVar": "--fds-badge-height",
        "alias": null,
        "value": "1.25rem"
      },
      {
        "path": "badge.padding-x",
        "cssVar": "--fds-badge-padding-x",
        "alias": "space.2",
        "value": "{space.2}"
      },
      {
        "path": "card.padding",
        "cssVar": "--fds-card-padding",
        "alias": "space.6",
        "value": "{space.6}"
      },
      {
        "path": "card.gap",
        "cssVar": "--fds-card-gap",
        "alias": "space.4",
        "value": "{space.4}"
      },
      {
        "path": "modal.padding",
        "cssVar": "--fds-modal-padding",
        "alias": "space.7",
        "value": "{space.7}"
      },
      {
        "path": "modal.gap",
        "cssVar": "--fds-modal-gap",
        "alias": "space.5",
        "value": "{space.5}"
      },
      {
        "path": "tabs.trigger-height",
        "cssVar": "--fds-tabs-trigger-height",
        "alias": null,
        "value": "2.125rem"
      },
      {
        "path": "tabs.trigger-padding-x",
        "cssVar": "--fds-tabs-trigger-padding-x",
        "alias": "space.4",
        "value": "{space.4}"
      },
      {
        "path": "toast.padding",
        "cssVar": "--fds-toast-padding",
        "alias": "space.4",
        "value": "{space.4}"
      },
      {
        "path": "select.option-height",
        "cssVar": "--fds-select-option-height",
        "alias": null,
        "value": "1.875rem"
      },
      {
        "path": "field.gap",
        "cssVar": "--fds-field-gap",
        "alias": "space.2",
        "value": "{space.2}"
      }
    ]
  }
];

export type ThemeName = "forefront-dark" | "forefront-light";
export type DensityName = "comfortable" | "compact";

/**
 * Union of every semantic token path. Generated, so a typo in consumer code is a
 * compile error rather than a silently missing custom property at runtime.
 */
export type SemanticTokenPath =
	| "color.surface.canvas"
	| "color.surface.sunken"
	| "color.surface.raised"
	| "color.surface.overlay"
	| "color.surface.scrim"
	| "color.surface.control"
	| "color.surface.control-hover"
	| "color.surface.disabled"
	| "color.surface.selected"
	| "color.surface.accent-subtle"
	| "color.surface.accent-bold"
	| "color.surface.accent-bold-hover"
	| "color.surface.accent-bold-active"
	| "color.surface.neutral-subtle"
	| "color.surface.neutral-subtle-hover"
	| "color.surface.neutral-bold"
	| "color.surface.success-subtle"
	| "color.surface.success-bold"
	| "color.surface.warning-subtle"
	| "color.surface.warning-bold"
	| "color.surface.danger-subtle"
	| "color.surface.danger-bold"
	| "color.surface.danger-bold-hover"
	| "color.surface.info-subtle"
	| "color.surface.info-bold"
	| "color.text.primary"
	| "color.text.secondary"
	| "color.text.subtle"
	| "color.text.placeholder"
	| "color.text.disabled"
	| "color.text.accent"
	| "color.text.on-accent"
	| "color.text.on-neutral-bold"
	| "color.text.on-danger"
	| "color.text.success"
	| "color.text.warning"
	| "color.text.danger"
	| "color.text.info"
	| "color.text.link"
	| "color.text.link-hover"
	| "color.border.subtle"
	| "color.border.default"
	| "color.border.strong"
	| "color.border.control"
	| "color.border.control-hover"
	| "color.border.accent"
	| "color.border.focus"
	| "color.border.success"
	| "color.border.warning"
	| "color.border.danger"
	| "color.border.disabled"
	| "color.icon.primary"
	| "color.icon.subtle"
	| "color.icon.accent"
	| "color.icon.on-accent"
	| "elevation.raised"
	| "elevation.overlay"
	| "elevation.modal"
	| "elevation.none"
	| "radius.control"
	| "radius.surface"
	| "radius.overlay"
	| "radius.pill"
	| "font.display"
	| "font.body"
	| "font.mono";

export type PrimitiveTokenPath =
	| "color.ink.650"
	| "color.ink.700"
	| "color.ink.750"
	| "color.ink.800"
	| "color.ink.850"
	| "color.ink.900"
	| "color.ink.950"
	| "color.ink.1000"
	| "color.slate.0"
	| "color.slate.25"
	| "color.slate.50"
	| "color.slate.100"
	| "color.slate.200"
	| "color.slate.300"
	| "color.slate.400"
	| "color.slate.450"
	| "color.slate.500"
	| "color.slate.600"
	| "color.blue.100"
	| "color.blue.300"
	| "color.blue.400"
	| "color.blue.500"
	| "color.blue.600"
	| "color.blue.700"
	| "color.blue.800"
	| "color.blue.950"
	| "color.orange.100"
	| "color.orange.400"
	| "color.orange.500"
	| "color.orange.600"
	| "color.orange.700"
	| "color.orange.950"
	| "color.green.100"
	| "color.green.400"
	| "color.green.500"
	| "color.green.600"
	| "color.green.700"
	| "color.green.950"
	| "color.red.100"
	| "color.red.300"
	| "color.red.400"
	| "color.red.500"
	| "color.red.600"
	| "color.red.700"
	| "color.red.950"
	| "color.alpha.light-08"
	| "color.alpha.dark-08"
	| "color.alpha.scrim-dark"
	| "color.alpha.scrim-cool"
	| "font.family.clash"
	| "font.family.satoshi"
	| "font.family.mono"
	| "font.size.10"
	| "font.size.20"
	| "font.size.30"
	| "font.size.40"
	| "font.size.50"
	| "font.size.60"
	| "font.size.70"
	| "font.size.80"
	| "font.size.90"
	| "font.size.100"
	| "font.size.110"
	| "font.size.120"
	| "font.size.130"
	| "font.weight.regular"
	| "font.weight.medium"
	| "font.weight.semibold"
	| "font.weight.bold"
	| "font.line-height.tight"
	| "font.line-height.snug"
	| "font.line-height.normal"
	| "font.line-height.relaxed"
	| "font.tracking.tighter"
	| "font.tracking.tight"
	| "font.tracking.normal"
	| "font.tracking.wide"
	| "font.tracking.wider"
	| "space.0"
	| "space.1"
	| "space.2"
	| "space.3"
	| "space.4"
	| "space.5"
	| "space.6"
	| "space.7"
	| "space.8"
	| "space.9"
	| "space.10"
	| "space.11"
	| "space.12"
	| "space.13"
	| "space.14"
	| "space.15"
	| "radius.none"
	| "radius.xs"
	| "radius.sm"
	| "radius.md"
	| "radius.lg"
	| "radius.xl"
	| "radius.2xl"
	| "radius.full"
	| "border-width.none"
	| "border-width.thin"
	| "border-width.medium"
	| "border-width.thick"
	| "shadow.dark-sm"
	| "shadow.dark-md"
	| "shadow.dark-lg"
	| "shadow.light-sm"
	| "shadow.light-md"
	| "shadow.light-lg"
	| "shadow.none"
	| "duration.instant"
	| "duration.fast"
	| "duration.moderate"
	| "duration.slow"
	| "duration.slower"
	| "easing.linear"
	| "easing.standard"
	| "easing.emphasized"
	| "easing.entrance"
	| "easing.exit"
	| "easing.spring"
	| "z-index.base"
	| "z-index.raised"
	| "z-index.sticky"
	| "z-index.overlay"
	| "z-index.modal"
	| "z-index.popover"
	| "z-index.toast"
	| "z-index.tooltip";

export const themeNames = [
  "forefront-dark",
  "forefront-light"
] as ThemeName[];
export const densityNames = [
  "comfortable",
  "compact"
] as DensityName[];
export const defaultTheme: ThemeName = "forefront-dark";

/** `cssVar("color.surface.canvas")` -> `"var(--fds-color-surface-canvas)"` */
export function cssVar(path: SemanticTokenPath | PrimitiveTokenPath | string): string {
	return `var(--fds-${path.split(".").join("-")})`;
}

/** The DOM attributes that drive theming. Exported so consumers never hardcode them. */
export const THEME_ATTRIBUTE = "data-fds-theme";
export const DENSITY_ATTRIBUTE = "data-fds-density";
