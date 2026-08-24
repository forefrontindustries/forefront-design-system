import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx", "../src/**/*.mdx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  typescript: { check: false },
  // theme.ts uses the logo as brandImage. The docs site owns the file, so serve
  // that same copy rather than duplicating it: /images/* resolves here on 6006
  // and on the docs site, which mounts this build under /storybook/.
  staticDirs: [{ from: "../../web/public/images", to: "/images" }],
  // The manager shell is a separate document from the preview iframe, so it
  // does not inherit the docs site font. theme.ts asks for Outfit, so load it.
  managerHead: (head) => `
    ${head}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" />
  `,
  // The docs site links to /storybook/, and both the Pages deploy and the local
  // dev server mount the static build at that path. Asset URLs have to agree.
  viteFinal: (config, { configType }) => {
    if (configType === "PRODUCTION") config.base = "/storybook/";
    return config;
  },
};

export default config;
