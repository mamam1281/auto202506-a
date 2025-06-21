'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/utils';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  /** 카드 변형 */
  variant?: 'default' | 'game' | 'mission' | 'reward' | 'neon' | 'gradient' | 'glass' | 'premium' | 'hero';
  
  /** 카드 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** 클릭 가능 여부 */
  clickable?: boolean;
  
  /** 네온 효과 활성화 */
  neonEffect?: boolean;
  
  /** 애니메이션 활성화 */
  animated?: boolean;
  
  /** 그림자 크기 */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow';
  
  /** 패딩 크기 */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 글래스모피즘 효과 */
  glassMorphism?: boolean;
  
  /** 그라데이션 배경 */
  gradientBg?: boolean;
  
  /** 호버 효과 유형 */
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'rotate' | 'none';
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
  
  /** 자식 요소 */
  children: React.ReactNode;
}

// 고급 애니메이션 variants
const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    rotateY: 0,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  hover: { 
    scale: 1.03, 
    y: -12,
    rotateY: 2,
    boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(123, 41, 205, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
  },
  active: { 
    scale: 0.98, 
    y: -2,
    rotateY: 0,
    boxShadow: '0 8px 30px rgba(135, 13, 209, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
  },
  // 네온 카드 variants
  neonDefault: {
    scale: 1,
    boxShadow: `0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
  },
  neonHover: {
    scale: 1.05,
    boxShadow: `0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3), 0 0 100px rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
  },
  // 게임 카드 variants
  gameDefault: {
    scale: 1,
    rotateX: 0,
    boxShadow: `0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
  },
  gameHover: {
    scale: 1.08,
    rotateX: 5,
    boxShadow: `0 15px 40px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3), 0 0 80px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
  }
};

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  clickable = false,
  neonEffect = false,
  animated = true,
  shadow = 'md',
  padding = 'md',
  glassMorphism = false,
  gradientBg = false,
  hoverEffect = 'lift',
  onClick,
  className = '',
  children,
  ...motionProps
}) => {
  
  // 베이스 스타일 생성
  const getBaseStyles = () => {
    const baseClasses = [
      'relative overflow-hidden rounded-2xl border transition-all duration-300',
      'backdrop-blur-sm',
    ];

    // 크기별 스타일
    switch (size) {
      case 'xs':
        baseClasses.push('min-h-[80px] max-w-xs');
        break;
      case 'sm':
        baseClasses.push('min-h-[120px] max-w-sm');
        break;
      case 'md':
        baseClasses.push('min-h-[160px] max-w-md');
        break;
      case 'lg':
        baseClasses.push('min-h-[200px] max-w-lg');
        break;
      case 'xl':
        baseClasses.push('min-h-[240px] max-w-xl');
        break;
      case '2xl':
        baseClasses.push('min-h-[300px] max-w-2xl');
        break;
    }

    // 패딩 설정
    switch (padding) {
      case 'none':
        baseClasses.push('p-0');
        break;
      case 'xs':
        baseClasses.push('p-2');
        break;
      case 'sm':
        baseClasses.push('p-4');
        break;
      case 'md':
        baseClasses.push('p-6');
        break;
      case 'lg':
        baseClasses.push('p-8');
        break;
      case 'xl':
        baseClasses.push('p-10');
        break;
    }

    // 변형별 기본 스타일
    switch (variant) {
      case 'neon':
        baseClasses.push(
          'bg-slate-900/95 border-purple-500/60',
          'shadow-[0_0_20px_rgba(168,85,247,0.4)]'
        );
        if (neonEffect) {
          baseClasses.push('animate-pulse');
        }
        break;
      case 'glass':
        baseClasses.push(
          'bg-white/5 border-white/10',
          'backdrop-blur-xl',
          'shadow-2xl shadow-black/20'
        );
        break;
      case 'game':
        baseClasses.push(
          'bg-gradient-to-br from-slate-800 to-slate-900',
          'border-amber-500/30',
          'shadow-[0_8px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(255,215,0,0.1)]'
        );
        break;
      case 'premium':
        baseClasses.push(
          'bg-gradient-to-br from-purple-900/90 to-blue-900/90',
          'border-purple-500/50',
          'shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
        );
        break;
      case 'hero':
        baseClasses.push(
          'bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80',
          'border-indigo-500/50',
          'shadow-[0_25px_80px_rgba(0,0,0,0.5)]'
        );
        break;
      default:
        baseClasses.push(
          'bg-white/90 dark:bg-slate-800/90',
          'border-gray-200 dark:border-slate-700',
          'shadow-lg dark:shadow-2xl'
        );
    }

    // 그림자 설정
    switch (shadow) {
      case 'none':
        break;
      case 'glow':
        baseClasses.push('shadow-[0_0_30px_rgba(123,41,205,0.3)]');
        break;
      case '2xl':
        baseClasses.push('shadow-2xl');
        break;
    }

    // 클릭 가능한 카드
    if (clickable) {
      baseClasses.push(
        'cursor-pointer select-none',
        'hover:scale-105 active:scale-95',
        'transform-gpu will-change-transform'
      );
    }

    return baseClasses.join(' ');
  };

  // 애니메이션 variant 선택
  const getAnimationVariant = () => {
    if (!animated) return undefined;
    
    switch (variant) {
      case 'neon':
        return {
          default: cardVariants.neonDefault,
          hover: cardVariants.neonHover,
        };
      case 'game':
        return {
          default: cardVariants.gameDefault,
          hover: cardVariants.gameHover,
        };
      default:
        return cardVariants;
    }
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={cn(getBaseStyles(), className)}
      variants={getAnimationVariant()}
      initial={animated ? "default" : undefined}
      whileHover={animated && clickable ? "hover" : undefined}
      whileTap={animated && clickable ? "active" : undefined}
      onClick={handleClick}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      {...motionProps}
    >
      {/* 글래스모피즘 오버레이 */}
      {glassMorphism && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
      )}
      
      {/* 네온 효과 백그라운드 */}
      {neonEffect && (
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl blur-xl" />
        </div>
      )}
      
      {/* 그라데이션 배경 */}
      {gradientBg && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 rounded-2xl" />
      )}
      
      {/* 게임 카드 특수 효과 */}
      {variant === 'game' && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
        </>
      )}
      
      {/* 프리미엄 카드 효과 */}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl" />
      )}
      
      {/* 컨텐츠 */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* 호버 오버레이 */}
      {clickable && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// 카드 헤더 컴포넌트
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}>
    {children}
  </div>
);

// 카드 제목 컴포넌트
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

// 카드 설명 컴포넌트
export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

// 카드 컨텐츠 컴포넌트
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);

// 카드 푸터 컴포넌트
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={cn('flex items-center p-6 pt-0', className)}>
    {children}
  </div>
);

export default Card;
