'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/utils';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'text' 
  | 'ghost'
  | 'error'
  | 'gradient'
  | 'gradient-purple'
  | 'gradient-blue'
  | 'gradient-green'
  | 'gradient-orange'
  | 'gradient-pink'
  | 'glass'
  | 'glass-purple'
  | 'glass-blue'
  | 'neumorphism'
  | 'neumorphism-dark'
  | 'neon'
  | 'neon-purple'
  | 'neon-blue'
  | 'neon-green';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  state = 'default',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  
  // 실제 상태 결정 (loading과 disabled 우선 처리)
  const actualState = loading ? 'loading' : disabled ? 'disabled' : state;
  const isInteractive = !loading && !disabled;
  // 아이콘 및 로딩 스피너 사이즈 (버튼 사이즈에 맞춤)
  const iconSizes = {
    sm: 16,  // Small 버튼용
    md: 20,  // Medium 버튼용  
    lg: 24,  // Large 버튼용
    icon: 20 // 아이콘 전용 버튼용
  };

  // 상용 앱/웹 표준 사이즈 (더 큰 사이즈로 수정)
  const sizeClasses = {
    sm: 'h-10 px-5 py-2 text-sm min-h-[40px] sm:h-9 sm:px-4 sm:py-1.5 sm:min-h-[36px]', // Small 크기 증가
    md: 'h-12 px-7 py-3 text-base min-h-[48px] sm:h-11 sm:px-6 sm:py-2.5 sm:min-h-[44px]', // Medium 크기 증가  
    lg: 'h-14 px-9 py-4 text-lg min-h-[56px] sm:h-13 sm:px-8 sm:py-3.5 sm:min-h-[52px]', // Large 크기 증가
    icon: 'h-12 w-12 p-0 min-h-[48px] min-w-[48px] sm:h-11 sm:w-11 sm:min-h-[44px] sm:min-w-[44px]' // 아이콘 정사각형
  };
  // 아이콘 전용 버튼 크기 (완전 정사각형)
  const iconOnlyClasses = {
    sm: 'h-10 w-10 p-0 min-h-[40px] min-w-[40px] sm:h-9 sm:w-9 sm:min-h-[36px] sm:min-w-[36px]',
    md: 'h-12 w-12 p-0 min-h-[48px] min-w-[48px] sm:h-11 sm:w-11 sm:min-h-[44px] sm:min-w-[44px]',
    lg: 'h-14 w-14 p-0 min-h-[56px] min-w-[56px] sm:h-13 sm:w-13 sm:min-h-[52px] sm:min-w-[52px]',
    icon: 'h-12 w-12 p-0 min-h-[48px] min-w-[48px] sm:h-11 sm:w-11 sm:min-h-[44px] sm:min-w-[44px]'
  };// Primary 버튼 색상 (design token 사용) - 호버시 텍스트 색상 유지
  const primaryClasses = cn(
    'text-white border',
    'disabled:cursor-not-allowed',
    'focus:ring-2 focus:ring-offset-2',
    'bg-[var(--color-amber-500)] border-[var(--color-amber-500)]',
    'hover:brightness-110 hover:border-[var(--color-amber-500)] hover:!text-white',
    'active:brightness-90 active:border-[var(--color-amber-500)] active:!text-white',
    'disabled:bg-[var(--color-slate-400)] disabled:border-[var(--color-slate-400)]',
    'focus:ring-[var(--color-amber-500)]/30 focus:ring-offset-[var(--color-slate-900)]'
  );  // Secondary 버튼 색상 (design token 사용)
  const secondaryClasses = cn(
    'text-white border',
    'disabled:cursor-not-allowed',
    'focus:ring-2 focus:ring-offset-2',
    'bg-[var(--color-slate-600)] border-[var(--color-slate-600)]',
    'hover:brightness-110 hover:border-[var(--color-slate-600)] hover:!text-white',
    'active:brightness-90 active:border-[var(--color-slate-600)] active:!text-white',
    'disabled:bg-[var(--color-slate-400)] disabled:border-[var(--color-slate-400)]',
    'focus:ring-[var(--color-slate-400)]/30 focus:ring-offset-[var(--color-slate-900)]'
  );  // Outline 버튼 색상 (호버시 텍스트 색상 유지)
  const outlineClasses = cn(
    'bg-transparent border-2',
    'disabled:cursor-not-allowed',
    'focus:ring-2 focus:ring-offset-2',
    'text-[var(--color-amber-500)] border-[var(--color-amber-500)]',
    'hover:bg-[var(--color-amber-500)] hover:!text-white hover:border-[var(--color-amber-500)]',
    'active:brightness-90 active:border-[var(--color-amber-500)] active:!text-white active:bg-[var(--color-amber-500)]',
    'disabled:border-[var(--color-slate-400)] disabled:text-[var(--color-slate-400)]',
    'focus:ring-[var(--color-amber-500)]/30 focus:ring-offset-[var(--color-slate-900)]'
  );// Text 버튼 색상 (텍스트 유지)
  const textClasses = cn(
    'bg-transparent border border-transparent',
    'disabled:cursor-not-allowed',
    'focus:ring-2 focus:ring-offset-2',
    'text-[var(--color-amber-500)]',
    'hover:bg-[var(--color-amber-500)]/10 hover:!text-[var(--color-amber-500)]',
    'active:bg-[var(--color-amber-500)]/20 active:!text-[var(--color-amber-500)]',
    'disabled:text-[var(--color-slate-400)]',
    'focus:ring-[var(--color-amber-500)]/30 focus:ring-offset-[var(--color-slate-900)]'
  );
  // Ghost 버튼 색상 (텍스트 유지)
  const ghostClasses = cn(
    'bg-transparent border border-transparent',
    'disabled:cursor-not-allowed',
    'focus:ring-2 focus:ring-offset-2',
    'text-[var(--color-slate-200)]',
    'hover:bg-[var(--color-slate-700)]/50 hover:!text-[var(--color-slate-100)]',
    'active:bg-[var(--color-slate-600)]/50 active:!text-[var(--color-slate-100)]',
    'disabled:text-[var(--color-slate-400)]',
    'focus:ring-[var(--color-slate-400)]/30 focus:ring-offset-[var(--color-slate-900)]'
  );  // Error 버튼 색상 (design token 사용 - success green)
  const errorClasses = cn(
    'text-white border',
    'disabled:cursor-not-allowed',
    'focus:ring-2 focus:ring-offset-2',
    'bg-[var(--color-success)] border-[var(--color-success)]',
    'hover:brightness-110 hover:border-[var(--color-success)] hover:!text-white',
    'active:brightness-90 active:border-[var(--color-success)] active:!text-white',
    'disabled:bg-[var(--color-slate-400)] disabled:border-[var(--color-slate-400)]',
    'focus:ring-[var(--color-success)]/30 focus:ring-offset-[var(--color-slate-900)]'
  );// 그라데이션 버튼들 (design token 사용)
  const gradientClasses = {    gradient: cn(
      'text-white border-0',
      'disabled:cursor-not-allowed',
      'focus:ring-2 focus:ring-offset-2',
      'bg-gradient-to-r from-[var(--color-purple-500)] to-[var(--color-blue-500)]',
      'hover:brightness-110 hover:!text-white',
      'active:brightness-90 active:!text-white',
      'disabled:from-[var(--color-slate-400)] disabled:to-[var(--color-slate-400)]',
      'focus:ring-[var(--color-purple-500)]/30 focus:ring-offset-[var(--color-slate-900)]'
    ),    'gradient-purple': cn(
      'text-white border-0',
      'disabled:cursor-not-allowed',
      'bg-gradient-to-r from-[var(--color-purple-500)] to-[var(--neon-purple-4)]',
      'hover:brightness-110 hover:!text-white',
      'active:brightness-90 active:!text-white',
      'disabled:from-[var(--color-slate-400)] disabled:to-[var(--color-slate-400)]'
    ),    'gradient-blue': cn(
      'text-white border-0',
      'disabled:cursor-not-allowed',
      'bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-info)]',
      'hover:brightness-110 hover:!text-white',
      'active:brightness-90 active:!text-white',
      'disabled:from-[var(--color-slate-400)] disabled:to-[var(--color-slate-400)]'
    ),    'gradient-green': cn(
      'text-white border-0',
      'disabled:cursor-not-allowed',
      'bg-gradient-to-r from-[var(--color-success)] to-[var(--color-emerald-500)]',
      'hover:brightness-110 hover:!text-white',
      'active:brightness-90 active:!text-white',
      'disabled:from-[var(--color-slate-400)] disabled:to-[var(--color-slate-400)]'
    ),    'gradient-orange': cn(
      'text-white border-0',
      'disabled:cursor-not-allowed',
      'bg-gradient-to-r from-[var(--color-amber-500)] to-[var(--color-red-500)]',
      'hover:brightness-110 hover:!text-white',
      'active:brightness-90 active:!text-white',
      'disabled:from-[var(--color-slate-400)] disabled:to-[var(--color-slate-400)]'
    ),    'gradient-pink': cn(
      'text-white border-0',
      'disabled:cursor-not-allowed',
      'bg-gradient-to-r from-[var(--neon-purple-1)] to-[var(--neon-purple-2)]',
      'hover:brightness-110 hover:!text-white',
      'active:brightness-90 active:!text-white',
      'disabled:from-[var(--color-slate-400)] disabled:to-[var(--color-slate-400)]'
    ),
  };  // 글래스모피즘 효과 (더 강화된 효과)
  const glassClasses = {    glass: cn(
      'text-white relative overflow-hidden',
      'disabled:cursor-not-allowed',
      'bg-white/15 backdrop-blur-2xl border border-white/30',
      'hover:bg-white/25 hover:border-white/40 hover:shadow-2xl hover:shadow-white/20',
      'active:bg-white/35 active:scale-[0.98]',
      'disabled:bg-white/5 disabled:border-white/10',
      'shadow-xl shadow-black/40',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/30 before:via-white/10 before:to-transparent before:opacity-70',
      'after:absolute after:top-0 after:left-0 after:right-0 after:h-1/3 after:rounded-t-full after:bg-gradient-to-b after:from-white/20 after:to-transparent',
      'transition-all duration-300'
    ),    'glass-purple': cn(
      'text-white relative overflow-hidden',
      'disabled:cursor-not-allowed',
      'bg-purple-500/20 backdrop-blur-2xl border border-purple-400/40',
      'hover:bg-purple-500/30 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/30',
      'active:bg-purple-500/40 active:scale-[0.98]',
      'disabled:bg-purple-500/10 disabled:border-purple-400/20',
      'shadow-xl shadow-purple-900/40',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-purple-300/30 before:via-purple-400/15 before:to-transparent before:opacity-70',
      'after:absolute after:top-0 after:left-0 after:right-0 after:h-1/3 after:rounded-t-full after:bg-gradient-to-b after:from-purple-300/20 after:to-transparent',
      'transition-all duration-300'
    ),    'glass-blue': cn(      'text-white relative overflow-hidden',
      'disabled:cursor-not-allowed',
      'bg-blue-500/20 backdrop-blur-2xl border border-blue-400/40',
      'hover:bg-blue-500/30 hover:border-blue-400/60 hover:shadow-2xl hover:shadow-blue-500/30',
      'active:bg-blue-500/40 active:scale-[0.98]',
      'disabled:bg-blue-500/10 disabled:border-blue-400/20',
      'shadow-xl shadow-blue-900/40',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-blue-300/30 before:via-blue-400/15 before:to-transparent before:opacity-70',
      'after:absolute after:top-0 after:left-0 after:right-0 after:h-1/3 after:rounded-t-full after:bg-gradient-to-b after:from-blue-300/20 after:to-transparent',
      'transition-all duration-300'
    ),
  };
  // 뉴모피즘 효과
  const neumorphismClasses = {
    neumorphism: cn(
      'bg-[var(--color-slate-300)] text-[var(--color-slate-800)] border-0 relative',
      'shadow-[8px_8px_16px_var(--color-slate-400),-8px_-8px_16px_var(--color-white)]',
      'hover:shadow-[6px_6px_12px_var(--color-slate-400),-6px_-6px_12px_var(--color-white)] hover:translate-y-[-1px]',
      'active:shadow-[inset_4px_4px_8px_var(--color-slate-400),inset_-4px_-4px_8px_var(--color-white)] active:translate-y-0',
      'disabled:shadow-[4px_4px_8px_var(--color-slate-400),-4px_-4px_8px_var(--color-white)] disabled:cursor-not-allowed disabled:opacity-60',
      'transition-all duration-200'
    ),
    'neumorphism-dark': cn(
      'bg-[var(--color-slate-800)] text-[var(--color-slate-200)] border-0 relative',
      'shadow-[8px_8px_16px_var(--color-slate-900),-8px_-8px_16px_var(--color-slate-700)]',
      'hover:shadow-[6px_6px_12px_var(--color-slate-900),-6px_-6px_12px_var(--color-slate-700)] hover:translate-y-[-1px]',
      'active:shadow-[inset_4px_4px_8px_var(--color-slate-900),inset_-4px_-4px_8px_var(--color-slate-700)] active:translate-y-0',
      'disabled:shadow-[4px_4px_8px_var(--color-slate-900),-4px_-4px_8px_var(--color-slate-700)] disabled:cursor-not-allowed disabled:opacity-60',
      'transition-all duration-200'
    ),
  };  // 네온 효과 (진짜 네온 컬러로 수정)
  const neonClasses = {    neon: cn(
      'bg-gradient-to-r from-cyan-400/10 via-cyan-300/5 to-cyan-400/10 border-2 border-cyan-400 text-cyan-300 relative overflow-hidden',
      'shadow-[0_0_15px_#00ffff,inset_0_0_15px_#00ffff40]',
      'hover:shadow-[0_0_25px_#00ffff,0_0_35px_#00ffff,inset_0_0_25px_#00ffff60] hover:!text-white hover:bg-gradient-to-r hover:from-cyan-400/20 hover:via-cyan-300/15 hover:to-cyan-400/20',
      'active:shadow-[0_0_35px_#00ffff,0_0_45px_#00ffff,inset_0_0_35px_#00ffff80] active:!text-white active:bg-gradient-to-r active:from-cyan-400/30 active:via-cyan-300/25 active:to-cyan-400/30',
      'disabled:shadow-[0_0_8px_#00ffff60] disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent',
      'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
    ),    'neon-purple': cn(
      'bg-gradient-to-r from-purple-400/10 via-fuchsia-400/5 to-purple-400/10 border-2 border-purple-400 text-purple-300 relative overflow-hidden',
      'shadow-[0_0_15px_#a855f7,inset_0_0_15px_#a855f740]',
      'hover:shadow-[0_0_25px_#a855f7,0_0_35px_#a855f7,inset_0_0_25px_#a855f760] hover:!text-white hover:bg-gradient-to-r hover:from-purple-400/20 hover:via-fuchsia-400/15 hover:to-purple-400/20',
      'active:shadow-[0_0_35px_#a855f7,0_0_45px_#a855f7,inset_0_0_35px_#a855f780] active:!text-white active:bg-gradient-to-r active:from-purple-400/30 active:via-fuchsia-400/25 active:to-purple-400/30',
      'disabled:shadow-[0_0_8px_#a855f760] disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-purple-400/20 before:to-transparent',
      'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
    ),    'neon-blue': cn(
      'bg-gradient-to-r from-blue-400/10 via-indigo-400/5 to-blue-400/10 border-2 border-blue-400 text-blue-300 relative overflow-hidden',
      'shadow-[0_0_15px_#3b82f6,inset_0_0_15px_#3b82f640]',
      'hover:shadow-[0_0_25px_#3b82f6,0_0_35px_#3b82f6,inset_0_0_25px_#3b82f660] hover:!text-white hover:bg-gradient-to-r hover:from-blue-400/20 hover:via-indigo-400/15 hover:to-blue-400/20',
      'active:shadow-[0_0_35px_#3b82f6,0_0_45px_#3b82f6,inset_0_0_35px_#3b82f680] active:!text-white active:bg-gradient-to-r active:from-blue-400/30 active:via-indigo-400/25 active:to-blue-400/30',
      'disabled:shadow-[0_0_8px_#3b82f660] disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-blue-400/20 before:to-transparent',
      'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
    ),    'neon-green': cn(
      'bg-gradient-to-r from-green-400/10 via-emerald-400/5 to-green-400/10 border-2 border-green-400 text-green-300 relative overflow-hidden',
      'shadow-[0_0_15px_#22c55e,inset_0_0_15px_#22c55e40]',
      'hover:shadow-[0_0_25px_#22c55e,0_0_35px_#22c55e,inset_0_0_25px_#22c55e60] hover:!text-white hover:bg-gradient-to-r hover:from-green-400/20 hover:via-emerald-400/15 hover:to-green-400/20',
      'active:shadow-[0_0_35px_#22c55e,0_0_45px_#22c55e,inset_0_0_35px_#22c55e80] active:!text-white active:bg-gradient-to-r active:from-green-400/30 active:via-emerald-400/25 active:to-green-400/30',
      'disabled:shadow-[0_0_8px_#22c55e60] disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-300',
      'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-green-400/20 before:to-transparent',
      'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
    ),
  };// Variant별 스타일 매핑
  const variantClasses = {
    primary: primaryClasses,
    secondary: secondaryClasses,
    outline: outlineClasses,
    text: textClasses,
    ghost: ghostClasses,
    error: errorClasses,
    gradient: gradientClasses.gradient,
    'gradient-purple': gradientClasses['gradient-purple'],
    'gradient-blue': gradientClasses['gradient-blue'],
    'gradient-green': gradientClasses['gradient-green'],
    'gradient-orange': gradientClasses['gradient-orange'],
    'gradient-pink': gradientClasses['gradient-pink'],
    glass: glassClasses.glass,
    'glass-purple': glassClasses['glass-purple'],
    'glass-blue': glassClasses['glass-blue'],
    neumorphism: neumorphismClasses.neumorphism,
    'neumorphism-dark': neumorphismClasses['neumorphism-dark'],
    neon: neonClasses.neon,
    'neon-purple': neonClasses['neon-purple'],
    'neon-blue': neonClasses['neon-blue'],
    'neon-green': neonClasses['neon-green'],  };

  // 최종 클래스 생성
  const buttonClasses = cn(
    // 기본 스타일 (표준 사이즈)
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-full transition-all duration-200',
    'transform-gpu will-change-transform',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none', // 텍스트 선택 방지
    
    // 사이즈 (아이콘 전용은 정사각형)
    iconOnly ? iconOnlyClasses[size] : sizeClasses[size],
      // 전체 너비 (깔끔한 배치)
    fullWidth && 'w-full justify-center',
    
    // Variant
    variantClasses[variant],
    
    // 반응형 터치 타겟 (모바일 최적화)
    'min-h-[44px] sm:min-h-0', // 모바일에서 최소 터치 타겟 44px
    
    className
  );  // 버튼 내용 렌더링
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 size={iconSizes[size]} className="animate-spin" />
          {!iconOnly && <span>로딩중...</span>}
        </>
      );
    }

    if (iconOnly && icon) {
      return <span className="flex items-center justify-center">{icon}</span>;
    }

    return (
      <>
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </>
    );
  };

  // 클릭 핸들러
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isInteractive) return;
    onClick?.(e);
  };  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      disabled={!isInteractive}
      onClick={handleClick}
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
