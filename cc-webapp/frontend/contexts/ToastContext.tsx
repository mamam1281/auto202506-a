import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastProps, ToastType } from '../components/Toast';

// Toast 메시지 타입 (ID 포함)
interface ToastMessage extends Omit<ToastProps, 'onClose'> {
  id: string;
}

// Context Value 타입 정의
interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Context 생성
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// useToast 훅 (컨텍스트 사용을 쉽게)
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number; // 최대 토스트 개수 (기본값: 5)
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

// ToastProvider 컴포넌트
export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5,
  position = 'bottom-center'
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [portalRoot, setPortalRoot] = useState<Element | null>(null);

  React.useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  // 토스트 메시지 추가 함수
  const showToast = useCallback((message: string, type?: ToastType, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { 
      id, 
      message, 
      type: type || 'default', 
      duration: duration !== undefined ? duration : 3000 
    };
    
    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast];
      // 최대 개수 초과 시 오래된 토스트 제거
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(-maxToasts);
      }
      return updatedToasts;
    });
  }, [maxToasts]);

  // 토스트 메시지 제거 함수
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // 모든 토스트 제거 함수
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 위치에 따른 스타일 클래스
  const getPositionClasses = () => {
    switch (position) {
      case 'top-center':
        return 'top-[var(--spacing-4)] left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'top-[var(--spacing-4)] right-[var(--spacing-4)]';
      case 'bottom-right':
        return 'bottom-[var(--spacing-4)] right-[var(--spacing-4)]';
      case 'bottom-center':
      default:
        return 'bottom-[var(--spacing-4)] left-1/2 -translate-x-1/2';
    }
  };

  if (!portalRoot) {
    return (
      <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
        {children}
      </ToastContext.Provider>
    );
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      {createPortal(
        <div 
          className={`
            toast-container fixed z-50 flex flex-col items-center gap-[var(--spacing-2)]
            ${getPositionClasses()}
          `}
          role="region"
          aria-label="알림 메시지"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <Toast key={toast.id} {...toast} onClose={removeToast} />
            ))}
          </AnimatePresence>
        </div>,
        portalRoot
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
