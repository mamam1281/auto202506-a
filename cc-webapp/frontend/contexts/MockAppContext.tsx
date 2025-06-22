'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 모킹된 앱 상태 타입과 AppContext와 동일한 인터페이스 사용
interface MockAppState {
  // 레이아웃 관련
  sidebarOpen: boolean;
  currentLayout: 'app' | 'game' | 'auth';
  
  // 인증 관련
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    level: number;
    tokenBalance: number;
    avatar?: string;
    stats: {
      gamesPlayed: number;
      wins: number;
      losses: number;
      winRate: number;
    };
  } | null;
  
  // 게임 관련
  games: any[];
  currentGame: any | null;
  
  // 알림 관련
  notifications: any[];
  
  // 기타
  loading: boolean;
  error: string | null;
  
  // 설정
  settings: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    theme: 'dark' | 'light';
    language: 'ko' | 'en';
  };
}

// 모킹된 앱 컨텍스트 타입
interface MockAppContextType {
  state: MockAppState;
  actions: {
    toggleSidebar: () => void;
    setSidebar: (open: boolean) => void;
    setLayout: (layout: 'app' | 'game' | 'auth') => void;
    login: (user: any) => void;
    logout: () => void;
    addNotification: (notification: any) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateSettings: (settings: Partial<MockAppState['settings']>) => void;
  };
}

// 모킹된 앱 컨텍스트 생성
const MockAppContext = createContext<MockAppContextType | undefined>(undefined);

// 모킹된 리듀서 액션 타입
type MockAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_LAYOUT'; payload: 'app' | 'game' | 'auth' }
  | { type: 'LOGIN'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<MockAppState['settings']> };

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
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    default:
      return state;
  }
};

// 모킹된 초기 상태
const initialState: MockAppState = {
  sidebarOpen: false,
  currentLayout: 'app',
  isAuthenticated: true,
  user: {
    id: 'mock-user-id',
    username: 'StoryUser',
    email: 'story@example.com',
    level: 7,
    tokenBalance: 1500,
    avatar: undefined,
    stats: {
      gamesPlayed: 52,
      wins: 30,
      losses: 22,
      winRate: 57.7
    }
  },
  notifications: [],
  games: [],
  currentGame: null,
  loading: false,
  error: null,
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'dark',
    language: 'ko'
  }
};

// 모킹된 앱 Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mockReducer, initialState);
  // 모킹된 actions
  const actions = {
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setSidebar: (open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }),
    setLayout: (layout: 'app' | 'game' | 'auth') => dispatch({ type: 'SET_LAYOUT', payload: layout }),
    login: (user: any) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    addNotification: (notification: any) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    updateSettings: (settings: Partial<MockAppState['settings']>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  };

  return (
    <MockAppContext.Provider value={{ state, actions }}>
      {children}
    </MockAppContext.Provider>
  );
};

// MockAppProvider는 AppProvider와 동일한 구현을 가진 별칭
export const MockAppProvider = AppProvider;

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

// useSettings 훅
export function useSettings() {
  const { state, actions } = useAppContext();
  return {
    settings: state.settings,
    updateSettings: actions.updateSettings
  };
}

// useGames 훅
export function useGames() {
  const { state } = useAppContext();
  return {
    games: state.games,
    currentGame: state.currentGame
  };
}

// useLoading 훅
export function useLoading() {
  const { state, actions } = useAppContext();
  return {
    loading: state.loading,
    error: state.error,
    setLoading: actions.setLoading,
    setError: actions.setError
  };
}
