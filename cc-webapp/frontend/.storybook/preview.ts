import type { Preview } from '@storybook/react';
import '../styles/globals.css';
import '../styles/tailwind.css'; // Tailwind CSS import
import '../styles/variables.css'; // CSS Variables import
import '../styles/fonts.css'; // Font import (if applicable)

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Small mobile',
          styles: {
            height: '768px',
            width: '374px',
          },
          type: 'mobile',
        },
        mobile2: {
          name: 'Large mobile',
          styles: {
            height: '896px',
            width: '384px',
          },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: {
            height: '1112px',
            width: '834px',
          },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: {
            height: '900px',
            width: '1440px',
          },
          type: 'desktop',
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'game',
          value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
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
