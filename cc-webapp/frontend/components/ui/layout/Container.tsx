'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence, Variant, Variants } from 'framer-motion';
import { cn } from '../utils/utils';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ContainerVariant = 'default' | 'dark' | 'glass' | 'card' | 'gradient';
export type AnimationPreset = 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';

interface ContainerProps {
  /** 자식 요소 */
  children: ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
  
  /** 컨테이너 크기 */
  size?: ContainerSize;
  
  /** 패딩 적용 여부 */
  padding?: boolean | 'sm' | 'md' | 'lg';
  
  /** 가운데 정렬 여부 */
  centered?: boolean;
  
  /** 애니메이션 적용 여부 */
  animate?: boolean;
  
  /** 애니메이션 프리셋 */
  animationPreset?: AnimationPreset;
  
  /** 배경 스타일 */
  variant?: ContainerVariant;
  
  /** 반응형 클래스 */
  responsive?: boolean;
  
  /** 레이아웃 ID (AnimatePresence용) */
  layoutId?: string;
}

/**
 * 반응형 컨테이너 컴포넌트
 * 피그마_003게임 플랫폼 레이아웃 시스템 참조 구현
 */
export function Container({ 
  children, 
  className, 
  size = 'lg',
  padding = true,
  centered = false,
  animate = false,
  animationPreset = 'fade',
  variant = 'default',
  responsive = true,
  layoutId
}: ContainerProps) {
  // 크기별 클래스 맵핑
  const sizeClasses = {
    sm: 'max-w-md',    // 448px
    md: 'max-w-2xl',   // 672px
    lg: 'max-w-4xl',   // 896px
    xl: 'max-w-6xl',   // 1152px
    '2xl': 'max-w-7xl', // 1280px
    full: 'max-w-full'
  };
  
  // 패딩 클래스
  const paddingClasses: Record<string, string> = {
    'true': 'px-4 sm:px-6 lg:px-8',
    'sm': 'px-2 sm:px-3',
    'md': 'px-4 sm:px-5',
    'lg': 'px-5 sm:px-8 lg:px-10',
    'false': ''
  };
  
  // 배경 스타일 클래스
  const variantClasses = {
    default: '',
    dark: 'bg-slate-900 text-slate-50 shadow-lg',
    glass: 'bg-background/60 backdrop-blur-md border border-slate-200/10',
    card: 'bg-background shadow-xl rounded-xl border border-slate-200/10',
    gradient: 'bg-gradient-to-br from-slate-900 via-[var(--neon-purple-1)] to-slate-900'
  };  // 애니메이션 프리셋 variants
  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const slideVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const zoomVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };
  
  const bounceVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, y: 50, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };
  
  // 현재 선택된 애니메이션 프리셋 가져오기
  const getAnimationVariant = (): Variants => {
    switch(animationPreset) {
      case 'fade': return fadeVariants;
      case 'slide': return slideVariants;
      case 'zoom': return zoomVariants;
      case 'bounce': return bounceVariants;
      default: return fadeVariants;
    }
  };
  // 선택된 variants
  const selectedVariants = animate ? getAnimationVariant() : undefined;
  
  // 패딩 클래스 결정
  const paddingClass = typeof padding === 'boolean' 
    ? (padding ? paddingClasses.true : paddingClasses.false)
    : paddingClasses[padding];

  // 공통 클래스
  const containerClass = cn(
    'mx-auto w-full',
    sizeClasses[size],
    paddingClass,
    centered && 'flex flex-col items-center',
    variantClasses[variant],
    responsive && 'transition-all duration-300',
    className
  );  // 반응형 Wrapper - 타입 안전성을 위해 조건부 렌더링
  const renderContainer = () => {
    if (animate) {
      return (
        <motion.div
          className={containerClass}
          layoutId={layoutId}
          variants={selectedVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      );
    } else {
      return (
        <div className={containerClass}>
          {children}
        </div>
      );
    }
  };

  // AnimatePresence로 감싸서 exit 애니메이션 활성화
  return animate && layoutId ? (
    <AnimatePresence mode="wait">
      {renderContainer()}
    </AnimatePresence>
  ) : renderContainer();
}