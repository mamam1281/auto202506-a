'use client';

import React, { forwardRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Eye, EyeOff, Search, User, Mail, Lock } from 'lucide-react';
import { cn } from '../utils/utils';

export type InputVariant = 
  | 'default' 
  | 'search' 
  | 'email' 
  | 'password'
  | 'text'
  | 'gradient'
  | 'neon';

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
        right: 'pr-9',         // 36px (icon + gap)
      },
    },
    md: {
      height: 'h-10',          // 40px
      padding: 'px-4 py-2',    // 16px horizontal, 8px vertical
      fontSize: 'text-base',   // 16px
      iconSize: 20,
      iconLeft: 'left-4',      // 16px from left
      iconRight: 'right-4',    // 16px from right
      paddingWithIcon: {
        left: 'pl-11',         // 44px (icon + gap)
        right: 'pr-11',        // 44px (icon + gap)
      },
    },
    lg: {
      height: 'h-12',          // 48px
      padding: 'px-5 py-3',    // 20px horizontal, 12px vertical
      fontSize: 'text-lg',     // 18px
      iconSize: 24,
      iconLeft: 'left-5',      // 20px from left
      iconRight: 'right-5',    // 20px from right
      paddingWithIcon: {
        left: 'pl-13',         // 52px (icon + gap)
        right: 'pr-13',        // 52px (icon + gap)
      },
    },
  };

  const config = sizeConfig[size];

  // 기본 스타일
  const baseStyles = cn(
    // 기본 구조
    config.height,
    config.fontSize,
    fullWidth ? 'w-full' : 'w-auto',
    
    // 패딩 (아이콘 여부에 따라 결정)
    leftIcon ? config.paddingWithIcon.left : config.padding.split(' ')[0],
    rightIcon || showPasswordToggle ? config.paddingWithIcon.right : config.padding.split(' ')[0],
    'py-' + config.padding.split(' ')[1].replace('py-', ''),
    
    // 기본 스타일
    'border rounded-lg transition-all duration-200 outline-none',
    'placeholder:text-gray-400',
    
    // 배경과 텍스트
    'bg-white text-gray-900',
    'dark:bg-gray-800 dark:text-gray-100',
    
    // 포커스 상태 기본
    'focus:ring-2 focus:ring-offset-1',
    
    // 비활성화 상태
    disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
  );

  // variant별 스타일
  const variantStyles = {
    default: cn(
      'border-gray-300 dark:border-gray-600',
      !disabled && 'hover:border-gray-400 dark:hover:border-gray-500',
      isFocused && 'border-blue-500 dark:border-blue-400 ring-blue-500/20 dark:ring-blue-400/20',
      state === 'error' && 'border-red-500 ring-red-500/20',
      state === 'success' && 'border-green-500 ring-green-500/20'
    ),
    search: cn(
      'border-gray-300 dark:border-gray-600',
      'bg-gray-50 dark:bg-gray-700/50',
      !disabled && 'hover:bg-gray-100 dark:hover:bg-gray-700',
      isFocused && 'border-blue-500 dark:border-blue-400 ring-blue-500/20 bg-white dark:bg-gray-800'
    ),
    email: cn(
      'border-blue-300 dark:border-blue-600',
      !disabled && 'hover:border-blue-400 dark:hover:border-blue-500',
      isFocused && 'border-blue-500 dark:border-blue-400 ring-blue-500/20'
    ),
    password: cn(
      'border-purple-300 dark:border-purple-600',
      !disabled && 'hover:border-purple-400 dark:hover:border-purple-500',
      isFocused && 'border-purple-500 dark:border-purple-400 ring-purple-500/20'
    ),
    text: cn(
      'border-gray-300 dark:border-gray-600',
      !disabled && 'hover:border-gray-400 dark:hover:border-gray-500',
      isFocused && 'border-blue-500 dark:border-blue-400 ring-blue-500/20'
    ),    gradient: cn(
      'border-0 bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]',
      'focus:from-purple-600 focus:to-pink-600'
    ),
    neon: cn(
      'border-purple-400 dark:border-purple-500',
      'bg-purple-50/50 dark:bg-purple-900/20',
      'shadow-[0_0_10px_rgba(168,85,247,0.3)] dark:shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      !disabled && 'hover:border-purple-500 dark:hover:border-purple-400',
      !disabled && 'hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
      isFocused && 'border-purple-500 dark:border-purple-400 ring-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
    ),
  };

  // 아이콘 자동 선택
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search': return <Search size={config.iconSize} />;
      case 'email': return <Mail size={config.iconSize} />;
      case 'password': return <Lock size={config.iconSize} />;
      case 'text': return <User size={config.iconSize} />;
      default: return null;
    }
  };

  const displayLeftIcon = leftIcon || getDefaultIcon();
  const displayRightIcon = rightIcon || (showPasswordToggle && propType === 'password' ? (
    <button
      type="button"
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      onClick={() => setShowPassword(!showPassword)}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff size={config.iconSize} /> : <Eye size={config.iconSize} />}
    </button>
  ) : null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    props.onChange?.(e);
  };

  const containerClasses = cn(
    'relative',
    fullWidth && 'w-full',
    containerClassName
  );

  const inputClasses = cn(
    baseStyles,
    variantStyles[variant],
    className
  );

  const iconClasses = cn(
    'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
    'pointer-events-none'
  );

  const InputComponent = variant === 'gradient' ? (
    <div className={cn(variantStyles[variant], 'rounded-lg')}>
      <motion.input
        ref={ref}
        type={inputType}
        disabled={disabled}
        className={cn(
          baseStyles.replace(variantStyles[variant], ''),
          'border-0 bg-white dark:bg-gray-800 rounded-lg',
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={inputValue}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        {...props}
      />
    </div>
  ) : (
    <motion.input
      ref={ref}
      type={inputType}
      disabled={disabled}
      className={inputClasses}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      value={inputValue}
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      {...props}
    />
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label className={cn(
          'block text-sm font-medium mb-2',
          'text-gray-700 dark:text-gray-300',
          state === 'error' && 'text-red-600 dark:text-red-400',
          state === 'success' && 'text-green-600 dark:text-green-400',
          disabled && 'opacity-50'
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {displayLeftIcon && (
          <div className={cn(iconClasses, config.iconLeft)}>
            {displayLeftIcon}
          </div>
        )}
        
        {InputComponent}
        
        {displayRightIcon && (
          <div className={cn(
            iconClasses.replace('pointer-events-none', ''),
            config.iconRight,
            showPasswordToggle && 'cursor-pointer pointer-events-auto'
          )}>
            {displayRightIcon}
          </div>
        )}
      </div>
      
      {/* 에러/성공 메시지 */}
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      
      {success && !error && (
        <motion.p 
          className="mt-1 text-sm text-green-600 dark:text-green-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {success}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
