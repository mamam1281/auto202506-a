'use client';

import { Crown, Shield, Gem, Code } from 'lucide-react';
import { RANK_COLORS, RANK_LABELS } from './types';

interface RankBadgeProps {
  rank: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function RankBadge({ 
  rank, 
  size = 'md',
  showIcon = true 
}: RankBadgeProps) {
  const rankKey = rank.toUpperCase() as keyof typeof RANK_COLORS;
  const colors = RANK_COLORS[rankKey] || RANK_COLORS.STANDARD;
  const label = RANK_LABELS[rankKey] || rank;

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

  const getRankIcon = () => {
    switch (rankKey) {
      case 'VIP':
        return Crown;
      case 'PREMIUM':
        return Gem;
      case 'DEV':
        return Code;
      default:
        return Shield;
    }
  };

  const IconComponent = getRankIcon();

  return (
    <div className={`
      ${sizeClasses[size]}
      ${colors.bg}
      ${colors.text}
      ${colors.border}
      inline-flex items-center gap-1.5
      border
      rounded-lg
      font-semibold
    `}>
      {showIcon && (
        <IconComponent size={iconSizes[size]} />
      )}
      
      <span>{label}</span>
    </div>
  );
}
