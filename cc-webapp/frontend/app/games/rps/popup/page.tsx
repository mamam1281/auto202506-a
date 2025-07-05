'use client';

import { Suspense } from 'react';
import RPSGame from '../../../../components/games/rps/RPSGame';
import '../../../../components/games/rps/rps-new-theme.css';

// 팝업 전용 로딩 스켈레톤
function PopupLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-3"></div>
        <p className="text-gray-300 text-sm">RPS 게임 로딩 중...</p>
      </div>
    </div>
  );
}

// 팝업 전용 RPS 게임 래퍼
function RPSGamePopupWrapper() {
  return (
    <div className="w-full h-full rps-popup-optimized overflow-hidden flex items-center justify-center">
      <div className="w-full" style={{
        maxWidth: '380px',
        margin: '0 auto',
        padding: '0',
      }}>
        <RPSGame />
      </div>
    </div>
  );
}

// 팝업 전용 RPS 페이지
export default function RPSPopupPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center" style={{
      background: 'var(--casino-gradient-main)',
      padding: 0,
      overflow: 'hidden'
    }}>
      <Suspense fallback={<PopupLoadingSkeleton />}>
        <RPSGamePopupWrapper />
      </Suspense>
    </div>
  );
}