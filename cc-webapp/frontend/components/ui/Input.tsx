import React, { forwardRef, useState } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 변형 */
  variant?: 'text' | 'password' | 'search' | 'number';
  
  /** 입력 필드 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 입력 필드 상태 */
  state?: 'default' | 'focus' | 'error' | 'disabled' | 'success';
  
  /** 라벨 */
  label?: string;
  
  /** 도움말 텍스트 */
  helperText?: string;
  
  /** 오류 메시지 */
  errorText?: string;
  
  /** 좌측 아이콘 표시 여부 */
  leftIcon?: boolean;
  
  /** 우측 아이콘 표시 여부 */
  rightIcon?: boolean;
  
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  
  /** 필수 여부 */
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'text',
  size = 'md',
  state = 'default',
  label,
  helperText,
  errorText,
  leftIcon = false,
  rightIcon = false,
  fullWidth = true,
  required = false,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(errorText);
  const isDisabled = disabled || state === 'disabled';
  const currentState = hasError ? 'error' : (isFocused ? 'focus' : state);
  
  // 입력 타입 결정
  const getInputType = () => {
    if (variant === 'password') {
      return isPasswordVisible ? 'text' : 'password';
    }
    return variant === 'text' ? 'text' : variant;
  };
  
  // 자동 아이콘 결정
  const getLeftIcon = () => {
    if (!leftIcon) return null;
    if (variant === 'search') return '🔍';
    return '📝';
  };
  
  const getRightIcon = () => {
    if (variant === 'password') {
      return (
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          tabIndex={-1}
        >
          {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
        </button>
      );
    }
    if (!rightIcon) return null;
    return '⚙️';
  };
    const containerClassNames = [
    styles.container,
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ');

  const inputClassNames = [
    styles.input,
    styles[variant],
    styles[size],
    styles[currentState],
    leftIcon && styles.hasLeftIcon,
    (rightIcon || variant === 'password') && styles.hasRightIcon,
    variant === 'number' && styles.monospace
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassNames}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {getLeftIcon() && (
          <div className={styles.leftIcon}>
            {getLeftIcon()}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={getInputType()}
          className={inputClassNames}
          disabled={isDisabled}
          aria-invalid={hasError}
          aria-describedby={
            errorText ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {getRightIcon() && (
          <div className={styles.rightIcon}>
            {getRightIcon()}
          </div>
        )}
      </div>
      
      {errorText && (
        <div id={`${inputId}-error`} className={styles.errorText}>
          {errorText}
        </div>
      )}
      
      {helperText && !errorText && (
        <div id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
