'use client';

import { ReactNode } from 'react';
import { cn } from '../utils/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

/**
 * 반응형 컨테이너 컴포넌트
 * 통합_반응형_가이드.md 기준으로 구현
 */
export const ResponsiveContainer = ({ 
  children, 
  className,
  maxWidth = 'xl',
  padding = true
}: ResponsiveContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',     // 640px
    md: 'max-w-screen-md',     // 768px  
    lg: 'max-w-screen-lg',     // 1024px
    xl: 'max-w-screen-xl',     // 1280px
    '2xl': 'max-w-screen-2xl', // 1536px
    full: 'max-w-full'
  };
  return (
    <div className={cn(
      'w-full mx-auto',
      maxWidthClasses[maxWidth],
      padding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

/**
 * 반응형 그리드 컴포넌트
 * 통합_반응형_가이드.md의 그리드 시스템 구현
 */
export const ResponsiveGrid = ({
  children,
  columns = { base: 1, sm: 2, lg: 3, xl: 4 },
  gap = 4,
  className
}: ResponsiveGridProps) => {
  const getGridClasses = () => {
    const classes = ['grid'];
    
    // 기본 컬럼 (모바일)
    if (columns.base) {
      classes.push(`grid-cols-${columns.base}`);
    }
    
    // 반응형 컬럼
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);
    
    // 간격
    classes.push(`gap-${gap}`);
    
    return classes;
  };
  return (
    <div className={cn(...getGridClasses(), className)}>
      {children}
    </div>
  );
};

/**
 * 카드별 특화 그리드 컴포넌트들
 */

// 게임 카드 그리드 (4열 -> 2열 -> 1열)
export const GameGrid = ({ children, className }: { children: ReactNode; className?: string }) => (
  <ResponsiveGrid
    columns={{ base: 1, sm: 2, lg: 4 }}
    gap={4}
    className={cn('game-arena-grid', className)}
  >
    {children}
  </ResponsiveGrid>
);

// 미션 카드 그리드 (3열 -> 2열 -> 1열)  
export const MissionGrid = ({ children, className }: { children: ReactNode; className?: string }) => (
  <ResponsiveGrid
    columns={{ base: 1, md: 2, lg: 3 }}
    gap={4}
    className={cn('mission-grid', className)}
  >
    {children}
  </ResponsiveGrid>
);

// 기본 카드 그리드 (3열 -> 2열 -> 1열)
export const CardGrid = ({ children, className }: { children: ReactNode; className?: string }) => (
  <ResponsiveGrid
    columns={{ base: 1, md: 2, lg: 3 }}
    gap={6}
    className={cn('cosmic-hub-grid', className)}
  >
    {children}
  </ResponsiveGrid>
);

export default ResponsiveContainer;
