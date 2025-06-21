'use client';

import React, { forwardRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Eye, EyeOff, Search, User, Mail, Lock } from 'lucide-react';

export type InputVariant = 
  | 'default' 
  | 'search' 
  | 'email' 
  | 'password'
  | 'text'
  | 'gradient';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputState = 'default' | 'focused' | 'error' | 'disabled' | 'success';

export interface InputProps extends Omit<HTMLMotionProps<'input'>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  label?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  state = 'default',
  label,
  error,
  success,
  disabled = false,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  fullWidth = false,
  className = '',
  containerClassName = '',
  type: propType = 'text',
  ...props
}, ref) => {
  
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(props.value || '');

  // 패스워드 타입일 때 실제 type 결정
  const inputType = propType === 'password' && showPassword ? 'text' : propType;

  // 8px Grid System 기반 정확한 크기 정의
  const sizeConfig = {
    sm: {
      height: 'h-8',           // 32px
      padding: 'px-3 py-1',    // 12px horizontal, 4px vertical
      fontSize: 'text-sm',     // 14px
      iconSize: 16,
      iconLeft: 'left-3',      // 12px from left
      iconRight: 'right-3',    // 12px from right
      paddingWithIcon: {
        left: 'pl-9',          // 36px (icon + gap)
        right: 'pr-9'          // 36px (icon + gap)
      },
      labelGap: 'mb-1'         // 4px gap
    },
    md: {
      height: 'h-10',          // 40px
      padding: 'px-4 py-2',    // 16px horizontal, 8px vertical
      fontSize: 'text-base',   // 16px
      iconSize: 20,
      iconLeft: 'left-3',      // 12px from left
      iconRight: 'right-3',    // 12px from right
      paddingWithIcon: {
        left: 'pl-10',         // 40px (icon + gap)
        right: 'pr-10'         // 40px (icon + gap)
      },
      labelGap: 'mb-2'         // 8px gap
    },
    lg: {
      height: 'h-12',          // 48px
      padding: 'px-6 py-3',    // 24px horizontal, 12px vertical
      fontSize: 'text-lg',     // 18px
      iconSize: 24,
      iconLeft: 'left-4',      // 16px from left
      iconRight: 'right-4',    // 16px from right
      paddingWithIcon: {
        left: 'pl-12',         // 48px (icon + gap)
        right: 'pr-12'         // 48px (icon + gap)
      },
      labelGap: 'mb-3'         // 12px gap
    }
  };

  const currentSize = sizeConfig[size];

  // Design System 색상 기반 Variant 스타일
  const getVariantStyles = () => {
    const currentState = disabled ? 'disabled' : error ? 'error' : success ? 'success' : isFocused ? 'focused' : 'default';
    
    const baseStyles = `
      input-base w-full
      ${currentSize.height} ${currentSize.padding} ${currentSize.fontSize}
      transition-all duration-200 ease-out
      placeholder:text-[#A0A0A0] placeholder:transition-opacity placeholder:duration-200
      text-white border-2
      touch-target
    `;

    switch (variant) {
      case 'search':
        return `
          ${baseStyles}
          bg-[#2d2d2d] border-[#333333] rounded-lg
          ${currentState === 'focused' ? 'border-[#7B29CD] bg-[#333333] shadow-sm ring-2 ring-[#7B29CD]/20' : ''}
          ${currentState === 'error' ? 'border-[#B90C29] bg-[#B90C29]/10' : ''}
          ${currentState === 'success' ? 'border-[#10B981] bg-[#10B981]/10' : ''}
          ${currentState === 'disabled' ? 'border-[#333333]/50 bg-[#2d2d2d]/50 text-[#A0A0A0]' : ''}
        `;
      
      case 'gradient':
      case 'email':
      case 'password':
        return `
          ${baseStyles}
          bg-transparent border-0 border-b-2 rounded-none border-b-[#333333]
          ${currentState === 'focused' ? 'border-b-transparent' : ''}
          ${currentState === 'error' ? 'border-b-[#B90C29]' : ''}
          ${currentState === 'success' ? 'border-b-[#10B981]' : ''}
          ${currentState === 'disabled' ? 'border-b-[#333333]/50 text-[#A0A0A0]' : ''}
        `;
      
      default:
        return `
          ${baseStyles}
          bg-[#2d2d2d] border-[#333333] rounded-lg
          ${currentState === 'focused' ? 'border-[#7B29CD] shadow-sm ring-2 ring-[#7B29CD]/20' : ''}
          ${currentState === 'error' ? 'border-[#B90C29]' : ''}
          ${currentState === 'success' ? 'border-[#10B981]' : ''}
          ${currentState === 'disabled' ? 'border-[#333333]/50 bg-[#2d2d2d]/50 text-[#A0A0A0]' : ''}
        `;
    }
  };

  // 기본 아이콘 설정
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return <Search size={currentSize.iconSize} className="text-[#A0A0A0]" />;
      case 'email':
        return <User size={currentSize.iconSize} className="text-[#A0A0A0]" />;
      case 'password':
        return <Lock size={currentSize.iconSize} className="text-[#A0A0A0]" />;
      default:
        return null;
    }
  };

  // 우측 아이콘 설정
  const getRightIcon = () => {
    if (propType === 'password' || showPasswordToggle) {
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[#A0A0A0] hover:text-white transition-colors touch-target"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff size={currentSize.iconSize} />
          ) : (
            <Eye size={currentSize.iconSize} />
          )}
        </button>
      );
    }
    return rightIcon;
  };

  // Framer Motion variants (웹&앱 최적화)
  const motionVariants = {
    default: { scale: 1 },
    focused: { scale: 1.01, transition: { duration: 0.15, ease: 'easeOut' } },
  };

  const finalLeftIcon = leftIcon || getDefaultIcon();
  const finalRightIcon = getRightIcon();

  // 아이콘 유무에 따른 패딩 계산
  const getInputPadding = () => {
    let paddingClasses = currentSize.padding;
    
    if (finalLeftIcon) {
      paddingClasses = paddingClasses.replace(/px-\d+/, currentSize.paddingWithIcon.left);
    }
    
    if (finalRightIcon) {
      const rightPadding = finalLeftIcon ? 
        currentSize.paddingWithIcon.right : 
        paddingClasses.replace(/px-\d+/, currentSize.paddingWithIcon.right);
      paddingClasses = paddingClasses.includes('pl-') ? 
        `${paddingClasses} ${currentSize.paddingWithIcon.right}` : 
        rightPadding;
    }
    
    return paddingClasses;
  };

  return (
    <div className={`
      relative 
      ${fullWidth ? 'w-full' : 'w-80'} 
      ${containerClassName}
    `}>
      {/* Label */}
      {label && (
        <motion.label
          className={`
            block font-['Exo'] font-medium
            ${currentSize.labelGap}
            ${currentSize.fontSize}
            ${isFocused || inputValue ? 'text-white' : 'text-[#D1D5DB]'}
            ${error ? 'text-[#B90C29]' : ''}
            ${success ? 'text-[#10B981]' : ''}
            transition-all duration-200
          `}
          animate={{
            color: error ? '#B90C29' : success ? '#10B981' : isFocused || inputValue ? '#FFFFFF' : '#D1D5DB'
          }}
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {finalLeftIcon && (
          <div className={`
            absolute ${currentSize.iconLeft} top-1/2 -translate-y-1/2 z-10
            pointer-events-none flex items-center justify-center
          `}>
            {finalLeftIcon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={`
            ${getVariantStyles()}
            ${getInputPadding()}
            ${className}
          `}
          variants={motionVariants}
          initial="default"
          animate={isFocused ? "focused" : "default"}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            setInputValue(e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />

        {/* Right Icon */}
        {finalRightIcon && (
          <div className={`
            absolute ${currentSize.iconRight} top-1/2 -translate-y-1/2 z-10
            flex items-center justify-center
            ${typeof finalRightIcon === 'object' && 'type' in finalRightIcon && finalRightIcon.type === 'button' ? '' : 'pointer-events-none'}
          `}>
            {finalRightIcon}
          </div>
        )}

        {/* Gradient Underline for gradient variants */}
        {(variant === 'gradient' || variant === 'email' || variant === 'password') && isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7B29CD] via-[#870DD1] via-[#5B30F6] to-[#8054F2]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </div>

      {/* Error/Success Message */}
      {(error || success) && (
        <motion.p
          className={`
            mt-2 ${currentSize.fontSize === 'text-lg' ? 'text-base' : 'text-sm'} font-['Exo']
            ${error ? 'text-[#B90C29]' : 'text-[#10B981]'}
          `}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error || success}
        </motion.p>
      )}

      {/* Helper Text for Forgot Password */}
      {variant === 'password' && !error && !success && (
        <div className="mt-3 text-right">
          <button
            type="button"
            className="text-sm font-['Exo'] text-[#D1D5DB] hover:text-[#7B29CD] transition-colors duration-200 touch-target"
          >
            Forgot Password?
          </button>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };