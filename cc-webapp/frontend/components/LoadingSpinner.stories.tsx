import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner, LoadingSpinnerProps } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['modern', 'classic'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const ModernMd: Story = {
  args: {
    size: 'md',
    variant: 'modern',
  },
};

export const ModernSm: Story = {
  args: {
    size: 'sm',
    variant: 'modern',
  },
};

export const ModernLg: Story = {
  args: {
    size: 'lg',
    variant: 'modern',
  },
};

export const ClassicMd: Story = {
  args: {
    size: 'md',
    variant: 'classic',
  },
};

export const ClassicSm: Story = {
  args: {
    size: 'sm',
    variant: 'classic',
  },
};

export const ClassicLg: Story = {
  args: {
    size: 'lg',
    variant: 'classic',
  },
};
