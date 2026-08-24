import { create } from "storybook/theming";

/**
 * Storybook's own chrome is not themeable by our tokens: the manager renders
 * outside the preview iframe, so it never sees the token stylesheet. These
 * values are therefore copied from the forefront-dark theme by hand, and this
 * is the one place in the repo where literal colour values are legitimate.
 *
 * Source of truth for each value, from packages/tokens/build/tokens.css:
 *   ink-950   #07090f   surface.canvas
 *   ink-850   #0a0c14   surface.raised
 *   ink-650   #2a2a35   border.strong
 *   blue-500  #5793ca   surface.accent.bold
 *   blue-400  #7ba8d1   text.accent
 *   slate-25  #f8fafc   text.primary
 *   slate-300 #a4aab4   text.secondary
 */
export default create({
  base: "dark",

  brandTitle: `
    <span style="display:flex;flex-direction:column;line-height:1.15">
      <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7ba8d1">Forefront</span>
      <span style="font-size:15px;font-weight:600;color:#f8fafc">Design System</span>
    </span>
  `,
  brandUrl: "https://github.com/forefrontindustries/forefront-design-system",
  brandTarget: "_blank",

  colorPrimary: "#5793ca",
  colorSecondary: "#5793ca",

  appBg: "#07090f",
  appContentBg: "#07090f",
  appPreviewBg: "#07090f",
  appBorderColor: "#2a2a35",
  appBorderRadius: 8,

  textColor: "#f8fafc",
  textInverseColor: "#07090f",
  textMutedColor: "#a4aab4",

  barBg: "#0a0c14",
  barTextColor: "#a4aab4",
  barSelectedColor: "#7ba8d1",
  barHoverColor: "#7ba8d1",

  buttonBg: "#0a0c14",
  buttonBorder: "#2a2a35",
  booleanBg: "#0a0c14",
  booleanSelectedBg: "#5793ca",

  inputBg: "#0a0c14",
  inputBorder: "#2a2a35",
  inputTextColor: "#f8fafc",
  inputBorderRadius: 6,

  fontBase: '"Outfit", Arial, Helvetica, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});
