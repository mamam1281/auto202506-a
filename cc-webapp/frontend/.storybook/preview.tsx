import '../styles/globals.css';
import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import { AppProvider } from '../contexts/AppContext';

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProvider>
        <div className="h-screen flex flex-col">
          <Story />
        </div>
      </AppProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0f0f23',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    darkMode: {
      dark: { ...themes.dark, appBg: '#0f0f23' },
      light: { ...themes.light, appBg: '#ffffff' },
      current: 'dark'
    },
    docs: {
      theme: themes.dark,
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1024px', height: '768px' },
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
