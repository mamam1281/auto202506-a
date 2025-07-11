'use client';

import { useState } from 'react';
import { Crown, Star, TrendingUp } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import LevelBadge from './LevelBadge';
import RankBadge from './RankBadge';
import SimpleProgressBar from '../SimpleProgressBar';
import StatusDot from './StatusDot';
import type { ProfileHeaderProps, RANK_COLORS } from './types';

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [showOnlineStatus] = useState(true);

  return (
    <div className="rounded-xl p-6 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
      {/* Background decoration - 데일리 모달과 동일한 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full filter blur-3xl" />
      
      <div className="relative z-10">
        {/* 프로필 정보 - 데일리 모달과 동일한 간격 체계 */}
        <div className="flex items-start gap-6 mb-6">
          {/* 아바타와 온라인 상태 */}
          <div className="relative">
            <ProfileAvatar 
              user={user} 
              size="lg" 
              showOnlineStatus={showOnlineStatus} 
            />
            {showOnlineStatus && (
              <div className="absolute -bottom-1 -right-1">
                <StatusDot status="online" size="md" showPulse={true} />
              </div>
            )}
          </div>
          
          {/* 400px 너비를 활용한 정보 배치 */}
          <div className="flex-1 min-w-0">
            {/* 1순위: 닉네임 + 등급 */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-white truncate">
                {user.nickname}
              </h2>
              <RankBadge rank={(user.rank as keyof typeof RANK_COLORS) || 'STANDARD'} size="md" />
            </div>
            
            {/* 2순위: 레벨 + 승리 수 */}
            <div className="flex items-center gap-4 mb-4">
              <LevelBadge level={user.level || 1} size="md" />
              <div className="flex items-center gap-2 bg-amber-500/15 px-4 py-2 rounded-lg border border-amber-400/30 flex-1">
                <Star size={20} className="fill-current text-amber-400" />
                <span className="text-base font-bold text-amber-400">{user.wins || 0}승</span>
              </div>
            </div>
            
            {/* 3순위: 연속접속 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">연속 출석</span>
              <span className="text-xl font-bold text-orange-400">{user.loginStreak || 0}일</span>
              <span className="text-xl">🔥</span>
            </div>
          </div>
        </div>

        {/* 경험치 섹션 - 데일리 모달과 동일한 패딩 */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-white">성장 진행도</span>
            <span className="text-base font-bold text-blue-400 bg-blue-500/20 px-4 py-2 rounded-full">
              Lv.{user.level || 1}
            </span>
          </div>
          
          <SimpleProgressBar
            progress={((user.experience || 0) / (user.experienceRequired || 1000)) * 100}
            size="lg"
            label={`${(user.experience || 0).toLocaleString()} / ${(user.experienceRequired || 1000).toLocaleString()} 경험치`}
            showPercentage={true}
          />
        </div>
      </div>
    </div>
  );
}
