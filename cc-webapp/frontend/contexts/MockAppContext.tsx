'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 모킹된 앱 상태 타입
interface MockAppState {
  // 레이아웃 관련
  sidebarOpen: boolean;
  currentLayout: string;
  
  // 인증 관련
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    level: number;
    tokenBalance: number;
  } | null;
  
  // 알림 관련
  notifications: any[];
}

// 모킹된 앱 컨텍스트 타입
interface MockAppContextType {
  state: MockAppState;
  actions: {
    toggleSidebar: () => void;
    setSidebar: (open: boolean) => void;
    setLayout: (layout: string) => void;
    login: (user: any) => void;
    logout: () => void;
    addNotification: (notification: any) => void;
  };
}

// 모킹된 앱 컨텍스트 생성
const MockAppContext = createContext<MockAppContextType | undefined>(undefined);

// 모킹된 리듀서 액션 타입
type MockAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_LAYOUT'; payload: string }
  | { type: 'LOGIN'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'ADD_NOTIFICATION'; payload: any };

// 모킹된 리듀서
const mockReducer = (state: MockAppState, action: MockAction): MockAppState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload
      };
    case 'SET_LAYOUT':
      return {
        ...state,
        currentLayout: action.payload
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    default:
      return state;
  }
};

// 모킹된 초기 상태
const initialState: MockAppState = {
  sidebarOpen: false,
  currentLayout: 'default',
  isAuthenticated: true,
  user: {
    id: 'mock-user-id',
    username: 'StoryUser',
    level: 7,
    tokenBalance: 1500
  },
  notifications: []
};

// 모킹된 앱 Provider
export const MockAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mockReducer, initialState);

  // 모킹된 actions
  const actions = {
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setSidebar: (open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }),
    setLayout: (layout: string) => dispatch({ type: 'SET_LAYOUT', payload: layout }),
    login: (user: any) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    addNotification: (notification: any) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
  };

  return (
    <MockAppContext.Provider value={{ state, actions }}>
      {children}
    </MockAppContext.Provider>
  );
};

// useAppContext 훅을 대체하기 위한 모킹된 Context 훅
export function useAppContext() {
  const context = useContext(MockAppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// useAuth 훅
export function useAuth() {
  const { state, actions } = useAppContext();
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    login: actions.login,
    logout: actions.logout
  };
}

// useLayout 훅
export function useLayout() {
  const { state, actions } = useAppContext();
  return {
    currentLayout: state.currentLayout,
    sidebarOpen: state.sidebarOpen,
    setLayout: actions.setLayout,
    toggleSidebar: actions.toggleSidebar,
    setSidebar: actions.setSidebar
  };
}

// useNotifications 훅
export function useNotifications() {
  const { state, actions } = useAppContext();
  return {
    notifications: state.notifications,
    addNotification: actions.addNotification
  };
}
