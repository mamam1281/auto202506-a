'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Coins, AlertTriangle, Zap, Star, Diamond, Crown } from 'lucide-react';
import { cn } from './utils/utils';

interface TokenBalanceProps {
  amount: number;
  tokenType?: 'coin' | 'gem' | 'xp' | 'star' | 'diamond';
  status?: 'normal' | 'warning' | 'critical';
  change?: 'none' | 'increase' | 'decrease';
  variant?: 'default' | 'neon' | 'premium' | 'gaming' | 'minimalist' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  onRecharge?: () => void;
  className?: string;
}

export function TokenBalanceWidget({ 
  amount, 
  tokenType = 'coin',
  status = 'normal', 
  change = 'none',
  variant = 'default',
  size = 'md',
  animated = true,
  onRecharge,
  className = '' 
}: TokenBalanceProps) {
  const formatAmount = (num: number | undefined | null) => {
    // 더 엄격한 유효성 검사
    if (num === undefined || num === null || isNaN(Number(num)) || typeof num !== 'number') {
      return '0';
    }
    
    const safeNum = Number(num);
    if (isNaN(safeNum)) {
      return '0';
    }
    
    if (safeNum >= 1000000) {
      return (safeNum / 1000000).toFixed(1) + 'M';
    }
    if (safeNum >= 1000) {
      return (safeNum / 1000).toFixed(1) + 'K';
    }
    
    try {
      return safeNum.toLocaleString();
    } catch (error) {
      return safeNum.toString();
    }
  };

  const getTokenConfig = () => {
    switch (tokenType) {
      case 'gem':
        return {
          icon: <Diamond className="w-5 h-5" />,
          name: '젬',
          color: 'text-purple-400',
          gradient: 'from-purple-500 to-pink-500',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          glow: 'shadow-purple-500/20'
        };
      case 'xp':
        return {
          icon: <Zap className="w-5 h-5" />,
          name: 'XP',
          color: 'text-blue-400',
          gradient: 'from-blue-500 to-cyan-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          glow: 'shadow-blue-500/20'
        };
      case 'star':
        return {
          icon: <Star className="w-5 h-5" />,
          name: '스타',
          color: 'text-yellow-400',
          gradient: 'from-yellow-500 to-orange-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          glow: 'shadow-yellow-500/20'
        };
      case 'diamond':
        return {
          icon: <Crown className="w-5 h-5" />,
          name: '다이아',
          color: 'text-cyan-400',
          gradient: 'from-cyan-500 to-teal-500',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          glow: 'shadow-cyan-500/20'
        };
      default: // coin
        return {
          icon: <Coins className="w-5 h-5" />,
          name: '코인',
          color: 'text-emerald-400',
          gradient: 'from-emerald-500 to-green-500',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-500/20'
        };
    }
  };
  const getStatusColor = () => {
    const tokenConfig = getTokenConfig();
    
    switch (status) {
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          glow: 'shadow-amber-500/20'
        };
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          glow: 'shadow-red-500/20'
        };
      default:
        return {
          ...tokenConfig,
          text: tokenConfig.color
        };
    }
  };

  const getVariantStyles = () => {
    const token = getTokenConfig();
    
    switch (variant) {
      case 'neon':
        return {
          container: cn(
            'relative backdrop-blur-xl bg-black/80',
            'border-2', token.border, 'rounded-2xl',
            'shadow-2xl', token.glow,
            'before:absolute before:inset-0 before:rounded-2xl',
            'before:bg-gradient-to-br before:from-white/5 before:to-transparent',
            'before:pointer-events-none',
            'hover:shadow-purple-500/40'
          ),
          pulse: true
        };
      case 'premium':
        return {
          container: cn(
            'relative backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90',
            'border border-yellow-400/30 rounded-2xl',
            'shadow-2xl shadow-yellow-500/20',
            'before:absolute before:inset-0 before:rounded-2xl',
            'before:bg-gradient-to-br before:from-yellow-400/10 before:to-amber-500/5',
            'before:pointer-events-none'
          ),
          pulse: false
        };
      case 'gaming':
        return {
          container: cn(
            'relative backdrop-blur-xl bg-slate-800/90',
            'border', token.border, 'rounded-xl',
            'shadow-xl', token.glow,
            'font-mono'
          ),
          pulse: true
        };
      case 'luxury':
        return {
          container: cn(
            'relative backdrop-blur-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50',
            'border border-purple-400/30 rounded-2xl',
            'shadow-2xl shadow-purple-500/20'
          ),
          pulse: false
        };
      case 'minimalist':
        return {
          container: cn(
            'relative backdrop-blur-sm bg-white/5',
            'border border-gray-400/20 rounded-xl',
            'shadow-lg'
          ),
          pulse: false
        };
      default:
        return {
          container: cn(
            'relative backdrop-blur-xl bg-slate-900/80',
            'border', token.border, 'rounded-2xl',
            'shadow-xl', token.glow
          ),
          pulse: false
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          text: 'text-lg',
          subtext: 'text-xs',
          icon: 'w-4 h-4'
        };
      case 'lg':
        return {
          container: 'p-8',
          text: 'text-3xl',
          subtext: 'text-base',
          icon: 'w-6 h-6'
        };
      case 'xl':
        return {
          container: 'p-10',
          text: 'text-4xl',
          subtext: 'text-lg',
          icon: 'w-8 h-8'
        };
      default: // md
        return {
          container: 'p-6',
          text: 'text-2xl',
          subtext: 'text-sm',
          icon: 'w-5 h-5'
        };
    }
  };

  const getChangeIcon = () => {
    switch (change) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const token = getTokenConfig();
  const colors = getStatusColor();
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const changeIcon = getChangeIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Main Container */}
      <div className={cn(variantStyles.container, sizeStyles.container, 'transition-all duration-300')}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(colors.bg, colors.border, 'border rounded-xl p-2')}
              animate={variantStyles.pulse && animated ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {token.icon}
            </motion.div>
            <div>
              <h3 className={cn(colors.text, 'font-bold', sizeStyles.subtext)}>
                {token.name} 잔고
              </h3>
              {change !== 'none' && (
                <div className="flex items-center gap-1 mt-1">
                  {changeIcon}
                  <span className={cn(sizeStyles.subtext, change === 'increase' ? 'text-emerald-400' : 'text-red-400')}>
                    {change === 'increase' ? '+' : '-'}5.2%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {status === 'warning' || status === 'critical' ? (
            <AlertTriangle className={cn(sizeStyles.icon, colors.text)} />
          ) : null}
        </div>

        {/* Amount Display */}
        <motion.div 
          className="mb-4"
          animate={animated ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={cn(colors.text, 'font-bold', sizeStyles.text, 'tracking-tight')}>
            {formatAmount(amount)}
          </div>          <div className={cn('text-gray-400', sizeStyles.subtext, 'mt-1')}>
            정확한 잔고: {formatAmount(amount)}
          </div>
        </motion.div>

        {/* Recharge Button */}
        {onRecharge && (
          <motion.button
            onClick={onRecharge}
            className={cn(
              'w-full bg-gradient-to-r', token.gradient,
              'text-white font-semibold py-3 px-4 rounded-xl',
              'shadow-lg hover:shadow-xl',
              'transition-all duration-300',
              'hover:scale-105 active:scale-95'
            )}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            충전하기
          </motion.button>
        )}

        {/* Floating Particles (for premium variants) */}
        {(variant === 'neon' || variant === 'premium') && animated && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={cn('absolute w-1 h-1', colors.bg, 'rounded-full')}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TokenBalanceWidget;
