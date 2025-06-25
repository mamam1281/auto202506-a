import { ReactNode } from 'react';
import { cn } from '../ui/utils';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'error' | 'success' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function BaseCard({ 
  children, 
  className, 
  variant = 'default',
  size = 'md'
}: BaseCardProps) {
  const variants = {
    default: 'bg-card border-border hover:bg-muted/50',
    accent: 'bg-accent/10 border-accent/20 hover:bg-accent/15',
    error: 'bg-destructive/10 border-destructive/20 hover:bg-destructive/15',
    success: 'bg-chart-2/10 border-chart-2/20 hover:bg-chart-2/15',
    info: 'bg-chart-1/10 border-chart-1/20 hover:bg-chart-1/15'
  };

  const sizes = {
    sm: 'p-3 rounded-sm',
    md: 'p-4 rounded-md', 
    lg: 'p-6 rounded-lg'
  };

  return (
    <div className={cn(
      'backdrop-blur-sm border transition-all duration-300',
      'shadow-lg hover:shadow-xl transform hover:-translate-y-1',
      'relative overflow-hidden',
      variants[variant],
      sizes[size],
      className
    )}>
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}