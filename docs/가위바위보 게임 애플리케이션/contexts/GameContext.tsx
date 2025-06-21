'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { GameSettings, GameStats, GameScore, GameResult } from '@/types/game';

interface GameContextState {
  settings: GameSettings;
  stats: GameStats;
  isLoading: boolean;
  error: string | null;
}

interface GameContextActions {
  updateSettings: (settings: Partial<GameSettings>) => void;
  updateStats: (result: GameResult, score: GameScore) => void;
  resetStats: () => void;
  setError: (error: string | null) => void;
}

type GameContextType = GameContextState & GameContextActions;

const GameContext = createContext<GameContextType | undefined>(undefined);

// 기본값
const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  theme: 'dark',
  difficulty: 'medium'
};

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  winRate: 0,
  longestWinStreak: 0,
  currentWinStreak: 0,
  favoriteChoice: null,
  averageGameTime: 0
};

// 액션 타입
type GameAction =
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'UPDATE_STATS'; payload: { result: GameResult; score: GameScore } }
  | { type: 'RESET_STATS' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE'; payload: { settings: GameSettings; stats: GameStats } };

// 리듀서
const gameReducer = (state: GameContextState, action: GameAction): GameContextState => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'UPDATE_STATS': {
      const { result, score } = action.payload;
      const totalGames = score.player + score.ai + score.draws;
      const winRate = totalGames > 0 ? (score.player / totalGames) * 100 : 0;
      
      // 연승 계산
      let currentWinStreak = state.stats.currentWinStreak;
      if (result === 'win') {
        currentWinStreak += 1;
      } else if (result === 'lose') {
        currentWinStreak = 0;
      }

      const longestWinStreak = Math.max(state.stats.longestWinStreak, currentWinStreak);

      return {
        ...state,
        stats: {
          ...state.stats,
          totalGames,
          winRate,
          currentWinStreak,
          longestWinStreak
        }
      };
    }

    case 'RESET_STATS':
      return {
        ...state,
        stats: DEFAULT_STATS
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'INITIALIZE':
      return {
        ...state,
        settings: action.payload.settings,
        stats: action.payload.stats,
        isLoading: false
      };

    default:
      return state;
  }
};

// 초기 상태
const initialState: GameContextState = {
  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,
  isLoading: true,
  error: null
};

// 프로바이더 컴포넌트
interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSettings = localStorage.getItem('rps-settings');
        const savedStats = localStorage.getItem('rps-stats');

        const settings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
        const stats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS;

        dispatch({
          type: 'INITIALIZE',
          payload: { settings, stats }
        });
      } catch (error) {
        console.error('Failed to load game data:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: '게임 데이터를 불러오는데 실패했습니다.'
        });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // 설정 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('rps-settings', JSON.stringify(state.settings));
    }
  }, [state.settings, state.isLoading]);

  // 통계 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('rps-stats', JSON.stringify(state.stats));
    }
  }, [state.stats, state.isLoading]);

  // 액션 함수들
  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const updateStats = useCallback((result: GameResult, score: GameScore) => {
    dispatch({ type: 'UPDATE_STATS', payload: { result, score } });
  }, []);

  const resetStats = useCallback(() => {
    dispatch({ type: 'RESET_STATS' });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const contextValue: GameContextType = {
    ...state,
    updateSettings,
    updateStats,
    resetStats,
    setError
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// 훅
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};