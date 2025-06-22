import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    onMenuToggle: { action: 'toggle menu' },
    isMenuOpen: { control: 'boolean' },
    brandName: { control: 'text' },
    showSearch: { control: 'boolean' },
    showTokenBalance: { control: 'boolean' },
    showNotifications: { control: 'boolean' },
    showUserMenu: { control: 'boolean' }
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brandName: "GamePlatform",
    showSearch: true,
    showTokenBalance: true,
    showNotifications: true,
    showUserMenu: true,
    isMenuOpen: false
  }
};

export const MenuOpen: Story = {
  args: {
    ...Default.args,
    isMenuOpen: true
  }
};

export const NoSearch: Story = {
  args: {
    ...Default.args,
    showSearch: false
  }
};

export const Minimal: Story = {
  args: {
    brandName: "GamePlatform",
    showSearch: false,
    showTokenBalance: false,
    showNotifications: false,
    showUserMenu: true
  }
};