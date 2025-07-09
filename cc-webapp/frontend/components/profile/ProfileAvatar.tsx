'use client';

import type { User } from './types';

interface ProfileAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineStatus?: boolean;
}

export default function ProfileAvatar({ 
  user, 
  size = 'md',
  showOnlineStatus = false 
}: ProfileAvatarProps) {
  const getInitials = (nickname: string) => {
    return nickname.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  };

  return (
    <div className="relative">
      <div className={`
        ${sizeClasses[size]}
        rounded-full 
        bg-gradient-to-br from-[var(--color-purple-primary)] to-[var(--color-purple-secondary)] 
        flex items-center justify-center 
        text-white font-bold
        border-2 border-white/20
        shadow-elegant
      `}>
        {getInitials(user.nickname)}
      </div>
      
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
}
