'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { closeGamePopup, isPopupWindow } from '../utils/gamePopup';

interface GamePopupLayoutProps {
  children: React.ReactNode;
  title: string;
  showCloseButton?: boolean;
}

/**
 * 게임 팝업 창 전용 레이아웃
 * 독립적인 팝업 창에서 게임을 실행할 때 사용
 */
export default function GamePopupLayout({ 
  children, 
  title, 
  showCloseButton = true 
}: GamePopupLayoutProps) {
  useEffect(() => {
    // 팝업 창이 아닌 경우 경고
    if (!isPopupWindow()) {
      console.warn('GamePopupLayout should only be used in popup windows');
    }

    // 팝업 창 제목 설정
    document.title = title;

    // ESC 키로 창 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeGamePopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title]);

  const handleCloseClick = () => {
    closeGamePopup();
  };

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
        }
        
        .game-popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--color-primary-charcoal);
          border-bottom: 1px solid var(--border);
          min-height: 40px;
          flex-shrink: 0;
        }
        
        .game-popup-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .game-popup-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .game-popup-close-btn:hover {
          background: var(--color-primary-dark-navy);
          color: var(--color-text-primary);
        }
      `}</style>

      {/* 팝업 헤더 */}
      <div className="game-popup-header">
        <h1 className="text-sm font-semibold truncate flex-1 mr-2">
          {title}
        </h1>
        {showCloseButton && (
          <button
            onClick={handleCloseClick}
            className="game-popup-close-btn"
            title="창 닫기 (ESC)"
            aria-label="창 닫기"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 게임 콘텐츠 */}
      <div className="game-popup-content">
        {children}
      </div>
    </div>
  );
}
