'use client';

import React, { useEffect } from 'react';
import { closeGamePopup, isPopupWindow } from '../utils/gamePopup';

interface GamePopupLayoutProps {
  children: React.ReactNode;
}

/**
 * 게임 팝업 창 전용 레이아웃
 * 독립적인 팝업 창에서 게임을 실행할 때 사용
 */
export default function GamePopupLayout({ 
  children
}: GamePopupLayoutProps) {
  useEffect(() => {
    // 팝업 창이 아닌 경우 경고
    if (!isPopupWindow()) {
      console.warn('GamePopupLayout should only be used in popup windows');
    }

    // 팝업 창 크기 보고
    const reportPopupSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log(`🎰 슬롯 팝업 크기: 가로 ${width}px × 세로 ${height}px`);
    };

    // 초기 크기 보고
    reportPopupSize();

    // 리사이즈 시 크기 보고
    window.addEventListener('resize', reportPopupSize);

    // ESC 키로 창 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeGamePopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', reportPopupSize);
    };
  }, []);

  return (
    <div className="game-popup-layout">
      {/* 팝업 창 전용 스타일 */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background: var(--color-primary-dark-navy);
          font-family: var(--font-primary);
        }
        
        .game-popup-layout {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-primary-dark-navy);
          color: var(--color-text-primary);
          overflow: hidden;
          padding: 0;
          margin: 0;
        }
        
        .game-popup-content {
          flex: 1; /* 전체 공간 사용 */
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
        }
      `}</style>

      {/* 게임 콘텐츠 - 전체 화면 사용 */}
      <div className="game-popup-content">
        {children}
      </div>
    </div>
  );
}
