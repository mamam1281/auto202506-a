'use client';

import { useAuth } from '../auth/AuthContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import type { User } from './types';

export default function ProfileContainer() {
  const { user, isAuthenticated, logout } = useAuth();

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

  // user 객체를 User 타입으로 변환
  const userData: User = {
    id: user.id || 0,
    nickname: user.nickname || '익명',
    cyber_token_balance: user.cyber_token_balance || 0,
    rank: user.rank || 'STANDARD',
    level: user.level || 1,
    experience: user.experience || 0,
    experienceRequired: user.experienceRequired || 100,
    tokens: user.tokens || user.cyber_token_balance || 0,
    wins: user.wins || 0,
    loginStreak: user.loginStreak || 0,
    completedMissions: user.completedMissions || 0,
    email: user.email,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* 프로필 헤더 */}
      <ProfileHeader user={userData} />
      
      {/* 프로필 통계 */}
      <ProfileStats user={userData} />
      
      {/* 프로필 액션 */}
      <ProfileActions onLogout={logout} />
    </div>
  );
}
