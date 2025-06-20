import React from 'react';
import { motion } from 'framer-motion';
import styles from './TokenDisplay.module.css';

export interface TokenDisplayProps {
  /** 토큰 수량 */
  amount: number;
  
  /** 토큰 변화량 */
  change?: number;
  
  /** 표시 변형 */
  variant?: 'normal' | 'warning' | 'critical';
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 애니메이션 활성화 */
  animated?: boolean;
  
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  
  /** 변화량 표시 여부 */
  showChange?: boolean;
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  amount,
  change = 0,
  variant = 'normal',
  size = 'md',
  animated = true,
  showIcon = true,
  showChange = true,
  onClick,
  className = ''
}) => {
  // 상태 결정 로직 (통합 가이드 기준)
  const getVariantFromAmount = (amount: number): 'normal' | 'warning' | 'critical' => {
    if (amount < 100000) return 'critical';
    if (amount < 1000000) return 'warning';
    return 'normal';
  };

  const currentVariant = variant === 'normal' ? getVariantFromAmount(amount) : variant;
  
  const containerClassNames = [
    styles.container,
    styles[currentVariant],
    styles[size],
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  // 토큰 포맷팅 (1K, 1M 등)
  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  // 변화량 포맷팅
  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${formatTokenAmount(Math.abs(change))}`;
  };
  // 애니메이션 설정 (통합 애니메이션 가이드 기준)
  const containerVariants = {
    initial: { 
      scale: 0.95,
      opacity: 0,
      y: 10
    },
    animate: { 
      scale: 1,
      opacity: 1,
      y: 0
    },
    hover: {
      scale: 1.02
    },
    tap: {
      scale: 0.98
    }
  };

  const amountVariants = {
    initial: { scale: 1 },
    change: { 
      scale: [1, 1.1, 1]
    }
  };

  const changeVariants = {
    initial: { 
      opacity: 0,
      x: -10
    },
    animate: { 
      opacity: 1,
      x: 0
    }
  };

  const MotionContainer = onClick ? motion.button : motion.div;

  return (
    <MotionContainer
      className={containerClassNames}
      variants={animated ? containerVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated && onClick ? "hover" : undefined}
      whileTap={animated && onClick ? "tap" : undefined}
      onClick={onClick}
      layout={animated}
      role={onClick ? "button" : undefined}
      aria-label={`토큰 ${formatTokenAmount(amount)}개`}
    >
      {/* 상태 표시기 */}
      <div className={styles.statusIndicator} />
      
      {/* 아이콘 */}
      {showIcon && (
        <div className={styles.iconContainer}>
          <svg 
            className={styles.icon} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 토큰 수량 */}
        <motion.div 
          className={styles.amount}
          variants={animated ? amountVariants : undefined}
          animate={change !== 0 ? "change" : "initial"}
        >
          {formatTokenAmount(amount)}
        </motion.div>
        
        {/* 토큰 레이블 */}
        <div className={styles.label}>
          사이버 토큰
        </div>
        
        {/* 변화량 */}
        {showChange && change !== 0 && (
          <motion.div 
            className={`${styles.change} ${change > 0 ? styles.positive : styles.negative}`}
            variants={animated ? changeVariants : undefined}
            initial={animated ? "initial" : undefined}
            animate={animated ? "animate" : undefined}
          >
            {formatChange(change)}
          </motion.div>
        )}
      </div>

      {/* 트렌드 화살표 */}
      {showChange && change !== 0 && (
        <div className={`${styles.trend} ${change > 0 ? styles.up : styles.down}`}>
          <svg 
            className={styles.trendIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {change > 0 ? (
              <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M17 10l-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </div>
      )}

      {/* 글로우 효과 */}
      <div className={styles.glow} />
    </MotionContainer>
  );
};

export default TokenDisplay;
