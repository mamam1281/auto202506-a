import type { Meta, StoryObj } from '@storybook/react';
import BottomNavigationBar, { navItems } from './BottomNavigationBar';
import React, { useState } from 'react';

const meta: Meta<typeof BottomNavigationBar> = {
  title: 'Layout/BottomNavigationBar',
  component: BottomNavigationBar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BottomNavigationBar>;

export const Default: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState('home');
    return (
      // Converted inline styles to Tailwind classes
      // minHeight: 200 -> min-h-[200px]
      // background: '#222' -> bg-background (using theme's background color)
      <div className="min-h-[200px] bg-background p-4 flex items-center justify-center">
        <BottomNavigationBar
          activeTab={activeTab}
          onTabClick={(tabId) => setActiveTab(tabId)}
        />
      </div>
    );
  },
  args: {
    activeTab: 'home',
    onTabClick: () => {},
  },
};
