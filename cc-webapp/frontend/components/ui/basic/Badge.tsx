import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  /** 배지 변형 */
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';
  
  /** 배지 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 자식 요소 */
  children: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = ''
}) => {
  const badgeClassNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClassNames}>
      {children}
    </span>
  );
};

export default Badge;
