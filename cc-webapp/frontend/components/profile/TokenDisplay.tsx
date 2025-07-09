'use client';

import { Coins } from 'lucide-react';

interface TokenDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
}

export default function TokenDisplay({ 
  amount, 
  size = 'md',
  showIcon = true,
  showLabel = true,
  onClick 
}: TokenDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]}
        inline-flex items-center gap-2
        bg-gradient-to-r from-yellow-500/20 to-orange-500/20
        border border-yellow-500/30
        rounded-xl
        text-yellow-400
        font-bold
        ${onClick ? 'cursor-pointer hover:bg-yellow-500/10 transition-colors' : ''}
      `}
      onClick={onClick}
    >
      {showIcon && (
        <Coins size={iconSizes[size]} className="text-yellow-400" />
      )}
      
      {showLabel && (
        <span className="text-xs text-yellow-300 mr-1">토큰</span>
      )}
      
      <span>{amount.toLocaleString()}</span>
    </div>
  );
}
