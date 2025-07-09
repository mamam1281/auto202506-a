'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

export default function StatCard({ 
  icon: Icon, 
  label, 
  value,
  color = 'text-blue-400',
  size = 'md',
  clickable = false,
  onClick 
}: StatCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4', 
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const valueClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]}
        glassmorphism rounded-xl
        ${clickable ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}
        hover-lift
      `}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon size={iconSizes[size]} />
        </div>
        
        <div className="flex-1">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">
            {label}
          </p>
          <p className={`${valueClasses[size]} font-bold ${color} mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </div>
  );
}
