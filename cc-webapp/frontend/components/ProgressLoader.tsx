import React from 'react';
import { motion } from 'framer-motion';

export type ProgressLoaderSize = 'sm' | 'md' | 'lg';
export type ProgressLoaderVariant = 'default' | 'gradient' | 'striped' | 'pulsing';

export interface ProgressLoaderProps {
  value: number; // 0~100
  size?: ProgressLoaderSize;
  variant?: ProgressLoaderVariant;
  className?: string;
}

// Using themed spacing keys: h-1, h-2, h-3
const heightTailwindClasses: Record<ProgressLoaderSize, string> = {
  sm: 'h-4', // 16px
  md: 'h-6', // 24px
  lg: 'h-8', // 32px
};

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  value,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  
  // 트랙 배경색 - 어두운 배경
  const trackColorClass = 'bg-muted';
  const radiusClass = 'rounded-md';

  // 프로그레스 바 색상 설정
  let barColorClass = 'bg-success'; // 기본 초록색
  if (variant === 'gradient') {
    barColorClass = 'bg-gradient-purple-primary';
  } else if (variant === 'striped') {
    barColorClass = 'bg-primary progress-striped';
  } else if (variant === 'pulsing') {
    barColorClass = 'bg-accent progress-pulsing';
  }

  const barClasses = [barColorClass, radiusClass, 'h-full'].join(' ');
  const minWidthClass = "min-w-[4px]";

  return (
    <div
      className={`w-full ${heightTailwindClasses[size]} ${trackColorClass} ${radiusClass} overflow-hidden ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`${barClasses} ${minWidthClass}`}
        initial={{ width: '0%' }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};
