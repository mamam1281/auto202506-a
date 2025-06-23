import type { Meta, StoryObj } from '@storybook/react';
import { ProgressLoader, ProgressLoaderProps } from './ProgressLoader';

const meta: Meta<typeof ProgressLoader> = {
  title: 'Components/ProgressLoader',
  component: ProgressLoader,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    variant: { control: { type: 'select' }, options: ['default', 'gradient', 'striped', 'pulsing'] },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressLoader>;

export const Default: Story = {
  args: { value: 60, size: 'md', variant: 'default' },
};
export const Gradient: Story = {
  args: { value: 80, size: 'md', variant: 'gradient' },
};
export const Striped: Story = {
  args: { value: 40, size: 'md', variant: 'striped' },
};
export const Pulsing: Story = {
  args: { value: 90, size: 'md', variant: 'pulsing' },
};
export const Large: Story = {
  args: { value: 75, size: 'lg', variant: 'gradient' },
};
export const Small: Story = {
  args: { value: 30, size: 'sm', variant: 'default' },
};
