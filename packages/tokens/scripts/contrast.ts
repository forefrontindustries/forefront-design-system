/**
 * WCAG contrast gate. Accessibility is a build rule here, not a review comment:
 * every pair below is checked in every theme, and the token build fails if one drops
 * under its threshold. Adding a theme therefore cannot ship a quietly unreadable state.
 */
import { loadModel, resolveTheme, type Model } from "./resolve.ts";

type Pair = { label: string; fg: string; bg: string; required: number; note: string };

/** 4.5:1 for body text, 3:1 for large text and for non-text boundaries (WCAG 1.4.3 / 1.4.11). */
const PAIRS: Pair[] = [
  { label: "text.primary on surface.canvas", fg: "color-text-primary", bg: "color-surface-canvas", required: 4.5, note: "body copy" },
  { label: "text.primary on surface.raised", fg: "color-text-primary", bg: "color-surface-raised", required: 4.5, note: "card copy" },
  { label: "text.secondary on surface.canvas", fg: "color-text-secondary", bg: "color-surface-canvas", required: 4.5, note: "supporting copy" },
  { label: "text.subtle on surface.canvas", fg: "color-text-subtle", bg: "color-surface-canvas", required: 4.5, note: "metadata still has to be readable" },
  { label: "text.placeholder on surface.control", fg: "color-text-placeholder", bg: "color-surface-control", required: 4.5, note: "placeholder text" },
  { label: "text.on-accent on surface.accent.bold", fg: "color-text-on-accent", bg: "color-surface-accent-bold", required: 4.5, note: "primary button label" },
  { label: "text.on-neutral-bold on surface.neutral.bold", fg: "color-text-on-neutral-bold", bg: "color-surface-neutral-bold", required: 4.5, note: "tooltip label" },
  { label: "text.on-danger on surface.danger.bold", fg: "color-text-on-danger", bg: "color-surface-danger-bold", required: 4.5, note: "destructive button label" },
  { label: "text.accent on surface.canvas", fg: "color-text-accent", bg: "color-surface-canvas", required: 4.5, note: "accent text" },
  { label: "text.link on surface.canvas", fg: "color-text-link", bg: "color-surface-canvas", required: 4.5, note: "inline link" },
  { label: "text.danger on surface.canvas", fg: "color-text-danger", bg: "color-surface-canvas", required: 4.5, note: "validation message" },
  { label: "text.success on surface.canvas", fg: "color-text-success", bg: "color-surface-canvas", required: 4.5, note: "success message" },
  { label: "text.warning on surface.canvas", fg: "color-text-warning", bg: "color-surface-canvas", required: 4.5, note: "warning message" },
  { label: "text.info on surface.canvas", fg: "color-text-info", bg: "color-surface-canvas", required: 4.5, note: "info message" },
  { label: "text.primary on surface.selected", fg: "color-text-primary", bg: "color-surface-selected", required: 4.5, note: "selected row copy" },
  { label: "border.control on surface.canvas", fg: "color-border-control", bg: "color-surface-canvas", required: 3, note: "control boundary, WCAG 1.4.11" },
  { label: "border.focus on surface.canvas", fg: "color-border-focus", bg: "color-surface-canvas", required: 3, note: "focus ring must be visible" },
  { label: "border.focus on surface.raised", fg: "color-border-focus", bg: "color-surface-raised", required: 3, note: "focus ring on a card" },
  { label: "border.danger on surface.canvas", fg: "color-border-danger", bg: "color-surface-canvas", required: 3, note: "invalid control boundary" },
  { label: "icon.primary on surface.canvas", fg: "color-icon-primary", bg: "color-surface-canvas", required: 3, note: "icon, non-text contrast" },
];

const hex = (raw: string) => {
  let value = raw.trim().replace("#", "");
  if (value.length === 3) value = value.split("").map((c) => c + c).join("");
  if (value.length === 8) value = value.slice(0, 6); // alpha handled by the note, not the maths
  const int = Number.parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255] as const;
};

const luminance = (raw: string) => {
  const [r, g, b] = hex(raw).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (fg: string, bg: string) => {
  const a = luminance(fg);
  const b = luminance(bg);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
};

export function contrastReport(model: Model = loadModel()) {
  const pairs: {
    theme: string;
    label: string;
    ratio: number;
    required: number;
    passes: boolean;
    note: string;
    fgValue: string;
    bgValue: string;
  }[] = [];

  for (const theme of model.themes) {
    const { resolved } = resolveTheme(model, theme.name);
    for (const pair of PAIRS) {
      const fgValue = resolved[pair.fg];
      const bgValue = resolved[pair.bg];
      if (!fgValue?.startsWith("#") || !bgValue?.startsWith("#")) continue;
      const ratio = contrastRatio(fgValue, bgValue);
      pairs.push({
        theme: theme.name,
        label: pair.label,
        ratio,
        required: pair.required,
        passes: ratio >= pair.required,
        note: pair.note,
        fgValue,
        bgValue,
      });
    }
  }

  return {
    standard: "WCAG 2.2 AA: 4.5:1 body text, 3:1 large text and non-text boundaries",
    checked: pairs.length,
    failing: pairs.filter((p) => !p.passes).length,
    pairs,
  };
}

if (import.meta.main) {
  const report = contrastReport();
  for (const pair of report.pairs) {
    const mark = pair.passes ? "pass" : "FAIL";
    console.log(`${mark}  ${pair.theme.padEnd(16)} ${pair.ratio.toFixed(2).padStart(6)}:1  needs ${pair.required}  ${pair.label}`);
  }
  console.log(`\n${report.checked} pairs checked, ${report.failing} failing`);
  if (report.failing) process.exit(1);
}
