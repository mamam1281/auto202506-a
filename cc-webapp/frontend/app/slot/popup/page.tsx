'use client';

import { Suspense } from 'react';
import GamePopupLayout from '../../../components/GamePopupLayout';
import SlotMachine from '../../../components/games/slot/SlotMachine';

// 팝업 창용 로딩 스켈레톤
function PopupLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-primary)] to-[var(--color-surface-secondary)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-purple)] mx-auto mb-3"></div>
        <p className="text-[var(--color-text-secondary)] text-sm">슬롯 머신 로딩 중...</p>
      </div>
    </div>
  );
}

// 팝업 창용 슬롯 게임 컨텐츠
function SlotGamePopupContent() {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-[var(--color-surface-primary)] via-[var(--color-surface-secondary)] to-[var(--color-surface-tertiary)] p-4">
      <div className="w-full max-w-full mx-auto h-full flex flex-col justify-center">
        <SlotMachine className="w-full" />
      </div>
    </div>
  );
}

// 메인 익스포트 - 팝업 창용 심플 슬롯 페이지
export default function SlotPopupPage() {
  return (
    <GamePopupLayout title="슬롯 머신">
      <Suspense fallback={<PopupLoadingSkeleton />}>
        <SlotGamePopupContent />
      </Suspense>
    </GamePopupLayout>
  );
}
