import React, { useEffect, useState } from 'react';
import styles from './Drawer.module.css';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  /** 드로어 열림/닫힘 상태 */
  open: boolean;
  
  /** 열림/닫힘 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  
  /** 드로어 위치 */
  position?: DrawerPosition;
  
  /** 드로어 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** 오버레이 클릭 시 닫기 */
  closeOnOverlayClick?: boolean;
  
  /** ESC 키로 닫기 */
  closeOnEscape?: boolean;
  
  /** 드로어 제목 */
  title?: string;
  
  /** 닫기 버튼 표시 */
  showCloseButton?: boolean;
  
  /** 드로어 내용 */
  children: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  title,
  showCloseButton = true,
  children,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && open) {
        onOpenChange(false);
      }
    };

    if (open && closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, closeOnEscape, onOpenChange]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onOpenChange(false);
    }
  };

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!shouldRender) return null;

  const drawerClasses = [
    styles.drawer,
    styles[position],
    styles[size],
    isAnimating ? styles.open : styles.closed,
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div 
        className={`${styles.overlay} ${isAnimating ? styles.overlayOpen : styles.overlayClosed}`}
        onClick={handleOverlayClick}
      />
      
      <div 
        className={drawerClasses}
        onClick={handleDrawerClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2 id="drawer-title" className={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button 
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="드로어 닫기"
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
