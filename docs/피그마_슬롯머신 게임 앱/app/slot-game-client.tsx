'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { GameLayout } from '../components/GameLayout';
import { GameHeader } from '../components/GameHeader';
import { SlotMachine } from '../components/SlotMachine';
import { GameFooter } from '../components/GameFooter';

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

export default function SlotGameClient() {
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

  const handleExit = () => {
    // 나가기 기능 구현 (예: 홈으로 이동, 확인 다이얼로그 등)
    if (typeof window !== 'undefined') {
      const confirmExit = window.confirm('정말로 게임을 종료하시겠습니까?');
      if (confirmExit) {
        // 게임 상태 저장 후 홈으로 이동
        localStorage.setItem('userCoins', userCoins.toString());
        console.log('게임 종료');
        // 실제 앱에서는 router.push('/') 등으로 홈으로 이동
      }
    }
  };

  const handleCoinsChange = (newCoins: number) => {
    setUserCoins(newCoins);
  };

  const contextValue: GameContextType = {
    userCoins,
    setUserCoins,
    gameSettings,
    setGameSettings
  };

  return (
    <GameContext.Provider value={contextValue}>
      <GameLayout>
        {/* 게임 헤더 */}
        <GameHeader 
          userCoins={userCoins} 
          onExit={handleExit} 
        />
        
        {/* 메인 게임 영역 */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <SlotMachine 
              userCoins={userCoins}
              onCoinsChange={handleCoinsChange}
            />
          </div>
        </main>
        
        {/* 게임 푸터 */}
        <GameFooter />
      </GameLayout>
    </GameContext.Provider>
  );
}