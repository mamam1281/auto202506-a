'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import AppHeader from '../components/AppHeader';
import BottomNavigationBar from '../components/BottomNavigationBar';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

// 사이드바 없는 깔끔한 레이아웃 (AppHeader + BottomNav만 유지)
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [activeTab, setActiveTab] = React.useState('home');
  
  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    console.log(`Navigate to ${path} (tab: ${tabId})`);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  return (
    <Provider store={store}>
      <div className="miniapp-container">
        <div className="game-platform-layout flex flex-col min-h-screen">
          {/* AppHeader - 고정 상단 */}
          <div className="miniapp-header">
            <AppHeader
              appName="CasinoClub"
              onProfileClick={handleProfileClick}
              onNotificationsClick={handleNotificationsClick}
              onSettingsClick={handleSettingsClick}
              showTokenBalanceOnMobile={true}
              hasNotifications={false}
            />
          </div>
          
          {/* 메인 콘텐츠 영역 - 고정 크기 컨테이너 */}
          <main className="flex-grow pb-20 pt-[var(--app-header-height-mobile)] md:pt-[var(--app-header-height-desktop)]">
            <div className="miniapp-content min-h-screen">
              {children}
            </div>
          </main>
          
          {/* BottomNavigationBar - 고정 하단 */}
          <div className="miniapp-bottom-nav">
            <BottomNavigationBar
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />
          </div>
        </div>
      </div>
    </Provider>
  );
}
