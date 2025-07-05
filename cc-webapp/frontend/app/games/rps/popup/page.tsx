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
    <div className="w-full h-full rps-popup-optimized overflow-hidden">
      <div className="w-full h-full">
        <RPSGame />
      </div>
    </div>
  );
}

// 팝업 전용 RPS 페이지
export default function RPSPopupPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Suspense fallback={<PopupLoadingSkeleton />}>
        <RPSGamePopupWrapper />
      </Suspense>
    </div>
  );
}