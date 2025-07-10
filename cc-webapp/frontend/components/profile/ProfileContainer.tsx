'use client';

import { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import FlashOfferBanner from './FlashOfferBanner';
import DailyCheckInModal from './DailyCheckInModal';
import MissionCards from './MissionCards';
import type { User, FlashOffer, Mission, CJMessage, ProfileContainerProps } from './types';
import '../../styles/profile.css';

// CJChatBubble 임시 컴포넌트 (실제 구현 전까지만 사용)
const CJChatBubble = ({ user, messages, onActionClick, onVisitSite }: any) => (
  <div className="profile-chat-bubble">
    <div className="profile-chat-bubble-inner">
      <div className="text-white">
        <p>AI 도우미 메시지</p>
      </div>
    </div>
  </div>
);

export default function ProfileContainer({ className = '' }: ProfileContainerProps) {
  // Mock user data - replace with actual data fetching
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
    title: '💎 토큰 2배 충전!',
    description: '지금 충전하면 보너스 토큰 100% 추가 지급!',
    originalPrice: 10000,
    discountPrice: 10000,
    discount: 100,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    isActive: true,
    type: 'TOKEN_BONUS'
  });

  // Mock missions data
  const [missions] = useState<Mission[]>([
    {
      id: 'daily-001',
      title: '첫 게임 플레이',
      description: '오늘 첫 게임을 플레이하세요',
      reward: 50,
      type: 'DAILY',
      progress: 0,
      target: 1,
      completed: false,
      icon: '🎮'
    },
    {
      id: 'weekly-001',
      title: '주간 승리 달성',
      description: '이번 주에 5번 승리하세요',
      reward: 200,
      type: 'WEEKLY',
      progress: 2,
      target: 5,
      completed: false,
      icon: '🏆'
    }
  ]);

  // Mock CJ messages
  const [cjMessages] = useState<CJMessage[]>([
    {
      id: 'msg-001',
      message: '🎉 연속 접속 8일 달성! 대단해요! 오늘도 게임을 즐겨보세요!',
      emotion: 'congratulatory',
      timestamp: new Date().toISOString(),
      actionSuggestion: {
        text: '게임 시작하기',
        action: 'start_game',
        params: { gameType: 'recommended' }
      }
    }
  ]);

  // Modal states
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  // Check if user should see daily check-in modal
  useEffect(() => {
    const storedLastCheckIn = localStorage.getItem('lastCheckIn');
    setLastCheckIn(storedLastCheckIn);

    // 임시: 항상 모달 표시 (테스트용)
    const timer = setTimeout(() => {
      setShowDailyCheckIn(true);
    }, 1000);
    
    return () => clearTimeout(timer);
    
    /* 원래 로직 (필요시 복원)
    const today = new Date().toDateString();
    
    if (!storedLastCheckIn || storedLastCheckIn !== today) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowDailyCheckIn(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    */
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout logic
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.reload();
  };

  const handleFlashOfferClose = () => {
    console.log('Flash offer closed');
  };

  const handleFlashOfferClaim = (offerId: string) => {
    console.log('Flash offer claimed:', offerId);
  };

  const handleFlashOfferVisitSite = () => {
    console.log('Visiting site from flash offer');
    window.open('https://company-site.com/flash-offer', '_blank');
  };

  const handleDailyCheckInClaim = (day: number) => {
    console.log('Daily check-in claimed for day:', day);
    const today = new Date().toDateString();
    localStorage.setItem('lastCheckIn', today);
    setShowDailyCheckIn(false);
  };

  const handleCJActionClick = (action: string, params?: any) => {
    console.log('CJ Action clicked:', action, params);
  };

  const handleCJVisitSite = () => {
    window.open('https://company-site.com', '_blank');
  };

  return (
    <div className={`profile-container max-w-md mx-auto p-3 space-y-4 ${className}`}>
      {/* Flash Offer Banner */}
      <FlashOfferBanner
        offer={flashOffer}
        onClose={handleFlashOfferClose}
        onClaim={handleFlashOfferClaim}
        onVisitSite={handleFlashOfferVisitSite}
      />

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Profile Stats */}
      <ProfileStats user={user} />

      {/* Mission Cards */}
      <MissionCards missions={missions} />

      {/* Profile Actions */}
      <ProfileActions onLogout={handleLogout} />

      {/* Daily Check-in Modal */}
      <DailyCheckInModal
        isOpen={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
        onClaim={handleDailyCheckInClaim}
        currentStreak={user.loginStreak || 0}
        lastCheckIn={lastCheckIn}
        todayReward={50}
      />

      {/* CJ Chat Bubble */}
      <CJChatBubble
        user={user}
        messages={cjMessages}
        onActionClick={handleCJActionClick}
        onVisitSite={handleCJVisitSite}
      />
    </div>
  );
}
