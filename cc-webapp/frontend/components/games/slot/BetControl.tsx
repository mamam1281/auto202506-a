'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../Button';
import { Minus, Plus, Gem } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface BetControlProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  minBet?: number;
  maxBet: number;
  step?: number;
  quickBetOptions?: number[];
  disabled?: boolean;
  className?: string;
}

export const BetControl: React.FC<BetControlProps> = ({
  betAmount,
  setBetAmount,
  minBet = 5,
  maxBet,
  step = 5,
  quickBetOptions = [5, 10, 25, 50, 100],
  disabled = false,
  className = '',
}) => {
  const increaseBet = () => {
    setBetAmount(Math.min(betAmount + step, maxBet));
  };

  const decreaseBet = () => {
    setBetAmount(Math.max(betAmount - step, minBet));
  };

  const handleQuickBetSelect = (amount: number) => {
    if (amount <= maxBet && amount >= minBet) {
      setBetAmount(amount);
    } else if (amount > maxBet) {
      setBetAmount(maxBet);
    } else {
      setBetAmount(minBet);
    }
  };

  return (
    <div className={cn("w-full bg-gradient-to-br from-[var(--color-surface-primary)] to-[var(--color-surface-secondary)] rounded-2xl border border-[var(--color-border-primary)] py-[20px] px-8 sm:px-12 mx-auto", className)}>
      {/* Bet Amount Adjust Buttons & Display */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-accent-amber)]">베팅 금액 조절</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">베팅 금액을 선택하여 더 큰 상금에 도전하세요</p>
        </div>
      
        <div className="w-full flex items-center justify-center gap-4 sm:gap-6 mb-4">
          <motion.button
            onClick={decreaseBet}
            disabled={disabled || betAmount <= minBet}
            className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 text-[var(--color-accent-amber)] rounded-xl shadow-xl transform transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-amber)]/50 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed",
              disabled || betAmount <= minBet 
                ? "bg-[var(--color-surface-tertiary)] border-2 border-[var(--color-border-secondary)]" 
                : "bg-gradient-to-b from-[var(--color-surface-secondary)]/70 to-[var(--color-surface-tertiary)]/70 border-2 border-[var(--color-accent-amber)]/30 hover:from-[var(--color-surface-primary)]/70 hover:to-[var(--color-surface-secondary)]/70 hover:border-[var(--color-accent-amber)]/50 active:scale-95"
            )}
            whileTap={!(disabled || betAmount <= minBet) ? { scale: 0.90 } : {}}
          >
            <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>

          <div className="text-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[var(--color-accent-amber)]/30 via-[var(--color-accent-yellow)]/30 to-[var(--color-accent-amber)]/30 border-2 border-[var(--color-accent-amber)]/50 rounded-2xl backdrop-blur-sm shadow-xl min-w-[160px] sm:min-w-[200px]">
            <div className="text-sm font-medium text-[var(--color-accent-amber)]/90 mb-1 tracking-wide">현재 베팅액</div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] flex items-center justify-center gap-2">
              <Gem size={20} className="opacity-80 inline-block" />
              {betAmount}
            </div>
          </div>

          <motion.button
            onClick={increaseBet}
            disabled={disabled || betAmount >= maxBet}
            className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 text-[var(--color-accent-amber)] rounded-xl shadow-xl transform transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-amber)]/50 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed",
              disabled || betAmount >= maxBet 
                ? "bg-[var(--color-surface-tertiary)] border-2 border-[var(--color-border-secondary)]" 
                : "bg-gradient-to-b from-[var(--color-surface-secondary)]/70 to-[var(--color-surface-tertiary)]/70 border-2 border-[var(--color-accent-amber)]/30 hover:from-[var(--color-surface-primary)]/70 hover:to-[var(--color-surface-secondary)]/70 hover:border-[var(--color-accent-amber)]/50 active:scale-95"
            )}
            whileTap={!(disabled || betAmount >= maxBet) ? { scale: 0.90 } : {}}
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
        </div>
      </div>

      {/* Quick Bet Options with Card Title */}
      <div className="w-full">
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-accent-amber)]">빠른 베팅 선택</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">원하는 베팅 금액을 빠르게 선택하세요</p>
        </div>
        
        <div className="w-full flex justify-center gap-2 sm:gap-3 flex-wrap">
          {quickBetOptions.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleQuickBetSelect(amount)}
              disabled={disabled}
              variant={betAmount === amount ? "primary" : "outline"}
              size="sm"
              className={cn(
                "text-sm sm:text-base px-4 py-2 min-w-[60px] h-10 transition-all duration-200 border-2 shadow-xl",
                betAmount === amount ? 
                  "bg-gradient-to-r from-[var(--color-accent-amber)] to-[var(--color-accent-yellow)] border-[var(--color-accent-amber)] shadow-lg shadow-[var(--color-accent-amber)]/20" : 
                  "hover:border-[var(--color-accent-amber)]/50 hover:shadow-xl hover:shadow-[var(--color-accent-amber)]/10"
              )}
            >
              {amount}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetControl;
