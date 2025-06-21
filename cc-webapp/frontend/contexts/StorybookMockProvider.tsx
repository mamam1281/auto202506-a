import React, { ReactNode } from 'react';
import { SidebarProvider } from '../components/ui/layout/Sidebar';

// 간단한 Mock 데이터
const mockUser = {
  id: "1",
  username: "테스트유저",
  email: "test@example.com",
  level: 10,
  tokenBalance: 15000,
  stats: {
    gamesPlayed: 100,
    wins: 60,
    losses: 40,
    winRate: 60.0
  }
};

const mockNotifications = [
  {
    id: "1",
    type: "info" as const,
    title: "알림",
    message: "새로운 게임이 추가되었습니다!",
    timestamp: Date.now(),
    read: false
  }
];

// 간단한 Mock Context
const mockContextValue = {
  // Auth
  user: mockUser,
  isAuthenticated: true,
  login: () => {},
  logout: () => {},
  
  // Layout
  currentLayout: 'app' as const,
  sidebarOpen: true,
  setLayout: () => {},
  toggleSidebar: () => {},
  setSidebar: () => {},
  
  // Notifications
  notifications: mockNotifications,
  addNotification: () => {},
  removeNotification: () => {},
  markNotificationRead: () => {},
  
  // Settings
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'dark' as const,
    language: 'ko' as const
  },
  updateSettings: () => {}
};

const MockContext = React.createContext(mockContextValue);

interface StorybookMockProviderProps {
  children: ReactNode;
}

export function StorybookMockProvider({ children }: StorybookMockProviderProps) {
  return (
    <MockContext.Provider value={mockContextValue}>
      <SidebarProvider defaultOpen={true}>
        {children}
      </SidebarProvider>
    </MockContext.Provider>
  );
}

// Mock Hooks
export const useAuth = () => ({
  user: mockUser,
  isAuthenticated: true,
  login: () => {},
  logout: () => {}
});

export const useLayout = () => ({
  currentLayout: 'app' as const,
  sidebarOpen: true,
  setLayout: () => {},
  toggleSidebar: () => {},
  setSidebar: () => {}
});

export const useNotifications = () => ({
  notifications: mockNotifications,
  addNotification: () => {},
  removeNotification: () => {},
  markNotificationRead: () => {}
});

export const useSettings = () => ({
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'dark' as const,
    language: 'ko' as const
  },
  updateSettings: () => {}
});
