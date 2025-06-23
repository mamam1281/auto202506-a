'use client';

import React from 'react';
import { GameProvider, useGame } from '../../components/ui/game/slot-machine/GameContext';
import { GameLayout } from '../../components/ui/game/slot-machine/GameLayout';
import { GameHeader } from '../../components/ui/game/slot-machine/GameHeader';
import { SlotMachine } from '../../components/ui/game/slot-machine/SlotMachine';
import { GameFooter } from '../../components/ui/game/slot-machine/GameFooter';

function SlotGameContent() {
  const { userCoins, setUserCoins } = useGame();

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

  return (
    <GameLayout>
      <GameHeader 
        userCoins={userCoins}
        onExit={handleExit}
        className="mb-4"
      />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <SlotMachine
          initialCoins={userCoins}
          onCoinsChange={handleCoinsChange}
        />
      </div>
      
      <GameFooter className="mt-6" />
    </GameLayout>
  );
}

export default function SlotGameClient() {
  return (
    <GameProvider>
      <SlotGameContent />
    </GameProvider>
  );
}
