'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { 
  // Coins, // Currently unused
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  AlertCircle, 
  CheckCircle,
  Activity,
  ExternalLink
} from 'lucide-react';

export interface TokenDisplayProps {
  /** 토큰 수량 */
  amount: number;
  
  /** 토큰 변화량 */
  change?: number;
  
  /** 이전 토큰 수량 (애니메이션용) */
  previousAmount?: number;
  
  /** 표시 변형 - auto는 자동 상태 결정 */
  variant?: 'auto' | 'healthy' | 'warning' | 'critical' | 'cosmic';
  
  /** 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 표시 모드 */
  mode?: 'compact' | 'widget' | 'card';
  
  /** 애니메이션 활성화 */
  animated?: boolean;
  
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  
  /** 변화량 표시 여부 */
  showChange?: boolean;
  
  /** 상태 메시지 표시 여부 */
  showStatus?: boolean;
  
  /** 진행 바 표시 여부 (widget 모드) */
  showProgress?: boolean;
  
  /** 글로우 효과 */
  glow?: boolean;
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
  
  /** 커스텀 토큰 아이콘 */
  icon?: React.ReactNode;
  
  /** 토큰 단위 표시 */
  unit?: string;
  
  /** 위젯 제목 (widget 모드) */
  title?: string;
  
  /** 위젯 설명 (widget 모드) */
  description?: string;
  
  /** 액션 버튼 (widget 모드) */
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

// Framer Motion props와 TokenDisplay props 결합
type TokenDisplayMotionProps = TokenDisplayProps & Omit<HTMLMotionProps<"div">, keyof TokenDisplayProps>;

const TokenDisplayAdvanced = forwardRef<HTMLDivElement, TokenDisplayMotionProps>(({
  amount,
  change = 0,
  previousAmount,
  variant = 'auto',
  size = 'md',
  mode = 'compact',
  animated = true,
  showIcon = true,
  showChange = true,
  showStatus = false,
  showProgress = false,
  glow = false,
  onClick,
  className = '',
  icon,
  unit = '',
  title,
  description,
  actionButton,
  ...motionProps
}, ref) => {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);

  // 토큰 수량 변화 애니메이션
  useEffect(() => {
    if (animated && previousAmount !== undefined && previousAmount !== amount) {
      setIsAnimating(true);
      const startTime = Date.now();
      const duration = 1200;
      const startAmount = previousAmount;
      const endAmount = amount;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentAmount = Math.round(startAmount + (endAmount - startAmount) * eased);
        
        setDisplayAmount(currentAmount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayAmount(amount);
    }
  }, [amount, previousAmount, animated]);

  // 상태별 임계값 설정 (이미지 기준)
  const getTokenStatus = (amount: number) => {
    if (amount < 300000) return 'critical';   // < 300K = Critical
    if (amount < 500000) return 'warning';    // 300K-500K = Warning  
    return 'healthy';                         // 500K+ = Healthy
  };

  // 최종 변형 결정
  const finalVariant = variant === 'auto' ? getTokenStatus(amount) : variant;

  // 상태별 완전한 스타일 시스템
  const getStatusConfig = () => {
    const configs = {
      healthy: {
        background: 'from-teal-800/80 via-green-800/70 to-emerald-800/80',
        border: 'border-green-400/30',
        text: 'text-green-100',
        amount: 'text-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-400',
        glow: 'rgba(34, 197, 94, 0.25)',
        message: 'Balance is healthy',
        progressColor: 'bg-green-500',
        progressBg: 'bg-green-500/20',
        buttonBg: 'from-green-600 to-green-700 hover:from-green-500 hover:to-green-600',
      },
      warning: {
        background: 'from-yellow-800/80 via-orange-800/70 to-amber-800/80',
        border: 'border-yellow-400/30',
        text: 'text-yellow-100',
        amount: 'text-yellow-200',
        icon: AlertTriangle,
        iconColor: 'text-yellow-400',
        glow: 'rgba(234, 179, 8, 0.25)',
        message: 'Token balance is running low',
        progressColor: 'bg-yellow-500',
        progressBg: 'bg-yellow-500/20',
        buttonBg: 'from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600',
      },
      critical: {
        background: 'from-red-800/80 via-rose-800/70 to-pink-800/80',
        border: 'border-red-400/30',
        text: 'text-red-100',
        amount: 'text-red-200',
        icon: AlertCircle,
        iconColor: 'text-red-400',
        glow: 'rgba(239, 68, 68, 0.3)',
        message: 'Critical: Token balance is very low',
        progressColor: 'bg-red-500',
        progressBg: 'bg-red-500/20',
        buttonBg: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
      },
      cosmic: {
        background: 'from-purple-800/80 via-indigo-800/70 to-violet-800/80',
        border: 'border-purple-400/30',
        text: 'text-purple-100',
        amount: 'text-purple-200',
        icon: Activity,
        iconColor: 'text-purple-400',
        glow: 'rgba(147, 51, 234, 0.3)',
        message: 'Cosmic energy flowing',
        progressColor: 'bg-purple-500',
        progressBg: 'bg-purple-500/20',
        buttonBg: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
      },
    };
    return configs[finalVariant] || configs.healthy;
  };

  // 반응형 크기 클래스
  const getSizeClasses = () => {
    const sizes = {
      xs: { container: 'px-2 py-1 text-xs', icon: 'w-3 h-3', gap: 'gap-1' },
      sm: { container: 'px-3 py-1.5 text-sm', icon: 'w-4 h-4', gap: 'gap-1.5' },
      md: { container: 'px-4 py-2 text-base', icon: 'w-5 h-5', gap: 'gap-2' },
      lg: { container: 'px-5 py-2.5 text-lg', icon: 'w-6 h-6', gap: 'gap-2.5' },
      xl: { container: 'px-6 py-3 text-xl', icon: 'w-7 h-7', gap: 'gap-3' },
    };
    return sizes[size];
  };

  const statusConfig = getStatusConfig();
  const sizeClasses = getSizeClasses();
  const StatusIcon = statusConfig.icon;

  // 토큰 포맷팅
  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toLocaleString();
  };

  // 변화량 포맷팅
  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${formatTokenAmount(Math.abs(change))}`;
  };

  // 변화량 아이콘
  const getChangeIcon = () => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  // 진행률 계산 (500K를 100%로 기준)
  const getProgressPercentage = () => {
    const maxAmount = 500000;
    return Math.min((amount / maxAmount) * 100, 100);
  };

  // 애니메이션 설정
  const containerVariants = {
    initial: { scale: 0.95, opacity: 0, y: 5 },
    animate: { scale: 1, opacity: 1, y: 0 },
    hover: { scale: onClick ? 1.02 : 1 },
    tap: { scale: onClick ? 0.98 : 1 }
  };

  const amountVariants = {
    initial: { scale: 1 },
    pulse: { scale: [1, 1.05, 1] }
  };

  // 컴팩트 모드 렌더링
  if (mode === 'compact') {
    return (
      <motion.div
        ref={ref}
        className={`
          inline-flex items-center ${sizeClasses.gap} ${sizeClasses.container}
          bg-gradient-to-r ${statusConfig.background}
          border ${statusConfig.border}
          rounded-lg backdrop-blur-sm
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        style={{ boxShadow: glow ? `0 4px 20px ${statusConfig.glow}` : undefined }}
        {...motionProps}
      >
        {showIcon && (
          <div className={statusConfig.iconColor}>
            {icon || <StatusIcon className={sizeClasses.icon} />}
          </div>
        )}
        
        <motion.span
          className={`font-semibold ${statusConfig.amount}`}
          variants={amountVariants}
          animate={isAnimating ? "pulse" : "initial"}
        >
          {formatTokenAmount(displayAmount)}{unit}
        </motion.span>
        
        {showChange && change !== 0 && (
          <div className="flex items-center gap-1">
            {getChangeIcon()}
            <span className="text-xs">{formatChange(change)}</span>
          </div>
        )}
      </motion.div>
    );
  }

  // 위젯 모드 렌더링 (이미지와 동일한 스타일)
  if (mode === 'widget') {
    return (
      <motion.div
        ref={ref}
        className={`
          w-full max-w-md mx-auto
          bg-gradient-to-br ${statusConfig.background}
          border ${statusConfig.border}
          rounded-2xl backdrop-blur-md
          p-6 space-y-4
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        style={{ 
          boxShadow: glow ? `0 8px 32px ${statusConfig.glow}, 0 0 0 1px ${statusConfig.glow}` : undefined 
        }}
        {...motionProps}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={statusConfig.iconColor}>
              {icon || <StatusIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={`font-medium ${statusConfig.text}`}>
                {title || 'Token Balance'}
              </h3>
              <p className={`text-sm opacity-80 ${statusConfig.text}`}>
                {description || 'Available Tokens'}
              </p>
            </div>
          </div>
          {onClick && (
            <ExternalLink className={`w-4 h-4 ${statusConfig.iconColor} opacity-60`} />
          )}
        </div>

        {/* 메인 토큰 표시 */}
        <div className="space-y-2">
          <motion.div
            className={`text-4xl font-bold ${statusConfig.amount}`}
            variants={amountVariants}
            animate={isAnimating ? "pulse" : "initial"}
          >
            {formatTokenAmount(displayAmount)}
          </motion.div>
          
          <p className={`text-sm ${statusConfig.text} opacity-80`}>
            {amount.toLocaleString()} tokens
          </p>
        </div>

        {/* 진행 바 */}
        {showProgress && (
          <div className="space-y-2">
            <div className={`w-full h-2 ${statusConfig.progressBg} rounded-full overflow-hidden`}>
              <motion.div
                className={`h-full ${statusConfig.progressColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* 상태 메시지 */}
        {showStatus && (
          <p className={`text-sm ${statusConfig.text} opacity-90`}>
            {statusConfig.message}
          </p>
        )}

        {/* 변화량 표시 */}
        {showChange && change !== 0 && (
          <div className="flex items-center gap-2">
            {getChangeIcon()}
            <span className={`text-sm ${statusConfig.text}`}>
              {formatChange(change)} {change > 0 ? 'gained' : 'spent'}
            </span>
          </div>
        )}

        {/* 액션 버튼 */}
        {actionButton && (
          <motion.button
            className={`
              w-full py-3 px-4 rounded-xl
              bg-gradient-to-r ${statusConfig.buttonBg}
              text-white font-medium
              transition-all duration-200
              flex items-center justify-center gap-2
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={actionButton.onClick}
          >
            <Activity className="w-4 h-4" />
            {actionButton.text}
          </motion.button>
        )}
      </motion.div>
    );
  }

  // 카드 모드 렌더링
  return (
    <motion.div
      ref={ref}
      className={`
        p-4 rounded-xl
        bg-gradient-to-r ${statusConfig.background}
        border ${statusConfig.border}
        backdrop-blur-sm
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      style={{ boxShadow: glow ? `0 6px 24px ${statusConfig.glow}` : undefined }}
      {...motionProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showIcon && (
            <div className={statusConfig.iconColor}>
              {icon || <StatusIcon className="w-6 h-6" />}
            </div>
          )}
          <div>
            <motion.div
              className={`text-2xl font-bold ${statusConfig.amount}`}
              variants={amountVariants}
              animate={isAnimating ? "pulse" : "initial"}
            >
              {formatTokenAmount(displayAmount)}{unit}
            </motion.div>
            {showStatus && (
              <p className={`text-sm ${statusConfig.text} opacity-80`}>
                {statusConfig.message}
              </p>
            )}
          </div>
        </div>
        
        {showChange && change !== 0 && (
          <div className="flex items-center gap-2">
            {getChangeIcon()}
            <span className={`font-medium ${statusConfig.text}`}>
              {formatChange(change)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

TokenDisplayAdvanced.displayName = 'TokenDisplayAdvanced';

const TokenDisplay = TokenDisplayAdvanced;
export default TokenDisplayAdvanced;
export { TokenDisplay };
