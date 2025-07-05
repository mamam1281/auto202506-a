'use client';

import { useState } from 'react';
import { openGamePopup } from '../../../utils/gamePopup';

export default function RoulettePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    const popup = openGamePopup('roulette');
    if (popup) {
      setIsPopupOpen(true);
      
      // 팝업이 닫힐 때 상태 업데이트
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setIsPopupOpen(false);
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen vh-optimized bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-[var(--color-primary-charcoal)] flex flex-col items-center justify-center p-4">
      <div className="glass-card p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">룰렛 게임</h1>
        
        <p className="text-[var(--color-text-secondary)] mb-8">
          행운의 룰렛 게임을 팝업 창에서 즐기세요!
        </p>
        
        <button
          onClick={handleOpenPopup}
          disabled={isPopupOpen}
          className={`btn-primary-glow w-full py-3 rounded-lg text-lg font-medium transition-all ${
            isPopupOpen ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {isPopupOpen ? '게임 진행 중...' : '룰렛 게임 시작'}
        </button>
        
        {isPopupOpen && (
          <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">
            팝업 창에서 게임이 실행 중입니다
          </p>
        )}
      </div>
    </div>
  );
}