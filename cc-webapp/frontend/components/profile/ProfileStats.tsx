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

      {/* Special Achievement Banner - Enhanced Layout */}
      {(user.loginStreak || 0) >= 7 && (
        <div className="profile-glass rounded-2xl p-5 bg-gradient-to-r from-orange-500/25 to-red-500/20 border-2 border-orange-400/40 
                        shadow-lg shadow-orange-500/20 transform hover:scale-[1.02] transition-all duration-300">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            {/* Left: Animated Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/30 border border-orange-400/50">
              <Flame size={24} className="text-orange-300 animate-pulse" />
            </div>
            
            {/* Center: Content */}
            <div className="space-y-1">
              <div className="text-lg font-bold text-orange-200">
                🔥 연속 접속 달성!
              </div>
              <div className="text-sm text-orange-300/90 leading-relaxed">
                특별 보너스 획득 가능
              </div>
            </div>
            
            {/* Right: Action Button */}
            <div className="flex items-center justify-center">
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 
                               text-white text-sm font-medium rounded-lg
                               hover:from-orange-400 hover:to-red-400
                               transform hover:scale-105 transition-all duration-200
                               shadow-md">
                수령
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
