import React, { useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  className?: string;
  backdropClassName?: string;
  showCloseButton?: boolean;
}

// 모달 크기별 클래스
const sizeClassMap: Record<ModalSize, string> = {
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
  full: 'w-full h-full max-w-full',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className = '',
  backdropClassName = '',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  // 포커스 가능한 요소 찾기
  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled'));
  };

  // 포커스 트랩 및 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const focusables = getFocusableElements();
        if (focusables.length) focusables[0].focus();
        else modalRef.current?.focus();
      }, 10);
    } else {
      document.body.style.overflow = '';
      lastActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line
  }, [isOpen]);

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // 포커스 트랩
      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
    // eslint-disable-next-line
  }, [isOpen, onClose]);

  // 오버레이 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 애니메이션 variants
  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const modalVariants = {
    initial: { scale: 0.96, opacity: 0, y: 40 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.96, opacity: 0, y: 40 },
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as any },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md ${backdropClassName}`}
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.18 }}
          onClick={handleBackdropClick}
          aria-modal="true"
          tabIndex={-1}
        >
          <motion.div
            ref={modalRef}
            className={`glassmorphism-dark ${sizeClassMap[size]} bg-card rounded-lg shadow-xl p-6 relative flex flex-col focus:outline-none ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-desc' : undefined}
            tabIndex={-1}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={modalVariants.transition}
          >
            {showCloseButton && (
              <Button
                iconOnly
                variant="text"
                size="sm"
                aria-label="Close"
                className="absolute top-3 right-3 z-10"
                onClick={onClose}
              >
                <X size={20} />
              </Button>
            )}
            {title && <h2 id="modal-title" className="heading-h3 mb-2">{title}</h2>}
            {description && <p id="modal-desc" className="text-caption mb-4 text-[--color-text-secondary]">{description}</p>}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
