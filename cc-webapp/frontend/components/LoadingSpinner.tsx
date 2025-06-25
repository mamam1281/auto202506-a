import React from 'react';
import { motion } from 'framer-motion';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingSpinnerVariant = 'modern' | 'classic' | 'dots' | 'pulse';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  className?: string;
  color?: 'primary' | 'accent' | 'white' | 'custom';
  text?: string;
}

// Using theme spacing keys: 다양한 크기 옵션
const sizeTailwindClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'w-6 h-6',   // 24px
  md: 'w-10 h-10', // 40px
  lg: 'w-16 h-16', // 64px
  xl: 'w-24 h-24', // 96px
};

// Using Tailwind border width classes
const borderTailwindClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'border-2',
  md: 'border-[3px]',
  lg: 'border-4',
  xl: 'border-[6px]',
};

// 색상 매핑
const colorClasses = {
  primary: 'border-blue-500',
  accent: 'border-amber-400',
  white: 'border-white',
  custom: 'border-current',
};

// 애니메이션 변형들
const spinAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear" as const,
  },
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const dotsAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'modern',
  className = '',
  color = 'accent',
  text,
}) => {
  const currentSizeClass = sizeTailwindClasses[size];

  // Modern Spinner (기본) - 심플한 2D 갈색 스피너
  if (variant === 'modern') {
    return (
      <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`${currentSizeClass} relative`}
          {...spinAnimation}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(139, 69, 19, 0.6))', // 갈색 glow 효과
          }}
        >
          <div 
            className="w-full h-full rounded-full border-4 absolute inset-0" 
            style={{
              borderColor: 'rgba(139, 69, 19, 0.2)', // 갈색 배경 테두리
              borderTopColor: '#8B4513', // 갈색 활성 부분
              boxShadow: '0 0 16px rgba(139, 69, 19, 0.4)', // 갈색 그림자
            }}
          />
        </motion.div>
        {text && (
          <p className="text-sm font-medium animate-pulse" style={{ color: '#D2B48C' }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Classic Spinner - 심플한 갈색 회전
  if (variant === 'classic') {
    return (
      <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`${currentSizeClass}`}
          {...spinAnimation}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(160, 82, 45, 0.5))', // 갈색 glow
          }}
        >
          <div 
            className="w-full h-full rounded-full border-3" 
            style={{
              borderColor: 'rgba(160, 82, 45, 0.3)', // 갈색 배경
              borderTopColor: '#A0522D', // 갈색 활성 부분
              boxShadow: '0 0 12px rgba(160, 82, 45, 0.3)',
            }}
          />
        </motion.div>
        {text && (
          <p className="text-sm font-medium" style={{ color: '#D2B48C' }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Dots Spinner - 갈색 점들
  if (variant === 'dots') {
    const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`${dotSize} rounded-full`}
              style={{
                backgroundColor: '#8B4513', // 갈색
                boxShadow: '0 0 8px rgba(139, 69, 19, 0.6)', // 갈색 glow
              }}
              animate={dotsAnimation.animate}
              transition={{
                ...dotsAnimation.transition,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm font-medium" style={{ color: '#D2B48C' }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Pulse Spinner - 갈색 맥박
  if (variant === 'pulse') {
    return (
      <div className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`${currentSizeClass} rounded-full flex items-center justify-center border-2`}
          style={{
            backgroundColor: 'rgba(139, 69, 19, 0.2)', // 갈색 배경
            borderColor: 'rgba(139, 69, 19, 0.4)', // 갈색 테두리
            boxShadow: '0 0 16px rgba(139, 69, 19, 0.4)', // 갈색 glow
          }}
          {...pulseAnimation}
        >
          <div 
            className="w-1/2 h-1/2 rounded-full" 
            style={{
              backgroundColor: '#8B4513', // 갈색 중심
              boxShadow: '0 0 8px rgba(139, 69, 19, 0.6)',
            }}
          />
        </motion.div>
        {text && (
          <p className="text-sm font-medium" style={{ color: '#D2B48C' }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};
