'use client';

import { Suspense } from 'react';
import ProfileContainer from '../../components/profile/ProfileContainer';
import GamePopupLayout from '../../components/GamePopupLayout';

function PopupLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-[var(--color-primary-charcoal)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-purple-primary)] mx-auto mb-3"></div>
        <p className="text-[var(--color-text-secondary)] text-sm">프로필 로딩 중...</p>
      </div>
    </div>
  );
}

function ProfilePopupContent() {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-[var(--color-primary-dark-navy)] via-[var(--color-primary-charcoal)] to-[var(--color-primary-dark-navy)] p-0">
      <div className="w-full max-w-[420px] mx-auto h-full flex flex-col">
        <ProfileContainer />
      </div>
    </div>
  );
}

export default function ProfilePopupPage() {
  return (
    <GamePopupLayout>
      <Suspense fallback={<PopupLoadingSkeleton />}>
        <ProfilePopupContent />
      </Suspense>
    </GamePopupLayout>
  );
}
