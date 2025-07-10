'use client';

import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperienceBarProps {
  current: number;
  required: number;
  showValues?: boolean;
  showIcon?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ExperienceBar({ 
  current, 
  required,
  showValues = true,
  showIcon = true,
  height = 'md',
  className
}: ExperienceBarProps) {
  const percentage = Math.min((current / required) * 100, 100);
  
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showValues && (
        <div className="flex items-center justify-between text-sm">
          {showIcon && <TrendingUp className="w-4 h-4 text-blue-400" />}
          <span className="text-muted-foreground">
            {current.toLocaleString()} / {required.toLocaleString()} XP
          </span>
          <span className="text-blue-400 font-semibold">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-muted/20 rounded-full overflow-hidden',
        heights[height]
      )}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
