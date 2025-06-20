import { createContext, useContext, useReducer, ReactNode, useMemo, useEffect } from 'react';

// 타입 정의
export interface User {
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
}

export interface Game {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  isActive: boolean;
  playerCount: number;
  rating: number;
  tags: string[];
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentLayout: 'app' | 'game' | 'auth';
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  games: Game[];
  currentGame: Game | null;
  notifications: Notification[];
  settings: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    theme: 'dark' | 'light';
    language: 'ko' | 'en';
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// Action 타입들
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LAYOUT'; payload: 'app' | 'game' | 'auth' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GAMES'; payload: Game[] }
  | { type: 'SET_CURRENT_GAME'; payload: Game | null }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'UPDATE_TOKEN_BALANCE'; payload: number }
  | { type: 'INIT_WITH_MOCK_DATA' };

// Mock 데이터
const mockUser: User = {
  id: "1",
  username: "게이머",
  email: "gamer@example.com",
  level: 12,
  tokenBalance: 25000,
  avatar: undefined,
  stats: {
    gamesPlayed: 150,
    wins: 95,
    losses: 55,
    winRate: 63.3
  }
};

const mockGames: Game[] = [
  {
    id: "1",
    title: "테트리스 마스터",
    category: "퍼즐",
    thumbnail: "https://images.unsplash.com/photo-1606503153255-59d8b8b3e7c5?w=300&h=200&fit=crop",
    description: "클래식 테트리스 게임의 현대적 버전",
    isActive: true,
    playerCount: 1247,
    rating: 4.8,
    tags: ["퍼즐", "아케이드", "싱글플레이어"]
  },
  {
    id: "2", 
    title: "스페이스 슈터",
    category: "액션",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
    description: "우주를 배경으로 한 액션 슈팅 게임",
    isActive: true,
    playerCount: 892,
    rating: 4.5,
    tags: ["액션", "슈팅", "멀티플레이어"]
  }
];

// 초기 상태
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentLayout: 'app',
  sidebarOpen: false,
  loading: false,
  error: null,
  games: [],
  currentGame: null,
  notifications: [],
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'dark',
    language: 'ko'
  }
};

// 리듀서
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_WITH_MOCK_DATA':
      return {
        ...state,
        user: mockUser,
        isAuthenticated: true,
        games: mockGames
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentGame: null
      };
    
    case 'SET_LAYOUT':
      return {
        ...state,
        currentLayout: action.payload,
        sidebarOpen: action.payload === 'game' ? false : state.sidebarOpen
      };
    
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
    
    case 'SET_GAMES':
      return {
        ...state,
        games: action.payload
      };
    
    case 'SET_CURRENT_GAME':
      return {
        ...state,
        currentGame: action.payload
      };
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'UPDATE_TOKEN_BALANCE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          tokenBalance: action.payload
        } : null
      };
    
    default:
      return state;
  }
}

// Context 생성
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    login: (user: User) => void;
    logout: () => void;
    setLayout: (layout: 'app' | 'game' | 'auth') => void;
    toggleSidebar: () => void;
    setSidebar: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    markNotificationRead: (id: string) => void;
    updateSettings: (settings: Partial<AppState['settings']>) => void;
    updateTokenBalance: (balance: number) => void;
    initWithMockData: () => void;
  };
} | null>(null);

// Provider 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 개발용 목 데이터 초기화
  useEffect(() => {
    dispatch({ type: 'INIT_WITH_MOCK_DATA' });
  }, []);

  // 액션 함수들을 useMemo로 메모이제이션
  const actions = useMemo(() => ({
    login: (user: User) => dispatch({ type: 'SET_USER', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    setLayout: (layout: 'app' | 'game' | 'auth') => dispatch({ type: 'SET_LAYOUT', payload: layout }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setSidebar: (open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    markNotificationRead: (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }),
    updateSettings: (settings: Partial<AppState['settings']>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    updateTokenBalance: (balance: number) => dispatch({ type: 'UPDATE_TOKEN_BALANCE', payload: balance }),
    initWithMockData: () => dispatch({ type: 'INIT_WITH_MOCK_DATA' })
  }), []);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    actions
  }), [state, actions]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// 커스텀 훅
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// 개별 훅들
export function useAuth() {
  const { state, actions } = useAppContext();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login: actions.login,
    logout: actions.logout
  };
}

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

export function useNotifications() {
  const { state, actions } = useAppContext();
  return {
    notifications: state.notifications,
    addNotification: actions.addNotification,
    removeNotification: actions.removeNotification,
    markNotificationRead: actions.markNotificationRead
  };
}

export function useSettings() {
  const { state, actions } = useAppContext();
  return {
    settings: state.settings,
    updateSettings: actions.updateSettings
  };
}
