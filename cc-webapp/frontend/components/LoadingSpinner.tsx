import React from 'react';
import { motion } from 'framer-motion';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
export type LoadingSpinnerVariant = 'modern' | 'classic';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  className?: string;
}

// Using theme spacing keys: 4 (32px), 10 (80px), 16 (128px)
const sizeTailwindClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'w-4 h-4', // w-4 (32px), h-4 (32px) from theme spacing
  md: 'w-10 h-10', // w-10 (80px), h-10 (80px) from theme spacing
  lg: 'w-16 h-16', // w-16 (128px), h-16 (128px) from theme spacing
};

// Using Tailwind border width classes or arbitrary values
const borderTailwindClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'border-2', // 2px
  md: 'border-[5px]', // 5px
  lg: 'border-8', // 8px
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
        <motion.div
          className={`w-full h-full rounded-full box-border
                      ${currentBorderWidthClass}
                      border-muted border-t-primary border-r-[#A855F7]`} // slate-800 -> muted, purple-500 -> primary
          // borderColor: '#1F2937', // border-muted (mapped from slate-800)
          // borderTopColor: '#8B5CF6', // border-t-primary
          // borderRightColor: '#A855F7' // No direct theme color, use arbitrary
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }  // classic
  return (
    <div className={`${currentSizeClass} inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className={`w-full h-full rounded-full box-border border-solid
                      ${currentBorderWidthClass}
                      border-transparent border-t-warning border-r-[#EAB308]`} // amber-500 -> warning
          // borderColor: 'transparent', -> border-transparent
          // borderTopColor: '#F59E0B', -> border-t-warning
          // borderRightColor: '#EAB308' // No direct theme color, use arbitrary
        />
      </motion.div>
    </div>
  );
};
