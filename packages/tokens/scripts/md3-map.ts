/**
 * Material 3 bridge map.
 *
 * Why this exists: a product team on Material 3 (Compose, Flutter, or @material/web)
 * should not have to fork the Forefront palette to stay on brand. MD3 exposes its own
 * semantic roles under md.sys.*; every one of them is answered here by a Forefront
 * contract token, so switching a Forefront theme also re-themes the MD3 surface.
 *
 * Reading the pairs: MD3 role on the left, Forefront contract token on the right.
 * MD3 communicates elevation through tonal surface colour rather than shadow, which is
 * why the surface-container ramp maps onto the Forefront surface ramp instead of onto
 * elevation tokens.
 */

export const MD3_COLOR_MAP: [string, string][] = [
  ["primary", "color-surface-accent-bold"],
  ["on-primary", "color-text-on-accent"],
  ["primary-container", "color-surface-accent-subtle"],
  ["on-primary-container", "color-text-accent"],
  ["secondary", "color-surface-neutral-bold"],
  ["on-secondary", "color-text-on-neutral-bold"],
  ["secondary-container", "color-surface-neutral-subtle"],
  ["on-secondary-container", "color-text-primary"],
  ["tertiary", "color-surface-info-bold"],
  ["on-tertiary", "color-text-on-accent"],
  ["tertiary-container", "color-surface-info-subtle"],
  ["on-tertiary-container", "color-text-info"],
  ["error", "color-surface-danger-bold"],
  ["on-error", "color-text-on-danger"],
  ["error-container", "color-surface-danger-subtle"],
  ["on-error-container", "color-text-danger"],
  ["surface", "color-surface-canvas"],
  ["on-surface", "color-text-primary"],
  ["on-surface-variant", "color-text-secondary"],
  ["surface-container-lowest", "color-surface-sunken"],
  ["surface-container-low", "color-surface-canvas"],
  ["surface-container", "color-surface-raised"],
  ["surface-container-high", "color-surface-overlay"],
  ["surface-container-highest", "color-surface-control-hover"],
  ["surface-dim", "color-surface-sunken"],
  ["surface-bright", "color-surface-raised"],
  ["inverse-surface", "color-surface-neutral-bold"],
  ["inverse-on-surface", "color-text-on-neutral-bold"],
  ["inverse-primary", "color-text-accent"],
  ["outline", "color-border-control"],
  ["outline-variant", "color-border-subtle"],
  ["scrim", "color-surface-scrim"],
];

/** MD3 shape ramp (4/8/12/16/28dp and full) answered by Forefront radius primitives. */
export const MD3_SHAPE_MAP: [string, string][] = [
  ["none", "radius-none"],
  ["extra-small", "radius-xs"],
  ["small", "radius-sm"],
  ["medium", "radius-md"],
  ["large", "radius-lg"],
  ["extra-large", "radius-xl"],
  ["extra-large-increased", "radius-2xl"],
  ["full", "radius-full"],
];

type Typescale = { font: string; size: string; lineHeight: string; weight: string; tracking: string };

export const MD3_TYPESCALE_MAP: [string, Typescale][] = [
  ["display-large", { font: "font-display", size: "font-size-130", lineHeight: "font-line-height-tight", weight: "font-weight-bold", tracking: "font-tracking-display" }],
  ["display-medium", { font: "font-display", size: "font-size-120", lineHeight: "font-line-height-tight", weight: "font-weight-bold", tracking: "font-tracking-display" }],
  ["display-small", { font: "font-display", size: "font-size-110", lineHeight: "font-line-height-tight", weight: "font-weight-semibold", tracking: "font-tracking-tighter" }],
  ["headline-large", { font: "font-display", size: "font-size-100", lineHeight: "font-line-height-snug", weight: "font-weight-semibold", tracking: "font-tracking-tighter" }],
  ["headline-medium", { font: "font-display", size: "font-size-90", lineHeight: "font-line-height-snug", weight: "font-weight-semibold", tracking: "font-tracking-tight" }],
  ["headline-small", { font: "font-display", size: "font-size-80", lineHeight: "font-line-height-snug", weight: "font-weight-semibold", tracking: "font-tracking-tight" }],
  ["title-large", { font: "font-body", size: "font-size-70", lineHeight: "font-line-height-snug", weight: "font-weight-medium", tracking: "font-tracking-tight" }],
  ["title-medium", { font: "font-body", size: "font-size-60", lineHeight: "font-line-height-normal", weight: "font-weight-medium", tracking: "font-tracking-normal" }],
  ["title-small", { font: "font-body", size: "font-size-50", lineHeight: "font-line-height-normal", weight: "font-weight-medium", tracking: "font-tracking-normal" }],
  ["body-large", { font: "font-body", size: "font-size-50", lineHeight: "font-line-height-relaxed", weight: "font-weight-regular", tracking: "font-tracking-normal" }],
  ["body-medium", { font: "font-body", size: "font-size-40", lineHeight: "font-line-height-relaxed", weight: "font-weight-regular", tracking: "font-tracking-normal" }],
  ["body-small", { font: "font-body", size: "font-size-30", lineHeight: "font-line-height-normal", weight: "font-weight-regular", tracking: "font-tracking-normal" }],
  ["label-large", { font: "font-body", size: "font-size-40", lineHeight: "font-line-height-snug", weight: "font-weight-medium", tracking: "font-tracking-normal" }],
  ["label-medium", { font: "font-body", size: "font-size-30", lineHeight: "font-line-height-snug", weight: "font-weight-medium", tracking: "font-tracking-wide" }],
  ["label-small", { font: "font-body", size: "font-size-20", lineHeight: "font-line-height-snug", weight: "font-weight-medium", tracking: "font-tracking-wide" }],
];
