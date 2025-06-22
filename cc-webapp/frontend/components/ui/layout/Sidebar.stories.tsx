import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    isCollapsed: { control: 'boolean' },
    onToggle: { action: 'toggle sidebar' },
    onCollapseToggle: { action: 'collapse toggle' }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--color-slate-900, #0f172a)',
        color: 'white'
      }}>
        <Story />
      </div>
    )
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    isCollapsed: false,
  }
};

export const Collapsed: Story = {
  args: {
    isOpen: true,
    isCollapsed: true,
  }
};

export const Closed: Story = {
  args: {
    isOpen: false,
    isCollapsed: false,
  }
};