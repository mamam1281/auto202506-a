'use client';

import { Suspense } from 'react';
import GamePopupLayout from '../../../components/GamePopupLayout';
import { GachaBox } from '../../../components/games/gacha/GachaBox';
import { TicketProvider } from '../../../components/games/gacha/TicketContext';

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
    <div className="w-full h-full overflow-y-auto bg-[var(--background)] p-4">
      <div className="w-full max-w-full mx-auto h-full flex flex-col justify-center">
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[360px]">
            <Suspense fallback={<PopupLoadingSkeleton />}>
              <GachaBox />
            </Suspense>
          </div>
        </div>
        
        {/* 간단한 설명 */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            티켓을 사용해 아이템을 획득하세요!
          </p>
        </div>
      </div>
    </div>
  );
}

// 메인 익스포트 - 팝업 창용 가챠 페이지
export default function GachaPopupPage() {
  return (
    <TicketProvider>
      <GamePopupLayout title="Lucky Gacha">
        <GachaGamePopupContent />
      </GamePopupLayout>
    </TicketProvider>
  );
}
