'use client';

import type { ProfileHeaderProps } from './types';

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const getInitials = (nickname: string) => {
    return nickname.substring(0, 2).toUpperCase();
  };

  const getRankColor = (rank: string = 'STANDARD') => {
    switch (rank) {
      case 'STANDARD':
        return 'text-[var(--color-blue-400)] bg-[var(--color-blue-400)]/10 border-[var(--color-blue-400)]/20';
      case 'PREMIUM':
        return 'text-[var(--color-orange-400)] bg-[var(--color-orange-400)]/10 border-[var(--color-orange-400)]/20';
      case 'VIP':
        return 'text-[var(--color-purple-400)] bg-[var(--color-purple-400)]/10 border-[var(--color-purple-400)]/20';
      default:
        return 'text-[var(--color-text-secondary)] bg-[var(--color-neutral-medium)]/10 border-[var(--color-neutral-medium)]/20';
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-xl">
      <div className="flex items-center gap-4">
        {/* 아바타 */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-purple-primary)] to-[var(--color-purple-secondary)] flex items-center justify-center text-white font-bold text-lg">
          {getInitials(user.nickname)}
        </div>
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
            {user.nickname}
          </h1>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRankColor(user.rank)}`}>
              {user.rank || 'STANDARD'}
            </span>
            <span className="text-[var(--color-text-secondary)] text-sm">
              레벨 {user.level || 1}
            </span>
          </div>
          
          {/* 경험치 바 */}
          <div className="w-full bg-[var(--color-neutral-dark)] rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[var(--color-purple-primary)] to-[var(--color-purple-secondary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((user.experience || 0) / (user.experienceRequired || 100)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
            <span>{user.experience || 0} XP</span>
            <span>{user.experienceRequired || 100} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
      </div>
    </div>
  );
}
