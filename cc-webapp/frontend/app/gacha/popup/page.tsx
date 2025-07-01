'use client';

import { Suspense } from 'react';
import GamePopupLayout from '../../../components/GamePopupLayout';
import { GachaBox } from '../../../components/games/gacha/GachaBox';
import { TicketProvider } from '../../../components/games/gacha/TicketContext';
import '../../../styles/gacha-popup.css';

// 팝업 창용 로딩 스켈레톤
function PopupLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-3"></div>
        <p className="text-[var(--muted-foreground)] text-sm">가챠 시스템 로딩 중...</p>
      </div>
    </div>
  );
}

// 팝업 창용 가챠 게임 컨텐츠
function GachaGamePopupContent() {
  return (
    <div className="gacha-popup-colorful">
      <div className="w-full max-w-[360px]">
        <Suspense fallback={<PopupLoadingSkeleton />}>
          <GachaBox />
        </Suspense>
      </div>
    </div>
  );
}

// 메인 익스포트 - 팝업 창용 가챠 페이지
export default function GachaPopupPage() {
  return (
    <TicketProvider>
      <GamePopupLayout>
        <GachaGamePopupContent />
      </GamePopupLayout>
    </TicketProvider>
  );
}
