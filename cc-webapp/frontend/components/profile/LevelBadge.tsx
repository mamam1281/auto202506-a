'use client';

import { Star } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function LevelBadge({ 
  level, 
  size = 'md',
  showIcon = true 
}: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      inline-flex items-center gap-1.5
      bg-gradient-to-r from-purple-500/20 to-blue-500/20
      border border-purple-500/30
      rounded-lg
      text-purple-300
      font-semibold
    `}>
      {showIcon && (
        <Star size={iconSizes[size]} className="text-purple-400" />
      )}
      
      <span>레벨 {level}</span>
    </div>
  );
}
