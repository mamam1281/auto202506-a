'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RPSGame from '../../../components/games/rps/RPSGame';
import '../../../components/games/rps/rps-new-theme.css';

// 로딩 스켈레톤
function LoadingSkeleton({ isPopup }: { isPopup: boolean }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${isPopup ? 'bg-slate-900' : ''}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-3"></div>
        <p className="text-gray-300 text-sm">RPS 게임 로딩 중...</p>
      </div>
    </div>
  );
}

// RPS 게임 래퍼
function RPSGameWrapper({ isPopup }: { isPopup: boolean }) {
  return (
    <div className={`w-full h-full rps-popup-optimized overflow-hidden ${isPopup ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : ''}`}>
      <div className="w-full h-full">
        <RPSGame />
      </div>
    </div>
  );
}

// URL 파라미터를 확인하는 컴포넌트
function RPSPageContent() {
  const searchParams = useSearchParams();
  const isPopup = searchParams?.get('popup') === 'true' || false;

  return (
    <div className={`${isPopup ? 'w-full h-screen' : 'min-h-screen'} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`}>
      <Suspense fallback={<LoadingSkeleton isPopup={isPopup} />}>
        <RPSGameWrapper isPopup={isPopup} />
      </Suspense>
    </div>
  );
}

// 메인 익스포트 - RPS 페이지 (일반 모드와 팝업 모드 모두 지원)
export default function RPSPage() {
  return (
    <Suspense fallback={<LoadingSkeleton isPopup={false} />}>
      <RPSPageContent />
    </Suspense>
  );
}
