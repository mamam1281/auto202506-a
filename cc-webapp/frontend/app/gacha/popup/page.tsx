'use client';

import { Suspense } from 'react';
import { GachaContainer } from '../../../components/games/gacha/GachaContainer';
import GamePopupLayout from '../../../components/GamePopupLayout';

// 팝업 창용 로딩 스켈레톤
function PopupLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-[var(--color-primary-charcoal)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-amber)] mx-auto mb-3"></div>
        <p className="text-[var(--color-text-secondary)] text-sm">가챠 게임 로딩 중...</p>
      </div>
    </div>
  );
}

// 팝업 창용 가챠 게임 페이지
function GachaGamePopupContent() {
  return (
    <div className="gacha-popup-compact w-full h-full overflow-y-auto bg-gradient-to-br from-[var(--color-primary-dark-navy)] via-[var(--color-primary-charcoal)] to-[var(--color-primary-dark-navy)] p-1">
      <div className="w-full max-w-full mx-auto h-full flex flex-col justify-center">
        <GachaContainer />
      </div>
    </div>
  );
}

// 메인 익스포트 - 팝업 창용 가챠 페이지
export default function GachaPopupPage() {
  return (
    <GamePopupLayout>
      <Suspense fallback={<PopupLoadingSkeleton />}>
        <GachaGamePopupContent />
      </Suspense>
    </GamePopupLayout>
  );
}
