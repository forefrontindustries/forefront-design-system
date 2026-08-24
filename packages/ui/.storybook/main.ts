import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx", "../src/**/*.mdx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  typescript: { check: false },
  // The docs site links to /storybook/, and both the Pages deploy and the local
  // dev server mount the static build at that path. Asset URLs have to agree.
  viteFinal: (config, { configType }) => {
    if (configType === "PRODUCTION") config.base = "/storybook/";
    return config;
  },
};

export default config;
