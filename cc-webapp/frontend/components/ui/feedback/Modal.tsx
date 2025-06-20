import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.css';
import { cn } from '../utils/utils';

export interface ModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  
  /** 제목 */
  title?: string;
  
  /** 설명 */
  description?: string;
  
  /** 자식 요소 */
  children: React.ReactNode;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** 닫기 버튼 표시 여부 */
  showCloseButton?: boolean;
  
  /** 배경 클릭으로 닫기 활성화 */
  closeOnBackdropClick?: boolean;
  
  /** ESC 키로 닫기 활성화 */
  closeOnEsc?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
  
  /** 모달 타입 */
  variant?: 'default' | 'glass' | 'neon' | 'game';
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className,
  variant = 'default'
}) => {
  // ESC 키 핸들러
  useEffect(() => {
    if (!closeOnEsc || !open) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, closeOnEsc, onClose]);

  // 배경 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 애니메이션 variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            className={cn(
              styles.modal,
              styles[size],
              styles[variant],
              className
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            {(title || description || showCloseButton) && (
              <div className={styles.header}>
                <div className={styles.headerContent}>
                  {title && <h2 className={styles.title}>{title}</h2>}
                  {description && <p className={styles.description}>{description}</p>}
                </div>
                {showCloseButton && (
                  <button 
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="모달 닫기"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path 
                        d="M15 5L5 15M5 5L15 15" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* 콘텐츠 */}
            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
