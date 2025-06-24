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
  sm: 'h-3', // 12px
  md: 'h-4', // 16px
  lg: 'h-5', // 20px
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
  // 바 클래스 구성 - 더 명시적 스타일링
  const barClasses = [barColorClass, radiusClass, 'h-full'].join(' ');
  const minWidthClass = "min-w-[4px]";
    // 테두리 제거(일반적인 개발앱 수준으로 조정)
  const borderClass = "border-0"; // 테두리 없애기
  return (
    <div
      className={`w-full ${heightTailwindClasses[size]} ${trackColorClass} ${radiusClass} overflow-hidden ${borderClass} ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >      <motion.div
        className={`${barClasses} ${minWidthClass}`}
        initial={{ width: '0%' }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          // 인라인 스타일로 백업 (Tailwind가 실패할 경우 대비)
          height: '100%',
          minWidth: '4px',
          borderRadius: 'var(--radius-md)'
        }}
      />
    </div>
  );
};
