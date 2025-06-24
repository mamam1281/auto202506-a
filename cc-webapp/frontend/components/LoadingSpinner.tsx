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
  sm: 'w-8 h-8',
  md: 'w-20 h-20', 
  lg: 'w-32 h-32',
};

const borderWidths: Record<LoadingSpinnerSize, string> = {
  sm: '2px',
  md: '5px',
  lg: '8px',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'modern',
  className = '',
}) => {  if (variant === 'modern') {
    return (
      <div className={`${sizeClasses[size]} inline-flex items-center justify-center ${className}`}>
        <motion.div
          className="w-full h-full rounded-full box-border"
          style={{
            borderWidth: borderWidths[size],
            borderColor: '#1F2937',
            borderTopColor: '#8B5CF6',
            borderRightColor: '#A855F7'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }  // classic
  return (
    <div className={`${sizeClasses[size]} inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >        <div 
          className="w-full h-full rounded-full box-border"
          style={{
            borderWidth: borderWidths[size],
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTopColor: '#F59E0B',
            borderRightColor: '#EAB308'
          }}
        />
      </motion.div>
    </div>
  );
};
