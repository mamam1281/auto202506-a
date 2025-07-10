'use client';

import { useEffect, useState } from 'react';
import ProfileContainer from '../../../components/profile/ProfileContainer';
import { Loader } from 'lucide-react';

function ProfilePopupLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center w-full h-screen max-w-md mx-auto bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-black">
      <div className="flex flex-col items-center gap-4">
        <Loader size={36} className="text-primary animate-spin" />
        <p className="text-white/70 text-lg">프로필 불러오는 중...</p>
      </div>
    </div>
  );
}

export default function ProfilePopupPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 프로필 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProfilePopupLoadingSkeleton />;
  }

  return (
    <div className="w-full h-screen max-w-md mx-auto bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-black p-2 sm:p-4 overflow-y-auto">
      <ProfileContainer className="popup-mode" />
    </div>
  );
}
