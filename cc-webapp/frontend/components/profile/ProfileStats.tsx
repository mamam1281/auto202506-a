'use client';

import { Coins, Trophy, Flame, Target } from 'lucide-react';
import TokenDisplay from './TokenDisplay';
import StreakIndicator from './StreakIndicator';
import StatCard from './StatCard';
import type { ProfileStatsProps } from './types';

export default function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    {
      icon: Trophy,
      label: '승리',
      value: user.wins || 0,
      color: 'text-yellow-400',
      clickable: true,
      onClick: () => console.log('View wins history')
    },
    {
      icon: Target,
      label: '완료된 미션',
      value: user.completedMissions || 0,
      color: 'text-green-400',
      clickable: true,
      onClick: () => console.log('View mission history')
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Row: Token & Streak */}
      <div className="grid grid-cols-2 gap-4">
        {/* Token Card - Enhanced Visual Hierarchy */}
        <div className="profile-glass rounded-xl p-4 flex items-center justify-center relative overflow-hidden
                        transform hover:scale-105 transition-all duration-300
                        shadow-2xl shadow-yellow-500/30 border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-400/15 to-orange-400/10">
          {/* Gold accent glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-orange-400/15 pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-yellow-400/60 to-orange-400/60 rounded-full blur-md animate-pulse" />
          <div className="relative z-10">
            <TokenDisplay 
              amount={user.cyber_token_balance || 0}
              size="lg"
              showIcon={true}
              showLabel={true}
              onClick={() => console.log('View token history')}
            />
          </div>
        </div>
        
        <div className="profile-glass rounded-xl p-4 flex items-center justify-center">
          <StreakIndicator 
            streak={user.loginStreak || 0}
            size="md"
            showLabel={true}
            animated={true}
          />
        </div>
      </div>

      {/* Bottom Row: Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            size="sm"
            clickable={stat.clickable}
            onClick={stat.onClick}
          />
        ))}
      </div>

      {/* Special Achievement Banner */}
      {(user.loginStreak || 0) >= 7 && (
        <div className="profile-glass rounded-xl p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
          <div className="flex items-center gap-2 text-orange-400">
            <Flame size={18} className="animate-pulse" />
            <span className="text-sm font-semibold">
              🔥 연속 접속 달성! 특별 보너스 획득 가능!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
