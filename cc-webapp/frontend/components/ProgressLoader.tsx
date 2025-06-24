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
  sm: 'h-1', // 8px, maps to var(--spacing-1)
  md: 'h-2', // 16px, maps to var(--spacing-2)
  lg: 'h-3', // 24px, maps to var(--spacing-3)
};

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  value,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  // Assuming 'bg-muted' is a suitable replacement for 'bg-[var(--color-primary-charcoal)]'
  // as --color-primary-charcoal is not in the provided theme.
  const trackColorClass = 'bg-muted';
  const radiusClass = 'rounded-md'; // Maps to var(--radius-md)

  let barColorClass = 'bg-success'; // Maps to var(--color-success)
  if (variant === 'gradient' || variant === 'striped' || variant === 'pulsing') {
    // Assuming 'bg-gradient-purple-primary' is the intended gradient.
    barColorClass = 'bg-gradient-purple-primary';
  }

  let barClasses = [barColorClass, radiusClass, 'h-full'];
  if (variant === 'striped') barClasses.push('progress-striped'); // Assumed to be defined in globals.css
  if (variant === 'pulsing') barClasses.push('progress-pulsing'); // Assumed to be defined in globals.css

  // min-w-[var(--spacing-0-5)] for 4px, or min-w-[4px]
  const minWidthClass = "min-w-[4px]";

  return (
    <div
      className={`w-full ${heightTailwindClasses[size]} ${trackColorClass} ${radiusClass} overflow-hidden ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`${barClasses.join(' ')} ${minWidthClass}`}
        initial={{ width: '0%' }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        // style minWidth removed
      />
    </div>
  );
};
