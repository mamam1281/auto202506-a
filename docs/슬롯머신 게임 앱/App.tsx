import React, { useState } from 'react';
import { GameLayout } from './components/GameLayout';
import { GameHeader } from './components/GameHeader';
import { SlotMachine } from './components/SlotMachine';
import { GameFooter } from './components/GameFooter';

export default function App() {
  const [userCoins, setUserCoins] = useState(10000);

  const handleExit = () => {
    // 나가기 기능 구현 (예: 홈으로 이동, 확인 다이얼로그 등)
    console.log('게임 종료');
  };

  const handleCoinsChange = (newCoins: number) => {
    setUserCoins(newCoins);
  };

  return (
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
  );
}