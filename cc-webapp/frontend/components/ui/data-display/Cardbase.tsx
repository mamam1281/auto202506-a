'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardBaseProps {
  /** 카드 제목 */
  title: string;
  
  /** 카드 설명 */
  description?: string;
  
  /** 카드 이미지 URL */
  image?: string;
  
  /** 카드 변형 */
  variant?: 'default' | 'gaming' | 'cosmic' | 'minimal';
  
  /** 카드 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 글로우 효과 활성화 */
  glow?: boolean;
  
  /** 호버 효과 활성화 */
  hover?: boolean;
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
  
  /** 자식 요소 */
  children?: React.ReactNode;
}

// Framer Motion props와 CardBase props 결합
type CardBaseMotionProps = CardBaseProps & Omit<HTMLMotionProps<"div">, keyof CardBaseProps>;

const CardBase = forwardRef<HTMLDivElement, CardBaseMotionProps>(({
  title, 
  description, 
  image, 
  variant = 'default',
  size = 'md',
  glow = true,
  hover = true,
  onClick,
  className = '', 
  children,
  ...motionProps
}, ref) => {
  
  // 반응형 크기 클래스 (통합_반응형_가이드.md 기준)
  const getSizeClasses = () => {
    const sizes = {
      sm: {
        height: 'min-h-[240px] sm:min-h-[260px]',
        padding: 'p-4 sm:p-5',
        image: 'h-24 sm:h-28',
        title: 'text-base sm:text-lg',
        description: 'text-xs sm:text-sm',
      },
      md: {
        height: 'min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]',
        padding: 'p-4 sm:p-6',
        image: 'h-32 sm:h-36 lg:h-40',
        title: 'text-lg sm:text-xl',
        description: 'text-sm sm:text-base',
      },
      lg: {
        height: 'min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]',
        padding: 'p-6 sm:p-8',
        image: 'h-40 sm:h-44 lg:h-48',
        title: 'text-xl sm:text-2xl',
        description: 'text-base sm:text-lg',
      },
    };
    return sizes[size];
  };

  // 변형별 스타일
  const getVariantStyles = () => {
    const variants = {
      default: {
        background: 'from-gray-900/90 to-gray-800/90',
        border: 'border-gray-600/30',
        glowColor: 'rgba(99, 102, 241, 0.1)',
        textPrimary: 'text-white',
        textSecondary: 'text-gray-300',
      },
      gaming: {
        background: 'from-purple-900/90 to-pink-900/90',
        border: 'border-purple-500/30',
        glowColor: 'rgba(147, 51, 234, 0.15)',
        textPrimary: 'text-white',
        textSecondary: 'text-purple-200',
      },
      cosmic: {
        background: 'from-indigo-900/90 to-purple-900/90',
        border: 'border-indigo-400/30',
        glowColor: 'rgba(123, 41, 205, 0.15)',
        textPrimary: 'text-white',
        textSecondary: 'text-indigo-200',
      },
      minimal: {
        background: 'from-slate-100 to-white',
        border: 'border-slate-200',
        glowColor: 'rgba(0, 0, 0, 0.05)',
        textPrimary: 'text-slate-900',
        textSecondary: 'text-slate-600',
      },
    };
    return variants[variant];
  };

  const sizeClasses = getSizeClasses();
  const variantStyles = getVariantStyles();

  // 애니메이션 설정
  const cardVariants = {
    default: { 
      scale: 1, 
      y: 0,
      rotateX: 0,
    },
    hover: { 
      scale: hover ? 1.02 : 1, 
      y: hover ? -4 : 0,
      rotateX: hover ? 5 : 0,
    },
    tap: { 
      scale: 0.98, 
      y: 0,
      rotateX: 0,
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer group
        bg-gradient-to-br ${variantStyles.background}
        border ${variantStyles.border}
        ${sizeClasses.height} h-full
        flex flex-col
        backdrop-blur-sm
        transition-all duration-300
        touch-target
        ${className}
      `}
      variants={cardVariants}
      initial="default"
      whileHover={hover ? "hover" : "default"}
      whileTap="tap"
      onClick={onClick}
      style={{
        transformPerspective: '1000px',
        boxShadow: glow ? `0 4px 20px ${variantStyles.glowColor}, 0 0 0 1px ${variantStyles.glowColor}` : undefined,
      }}
      {...motionProps}
    >
      {/* 글로우 효과 배경 */}
      {glow && (
        <>
          <motion.div 
            className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-2xl opacity-20"
            style={{
              background: `linear-gradient(45deg, ${variantStyles.glowColor}, transparent, ${variantStyles.glowColor})`
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* 애니메이션 테두리 */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}
      
      <div className={`relative z-10 ${sizeClasses.padding} flex flex-col h-full`}>
        {/* 이미지 영역 */}
        {image && (
          <div className={`mb-4 ${sizeClasses.image} flex-shrink-0`}>
            <motion.div 
              className="h-full rounded-xl overflow-hidden relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                style={{
                  background: `linear-gradient(to top, ${variantStyles.glowColor}, transparent)`
                }}
              />
            </motion.div>
          </div>
        )}
        
        {/* 기본 이미지 플레이스홀더 */}
        {!image && (
          <div className={`mb-4 ${sizeClasses.image} flex-shrink-0`}>
            <div className={`h-full rounded-xl border-2 border-dashed ${variantStyles.border} flex items-center justify-center`}>
              <motion.div
                className={`text-4xl opacity-60 ${variantStyles.textSecondary}`}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⭐
              </motion.div>
            </div>
          </div>
        )}
        
        {/* 컨텐츠 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <h3 className={`mb-2 ${variantStyles.textPrimary} font-semibold ${sizeClasses.title} leading-tight`}>
            {title}
          </h3>
          
          {description && (
            <p className={`${variantStyles.textSecondary} ${sizeClasses.description} leading-relaxed flex-1`}>
              {description}
            </p>
          )}
          
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* 하단 네온 액센트 */}
      {glow && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(to right, ${variantStyles.glowColor}, transparent, ${variantStyles.glowColor})`
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
});

CardBase.displayName = 'CardBase';

export default CardBase;
