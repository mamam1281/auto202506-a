'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Eye, EyeOff, Search, User, Mail, Lock } from 'lucide-react';
import { cn } from '../utils/utils';
import styles from './Input.module.css';
import { useTypingEffect, usePlaceholderTyping, useDigitalMotionTyping } from '../../../hooks/useTypingEffect';

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
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  
  // 타이핑 효과 Props
  enableTypingPlaceholder?: boolean;
  typingPlaceholders?: string[];
  enableDigitalTyping?: boolean;
  digitalTypingSpeed?: number;
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
  tooltip,
  tooltipPosition = 'top',
  type: propType = 'text',
  ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(props.value || '');

  // 패스워드 타입일 때 실제 type 결정
  const inputType = propType === 'password' && showPassword ? 'text' : propType;

  // 아이콘 자동 선택
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search': return <Search size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'email': return <Mail size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'password': return <Lock size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      case 'text': return <User size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
      default: return null;
    }
  };

  const displayLeftIcon = leftIcon || getDefaultIcon();
  const displayRightIcon = rightIcon || (showPasswordToggle && propType === 'password' ? (
    <button
      type="button"
      className={styles.passwordToggle}
      onClick={() => setShowPassword(!showPassword)}
      tabIndex={-1}
    >
      {showPassword ? 
        <EyeOff size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} /> : 
        <Eye size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      }
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
  // CSS 클래스 조합
  const containerClasses = cn(
    styles.container,
    fullWidth && styles.fullWidth,
    containerClassName
  );
  const inputClasses = cn(
    styles.input,
    styles[size],
    styles[variant],
    error && styles.error,
    success && !error && styles.success,
    isFocused && styles.focus,
    disabled && styles.disabled,
    displayLeftIcon ? styles.hasLeftIcon : '',
    displayRightIcon ? styles.hasRightIcon : '',
    className
  );

  return (
    <div className={containerClasses}>
      {/* 라벨 */}
      {label && (
        <label className={cn(
          styles.label,
          state === 'error' && styles.errorText,
          state === 'success' && styles.successText,
          disabled && styles.disabled
        )}>
          {label}
        </label>
      )}
      
      {/* 입력 래퍼 */}
      <div className={styles.inputWrapper}>
        {/* 왼쪽 아이콘 */}
        {displayLeftIcon && (
          <div className={cn(styles.leftIcon, styles[size])}>
            {displayLeftIcon}
          </div>
        )}
        
        {/* 입력 필드 */}
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
        
        {/* 오른쪽 아이콘 */}
        {displayRightIcon && (
          <div className={cn(
            styles.rightIcon, 
            styles[size],
            showPasswordToggle && 'pointer-events-auto'
          )}>
            {displayRightIcon}
          </div>
        )}

        {/* 툴팁 */}
        {tooltip && (
          <div className={cn(
            styles.tooltip,
            styles[`tooltip${tooltipPosition.charAt(0).toUpperCase() + tooltipPosition.slice(1)}`],
            isFocused && styles.tooltipVisible
          )}>
            {tooltip}
          </div>
        )}
      </div>
      
      {/* 에러 메시지 */}
      {error && (
        <motion.p 
          className={styles.errorText}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      
      {/* 성공 메시지 */}
      {success && !error && (
        <motion.p 
          className={styles.successText}
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
