'use client';

import { Suspense } from 'react';
import GamePopupLayout from '../../../../components/GamePopupLayout';
import RPSGame from '../../../../components/games/rps/RPSGame-Popup';
import '../../../../styles/rps-popup-optimized.css';

// 팝업 창용 로딩 스켈레톤
function PopupLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-3"></div>
        <p className="text-muted-foreground text-sm">RPS 게임 로딩 중...</p>
      </div>
    </div>
  );
}

// 팝업 창용 RPS 게임 래퍼
function RPSGamePopupWrapper() {
  return (
    <div className="w-full h-full rps-popup-optimized overflow-hidden">
      <div className="w-full h-full">
        <RPSGame />
      </div>
    </div>
  );
}

// 메인 익스포트 - 팝업 창용 RPS 페이지
export default function RPSPopupPage() {
  return (
    <GamePopupLayout>
      <Suspense fallback={<PopupLoadingSkeleton />}>
        <RPSGamePopupWrapper />
      </Suspense>
    </GamePopupLayout>
  );
}
