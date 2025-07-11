'use client';

import { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import DailyCheckInModal from './DailyCheckInModal';
import FlashOfferBanner from './FlashOfferBanner';
import MissionCards from './MissionCards';
import ProfileActions from './ProfileActions';
import type { User, ProfileContainerProps, FlashOffer, Mission } from './types';

export default function ProfileContainer({ className = '' }: ProfileContainerProps) {
  // Mock user data
  const [user] = useState<User>({
    id: 1,
    nickname: 'GameMaster',
    cyber_token_balance: 1500,
    rank: 'PREMIUM',
    level: 15,
    experience: 750,
    experienceRequired: 1000,
    wins: 42,
    loginStreak: 8,
    completedMissions: 23,
    email: 'user@example.com'
  });

  // Mock flash offer data
  const [flashOffer] = useState<FlashOffer>({
    id: 'flash-001',
    title: '💎 특별 토큰 패키지',
    description: '500% 보너스 + 무료 스핀',
    discount: 75,
    originalPrice: 19.99,
    salePrice: 4.99,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2시간 후 만료
    isActive: true,
    highlight: '최대 할인'
  });

  // Mock missions data
  const [missions] = useState<Mission[]>([
    {
      id: 'daily-1',
      title: '슬롯 게임 5회 플레이',
      description: '어떤 슬롯 게임이든 5회 플레이하세요',
      type: 'DAILY',
      progress: 3,
      target: 5,
      reward: { type: 'TOKEN', amount: 100 },
      isCompleted: false,
      timeLeft: '8시간 후 초기화'
    },
    {
      id: 'weekly-1',
      title: '주간 승리 목표',
      description: '이번 주에 10번 승리하세요',
      type: 'WEEKLY',
      progress: 7,
      target: 10,
      reward: { type: 'TOKEN', amount: 500 },
      isCompleted: false,
      timeLeft: '3일 남음'
    },
    {
      id: 'special-1',
      title: '럭키 잭팟 이벤트',
      description: '잭팟 게임에서 큰 상금을 획득하세요',
      type: 'SPECIAL',
      progress: 0,
      target: 1,
      reward: { type: 'SPECIAL', amount: 1000 },
      isCompleted: false,
      timeLeft: '이벤트 종료까지 5일'
    }
  ]);

  // Modal states
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showFlashOffer, setShowFlashOffer] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  // Check if user should see daily check-in modal
  useEffect(() => {
    const storedLastCheckIn = localStorage.getItem('lastCheckIn');
    if (storedLastCheckIn) {
      setLastCheckIn(storedLastCheckIn);
    }
  }, []);

  const handleDailyCheckInClaim = (day: number) => {
    const today = new Date().toISOString();
    localStorage.setItem('lastCheckIn', today);
    setLastCheckIn(today);
    setShowDailyCheckIn(false);
    console.log(`Day ${day} claimed!`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Handle logout logic - 제거됨
  };

  const handleMissionClick = (mission: Mission) => {
    console.log('Mission clicked:', mission.title);
    // Handle mission interaction
  };

  const handleVisitSite = () => {
    console.log('Visiting main site...');
    window.open('https://casinoclub.com', '_blank');
  };

  return (
    <div className={`profile-container min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 ${className}`}>
      {/* 420px 너비 최적화 컨테이너 - 좌우 패딩 16px로 최대 콘텐츠 공간 확보 */}
      <div className="w-full max-w-[420px] min-h-screen mx-auto px-4 pt-6 pb-8 
                      overflow-y-auto overscroll-y-contain
                      scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        
        {/* Flash Offer Banner - 최우선 노출 */}
        {showFlashOffer && (
          <section className="mb-6">
            <FlashOfferBanner 
              offer={flashOffer}
              onClose={() => setShowFlashOffer(false)}
              onClaim={(offerId) => console.log('Flash offer claimed:', offerId)}
              onVisitSite={handleVisitSite}
            />
          </section>
        )}

        {/* 메인 컨텐츠 - 데일리 모달과 동일한 간격 (space-y-6) */}
        <main className="space-y-6">
          {/* 프로필 헤더 */}
          <section>
            <ProfileHeader user={user} />
          </section>

          {/* 프로필 통계 및 빠른 액션 */}
          <section>
            <ProfileStats user={user} />
          </section>

          {/* 데일리 체크인 버튼 - 데일리 모달과 동일한 스타일 */}
          <section>
            <div className="rounded-xl py-6 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20"
                 style={{ paddingLeft: '16px', paddingRight: '16px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
              <div className="relative z-10 text-center space-y-4">
                <h3 className="text-lg font-bold text-white">일일 보상</h3>
                <button 
                  onClick={() => setShowDailyCheckIn(true)}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 
                             text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500
                             transform hover:scale-105 active:scale-95 transition-all duration-200
                             shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base"
                >
                  🎁 데일리 체크인
                </button>
              </div>
            </div>
          </section>

          {/* 미션 카드 섹션 */}
          <section>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white px-2">오늘의 미션</h3>
              <MissionCards 
                missions={missions}
                onMissionClick={handleMissionClick}
                onVisitSite={handleVisitSite}
              />
            </div>
          </section>

          {/* 프로필 액션 버튼들 */}
          <section>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white px-2">빠른 액션</h3>
              <ProfileActions />
            </div>
          </section>
        </main>

        {/* 하단 여백 - 스크롤 공간 확보 */}
        <div className="h-8" />
      </div>

      {/* 데일리 체크인 모달 */}
      <DailyCheckInModal
        isOpen={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
        onClaim={handleDailyCheckInClaim}
        currentStreak={user.loginStreak || 0}
        lastCheckIn={lastCheckIn}
        todayReward={50}
      />
    </div>
  );
}
