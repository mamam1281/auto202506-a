'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent'
  | 'success'
  | 'error'
  | 'info'
  | 'outline'
  | 'text'
  | 'gradient'
  | 'gradient-purple';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  state = 'default',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  children,
  className = '',
  ...props
}, ref) => {
  
  // 8px Grid System 기반 크기 정의
  const sizeClasses = {
    sm: `
      h-8 min-w-[64px] px-4 text-sm touch-target
      ${iconOnly ? 'w-8 px-0' : ''}
      ${icon && children && !iconOnly ? (iconPosition === 'left' ? 'pl-3 pr-4' : 'pl-4 pr-3') : ''}
    `,
    md: `
      h-10 min-w-[80px] px-6 text-base touch-target
      ${iconOnly ? 'w-10 px-0' : ''}
      ${icon && children && !iconOnly ? (iconPosition === 'left' ? 'pl-5 pr-6' : 'pl-6 pr-5') : ''}
    `,
    lg: `
      h-12 min-w-[96px] px-8 text-lg touch-target
      ${iconOnly ? 'w-12 px-0' : ''}
      ${icon && children && !iconOnly ? (iconPosition === 'left' ? 'pl-7 pr-8' : 'pl-8 pr-7') : ''}
    `
  };

  // 아이콘 크기
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  // 상용급 밝기와 톤으로 조절된 Variant 스타일
  const getVariantClasses = () => {
    const currentState = disabled || loading ? 'disabled' : state;
    
    switch (variant) {
      case 'primary':
        return {
          default: `
            bg-[#F59E0B] text-black border-0 font-medium
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#FBBF24] transform scale-[1.01] shadow-md
          `,
          active: `
            bg-[#D97706] transform scale-[0.99] shadow-sm
          `,
          disabled: `
            bg-[#F59E0B]/50 text-black/50 cursor-not-allowed shadow-none
          `
        };
      
      case 'secondary':
        return {
          default: `
            bg-[#333333] text-white border-0 font-medium
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#404040] transform scale-[1.01] shadow-md
          `,
          active: `
            bg-[#262626] transform scale-[0.99] shadow-sm
          `,
          disabled: `
            bg-[#333333]/50 text-white/50 cursor-not-allowed shadow-none
          `
        };

      case 'accent':
        return {
          default: `
            bg-[#ff4516] text-white border-0 font-medium
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#ff5530] transform scale-[1.01] shadow-md
          `,
          active: `
            bg-[#e53e0a] transform scale-[0.99] shadow-sm
          `,
          disabled: `
            bg-[#ff4516]/50 text-white/50 cursor-not-allowed shadow-none
          `
        };

      case 'success':
        return {
          default: `
            bg-[#10B981] text-white border-0 font-medium
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#059669] transform scale-[1.01] shadow-md
          `,
          active: `
            bg-[#047857] transform scale-[0.99] shadow-sm
          `,
          disabled: `
            bg-[#10B981]/50 text-white/50 cursor-not-allowed shadow-none
          `
        };

      case 'error':
        return {
          default: `
            bg-[#B90C29] text-white border-0 font-medium
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#DC2626] transform scale-[1.01] shadow-md
          `,
          active: `
            bg-[#991B1B] transform scale-[0.99] shadow-sm
          `,
          disabled: `
            bg-[#B90C29]/50 text-white/50 cursor-not-allowed shadow-none
          `
        };

      case 'info':
        return {
          default: `
            bg-[#135B79] text-white border-0 font-medium
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#0EA5E9] transform scale-[1.01] shadow-md
          `,
          active: `
            bg-[#0284C7] transform scale-[0.99] shadow-sm
          `,
          disabled: `
            bg-[#135B79]/50 text-white/50 cursor-not-allowed shadow-none
          `
        };
      
      case 'text':
        return {
          default: `
            bg-transparent text-[#D1D5DB] border-0
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#2d2d2d] text-white transform scale-[1.01]
          `,
          active: `
            bg-[#1a1a1a] text-white transform scale-[0.99]
          `,
          disabled: `
            bg-transparent text-[#A0A0A0] cursor-not-allowed
          `
        };
      
      case 'outline':
        return {
          default: `
            bg-transparent text-white border-2 border-[#A0A0A0]
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-[#2d2d2d] border-[#D1D5DB] transform scale-[1.01]
          `,
          active: `
            bg-[#1a1a1a] border-white transform scale-[0.99]
          `,
          disabled: `
            bg-transparent text-[#A0A0A0] border-[#A0A0A0]/50 cursor-not-allowed
          `
        };

      case 'gradient':
        return {
          default: `
            bg-gradient-to-r from-[#6B46C1] via-[#7C3AED] to-[#8B5CF6]
            text-white border-0 font-medium
            shadow-md shadow-purple-500/15
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]
            shadow-lg shadow-purple-500/20 transform scale-[1.01]
          `,
          active: `
            bg-gradient-to-r from-[#5B21B6] via-[#6B46C1] to-[#7C3AED]
            shadow-sm shadow-purple-500/10 transform scale-[0.99]
          `,
          disabled: `
            bg-gradient-to-r from-[#6B46C1]/50 via-[#7C3AED]/50 to-[#8B5CF6]/50
            text-white/50 cursor-not-allowed shadow-none
          `
        };

      case 'gradient-purple':
        return {
          default: `
            bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C084FC]
            text-white border-0 font-medium
            shadow-md shadow-purple-400/15
            transition-all duration-200 ease-out
          `,
          hover: `
            bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#DDD6FE]
            shadow-lg shadow-purple-400/20 transform scale-[1.01]
          `,
          active: `
            bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]
            shadow-sm shadow-purple-400/10 transform scale-[0.99]
          `,
          disabled: `
            bg-gradient-to-r from-[#8B5CF6]/50 via-[#A78BFA]/50 to-[#C084FC]/50
            text-white/50 cursor-not-allowed shadow-none
          `
        };
      
      default:
        return {
          default: '',
          hover: '',
          active: '',
          disabled: ''
        };
    }
  };

  // 부드러운 애니메이션 (상용급 최적화)
  const motionVariants = {
    default: { scale: 1 },
    hover: { scale: 1.01, transition: { duration: 0.15, ease: 'easeOut' } },
    tap: { scale: 0.99, transition: { duration: 0.1, ease: 'easeInOut' } },
    loading: { scale: 1, transition: { duration: 0.2 } }
  };

  // 상태에 따른 처리
  const isDisabled = disabled || loading;
  const isLoading = loading;

  // 클래스 조합
  const baseClasses = `
    btn-base relative
    ${fullWidth ? 'w-full' : ''}
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
    focus-visible:ring-offset-[#1a1a1a] focus-visible:ring-[#7C3AED]
    disabled:cursor-not-allowed
  `;

  const variantStyles = getVariantClasses();
  const currentStateStyle = variantStyles[isDisabled ? 'disabled' : 'default'];

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${currentStateStyle}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 아이콘 렌더링
  const renderIcon = () => {
    if (isLoading) {
      return <Loader2 size={iconSizes[size]} className="animate-spin" />;
    }
    if (icon) {
      return React.cloneElement(icon as React.ReactElement, {
        size: iconSizes[size],
        className: 'flex-shrink-0'
      });
    }
    return null;
  };

  return (
    <motion.button
      ref={ref}
      className={combinedClasses}
      disabled={isDisabled}
      variants={motionVariants}
      initial="default"
      whileHover={!isDisabled ? "hover" : "default"}
      whileTap={!isDisabled ? "tap" : "default"}
      animate={isLoading ? "loading" : "default"}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && !iconOnly && (
        <span className="truncate font-medium relative z-10">
          {children}
        </span>
      )}
      {iconPosition === 'right' && renderIcon()}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };