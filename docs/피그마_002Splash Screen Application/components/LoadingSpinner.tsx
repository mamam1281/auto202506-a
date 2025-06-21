import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'modern' | 'classic' | 'dots';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'modern', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  if (variant === 'modern') {
    return (
      <div className={`${baseClasses} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-1 rounded-full border border-primary/40 animate-pulse"></div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`${baseClasses} flex space-x-1 justify-center items-center`}>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} animate-spin rounded-full border-2 border-primary/20 border-t-primary`}></div>
  );
};