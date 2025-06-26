'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import Button from '../../Button';
import { Zap } from 'lucide-react';

export type GameState = 'idle' | 'spinning' | 'result';

interface SlotMachineButtonProps {
  onSpin: () => void;
  canSpin: boolean;
  isSpinning: boolean;
  gameState: GameState;
  winResult: any;
  balance: number;
  betAmount: number;
  className?: string;
}

export const SlotMachineButton: React.FC<SlotMachineButtonProps> = ({
  onSpin,
  canSpin,
  isSpinning,
  gameState,
  winResult,
  balance,
  betAmount,
  className = '',
}) => {
  return (
    <div className={`w-full bg-gradient-to-br from-[var(--color-surface-primary)] to-[var(--color-surface-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl py-[15px] px-8 sm:px-12 mx-auto ${className}`}>
      {/* Spin Button */}
      <div className="w-full text-center mb-4">
        <Button
          onClick={onSpin}
          disabled={!canSpin}
          size="lg"
          className={cn(
            "w-full h-16 sm:h-20 text-xl sm:text-2xl font-bold rounded-xl transition-all duration-300",
            !canSpin 
              ? "opacity-50 cursor-not-allowed" 
              : "bg-gradient-to-r from-[var(--color-accent-amber)] to-[var(--color-accent-yellow)] hover:from-[var(--color-accent-yellow)] hover:to-[var(--color-accent-amber)] text-[var(--color-surface-primary)] shadow-xl hover:shadow-2xl transform hover:scale-105"
          )}
        >
          <motion.div
            className="flex items-center justify-center gap-4"
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isSpinning ? Infinity : 0, ease: "linear" }}
          >
            <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </motion.div>
        </Button>
        
        {!canSpin && balance < betAmount && (
          <div className="text-[var(--color-status-error)] text-sm sm:text-base mt-2">
            Insufficient balance
          </div>
        )}
      </div>

      {/* Game State Indicator */}
      <div className="w-full text-center">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
          gameState === 'idle' && "bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)]",
          gameState === 'spinning' && "bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)]",
          gameState === 'result' && winResult?.isWin && "bg-[var(--color-status-success)]/20 text-[var(--color-status-success)]",
          gameState === 'result' && !winResult?.isWin && "bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            gameState === 'spinning' && "animate-pulse bg-[var(--color-accent-blue)]",
            gameState === 'result' && winResult?.isWin && "bg-[var(--color-status-success)]",
            gameState === 'result' && !winResult?.isWin && "bg-[var(--color-text-muted)]",
            gameState === 'idle' && "bg-[var(--color-text-secondary)]"
          )} />
          {gameState === 'idle' && 'Ready to Play'}
          {gameState === 'spinning' && 'Spinning...'}
          {gameState === 'result' && (winResult?.isWin ? 'You Win!' : 'Try Again')}
        </div>
      </div>
    </div>
  );
};

export default SlotMachineButton;
