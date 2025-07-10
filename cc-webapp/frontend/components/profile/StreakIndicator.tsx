'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakIndicatorProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export default function StreakIndicator({
  streak,
  size = 'md',
  showLabel = false,
  animated = false,
  className
}: StreakIndicatorProps) {
  const sizes = {
    sm: {
      container: 'gap-1',
      icon: 'w-4 h-4',
      text: 'text-sm',
      label: 'text-xs'
    },
    md: {
      container: 'gap-2',
      icon: 'w-5 h-5',
      text: 'text-base',
      label: 'text-sm'
    },
    lg: {
      container: 'gap-2',
      icon: 'w-6 h-6',
      text: 'text-lg font-bold',
      label: 'text-base'
    }
  };

  const sizeStyles = sizes[size];

  return (
    <div className={cn('flex items-center', sizeStyles.container, className)}>
      <Flame 
        className={cn(
          sizeStyles.icon,
          'text-orange-400',
          animated && 'animate-pulse'
        )} 
      />
      <div className="flex flex-col items-center">
        <span className={cn(sizeStyles.text, 'text-orange-400 font-semibold')}>
          {streak}일
        </span>
        {showLabel && (
          <span className={cn(sizeStyles.label, 'text-muted-foreground')}>
            연속 접속
          </span>
        )}
      </div>
    </div>
  );
}
