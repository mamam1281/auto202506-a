import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  /** 메시지 */
  message: string;
  
  /** 타입 */
  type?: 'info' | 'success' | 'warning' | 'error';
  
  /** 표시 시간 (ms) */
  duration?: number;
  
  /** 열림 상태 */
  open: boolean;
  
  /** 닫기 핸들러 */
  onClose: () => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  open,
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // 애니메이션 시간
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  const toastClassNames = [
    styles.toast,
    styles[type],
    isVisible ? styles.visible : styles.hidden,
    className
  ].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  return (
    <div className={toastClassNames}>
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

export default Toast;
