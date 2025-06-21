'use client';

import React, { forwardRef } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 변형 - 통합 가이드 표준 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'success' | 'warning' | 'error';
  
  /** 버튼 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  
  /** 로딩 상태 */
  loading?: boolean;
  
  /** 아이콘 */
  icon?: React.ReactNode;
  
  /** 아이콘 위치 */
  iconPosition?: 'left' | 'right';
  
  /** 아이콘만 표시 (정사각형) */
  iconOnly?: boolean;
  
  /** 로딩 텍스트 */
  loadingText?: string;
  
  /** 커스텀 CSS 클래스 */
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loadingText,
  className = '',
  children,
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  
  // CSS 클래스 조합
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    loading && styles.loading,
    isDisabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {loading && <div className={styles.spinner} />}
      
      {!loading && icon && iconPosition === 'left' && icon}
      
      {!loading && !iconOnly && children}
      
      {!loading && icon && iconPosition === 'right' && icon}
      
      {loading && loadingText && (
        <span className={styles.loadingText}>{loadingText}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
