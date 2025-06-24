'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import AppHeader from '../components/AppHeader';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Sidebar from '../components/Sidebar'; // Import Sidebar
// Import other global context providers here if needed

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

// This component now also serves as AppLayout
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Dummy props for AppHeader and BottomNavigationBar for now
  // These would ideally come from context, router, or other state management
  const [activeTab, setActiveTab] = React.useState('home');
  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    // router.push(path); // Would use Next.js router here
    console.log(`Navigate to ${path} (tab: ${tabId})`);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // router.push('/profile');
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  // Dummy current path for Sidebar active state
  const currentPath = '/'; // This would typically come from usePathname() in Next.js

  return (
    <Provider store={store}>
      <div className="game-platform-layout flex"> {/* Added flex for sidebar layout */}
        <Sidebar currentPath={currentPath} />
        {/* Main content area that will be offset by the sidebar on desktop */}
        <div className="flex-grow flex flex-col md:ml-64"> {/* md:ml-64 to offset fixed sidebar */}
          <AppHeader
            appName="CyberCanvas" // Example App Name
            onProfileClick={handleProfileClick}
            onNotificationsClick={handleNotificationsClick}
            onSettingsClick={handleSettingsClick}
            showTokenBalanceOnMobile={true}
            hasNotifications={false} // Example value
          />
          <main className="flex-grow w-full p-4"> {/* Added some padding to main content area */}
            {children}
          </main>
        </div>
        {/* BottomNavigationBar is outside the flex-grow div for main content to remain fixed at bottom */}
        <BottomNavigationBar
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      </div>
    </Provider>
  );
}
