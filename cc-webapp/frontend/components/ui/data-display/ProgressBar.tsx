// ProgressBar.tsx - 진행도 바
import React from 'react';

interface ProgressBarProps {
  value: number; // 0~100
  color?: 'red' | 'yellow' | 'green' | 'purple';
  className?: string;
}

const colorMap = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  green: 'bg-emerald-400',
  purple: 'bg-purple-500',
};

export default function ProgressBar({ value, color = 'green', className }: ProgressBarProps) {
  return (
    <div className={`w-full h-2 bg-slate-700 rounded-full overflow-hidden ${className || ''}`}> 
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorMap[color]}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
