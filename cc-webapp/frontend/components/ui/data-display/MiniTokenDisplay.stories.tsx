import type { Meta, StoryObj } from '@storybook/react';
import MiniTokenDisplay from './MiniTokenDisplay';

const meta: Meta<typeof MiniTokenDisplay> = {
  title: 'Data Display/MiniTokenDisplay',
  component: MiniTokenDisplay,
  tags: ['autodocs'],
  argTypes: {
    amount: { control: 'number', defaultValue: 1234567 },
    status: { control: 'radio', options: ['normal', 'warning', 'critical'], defaultValue: 'normal' },
    className: { control: 'text' }
  }
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: 1234567,
    status: 'normal',
  }
};

export const Warning: Story = {
  args: {
    amount: 80000,
    status: 'warning',
  }
};

export const Critical: Story = {
  args: {
    amount: 500,
    status: 'critical',
  }
};

export const CustomClass: Story = {
  args: {
    amount: 9999999,
    status: 'normal',
    className: 'ring-2 ring-purple-400'
  }
};
