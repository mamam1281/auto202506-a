'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export interface NotificationBannerProps {
  /** 알림 메시지 */
  message: string;
  
  /** 알림 타입 */
  type?: 'info' | 'success' | 'warning' | 'error';
  
  /** 자동 닫힘 시간 (ms) */
  autoClose?: number;
  
  /** 닫기 가능 여부 */
  closable?: boolean;
  
  /** 표시 여부 */
  visible?: boolean;
  
  /** 닫기 콜백 */
  onClose?: () => void;
  
  /** 위치 */
  position?: 'top' | 'bottom';
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  type = 'info',
  autoClose = 5000,
  closable = true,
  visible = true,
  onClose,
  position = 'top',
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const Icon = iconMap[type];

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible && autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // 반응형 클래스 설정 (통합_반응형_가이드.md 기준)
  const getResponsiveClasses = () => {
    const baseClasses = 'w-full px-4 sm:px-6 lg:px-8';
    const sizeClasses = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    };
    
    return `${baseClasses} ${sizeClasses[size]}`;
  };

  // 타입별 스타일
  const typeStyles = {
    info: {
      background: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      text: 'text-blue-100',
      icon: 'text-blue-400',
      glow: 'shadow-blue-500/10',
    },
    success: {
      background: 'from-green-500/10 to-green-600/10',
      border: 'border-green-500/20',
      text: 'text-green-100',
      icon: 'text-green-400',
      glow: 'shadow-green-500/10',
    },
    warning: {
      background: 'from-yellow-500/10 to-yellow-600/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-100',
      icon: 'text-yellow-400',
      glow: 'shadow-yellow-500/10',
    },
    error: {
      background: 'from-red-500/10 to-red-600/10',
      border: 'border-red-500/20',
      text: 'text-red-100',
      icon: 'text-red-400',
      glow: 'shadow-red-500/10',
    },
  };

  const currentStyle = typeStyles[type];
  // 애니메이션 설정 (모바일 최적화)
  const bannerVariants = {
    initial: {
      y: position === 'top' ? -100 : 100,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: position === 'top' ? -100 : 100,
      opacity: 0,
    },
  };

  const progressVariants = {
    initial: { width: '100%' },
    animate: { width: '0%' },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (        <motion.div
          variants={bannerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          className={`
            fixed left-0 right-0 z-50
            ${position === 'top' ? 'top-0' : 'bottom-0'}
            ${className}
          `}
        >
          <div
            className={`
              bg-gradient-to-r ${currentStyle.background}
              border-b ${currentStyle.border}
              backdrop-blur-md
              shadow-lg ${currentStyle.glow}
              ${getResponsiveClasses()}
            `}
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              {/* 아이콘과 메시지 */}
              <div className="flex items-center space-x-3">
                {showIcon && Icon && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`flex-shrink-0 ${currentStyle.icon}`}
                  >
                    <Icon 
                      size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} 
                      className="drop-shadow-sm"
                    />
                  </motion.div>
                )}
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className={`
                    ${currentStyle.text} font-medium
                    leading-relaxed
                    ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
                  `}
                >
                  {message}
                </motion.p>
              </div>

              {/* 닫기 버튼 */}
              {closable && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className={`
                    flex-shrink-0 ml-4 p-1 rounded-full
                    ${currentStyle.text} hover:bg-white/10
                    transition-colors duration-200
                    touch-target min-h-[44px] min-w-[44px]
                    sm:min-h-[40px] sm:min-w-[40px]
                    flex items-center justify-center
                  `}
                  aria-label="알림 닫기"
                >
                  <X size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
                </motion.button>
              )}
            </div>

            {/* 자동 닫힘 진행 바 */}
            {autoClose > 0 && isVisible && (                <motion.div
                className={`
                  absolute bottom-0 left-0 h-1
                  bg-gradient-to-r ${currentStyle.background}
                  border-t ${currentStyle.border}
                `}
                variants={progressVariants}
                initial="initial"
                animate="animate"
                transition={{
                  duration: autoClose / 1000,
                  ease: "linear",
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
