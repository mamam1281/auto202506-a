import React from 'react';
import { motion } from 'framer-motion';
import styles from './TokenBalanceWidget.module.css';

export interface TokenBalanceWidgetProps {
  /** 토큰 수량 */
  amount: number;
  
  /** 상태 (통합 가이드 기준) */
  status?: 'normal' | 'warning' | 'critical';
  
  /** 변화 방향 */
  change?: 'none' | 'increase' | 'decrease';
  
  /** 변화량 (선택적) */
  changeAmount?: number;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

const TokenBalanceWidget: React.FC<TokenBalanceWidgetProps> = ({
  amount,
  status,
  change = 'none',
  changeAmount,
  size = 'md',
  onClick,
  className = ''
}) => {
  // 자동 상태 결정 (status가 명시적으로 제공되지 않은 경우)
  const determineStatus = (amount: number): 'normal' | 'warning' | 'critical' => {
    if (amount < 100000) return 'critical';
    if (amount < 1000000) return 'warning';
    return 'normal';
  };

  const currentStatus = status || determineStatus(amount);

  // 숫자 포맷팅 (Monospace 적용)
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString();
  };

  // 변화량 포맷팅
  const formatChange = (change: 'none' | 'increase' | 'decrease', amount?: number): string => {
    if (change === 'none' || !amount) return '';
    const prefix = change === 'increase' ? '+' : '-';
    return `${prefix}${amount.toLocaleString()}`;
  };

  // 애니메이션 설정 (통합 가이드 기준)
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    increase: { rotate: [0, 15, 0], scale: [1, 1.2, 1] },
    decrease: { rotate: [0, -15, 0], scale: [1, 1.2, 1] },
    normal: { scale: [1, 1.1, 1] }
  };

  const containerClassNames = [
    styles.container,
    styles[size],
    styles[currentStatus],
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={containerClassNames}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={onClick ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      onClick={onClick}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* 토큰 아이콘 (Auto Layout) */}
      <div className={styles.iconContainer}>
        <motion.div
          className={styles.tokenIcon}
          variants={iconVariants}
          animate={change !== 'none' ? change : 'normal'}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            repeat: change !== 'none' ? 1 : 0
          }}
        >
          💎
        </motion.div>
      </div>

      {/* 수치 텍스트 (Monospace) */}
      <div className={styles.amountContainer}>
        <motion.div
          className={styles.amount}
          key={amount}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatAmount(amount)}
        </motion.div>
        <div className={styles.label}>TOKENS</div>
      </div>

      {/* 변화 인디케이터 (+/-) */}
      {change !== 'none' && changeAmount && (
        <motion.div
          className={`${styles.changeIndicator} ${styles[change]}`}
          initial={{ opacity: 0, x: change === 'increase' ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className={styles.changeIcon}>
            {change === 'increase' ? '↗️' : '↘️'}
          </span>
          <span className={styles.changeAmount}>
            {formatChange(change, changeAmount)}
          </span>
        </motion.div>
      )}

      {/* 경고 상태 (부족 시 주황색) */}
      {currentStatus !== 'normal' && (
        <motion.div
          className={styles.statusIndicator}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <span className={styles.statusIcon}>
            {currentStatus === 'critical' ? '⚠️' : '⚡'}
          </span>
          <span className={styles.statusText}>
            {currentStatus === 'critical' ? 'Low Balance' : 'Running Low'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TokenBalanceWidget;
