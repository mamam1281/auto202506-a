import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /** 버튼 변형 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'success' | 'warning' | 'error';
  
  /** 버튼 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 아이콘 (선택적) */
  icon?: React.ReactNode;
  
  /** 아이콘 위치 */
  iconPosition?: 'left' | 'right';
  
  /** 아이콘만 표시 여부 */
  iconOnly?: boolean;
  
  /** 로딩 상태 */
  loading?: boolean;
  
  /** 비활성화 상태 */
  disabled?: boolean;
  
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 버튼 타입 */
  type?: 'button' | 'submit' | 'reset';
  
  /** 추가 CSS 클래스명 */
  className?: string;
  
  /** 자식 요소 */
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    loading && styles.loading,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className={styles.spinner} />
          {!iconOnly && <span className={styles.loadingText}>로딩 중...</span>}
        </>
      );
    }

    if (iconOnly) {
      return icon;
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {icon}
          {children && <span>{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children && <span>{children}</span>}
          {icon}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={classNames}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
