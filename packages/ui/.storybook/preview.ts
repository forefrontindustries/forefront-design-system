import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

/**
 * Theme and density are set the same way in Storybook as in production: two attributes
 * on the document element. If a story looks right here it looks right in the app, because
 * nothing in the story layer overrides tokens.
 */
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Forefront theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "forefront-dark", title: "Dark (default)" },
          { value: "forefront-light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Density mode",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "comfortable", title: "Comfortable" },
          { value: "compact", title: "Compact" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "forefront-dark", density: "comfortable" },
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      root.setAttribute("data-fds-theme", String(context.globals.theme ?? "forefront-dark"));
      if (context.globals.density === "compact") root.setAttribute("data-fds-density", "compact");
      else root.removeAttribute("data-fds-density");
      document.body.style.background = "var(--fds-color-surface-canvas)";
      document.body.style.color = "var(--fds-color-text-secondary)";
      document.body.style.fontFamily = "var(--fds-font-body)";
      return Story();
    },
  ],
  parameters: {
    controls: { expanded: true },
    a11y: { test: "error" },
    backgrounds: { disable: true },
    layout: "centered",
  },
};

export default preview;
