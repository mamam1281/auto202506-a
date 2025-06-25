"use client";

import React from 'react';

interface CustomProgressProps {
  value?: number; // 0-100 사이의 값
  type?: 'determinate' | 'indeterminate';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CustomProgress: React.FC<CustomProgressProps> = ({
  value = 0,
  type = 'determinate',
  animated = true,
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const progressBarClass = `
    custom-progress-bar
    ${animated ? 'animated' : ''}
    ${type === 'indeterminate' ? 'indeterminate' : ''}
  `.trim();

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white" style={{fontFamily: "var(--font-primary)"}}>
            {label || 'Progress'}
          </span>
          {type === 'determinate' && (
            <span className="text-sm text-white/70" style={{fontFamily: "var(--font-primary)"}}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`custom-progress ${sizeClasses[size]}`}>
        <div
          className={progressBarClass + (type === 'indeterminate' ? ' animate-spin' : '')}
          style={{
            width: type === 'determinate' ? `${clampedValue}%` : '100%',
            background: 'var(--color-purple-primary, #5B30F6)',
            boxShadow: '0 0 8px var(--color-accent-amber, #F59E0B)',
          }}
        />
      </div>
    </div>
  );
};

// 원형 프로그레스 컴포넌트
interface CustomCircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
  type?: 'determinate' | 'indeterminate'; // 추가
}

export const CustomCircularProgress: React.FC<CustomCircularProgressProps> = ({
  value = 0,
  size = 80,
  strokeWidth = 8,
  animated = true,
  showLabel = false,
  className = '',
  type = 'determinate', // 추가
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(139, 69, 19, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={(animated && type === 'indeterminate') ? 'transition-all duration-500 ease-out animate-spin' : (animated ? 'transition-all duration-500 ease-out' : '')}
          style={{
            filter: 'drop-shadow(0 0 6px var(--color-accent-amber, #F59E0B))',
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-purple-primary, #5B30F6)" />
            <stop offset="50%" stopColor="var(--color-purple-secondary, #870DD1)" />
            <stop offset="100%" stopColor="var(--color-accent-amber, #F59E0B)" />
          </linearGradient>
        </defs>
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white" style={{fontFamily: "var(--font-primary)"}}>
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
    </div>
  );
};

// 스피너 로더 컴포넌트
interface CustomSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CustomSpinner: React.FC<CustomSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-white/20 border-t-purple-500 animate-spin" />
    </div>
  );
};