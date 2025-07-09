'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../../../components/ui/basic/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import ProfileInfo from '../../../components/auth/ProfileInfo';
import { User } from '../../../components/profile/types';
import { DailyCheckInModal } from '../../../components/profile/DailyCheckInModal';
import { isPopupWindow } from '../../../utils/gamePopup';
import '../../../styles/auth.css';

// 토스트 라이브러리가 없으므로 간단한 대체 함수 만들기
const toast = {
  success: (message: string) => console.log(`Success toast: ${message}`),
  info: (message: string) => console.log(`Info toast: ${message}`)
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopup, setIsPopup] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  
  // 클라이언트 측에서만 팝업 여부를 확인
  useEffect(() => {
    setIsPopup(isPopupWindow());
  }, []);

  // Mock API 호출 함수 - 도파민 루프 요소들 포함
  const fetchUserProfile = async (): Promise<User | null> => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      // 로그인하지 않은 경우에도 null을 반환하도록 변경
      return null;
    }
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('프로필 정보를 가져오는데 실패했습니다');
      }
      
      const data = await response.json();
      
      // API 응답을 새로운 User 타입으로 변환
      return {
        id: data.id.toString(),
        email: data.email || 'user@example.com',
        nickname: data.nickname,
        rank: data.rank || 'STANDARD',
        cyberTokens: data.cyber_token_balance,
        accountNumber: data.id.toString().padStart(8, '0'),
        createdAt: data.created_at || new Date().toISOString(),
        lastLoginAt: data.last_login_at || new Date().toISOString(),
        level: data.level || 1,
        experience: data.experience || 0,
        experienceToNext: data.experience_to_next || 1000,
        loginStreak: data.login_streak || 1,
        maxStreak: data.max_streak || 1,
        lastCheckIn: data.last_check_in
      };
    } catch (error) {
      console.error('프로필 데이터 변환 오류:', error);
      throw error;
    }
  };

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : '프로필 정보를 불러오는데 실패했습니다';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleStartGame = () => {
    toast.success('게임을 시작합니다! 🎮');
    // 게임 시작 로직 구현
  };

  const handleOpenSettings = () => {
    toast.info('설정 페이지로 이동합니다.');
    // 설정 페이지 이동 로직 구현
  };

  const handleVisitSite = () => {
    // 본사 사이트로의 이동 - 도파민 루프의 핵심
    const siteUrl = 'https://your-main-site.com';
    toast.success('본사 사이트로 이동합니다! 💎');
    window.open(siteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    toast.success('로그아웃되었습니다.');
    window.location.href = '/login';
  };
  
  const handleDailyCheckIn = () => {
    setShowDailyCheckIn(true);
  };
  
  const handleClaimReward = (day: number) => {
    const todayReward = [50, 75, 100, 150, 200, 300, 500][day - 1] || 100;
    toast.success(`${todayReward}💎를 획득했습니다!`);
    setShowDailyCheckIn(false);
    
    // 더미 사용자 데이터를 업데이트하는 로직을 여기에 추가할 수 있습니다.
    // 실제 구현에서는 API 호출을 통해 사용자 데이터를 업데이트합니다.
  };
  
  const handleChatAction = (action: string, params?: any) => {
    switch (action) {
      case 'openDailyCheckIn':
        handleDailyCheckIn();
        break;
      case 'startGame':
        handleStartGame();
        break;
      default:
        console.log(`Action not implemented: ${action}`, params);
    }
  };

  if (isLoading) {
    return (
      <div className={`auth-container ${isPopup ? 'popup-mode' : ''}`}>
        {/* 물방울 배경 효과를 제거하기 위한 스타일 오버라이드 */}
        <style jsx>{`
          .auth-container::after {
            display: none !important;
            background: none !important;
          }
        `}</style>
        <div className="auth-content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <div>
              <h2 className="text-lg text-white">대시보드 로딩 중</h2>
              <p className="text-sm text-muted">곧 준비될거예요...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`auth-container ${isPopup ? 'popup-mode' : ''}`}>
        {/* 물방울 배경 효과를 제거하기 위한 스타일 오버라이드 */}
        <style jsx>{`
          .auth-container::after {
            display: none !important;
            background: none !important;
          }
        `}</style>
        <div className="auth-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Alert className="auth-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button
                onClick={loadUserProfile}
                className="auth-button"
              >
                다시 시도
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 물방울 배경 효과를 제거하는 스타일
  const noBackgroundEffectStyle = {
    '::after': {
      display: 'none', // 물방울 효과 숨김
      background: 'none'
    }
  };

  // 로그인하지 않은 경우 개발용 더미 데이터 생성
  const dummyUser: User = user || {
    id: 'dev123',
    email: 'dev@example.com',
    nickname: '개발자 테스트',
    rank: 'DEV',
    cyberTokens: 9999,
    accountNumber: 'DEV1234',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    level: 99,
    experience: 9500,
    experienceToNext: 10000,
    loginStreak: 365,
    maxStreak: 365,
    lastCheckIn: new Date().toISOString()
  };

  // 로그인 상태 표시 (개발 환경용)
  const isLoggedIn = !!user;

  return (
    <div 
      className={`auth-container ${isPopup ? 'popup-mode' : ''}`} 
      style={{ 
        position: 'relative',
        background: '#121212',
      }}
    >
      {/* 물방울 배경 효과를 제거하기 위한 스타일 오버라이드 */}
      <style jsx>{`
        .auth-container::after {
          display: none !important;
          background: none !important;
        }
      `}</style>
      
      <div className="auth-content">
        {/* 개발 모드 알림 */}
        {!isLoggedIn && (
          <div className="bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-md mb-4 text-xs">
            <strong>개발 모드:</strong> 로그인하지 않은 상태에서 프로필 페이지를 확인하는 중입니다. 더미 데이터가 표시됩니다.
          </div>
        )}

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="auth-header"
        >
          <h1 className="auth-title">게임 대시보드</h1>
          <p className="auth-subtitle">
            환영합니다, <span className="text-primary">{dummyUser.nickname}</span>님!
            <br />
            <span className="text-yellow-400">연속 {dummyUser.loginStreak}일째 접속 중</span> 🔥
            {!isLoggedIn && <span className="ml-2 bg-purple-500/30 text-purple-300 px-1 py-0.5 rounded text-xs">개발</span>}
          </p>
        </motion.div>

        {/* 상단 네비게이션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-4"
        >
          <Button
            onClick={handleVisitSite}
            className="text-sm text-primary bg-transparent hover:bg-primary/10"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            본사
          </Button>
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="text-sm text-muted bg-transparent hover:bg-muted/10"
            >
              로그아웃
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/login'}
              className="text-sm text-primary bg-primary/20 hover:bg-primary/30"
            >
              로그인
            </Button>
          )}
        </motion.div>
        
        {/* 프로필 정보 - 도파민 루프 요소들 포함 */}
        <div className="relative">
          <ProfileInfo
            profile={{
              id: parseInt(dummyUser.id),
              nickname: dummyUser.nickname,
              cyber_token_balance: dummyUser.cyberTokens,
              rank: dummyUser.rank
            }}
          />
        </div>

        {/* 데일리 체크인 모달 */}
        <DailyCheckInModal
          isOpen={showDailyCheckIn}
          onClose={() => setShowDailyCheckIn(false)}
          onClaim={handleClaimReward}
          currentStreak={dummyUser.loginStreak}
          lastCheckIn={dummyUser.lastCheckIn}
          todayReward={100}
        />

        {/* 불필요한 하단 정보 삭제 */}
      </div>
    </div>
  );
}
