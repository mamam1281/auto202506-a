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
    <div className={cn("mb-4 sm:mb-6", className)}>
      {/* Bet Amount Adjust Buttons & Display */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <motion.button
          onClick={decreaseBet}
          disabled={disabled || betAmount <= minBet}
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 text-[var(--color-accent-amber)] rounded-xl shadow-lg transform transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-amber)]/50 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed",
            disabled || betAmount <= minBet 
              ? "bg-[var(--color-surface-tertiary)] border border-[var(--color-border-secondary)]" 
              : "bg-gradient-to-b from-[var(--color-surface-secondary)]/70 to-[var(--color-surface-tertiary)]/70 border border-[var(--color-accent-amber)]/30 hover:from-[var(--color-surface-primary)]/70 hover:to-[var(--color-surface-secondary)]/70 hover:border-[var(--color-accent-amber)]/50 active:scale-95"
          )}
          whileTap={!(disabled || betAmount <= minBet) ? { scale: 0.90 } : {}}
        >
          <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>

        <div className="text-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[var(--color-accent-amber)]/20 via-[var(--color-accent-yellow)]/20 to-[var(--color-accent-amber)]/20 border border-[var(--color-accent-amber)]/40 rounded-2xl backdrop-blur-sm shadow-lg min-w-[100px] sm:min-w-[120px]">
          <div className="text-xs sm:text-sm font-medium text-[var(--color-accent-amber)]/90 mb-0.5 tracking-wide">Current Bet</div>
          <div className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] flex items-center justify-center gap-1">
            <Gem size={14} className="opacity-70 inline-block" />
            {betAmount}
          </div>
        </div>

        <motion.button
          onClick={increaseBet}
          disabled={disabled || betAmount >= maxBet}
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 text-[var(--color-accent-amber)] rounded-xl shadow-lg transform transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-amber)]/50 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed",
            disabled || betAmount >= maxBet 
              ? "bg-[var(--color-surface-tertiary)] border border-[var(--color-border-secondary)]" 
              : "bg-gradient-to-b from-[var(--color-surface-secondary)]/70 to-[var(--color-surface-tertiary)]/70 border border-[var(--color-accent-amber)]/30 hover:from-[var(--color-surface-primary)]/70 hover:to-[var(--color-surface-secondary)]/70 hover:border-[var(--color-accent-amber)]/50 active:scale-95"
          )}
          whileTap={!(disabled || betAmount >= maxBet) ? { scale: 0.90 } : {}}
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>
      </div>

      {/* Quick Bet Options */}
      <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
        {quickBetOptions.map((amount) => (
          <Button
            key={amount}
            onClick={() => handleQuickBetSelect(amount)}
            disabled={disabled}
            variant={betAmount === amount ? "primary" : "outline"}
            size="sm"
            className="text-xs sm:text-sm px-3 py-1.5 min-w-[40px] h-8 transition-all duration-200"
          >
            {amount}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BetControl;
