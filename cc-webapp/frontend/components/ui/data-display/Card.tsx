'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './Card.module.css';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  /** 카드 변형 */
  variant?: 'default' | 'game' | 'mission' | 'reward' | 'neon' | 'gradient';
  
  /** 카드 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** 클릭 가능 여부 */
  clickable?: boolean;
  
  /** 네온 효과 활성화 */
  neonEffect?: boolean;
  
  /** 애니메이션 활성화 */
  animated?: boolean;
  
  /** 그림자 크기 */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 패딩 크기 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
  
  /** 자식 요소 */
  children: React.ReactNode;
}

// 글래스모피즘 카드 애니메이션 variants
const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    backdropFilter: 'blur(20px)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  hover: { 
    scale: 1.02, 
    y: -8,
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    backdropFilter: 'blur(25px)',
    borderColor: 'rgba(123, 41, 205, 0.3)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(123, 41, 205, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
  },
  active: { 
    scale: 0.98, 
    y: -2,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(30px)',
    borderColor: 'rgba(135, 13, 209, 0.4)',
    boxShadow: '0 6px 25px rgba(135, 13, 209, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  }
};

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  clickable = false,
  neonEffect = false,
  animated = true,
  shadow = 'md',
  padding = 'md',
  onClick,
  className = '',
  children,
  ...motionProps
}) => {
  const classNames = [
    styles.card,
    styles[variant],
    styles[size],
    styles[`shadow-${shadow}`],
    styles[`padding-${padding}`],
    clickable && styles.clickable,
    neonEffect && styles.neonEffect,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };
  return (
    <motion.div
      className={classNames}
      variants={animated ? cardVariants : undefined}
      initial={animated ? "default" : undefined}
      whileHover={animated ? "hover" : undefined}
      whileTap={animated && clickable ? "active" : undefined}
      onClick={handleClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.3
      }}
      {...motionProps}
    >      {/* 네온 글로우 배경 애니메이션 */}
      {neonEffect && (
        <motion.div 
          className={styles.neonBackground}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            background: [
              'radial-gradient(circle at 30% 30%, rgba(123, 41, 205, 0.08), transparent 70%)',
              'radial-gradient(circle at 70% 70%, rgba(135, 13, 209, 0.12), transparent 70%)',
              'radial-gradient(circle at 30% 30%, rgba(123, 41, 205, 0.08), transparent 70%)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* 호버 시 글래스 네온 테두리 */}
      {neonEffect && (
        <motion.div
          className={styles.neonBorder}
          initial={{ opacity: 0 }}
          whileHover={{ 
            opacity: [0, 1, 0.8],
            scale: [1, 1.01, 1],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      )}
      
      {/* 모서리 액센트 라인 */}
      {neonEffect && (
        <>
          <div className={styles.cornerAccent}>
            <motion.div 
              className={styles.cornerTop}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                boxShadow: [
                  '0 0 3px rgba(123, 41, 205, 0.3)',
                  '0 0 8px rgba(123, 41, 205, 0.5)',
                  '0 0 3px rgba(123, 41, 205, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className={styles.cornerLeft}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                boxShadow: [
                  '0 0 3px rgba(123, 41, 205, 0.3)',
                  '0 0 8px rgba(123, 41, 205, 0.5)',
                  '0 0 3px rgba(123, 41, 205, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <div className={styles.cornerAccentBottom}>
            <motion.div 
              className={styles.cornerBottom}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                boxShadow: [
                  '0 0 3px rgba(128, 84, 242, 0.3)',
                  '0 0 8px rgba(128, 84, 242, 0.5)',
                  '0 0 3px rgba(128, 84, 242, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
            <motion.div 
              className={styles.cornerRight}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                boxShadow: [
                  '0 0 3px rgba(128, 84, 242, 0.3)',
                  '0 0 8px rgba(128, 84, 242, 0.5)',
                  '0 0 3px rgba(128, 84, 242, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          </div>
        </>
      )}
      
      {/* 컨텐츠 */}
      <div className={styles.content}>
        {children}
      </div>
      
      {/* 하단 네온 액센트 */}
      {neonEffect && (
        <motion.div
          className={styles.bottomAccent}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              '0 0 5px rgba(123, 41, 205, 0.2)',
              '0 0 10px rgba(123, 41, 205, 0.4)',
              '0 0 5px rgba(123, 41, 205, 0.2)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
        {/* 글래스모피즘 라이트 스위프 */}
      {neonEffect && (
        <motion.div
          className={styles.lightSwipe}
          animate={{
            x: ['-150%', '150%'],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
        />
      )}
    </motion.div>
  );
};

export default Card;
