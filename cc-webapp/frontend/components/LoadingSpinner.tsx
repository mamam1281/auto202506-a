import React from 'react';
import { motion } from 'framer-motion';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
export type LoadingSpinnerVariant = 'modern' | 'classic';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  className?: string;
}

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: 'w-[var(--icon-sm)] h-[var(--icon-sm)]',
  md: 'w-[var(--icon-md)] h-[var(--icon-md)]',
  lg: 'w-[var(--icon-lg)] h-[var(--icon-lg)]',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'modern',
  className = '',
}) => {
  if (variant === 'modern') {
    return (
      <div className={`${sizeClasses[size]} inline-flex items-center justify-center ${className}`}>
        <motion.div
          className="w-full h-full border-2 border-[var(--color-primary-charcoal)] border-t-[var(--ring)] rounded-full box-border"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }
  // classic
  return (
    <div className={`${sizeClasses[size]} inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full border-2 border-transparent border-t-[var(--ring)] border-r-[var(--ring)] rounded-full opacity-75 box-border" />
      </motion.div>
    </div>
  );
};
