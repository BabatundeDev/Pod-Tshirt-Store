/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  staticDirs: ['../public']  // ✅ Add this line
};

export default config;
