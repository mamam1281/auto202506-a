'use client';

import { Calendar, Flame } from 'lucide-react';

interface StreakIndicatorProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function StreakIndicator({ 
  streak, 
  size = 'md',
  showLabel = true,
  animated = true 
}: StreakIndicatorProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400';
    if (streak >= 14) return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400';
    if (streak >= 7) return 'from-yellow-500/20 to-green-500/20 border-yellow-500/30 text-yellow-400';
    return 'from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-400';
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      inline-flex items-center gap-2
      bg-gradient-to-r ${getStreakColor()}
      border rounded-xl
      font-bold
      ${animated ? 'animate-pulse' : ''}
    `}>
      {streak >= 7 ? (
        <Flame size={iconSizes[size]} className={animated ? 'animate-bounce' : ''} />
      ) : (
        <Calendar size={iconSizes[size]} />
      )}
      
      <span>{streak}일</span>
      
      {showLabel && (
        <span className="text-xs opacity-80">연속</span>
      )}
    </div>
  );
}
