'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 변형 */
  variant?: 'default' | 'outline' | 'filled' | 'neon' | 'glass' | 'premium' | 'gaming' | 'luxury' | 'minimal' | 'floating' | 'retro' | 'cosmic';
  
  /** 입력 필드 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** 입력 필드 상태 */
  state?: 'default' | 'focus' | 'error' | 'disabled' | 'success' | 'warning' | 'loading';
  
  /** 라벨 */
  label?: string;
  
  /** 플레이스홀더 애니메이션 */
  animatedPlaceholder?: boolean;
  
  /** 도움말 텍스트 */
  helperText?: string;
  
  /** 오류 메시지 */
  errorText?: string;
  
  /** 좌측 아이콘 */
  leftIcon?: React.ReactNode;
  
  /** 우측 아이콘 */
  rightIcon?: React.ReactNode;
  
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  
  /** 필수 여부 */
  required?: boolean;
  
  /** 네온 효과 활성화 */
  neonEffect?: boolean;
  
  /** 글래스모피즘 효과 */
  glassMorphism?: boolean;
  
  /** 로딩 상태 */
  loading?: boolean;
  
  /** 로딩 텍스트 */
  loadingText?: string;
  
  /** 커스텀 CSS 클래스 */
  className?: string;
  
  /** 컨테이너 CSS 클래스 */
  containerClassName?: string;
}

// 애니메이션 variants
const containerVariants = {
  default: { 
    scale: 1,
    opacity: 1
  },
  focus: { 
    scale: 1.02,
    opacity: 1
  },
  error: {
    scale: 1.01,
    opacity: 1
  }
};

const neonVariants = {
  default: {
    boxShadow: '0 0 0 0 rgba(168, 85, 247, 0)'
  },
  focus: {
    boxShadow: '0 0 30px 5px rgba(168, 85, 247, 0.4)'
  },
  neon: {
    boxShadow: [
      '0 0 5px rgba(168, 85, 247, 0.8)',
      '0 0 15px rgba(168, 85, 247, 0.6)',
      '0 0 25px rgba(168, 85, 247, 0.4)',
      '0 0 15px rgba(168, 85, 247, 0.6)',
      '0 0 5px rgba(168, 85, 247, 0.8)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 플레이스홀더 애니메이션
const placeholderVariants = {
  typing: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  state = 'default',
  label,
  animatedPlaceholder = false,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  required = false,
  neonEffect = false,
  glassMorphism = false,
  loading = false,
  loadingText = "처리 중...",
  className,
  containerClassName,
  placeholder,
  disabled,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder || '');
  
  const isError = state === 'error' || !!errorText;
  const isSuccess = state === 'success';
  const isDisabled = disabled || state === 'disabled' || loading;

  // 애니메이션 플레이스홀더 효과
  useEffect(() => {
    if (animatedPlaceholder && placeholder) {
      const originalText = placeholder;
      let currentIndex = 0;
      let isDeleting = false;
      
      const interval = setInterval(() => {
        if (!isDeleting) {
          setCurrentPlaceholder(originalText.slice(0, currentIndex + 1));
          currentIndex++;
          if (currentIndex === originalText.length) {
            setTimeout(() => {
              isDeleting = true;
            }, 2000);
          }
        } else {
          setCurrentPlaceholder(originalText.slice(0, currentIndex));
          currentIndex--;
          if (currentIndex === 0) {
            isDeleting = false;
            setTimeout(() => {}, 1000);
          }
        }
      }, isDeleting ? 50 : 100);

      return () => clearInterval(interval);
    }
  }, [animatedPlaceholder, placeholder]);

  // Variant별 스타일
  const getVariantStyles = () => {
    const baseStyles = "transition-all duration-300 ease-in-out";
    
    switch (variant) {
      case 'neon':
        return cn(
          baseStyles,
          "bg-slate-900/50 border-2 border-purple-500/50 text-purple-100",
          "focus:border-purple-400 focus:bg-slate-800/70",
          neonEffect && "animate-pulse",
          glassMorphism && "backdrop-blur-md bg-white/5"
        );
      
      case 'glass':
        return cn(
          baseStyles,
          "bg-white/10 backdrop-blur-md border border-white/20 text-white",
          "focus:bg-white/15 focus:border-white/30",
          "placeholder:text-white/50"
        );
        
      case 'premium':
        return cn(
          baseStyles,
          "bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-gold-400/30",
          "text-gold-100 focus:border-gold-400/60",
          "backdrop-blur-sm"
        );
        
      case 'gaming':
        return cn(
          baseStyles,
          "bg-slate-800 border-2 border-green-500/50 text-green-100",
          "focus:border-green-400 focus:bg-slate-700",
          "font-mono tracking-wider"
        );
        
      case 'luxury':
        return cn(
          baseStyles,
          "bg-black/50 border border-gold-500/50 text-gold-100",
          "focus:border-gold-400 focus:bg-black/70",
          "backdrop-blur-sm"
        );
        
      case 'cosmic':
        return cn(
          baseStyles,
          "bg-gradient-to-r from-indigo-900/30 to-purple-900/30",
          "border border-cyan-400/30 text-cyan-100",
          "focus:border-cyan-300 focus:bg-indigo-900/50",
          "backdrop-blur-md"
        );
        
      case 'filled':
        return cn(
          baseStyles,
          "bg-slate-100 border border-slate-300 text-slate-900",
          "focus:bg-white focus:border-blue-500",
          "dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
        );
        
      case 'outline':
        return cn(
          baseStyles,
          "bg-transparent border-2 border-slate-300 text-slate-900",
          "focus:border-blue-500",
          "dark:border-slate-600 dark:text-slate-100"
        );
        
      default:
        return cn(
          baseStyles,
          "bg-white border border-slate-300 text-slate-900",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
        );
    }
  };

  // 크기별 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return "px-2 py-1 text-xs rounded-md";
      case 'sm':
        return "px-3 py-1.5 text-sm rounded-md";
      case 'lg':
        return "px-4 py-3 text-lg rounded-lg";
      case 'xl':
        return "px-5 py-4 text-xl rounded-lg";
      case '2xl':
        return "px-6 py-5 text-2xl rounded-xl";
      default:
        return "px-3 py-2 text-base rounded-md";
    }
  };

  // 상태별 스타일
  const getStateStyles = () => {
    if (isError) {
      return "border-red-500 focus:border-red-400 text-red-900 dark:text-red-100";
    }
    if (isSuccess) {
      return "border-green-500 focus:border-green-400 text-green-900 dark:text-green-100";
    }
    if (isDisabled) {
      return "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800";
    }
    return "";
  };

  return (
    <motion.div
      className={cn(
        "relative",
        fullWidth ? "w-full" : "w-auto",
        containerClassName
      )}
      variants={containerVariants}
      initial="default"
      animate={isFocused ? "focus" : isError ? "error" : "default"}
    >
      {/* 라벨 */}
      {label && (
        <motion.label
          className={cn(
            "block text-sm font-medium mb-2",
            variant === 'neon' ? "text-purple-300" :
            variant === 'glass' ? "text-white/80" :
            variant === 'premium' ? "text-gold-300" :
            variant === 'gaming' ? "text-green-300" :
            variant === 'luxury' ? "text-gold-300" :
            variant === 'cosmic' ? "text-cyan-300" :
            "text-slate-700 dark:text-slate-300"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* 입력 필드 컨테이너 */}
      <motion.div
        className="relative"
        variants={neonEffect ? neonVariants : {}}
        animate={
          neonEffect ? "neon" :
          isFocused ? "focus" : "default"
        }
      >
        {/* 좌측 아이콘 */}
        {leftIcon && (
          <div className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 z-10",
            variant === 'neon' ? "text-purple-400" :
            variant === 'glass' ? "text-white/60" :
            variant === 'premium' ? "text-gold-400" :
            variant === 'gaming' ? "text-green-400" :
            variant === 'luxury' ? "text-gold-400" :
            variant === 'cosmic' ? "text-cyan-400" :
            "text-slate-500"
          )}>
            {leftIcon}
          </div>
        )}

        {/* 입력 필드 */}
        <motion.input
          ref={ref}
          className={cn(
            "w-full outline-none transition-all duration-300",
            getSizeStyles(),
            getVariantStyles(),
            getStateStyles(),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            loading && "pr-12",
            className
          )}
          placeholder={animatedPlaceholder ? currentPlaceholder : placeholder}
          disabled={isDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={animatedPlaceholder ? placeholderVariants.typing : {}}
          {...props}
        />

        {/* 우측 아이콘 또는 로딩 스피너 */}
        <AnimatePresence>
          {(rightIcon || loading) && (
            <motion.div
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2",
                variant === 'neon' ? "text-purple-400" :
                variant === 'glass' ? "text-white/60" :
                variant === 'premium' ? "text-gold-400" :
                variant === 'gaming' ? "text-green-400" :
                variant === 'luxury' ? "text-gold-400" :
                variant === 'cosmic' ? "text-cyan-400" :
                "text-slate-500"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                rightIcon
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 도움말 텍스트 또는 에러 메시지 */}
      <AnimatePresence>
        {(helperText || errorText || loading) && (
          <motion.div
            className={cn(
              "mt-2 text-sm",
              isError ? "text-red-600 dark:text-red-400" :
              isSuccess ? "text-green-600 dark:text-green-400" :
              variant === 'neon' ? "text-purple-400" :
              variant === 'glass' ? "text-white/70" :
              variant === 'premium' ? "text-gold-400" :
              variant === 'gaming' ? "text-green-400" :
              variant === 'luxury' ? "text-gold-400" :
              variant === 'cosmic' ? "text-cyan-400" :
              "text-slate-600 dark:text-slate-400"
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? loadingText : errorText || helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;
