const path = require('path');

/** @type {import('@storybook/nextjs').StorybookConfig} */
const config = {
  stories: ['../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        },
        'postcss-loader',
      ],
    });
    const cssRule = config.module.rules.find((rule) => {
      if (typeof rule !== 'object' || !rule) return false;
      return rule.test instanceof RegExp && rule.test.test('.css');
    });
    if (cssRule && typeof cssRule === 'object') {
      cssRule.exclude = /\.module\.css$/;
    }
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/navigation': path.resolve(__dirname, './mocks/next-navigation.js'),
      'next/router': path.resolve(__dirname, './mocks/next-router.js'),
    };
    return config;
  },
};

module.exports = config;