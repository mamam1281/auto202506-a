import { Suspense } from 'react';

// 임시 ProfileContainer 컴포넌트 (실제 컴포넌트 경로 문제 해결 전까지)
const ProfileContainer = () => (
  <div className="profile-container space-y-6">
    <div className="profile-glass-strong rounded-xl p-6">
      <h1 className="text-2xl font-bold text-white mb-4">프로필 대시보드</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="profile-glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground">토큰</div>
          <div className="text-xl font-bold text-yellow-400">1,500💎</div>
        </div>
        <div className="profile-glass rounded-xl p-4">
          <div className="text-sm text-muted-foreground">레벨</div>
          <div className="text-xl font-bold text-blue-400">15</div>
        </div>
      </div>
    </div>
    
    <div className="profile-glass rounded-xl p-4">
      <h2 className="text-lg font-semibold text-white mb-3">미션</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <span className="text-white">첫 게임 플레이</span>
          <span className="text-yellow-400">50💎</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <span className="text-white">주간 승리 달성</span>
          <span className="text-yellow-400">200💎</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <button className="w-full h-12 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-bold">
        게임 시작
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button className="h-10 bg-muted/20 rounded-xl text-white">설정</button>
        <button className="h-10 bg-muted/20 rounded-xl text-white">본사 사이트</button>
      </div>
    </div>
  </div>
);

// 로딩 스켈레톤 컴포넌트
const ProfileViewLoadingSkeleton = () => (
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

export default function ProfileViewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Suspense fallback={<ProfileViewLoadingSkeleton />}>
          <ProfileContainer />
        </Suspense>
      </div>
    </div>
  );
}
