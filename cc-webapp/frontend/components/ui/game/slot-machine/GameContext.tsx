'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Game Context for state management
interface GameContextType {
  userCoins: number;
  setUserCoins: React.Dispatch<React.SetStateAction<number>>;
  gameSettings: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
  };
  setGameSettings: React.Dispatch<React.SetStateAction<{
    soundEnabled: boolean;
    animationsEnabled: boolean;
  }>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [userCoins, setUserCoins] = useState(10000);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    animationsEnabled: true
  });

  // Load saved game state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoins = localStorage.getItem('userCoins');
      const savedSettings = localStorage.getItem('gameSettings');
      
      if (savedCoins) {
        setUserCoins(parseInt(savedCoins, 10));
      }
      
      if (savedSettings) {
        setGameSettings(JSON.parse(savedSettings));
      }
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCoins', userCoins.toString());
      localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
    }
  }, [userCoins, gameSettings]);

  const value = {
    userCoins,
    setUserCoins,
    gameSettings,
    setGameSettings
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
