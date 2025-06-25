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
          <span className="text-sm font-medium text-white">
            {label || 'Progress'}
          </span>
          {type === 'determinate' && (
            <span className="text-sm text-white/70">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`custom-progress ${sizeClasses[size]}`}>
        <div
          className={progressBarClass}
          style={{
            width: type === 'determinate' ? `${clampedValue}%` : '100%',
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
}

export const CustomCircularProgress: React.FC<CustomCircularProgressProps> = ({
  value = 0,
  size = 80,
  strokeWidth = 8,
  animated = true,
  showLabel = false,
  className = '',
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
          className={animated ? 'transition-all duration-500 ease-out' : ''}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(139, 69, 19, 0.4))', // 갈색 glow
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#D2B48C" />
          </linearGradient>
        </defs>
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
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