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
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-white truncate">
                {user.nickname}
              </h2>
              <RankBadge rank={(user.rank as keyof typeof RANK_COLORS) || 'STANDARD'} size="sm" />
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <LevelBadge level={user.level || 1} size="sm" />
              <div className="flex items-center gap-1 text-sm text-yellow-400">
                <Star size={14} className="fill-current" />
                <span>{user.wins || 0}승</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <TrendingUp size={12} />
              <span>연속 접속 {user.loginStreak || 0}일</span>
            </div>
          </div>
        </div>

        {/* Experience Bar Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 font-medium">경험치</span>
            <span className="text-blue-400 font-semibold">
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
