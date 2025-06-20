import React from 'react';
import styles from './Alert.module.css';

export interface AlertProps {
  /** 알림 변형 */
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  
  /** 제목 */
  title?: string;
  
  /** 설명 */
  description?: string;
  
  /** 자식 요소 */
  children?: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  description,
  children,
  className = ''
}) => {
  const alertClassNames = [
    styles.alert,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClassNames} role="alert">
      {title && <h5 className={styles.title}>{title}</h5>}
      {description && <div className={styles.description}>{description}</div>}
      {children}
    </div>
  );
};

export default Alert;
