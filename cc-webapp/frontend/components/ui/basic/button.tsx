'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[var(--primary)] text-[var(--primary-foreground)] shadow hover:bg-[var(--primary)]/90':
              variant === 'default',
            'bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-sm hover:bg-[var(--destructive)]/90':
              variant === 'destructive',
            'border border-[var(--border)] bg-[var(--background)] shadow-sm hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]':
              variant === 'outline',
            'bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm hover:bg-[var(--secondary)]/80':
              variant === 'secondary',
            'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]':
              variant === 'ghost',
            'text-[var(--primary)] underline-offset-4 hover:underline':
              variant === 'link',
          },
          {
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-10 rounded-md px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
