'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/utils';
import styles from './Modal.module.css';

export interface ModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 콜백 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 모달 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 닫기 버튼 표시 여부 */
  showCloseButton?: boolean;
  /** 배경 클릭 시 닫기 */
  closeOnBackdrop?: boolean;
  /** ESC 키로 닫기 */
  closeOnEscape?: boolean;
  /** 배경 스타일 */
  backdrop?: 'blur' | 'dark' | 'light';
  /** 추가 CSS 클래스 */
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  backdrop = 'dark',
  className
}) => {
  // ESC 키 핸들링
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;

  const backdropClasses = {
    blur: styles.overlayBlur,
    dark: styles.overlayDark,
    light: styles.overlayLight
  };

  const sizeClasses = {
    sm: styles.modalSm,
    md: styles.modalMd,
    lg: styles.modalLg,
    xl: styles.modalXl
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        styles.overlay,
        backdropClasses[backdrop]
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(
          styles.modal,
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h3 id="modal-title" className={styles.title}>
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="모달 닫기"
                type="button"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* 내용 */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
