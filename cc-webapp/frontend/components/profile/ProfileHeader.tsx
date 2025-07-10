'use client';

import { useState } from 'react';
import { Crown, Star, TrendingUp } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import LevelBadge from './LevelBadge';
import RankBadge from './RankBadge';
import ExperienceBar from './ExperienceBar';
import StatusDot from './StatusDot';
import type { ProfileHeaderProps, RANK_COLORS } from './types';

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [showOnlineStatus] = useState(true);

  return (
    <div className="profile-glass-strong rounded-xl p-6 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full filter blur-3xl" />
      
      <div className="relative z-10">
        {/* Top Row: Avatar, Info, Status */}
        <div className="flex items-start gap-4 mb-4">
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
          
          <div className="flex-1 min-w-0">
            {/* 계층화된 텍스트 시스템 - 최상위: 닉네임 */}
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-white truncate leading-tight">
                {user.nickname}
              </h2>
              <RankBadge rank={(user.rank as keyof typeof RANK_COLORS) || 'STANDARD'} size="sm" />
            </div>
            
            {/* 중간 계층: 레벨 + 승리 수 (시각적 강조) */}
            <div className="flex items-center gap-3 mb-3">
              <LevelBadge level={user.level || 1} size="sm" />
              <div className="flex items-center gap-1.5 bg-yellow-500/20 px-2.5 py-1 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                <Star size={16} className="fill-current text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400 leading-none">{user.wins || 0}승</span>
              </div>
            </div>
            
            {/* 하위 계층: 연속접속 (텍스트 계층화 개선) */}
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-orange-400" />
              <span className="text-xs font-medium text-gray-400">연속 접속</span>
              <span className="text-lg font-bold text-orange-400">{user.loginStreak || 0}일</span>
              <span className="text-lg">🔥</span>
            </div>
          </div>
        </div>

        {/* Experience Bar Section - 계층화된 텍스트 */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="text-sm font-semibold text-gray-300">경험치</span>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
              Lv.{user.level || 1}
            </span>
          </div>
          
          <ExperienceBar
            current={user.experience || 0}
            required={user.experienceRequired || 1000}
            showValues={true}
            showIcon={false}
            height="md"
          />
        </div>
      </div>
    </div>
  );
}
