import type { Meta, StoryObj } from '@storybook/react';
import AppHeader, { AppHeaderProps } from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  args: {
    appName: 'GamePlatform',
    points: 25000,
    hasNotifications: false,
  },
};

export const WithNotifications: Story = {
  args: {
    appName: 'GamePlatform',
    points: 99999,
    hasNotifications: true,
  },
};

export const MobileNoPoints: Story = {
  args: {
    appName: 'GamePlatform',
    points: 1234,
    hasNotifications: false,
    showPointsOnMobile: false,
  },
};
