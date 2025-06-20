'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sonner.module.css';

// Simple className utility
const cn = (...classes: (string | undefined | null | false | Record<string, boolean>)[]) => {
  return classes
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
};

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

interface ToasterContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within ToasterProvider');
  }
  return context;
};

interface ToasterProviderProps {
  children: React.ReactNode;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  duration?: number;
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({
  children,
  position = 'bottom-right',
  expand = false,
  richColors = true,
  closeButton = true,
  duration = 4000,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const toast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = (++toastIdRef.current).toString();
    const newToast: Toast = {
      id,
      duration,
      ...toastData,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.duration);
    }

    return id;
  }, [duration]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToasterContextType = {
    toasts,
    toast,
    dismiss,
    dismissAll,
  };

  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      <Toaster 
        position={position}
        expand={expand}
        richColors={richColors}
        closeButton={closeButton}
      />
    </ToasterContext.Provider>
  );
};

interface ToasterProps {
  position: string;
  expand: boolean;
  richColors: boolean;
  closeButton: boolean;
}

const Toaster: React.FC<ToasterProps> = ({
  position,
  expand,
  richColors,
  closeButton,
}) => {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className={cn(
        styles.toaster,
        styles[position.replace('-', '') as keyof typeof styles] || styles.bottomright,
        { [styles.expand]: expand }
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
            richColors={richColors}
            closeButton={closeButton}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastComponentProps {
  toast: Toast;
  onDismiss: () => void;
  richColors: boolean;
  closeButton: boolean;
}

const ToastComponent: React.FC<ToastComponentProps> = ({
  toast,
  onDismiss,
  richColors,
  closeButton,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && !isHovered) {
      const timer = setTimeout(() => {
        onDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, isHovered, onDismiss]);
  const variants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        styles.toast,
        toast.type && styles[toast.type],
        { [styles.richColors]: richColors }
      )}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.toastContent}>
        {toast.title && (
          <div className={styles.toastTitle}>{toast.title}</div>
        )}
        {toast.description && (
          <div className={styles.toastDescription}>{toast.description}</div>
        )}
      </div>
      
      {toast.action && (
        <button
          className={styles.toastAction}
          onClick={() => {
            toast.action?.onClick();
            onDismiss();
          }}
        >
          {toast.action.label}
        </button>
      )}
      
      {closeButton && (
        <button
          className={styles.toastClose}
          onClick={onDismiss}
          aria-label="닫기"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

// Convenience functions
export const toast = {
  success: (message: string, options?: Partial<Toast>) => {
    // This will be connected to the context when used within ToasterProvider
    console.log('Success toast:', message, options);
  },
  error: (message: string, options?: Partial<Toast>) => {
    console.log('Error toast:', message, options);
  },
  warning: (message: string, options?: Partial<Toast>) => {
    console.log('Warning toast:', message, options);
  },
  info: (message: string, options?: Partial<Toast>) => {
    console.log('Info toast:', message, options);
  },
  default: (message: string, options?: Partial<Toast>) => {
    console.log('Default toast:', message, options);
  },
};
