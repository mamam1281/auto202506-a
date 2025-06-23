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

const heightClasses: Record<ProgressLoaderSize, string> = {
  sm: 'h-[var(--spacing-1)]', // 8px
  md: 'h-[var(--spacing-2)]', // 16px
  lg: 'h-[var(--spacing-3)]', // 24px
};

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  value,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const trackColor = 'bg-[var(--color-primary-charcoal)]';
  const radius = 'rounded-[var(--radius-md)]';
  let barColor = 'bg-[var(--color-success)]';
  if (variant === 'gradient' || variant === 'striped' || variant === 'pulsing') {
    barColor = 'bg-gradient-purple';
  }
  let barClass = `${barColor} ${radius}`;
  if (variant === 'striped') barClass += ' progress-striped';
  if (variant === 'pulsing') barClass += ' progress-pulsing';

  return (
    <div className={`w-full ${heightClasses[size]} ${trackColor} ${radius} overflow-hidden ${className}`.trim()} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className={`h-full ${barClass}`}
        initial={{ width: '0%' }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ minWidth: 4 }}
      />
    </div>
  );
};
