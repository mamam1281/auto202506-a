import React, { useState } from 'react';
import styles from './Dialog.module.css';

export interface DialogProps {
  /** 열림 상태 */
  open: boolean;
  
  /** 닫기 핸들러 */
  onClose: () => void;
  
  /** 제목 */
  title?: string;
  
  /** 설명 */
  description?: string;
  
  /** 자식 요소 */
  children: React.ReactNode;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = ''
}) => {
  if (!open) return null;

  const dialogClassNames = [
    styles.dialog,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={dialogClassNames}>
        {(title || description) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        )}
        
        <div className={styles.content}>
          {children}
        </div>
        
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Dialog;
