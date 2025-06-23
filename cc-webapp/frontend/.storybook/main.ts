import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],  addons: [
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
  },  webpackFinal: async (config) => {
    // CSS Modules 지원을 위한 설정
    config.module?.rules?.push({
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

    // 일반 CSS는 CSS 모듈이 아닌 것으로 처리
    const cssRule = config.module?.rules?.find((rule) => {
      if (typeof rule !== 'object' || !rule) return false;
      return rule.test instanceof RegExp && rule.test.test('.css');
    });

    if (cssRule && typeof cssRule === 'object') {
      cssRule.exclude = /\.module\.css$/;
    }

    // Next.js 모킹을 위한 resolve alias 추가
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/navigation': require.resolve('./mocks/next-navigation.js'),
      'next/router': require.resolve('./mocks/next-router.js'),
    };

    return config;
  },
};

export default config;
