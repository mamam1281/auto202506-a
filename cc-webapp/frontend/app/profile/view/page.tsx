'use client';

import { useEffect, useState, Suspense } from 'react';
import ProfileContainer from '../../../components/profile/ProfileContainer';
import { Loader } from 'lucide-react';

// 로딩 스켈레톤 컴포넌트
function ProfileViewLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[var(--color-primary-dark-navy)] to-black">
      <div className="flex flex-col items-center gap-4">
        <Loader size={36} className="text-primary animate-spin" />
        <p className="text-white/70 text-lg">프로필 불러오는 중...</p>
      </div>
    </div>
  );
}

export default function ProfileViewPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 프로필 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProfileViewLoadingSkeleton />;
  }

  return (
    <div className="miniapp-container">
      {/* 헤더 */}
      <header className="miniapp-header">
        <div className="glassmorphism-header w-full h-16 flex items-center justify-between px-4">
          <div className="text-white font-bold text-lg">프로필</div>
          <div>
            {/* 헤더 우측 아이콘들 */}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="miniapp-content">
        <div className="w-full max-w-[420px] mx-auto h-full flex flex-col">
          <Suspense fallback={<ProfileViewLoadingSkeleton />}>
            <ProfileContainer />
          </Suspense>
        </div>
      </main>

      {/* 바텀 네비게이션 */}
      <div className="miniapp-bottom-nav">
        <div className="flex items-center justify-around h-full">
          {/* 하단 네비게이션 버튼들 */}
        </div>
      </div>
    </div>
  );
}
}
    </div>
  );
}

export default function ProfileViewPage() {
  return (
    <Suspense fallback={<ProfileViewLoadingSkeleton />}>
      <ProfileViewContent />
    </Suspense>
  );
}
