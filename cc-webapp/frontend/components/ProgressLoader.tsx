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
  // 바 클래스 구성 - 더 명시적 스타일링
  const barClasses = [barColorClass, radiusClass, 'h-full'].join(' ');
  const minWidthClass = "min-w-[4px]";
  
  // 디버깅용 border 추가 (문제 확인 후 제거 가능)
  const debugClass = "border border-white";
  return (
    <div
      className={`w-full ${heightTailwindClasses[size]} ${trackColorClass} ${radiusClass} overflow-hidden ${debugClass} ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`${barClasses} ${minWidthClass} ${debugClass}`}
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
