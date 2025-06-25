import React from 'react';
import { motion } from 'framer-motion';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
export type LoadingSpinnerVariant = 'modern' | 'classic';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  className?: string;
}

// Using theme spacing keys: 원래 크기 유지
const sizeTailwindClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'w-8 h-8', // 32px 원래 크기 유지
  md: 'w-20 h-20', // 80px 원래 크기 유지
  lg: 'w-32 h-32', // 128px 원래 크기 유지
};

// Using Tailwind border width classes or arbitrary values - 2배 증가
const borderTailwindClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'border-[4px]', // 2px → 4px (2배)
  md: 'border-[10px]', // 5px → 10px (2배)
  lg: 'border-[16px]', // 8px → 16px (2배)
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'modern',
  className = '',
}) => {
  const currentSizeClass = sizeTailwindClasses[size];
  const currentBorderWidthClass = borderTailwindClasses[size];

  if (variant === 'modern') {
    return (
      <div className={`${currentSizeClass} inline-flex items-center justify-center ${className}`}>
        <div
          className={`loading-spinner w-full h-full rounded-full box-border
                      ${currentBorderWidthClass}
                      border-muted border-t-primary border-r-purple-500`}
        />
      </div>
    );
  }  // classic
  return (
    <div className={`${currentSizeClass} inline-flex items-center justify-center ${className}`}>
      <div
        className={`loading-spinner w-full h-full rounded-full box-border border-solid
                    ${currentBorderWidthClass}
                    border-transparent border-t-amber-500 border-r-yellow-500`}
      />
    </div>
  );
};
