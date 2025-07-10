'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileContainer from '../../components/profile/ProfileContainer';
import GamePopupLayout from '../../components/GamePopupLayout';
import TestNavigation from '../../components/TestNavigation';
import { Loader } from 'lucide-react';

// 통합 로딩 스켈레톤 컴포넌트
const ProfileLoadingSkeleton = ({ isPopupMode = false }: { isPopupMode?: boolean }) => {
  if (isPopupMode) {
    // 팝업 모드: 심플한 로딩
    return (
      <div className="flex items-center justify-center w-full h-screen max-w-md mx-auto bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-black">
        <div className="flex flex-col items-center gap-4">
          <Loader size={36} className="text-primary animate-spin" />
          <p className="text-white/70 text-lg">프로필 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 일반 모드: 상세한 스켈레톤
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="container mx-auto py-8 space-y-6">
        {/* Flash Offer Skeleton */}
        <div className="h-20 bg-muted/20 rounded-xl"></div>
        
        {/* Profile Header Skeleton */}
        <div className="h-32 bg-muted/20 rounded-xl"></div>
        
        {/* Profile Stats Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-muted/20 rounded-xl"></div>
          <div className="h-24 bg-muted/20 rounded-xl"></div>
        </div>
        
        {/* Mission Cards Skeleton */}
        <div className="space-y-3">
          <div className="h-20 bg-muted/20 rounded-xl"></div>
          <div className="h-20 bg-muted/20 rounded-xl"></div>
        </div>
        
        {/* Actions Skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-muted/20 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-muted/20 rounded-xl"></div>
            <div className="h-10 bg-muted/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode') || 'view'; // 'popup' | 'view'
  const isPopupMode = mode === 'popup';

  const containerClass = isPopupMode ? 'popup-mode' : '';
  const wrapperPadding = isPopupMode ? 'p-2 sm:p-4' : 'p-4';

  return (
    <GamePopupLayout>
      <div className={`w-full h-full bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-black ${wrapperPadding} overflow-y-auto`}>
        <Suspense fallback={<ProfileLoadingSkeleton isPopupMode={isPopupMode} />}>
          <ProfileContainer className={containerClass} />
        </Suspense>
        
        {/* 개발/테스트용 네비게이션 */}
        {process.env.NODE_ENV === 'development' && <TestNavigation />}
      </div>
    </GamePopupLayout>
  );
}