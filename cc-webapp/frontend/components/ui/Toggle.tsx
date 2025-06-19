'use client';

import React, { forwardRef } from 'react';
import { cn } from './utils';
import styles from './Toggle.module.css';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ 
    className, 
    pressed = false, 
    onPressedChange,
    variant = 'default',
    size = 'md',
    onClick,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onPressedChange?.(!pressed);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.toggle,
          styles[variant],
          styles[size],
          { [styles.pressed]: pressed },
          className
        )}
        aria-pressed={pressed}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Toggle.displayName = 'Toggle';
