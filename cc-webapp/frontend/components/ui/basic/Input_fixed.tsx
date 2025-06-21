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
    boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
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
      ease: "easeInOut" as const
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
  loadingText = '로딩 중...',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(props.placeholder || '');

  // 플레이스홀더 타이핑 애니메이션
  useEffect(() => {
    if (animatedPlaceholder && props.placeholder) {
      let i = 0;
      const placeholder = props.placeholder;
      const typingInterval = setInterval(() => {
        if (i < placeholder.length) {
          setAnimatedText(placeholder.slice(0, i + 1));
          i++;
        } else {
          setTimeout(() => {
            setAnimatedText('');
            i = 0;
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [animatedPlaceholder, props.placeholder]);

  // Variant별 스타일 매핑
  const variantStyles = {
    default: 'border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    outline: 'border-2 border-gray-300 bg-transparent text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    filled: 'border-0 bg-gray-100 text-gray-900 focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20',
    neon: 'border-2 border-purple-500/50 bg-black/50 text-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    glass: 'border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-2 focus:ring-white/20',
    premium: 'border-2 border-gradient-to-r from-gold-400 to-gold-600 bg-gradient-to-br from-amber-50 to-yellow-50 text-gray-900 focus:from-gold-500 focus:to-gold-700',
    gaming: 'border-2 border-green-500/50 bg-black/80 text-green-400 font-mono focus:border-green-400 focus:ring-2 focus:ring-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    luxury: 'border-2 border-purple-400/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20 text-white focus:border-purple-300 focus:ring-2 focus:ring-purple-400/50',
    minimal: 'border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 rounded-none focus:border-blue-500 focus:ring-0',
    floating: 'border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pt-6',
    retro: 'border-4 border-yellow-400 bg-yellow-100 text-gray-900 font-mono focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50 shadow-[4px_4px_0px_rgb(251,191,36)]',
    cosmic: 'border-2 border-cyan-500/50 bg-gradient-to-br from-blue-900/50 to-purple-900/50 text-cyan-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
  };

  // 크기별 스타일 매핑
  const sizeStyles = {
    xs: 'h-8 px-2 text-xs',
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg',
    xl: 'h-14 px-6 text-xl',
    '2xl': 'h-16 px-8 text-2xl'
  };

  // 상태별 스타일 매핑
  const stateStyles = {
    default: '',
    focus: 'ring-2 ring-blue-500/20',
    error: 'border-red-500 ring-2 ring-red-500/20 text-red-900',
    disabled: 'opacity-50 cursor-not-allowed bg-gray-100',
    success: 'border-green-500 ring-2 ring-green-500/20 text-green-900',
    warning: 'border-yellow-500 ring-2 ring-yellow-500/20 text-yellow-900',
    loading: 'opacity-75 cursor-wait'
  };

  const currentState = errorText ? 'error' : state;
  const displayPlaceholder = animatedPlaceholder ? animatedText : currentPlaceholder;

  return (
    <motion.div
      className={cn(
        'relative',
        fullWidth ? 'w-full' : 'w-auto',
        containerClassName
      )}
      variants={containerVariants}
      animate={isFocused ? 'focus' : currentState === 'error' ? 'error' : 'default'}
      transition={{ duration: 0.2 }}
    >
      {/* 라벨 */}
      {label && (
        <motion.label
          className={cn(
            'block mb-2 text-sm font-medium transition-colors duration-200',
            currentState === 'error' ? 'text-red-600' : 'text-gray-700',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}

      {/* 입력 필드 컨테이너 */}
      <motion.div
        className="relative"
        variants={neonEffect ? neonVariants : {}}
        animate={neonEffect ? 'neon' : isFocused ? 'focus' : 'default'}
      >
        {/* 좌측 아이콘 */}
        {leftIcon && (
          <div className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 z-10',
            'text-gray-400',
            sizeStyles[size].includes('text-xs') ? 'w-3 h-3' :
            sizeStyles[size].includes('text-sm') ? 'w-4 h-4' :
            sizeStyles[size].includes('text-lg') ? 'w-6 h-6' :
            sizeStyles[size].includes('text-xl') ? 'w-7 h-7' :
            sizeStyles[size].includes('text-2xl') ? 'w-8 h-8' : 'w-5 h-5'
          )}>
            {leftIcon}
          </div>
        )}

        {/* 입력 필드 */}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg transition-all duration-300 ease-in-out',
            'placeholder:text-gray-400 placeholder:transition-opacity placeholder:duration-300',
            'focus:outline-none focus:transition-all focus:duration-300',
            variantStyles[variant],
            sizeStyles[size],
            stateStyles[currentState],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            glassMorphism && 'backdrop-blur-md',
            className
          )}
          placeholder={displayPlaceholder}
          disabled={loading || props.disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* 우측 아이콘 또는 로딩 */}
        {(rightIcon || loading) && (
          <div className={cn(
            'absolute right-3 top-1/2 transform -translate-y-1/2 z-10',
            'text-gray-400',
            sizeStyles[size].includes('text-xs') ? 'w-3 h-3' :
            sizeStyles[size].includes('text-sm') ? 'w-4 h-4' :
            sizeStyles[size].includes('text-lg') ? 'w-6 h-6' :
            sizeStyles[size].includes('text-xl') ? 'w-7 h-7' :
            sizeStyles[size].includes('text-2xl') ? 'w-8 h-8' : 'w-5 h-5'
          )}>
            {loading ? (
              <motion.div
                className="border-2 border-gray-300 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : rightIcon}
          </div>
        )}

        {/* 플로팅 라벨 (floating variant용) */}
        {variant === 'floating' && label && (
          <motion.label
            className={cn(
              'absolute left-4 transition-all duration-200 pointer-events-none',
              isFocused || props.value
                ? 'top-2 text-xs text-blue-600'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
            )}
            animate={{
              top: isFocused || props.value ? '8px' : '50%',
              fontSize: isFocused || props.value ? '12px' : '16px',
              color: isFocused ? '#2563eb' : '#9ca3af'
            }}
          >
            {label}
          </motion.label>
        )}
      </motion.div>

      {/* 도움말 및 오류 메시지 */}
      <AnimatePresence>
        {(helperText || errorText) && (
          <motion.div
            className="mt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errorText ? (
              <motion.p
                className="text-sm text-red-600 flex items-center gap-1"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorText}
              </motion.p>
            ) : (
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {helperText}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로딩 오버레이 */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <motion.div
                className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {loadingText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;
