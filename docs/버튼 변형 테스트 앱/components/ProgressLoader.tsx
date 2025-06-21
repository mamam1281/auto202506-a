'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export type ProgressLoaderSize = 'sm' | 'md' | 'lg';

export interface ProgressLoaderProps {
  isLoading: boolean;
  duration?: number;
  onComplete?: () => void;
  size?: ProgressLoaderSize;
  className?: string;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  isLoading,
  duration = 3000,
  onComplete,
  size = 'md',
  className = ''
}) => {
  const [progress, setProgress] = useState(0);

  // 8px Grid System 기반 크기 정의
  const sizeClasses = {
    sm: {
      height: 'h-1',     // 4px
      text: 'text-xs'
    },
    md: {
      height: 'h-2',     // 8px
      text: 'text-sm'
    },
    lg: {
      height: 'h-3',     // 12px
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (duration / 50); // 50ms intervals
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 100);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading, duration, onComplete]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Progress Text */}
      <div className="flex justify-between items-center">
        <span className={`${currentSize.text} font-['Exo'] font-medium text-[#D1D5DB]`}>
          업로드 중...
        </span>
        <span className={`${currentSize.text} font-['Exo'] font-medium text-[#7C3AED]`}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className={`w-full bg-[#333333] rounded-full ${currentSize.height} overflow-hidden`}>
        <motion.div
          className={`${currentSize.height} bg-gradient-to-r from-[#6B46C1] via-[#7C3AED] to-[#8B5CF6] rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.1, 
            ease: 'easeOut' 
          }}
        />
      </div>

      {/* Status Text */}
      <div className="text-center">
        {progress < 30 && (
          <span className={`${currentSize.text} text-[#A0A0A0] font-['Exo']`}>
            파일을 준비하고 있습니다...
          </span>
        )}
        {progress >= 30 && progress < 70 && (
          <span className={`${currentSize.text} text-[#A0A0A0] font-['Exo']`}>
            업로드 중입니다...
          </span>
        )}
        {progress >= 70 && progress < 100 && (
          <span className={`${currentSize.text} text-[#A0A0A0] font-['Exo']`}>
            거의 완료되었습니다...
          </span>
        )}
        {progress === 100 && (
          <motion.span 
            className={`${currentSize.text} text-[#10B981] font-['Exo'] font-medium`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            업로드 완료!
          </motion.span>
        )}
      </div>
    </div>
  );
};