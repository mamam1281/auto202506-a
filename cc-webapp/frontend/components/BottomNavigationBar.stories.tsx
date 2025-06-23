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
      <div style={{ minHeight: 200, background: '#222' }}>
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
