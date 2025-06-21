'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
export type LoadingSpinnerVariant = 'modern' | 'classic';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'modern',
  className = ''
}) => {
  
  // 8px Grid System 기반 크기 정의
  const sizeClasses = {
    sm: 'w-4 h-4',      // 16px
    md: 'w-6 h-6',      // 24px  
    lg: 'w-8 h-8'       // 32px
  };

  const spinnerSize = sizeClasses[size];

  if (variant === 'modern') {
    return (
      <div className={`${spinnerSize} ${className}`}>
        <motion.div
          className="w-full h-full border-2 border-[#333333] border-t-[#7C3AED] rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
    );
  }

  // Classic variant
  return (
    <div className={`${spinnerSize} ${className}`}>
      <motion.div
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="w-full h-full border-2 border-transparent border-t-[#7C3AED] border-r-[#7C3AED] rounded-full opacity-75" />
      </motion.div>
    </div>
  );
};