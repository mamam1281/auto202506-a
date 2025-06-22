'use client';

import React, { forwardRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Eye, EyeOff, Search, User, Mail, Lock } from 'lucide-react';
import { cn } from '../utils/utils';
import styles from './Input.module.css';
import { usePlaceholderTyping } from '../../../hooks/useTypingEffect';

export type InputVariant = 
  | 'default' 
  | 'search' 
  | 'email' 
  | 'password'
  | 'text';

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
  
  // 타이핑 효과 Props (성능 최적화)
  enableTypingPlaceholder?: boolean;
  typingPlaceholders?: string[];
  
  // 효과 설정
  disableBorderAnimation?: boolean;
  disableColorShift?: boolean;
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
  placeholder = '',
  enableTypingPlaceholder = false,
  typingPlaceholders = [],
  disableBorderAnimation = false,
  disableColorShift = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // 타이핑 효과 훅 (조건부 사용으로 성능 최적화)
  const placeholderTyping = usePlaceholderTyping(
    enableTypingPlaceholder && typingPlaceholders.length > 0 
      ? typingPlaceholders 
      : [placeholder || ''], 
    { 
      speed: 100,
      loop: enableTypingPlaceholder && typingPlaceholders.length > 1
    }
  );

  // 패스워드 타입일 때 실제 type 결정
  const inputType = propType === 'password' && showPassword ? 'text' : propType;

  // 아이콘 자동 선택 (SOLID SRP 준수)
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

  // 이벤트 핸들러들 (SOLID SRP 준수)
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // 실제 효과 상태 결정 (SOLID OCP 준수)
  const actualState = error ? 'error' : success ? 'success' : isFocused ? 'focused' : state;
  // CSS 클래스 생성 (성능 최적화)
  const inputClasses = cn(
    styles.input,
    styles[size],
    actualState !== 'default' && styles[actualState],
    {
      [styles.withLeftIcon]: !!displayLeftIcon,
      [styles.withRightIcon]: !!(displayRightIcon || showPasswordToggle),
      [styles.disabled]: disabled,
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  const containerClasses = cn(
    styles.container,
    {
      [styles.fullWidth]: fullWidth,
    },
    containerClassName
  );

  // 현재 사용할 플레이스홀더 결정
  const currentPlaceholder = enableTypingPlaceholder 
    ? placeholderTyping.displayText 
    : placeholder;

  return (
    <div className={containerClasses}>
      {/* 라벨 */}
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      
      {/* 입력 래퍼 */}
      <div 
        className={styles.inputWrapper}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* 왼쪽 아이콘 */}
        {displayLeftIcon && (
          <div className={styles.leftIcon}>
            {displayLeftIcon}
          </div>
        )}
        
        {/* 메인 입력 필드 */}        {/* 모든 스케일 효과 제거됨 */}
        <motion.input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={currentPlaceholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {/* 오른쪽 아이콘 */}
        {displayRightIcon && (
          <div className={styles.rightIcon}>
            {displayRightIcon}
          </div>
        )}

        {/* 툴팁 */}
        {tooltip && showTooltip && (
          <div className={cn(
            styles.tooltip,
            styles[tooltipPosition],
            showTooltip && styles.show
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
