import type { Meta, StoryObj } from '@storybook/react';
import AppBar from './AppBar';

const meta = {
  title: 'Layout/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    leftContent: { 
      control: { type: 'select' },
      options: ['back', 'menu', 'none']
    },
    centerContent: {
      control: { type: 'select' },
      options: ['title', 'logo', 'none']
    },
    rightContent: {
      control: { type: 'select' },
      options: ['notification', 'profile', 'settings', 'none']
    },
    hasShadow: { control: 'boolean' },
    hasBorder: { control: 'boolean' },
    variant: {
      control: { type: 'select' },
      options: ['default', 'game', 'transparent']
    },
    onBackClick: { action: 'back clicked' },
    onMenuClick: { action: 'menu clicked' },
    onNotificationClick: { action: 'notification clicked' },
    onSettingsClick: { action: 'settings clicked' },
    onProfileClick: { action: 'profile clicked' }
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
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "카지노 게임",
    leftContent: 'menu',
    centerContent: 'title',
    rightContent: 'notification',
    hasShadow: true,
    hasBorder: true,
    variant: 'default'
  }
};

export const GameVariant: Story = {
  args: {
    ...Default.args,
    title: "슬롯 게임",
    leftContent: 'back',
    rightContent: 'settings',
    variant: 'game'
  }
};

export const TransparentVariant: Story = {
  args: {
    ...Default.args,
    title: "투명 앱바",
    variant: 'transparent',
    hasShadow: false,
    hasBorder: false
  },
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
        backgroundSize: 'cover',
        color: 'white'
      }}>
        <Story />
      </div>
    )
  ]
};

export const WithLogo: Story = {
  args: {
    ...Default.args,
    centerContent: 'logo'
  }
};

export const Minimal: Story = {
  args: {
    title: "간소화 앱바",
    leftContent: 'back',
    centerContent: 'title',
    rightContent: 'none',
    hasShadow: false
  }
};

export const CustomContent: Story = {
  render: () => (
    <AppBar
      leftContent={<div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full text-white font-bold">C</div>}
      centerContent={<div className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-xl">Custom AppBar</div>}
      rightContent={<div className="flex gap-2">
        <span className="bg-green-500 px-3 py-1 rounded text-xs font-medium">온라인</span>
        <span className="bg-yellow-500 px-3 py-1 rounded text-xs font-medium">75점</span>
      </div>}
      variant="default"
      hasShadow
    />
  )
};
