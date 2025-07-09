'use client';

import type { User } from './types';
import { Coins, Trophy, Calendar, Target } from 'lucide-react';

interface ProfileStatsProps {
  user: User;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    {
      icon: Coins,
      label: '토큰',
      value: (user.tokens || user.cyber_token_balance || 0).toLocaleString(),
      color: 'text-[var(--game-gold)]'
    },
    {
      icon: Trophy,
      label: '승리',
      value: (user.wins || 0).toString(),
      color: 'text-[var(--game-success)]'
    },
    {
      icon: Calendar,
      label: '연속 접속',
      value: `${user.loginStreak || 0}일`,
      color: 'text-[var(--color-yellow-400)]'
    },
    {
      icon: Target,
      label: '완료한 미션',
      value: (user.completedMissions || 0).toString(),
      color: 'text-[var(--color-blue-400)]'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="glassmorphism p-4 rounded-xl hover-lift">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <IconComponent size={20} />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-xs">
                  {stat.label}
                </p>
                <p className={`font-bold text-lg ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
