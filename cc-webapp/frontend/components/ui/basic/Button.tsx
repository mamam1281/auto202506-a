'use client';

import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 변형 - 2025년 카지노 수준 */
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'neon' | 'premium' | 'gaming' | 'luxury' | 'cosmic';
  
  /** 버튼 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  
  /** 로딩 상태 */
  loading?: boolean;
  
  /** 아이콘 */
  icon?: React.ReactNode;
  
  /** 아이콘 위치 */
  iconPosition?: 'left' | 'right';
  
  /** 네온 효과 활성화 */
  neonEffect?: boolean;
  
  /** 글래스모피즘 효과 */
  glassMorphism?: boolean;
  
  /** 파티클 효과 */
  particles?: boolean;
  
  /** 글로우 효과 */
  glowEffect?: boolean;
  
  /** 애니메이션 타입 */
  animation?: 'none' | 'pulse' | 'bounce' | 'spin' | 'ping';
  
  /** 커스텀 CSS 클래스 */
  className?: string;
}

// 카지노 수준 버튼 스타일 매핑
const variantStyles = {
  default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
  primary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl",
  secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-lg",
  destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl",
  outline: "border-2 border-purple-500 bg-transparent text-purple-500 hover:bg-purple-500/10 hover:border-purple-400",
  ghost: "hover:bg-purple-500/10 hover:text-purple-400 text-gray-300",
  link: "text-purple-400 underline-offset-4 hover:underline",
  
  // 🎰 카지노 프리미엄 스타일
  neon: "bg-black border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] font-bold tracking-wide",
  premium: "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] font-bold",
  gaming: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] font-mono font-bold",
  luxury: "bg-gradient-to-r from-purple-800 via-pink-700 to-purple-800 text-white hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] font-bold",
  cosmic: "bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white hover:from-indigo-800 hover:via-purple-700 hover:to-pink-800 shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:shadow-[0_0_35px_rgba(99,102,241,0.9)] font-bold"
};

const sizeStyles = {
  xs: "h-7 px-2 text-xs rounded-lg",
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-base rounded-lg",
  lg: "h-12 px-6 text-lg rounded-xl",
  xl: "h-14 px-8 text-xl rounded-xl",
  '2xl': "h-16 px-10 text-2xl rounded-2xl"
};

const animationStyles = {
  none: "",
  pulse: "animate-pulse",
  bounce: "animate-bounce", 
  spin: "animate-spin",
  ping: "animate-ping"
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  neonEffect = false,
  glassMorphism = false,
  particles = false,
  glowEffect = false,
  animation = 'none',
  className = '',
  children,
  disabled,
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  return (
    <motion.div
      whileHover={!isDisabled ? { 
        scale: 1.05, 
        y: -2,
        transition: { duration: 0.2 } 
      } : {}}
      whileTap={!isDisabled ? { 
        scale: 0.95, 
        y: 0,
        transition: { duration: 0.1 } 
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        ref={ref}
        className={cn(
          // 기본 스타일
          "relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 overflow-hidden",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          
          // 크기 스타일
          sizeStyles[size],
          
          // 변형 스타일  
          variantStyles[variant],
          
          // 애니메이션
          animationStyles[animation],
          
          // 전체 너비
          fullWidth && "w-full",
          
          // 글래스모피즘
          glassMorphism && "backdrop-blur-md bg-opacity-20",
          
          // 네온 효과 추가
          neonEffect && "animate-pulse",
          
          className
        )}
        disabled={isDisabled}
        onClick={onClick}
        {...props}      >
        {/* 로딩 스피너 */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 버튼 내용 */}
        <motion.div
          className={cn("flex items-center gap-2", loading && "opacity-0")}
          initial={false}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {icon && iconPosition === 'left' && (
            <motion.span
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              {icon}
            </motion.span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <motion.span
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              {icon}
            </motion.span>
          )}
        </motion.div>

        {/* 글로우 효과 */}
        {glowEffect && !isDisabled && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        )}

        {/* 파티클 효과 */}
        {particles && !isDisabled && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-current rounded-full opacity-60"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* 네온 테두리 애니메이션 */}
        {neonEffect && !isDisabled && (
          <motion.div
            className="absolute inset-0 rounded-inherit border-2 border-purple-500 opacity-0"
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </button>
    </motion.div>
  );
});

Button.displayName = 'Button';

export default Button;