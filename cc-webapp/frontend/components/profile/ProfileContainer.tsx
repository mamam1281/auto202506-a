'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import FlashOfferBanner from './FlashOfferBanner';
import { DailyCheckInModal } from './DailyCheckInModal';
import MissionCards from './MissionCards';
import { CJChatBubble } from './CJChatBubble';
import type { User, FlashOffer, Mission, CJMessage, ProfileContainerProps } from './types';

export default function ProfileContainer({ className = '' }: ProfileContainerProps) {
  const { isAuthenticated, logout, userData } = useAuth();

  // Mock user data - replace with actual data fetching
  const [user] = useState<User>(userData || {
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
    },
    {
      id: 'msg-002',
      message: '💰 토큰이 부족해 보이네요. 본사 사이트에서 더 많은 토큰을 획득해보세요!',
      emotion: 'encouraging',
      timestamp: new Date().toISOString(),
      actionSuggestion: {
        text: '토큰 충전하기',
        action: 'visit_site',
        params: { page: 'token_purchase' }
      }
    }
  ]);

  // Modal states
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);

  // Check if user should see daily check-in modal
  useEffect(() => {
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const today = new Date().toDateString();
    
    if (!lastCheckIn || lastCheckIn !== today) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowDailyCheckIn(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
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
    
    switch (action) {
      case 'start_game':
        // Navigate to game
        break;
      case 'visit_site':
        window.open('https://company-site.com', '_blank');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleCJVisitSite = () => {
    window.open('https://company-site.com', '_blank');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            프로필을 보려면 먼저 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-container space-y-6 ${className}`}>
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
        lastCheckIn={localStorage.getItem('lastCheckIn')}
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
