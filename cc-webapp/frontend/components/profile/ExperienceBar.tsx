'use client';

import { TrendingUp } from 'lucide-react';

interface ExperienceBarProps {
  current: number;
  required: number;
  showValues?: boolean;
  showIcon?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export default function ExperienceBar({ 
  current, 
  required,
  showValues = true,
  showIcon = true,
  height = 'md'
}: ExperienceBarProps) {
  const percentage = Math.min((current / required) * 100, 100);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(showValues || showIcon) && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {showIcon && (
              <TrendingUp size={16} className="text-blue-400" />
            )}
            <span className="text-sm text-white font-medium">경험치</span>
          </div>
          
          {showValues && (
            <span className="text-xs text-gray-400">
              {current.toLocaleString()} / {required.toLocaleString()}
            </span>
          )}
        </div>
      )}
      
      <div className={`
        ${heightClasses[height]}
        w-full bg-gray-700 rounded-full overflow-hidden
      `}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showValues && (
        <div className="text-center mt-1">
          <span className="text-xs text-blue-400 font-medium">
            {percentage.toFixed(1)}% 완료
          </span>
        </div>
      )}
    </div>
  );
}
