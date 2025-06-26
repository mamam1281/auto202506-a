'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../Button';
import { SlotReel } from './SlotReel';
import { BetControl } from './BetControl';
import { GameFooter } from './GameFooter';
import { checkWinCondition, generateSpinResult } from '../../../utils/slotLogic';
import { cn } from '../../../utils/cn';
import { Trophy, Zap, Star, Volume2, VolumeX } from 'lucide-react';

export type GameState = 'idle' | 'spinning' | 'result';

interface SlotMachineProps {
  className?: string;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ className }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reels, setReels] = useState<string[]>(['💎', '🔔', '🍒']); // Initial symbols
  const [betAmount, setBetAmount] = useState(10);
  const [winResult, setWinResult] = useState<any | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [jackpot, setJackpot] = useState(125780);
  const [balance, setBalance] = useState(1000);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [shake, setShake] = useState(false);

  // Jackpot animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = useCallback(async () => {
    if (balance < betAmount || isSpinning) return;

    setIsSpinning(true);
    setGameState('spinning');
    setBalance(prev => prev - betAmount);
    setWinResult(null);
    setShake(false);

    // Simulate API call and reel spin
    setTimeout(() => {
      const newReels = generateSpinResult();
      const result = checkWinCondition(newReels, betAmount);
      
      setReels(newReels);
      setWinResult(result);
      
      if (result.isWin) {
        setBalance(prev => prev + result.payout);
        if (result.payout > betAmount * 5) {
          setShake(true);
          setTimeout(() => setShake(false), 1000);
        }
      }
      
      setIsSpinning(false);
      setGameState('result');
      
      // Reset to idle after showing result
      setTimeout(() => {
        setGameState('idle');
      }, 3000);
    }, 2000);
  }, [betAmount, balance, isSpinning]);

  const canSpin = balance >= betAmount && !isSpinning;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      className={cn(
        "w-full max-w-lg mx-auto bg-gradient-to-br from-[var(--color-surface-primary)] to-[var(--color-surface-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl overflow-hidden",
        className
      )}
      animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[var(--color-text-primary)] text-sm font-medium opacity-90">
              Balance: <span className="text-[var(--color-accent-amber)] font-bold">{formatNumber(balance)}</span>
            </div>
            <Button
              variant="text"
              size="sm"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="text-[var(--color-text-primary)] hover:bg-white/10"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
          
          <motion.div
            className="text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-[var(--color-text-primary)] text-xs opacity-75 mb-1">JACKPOT</div>
            <div className="text-[var(--color-accent-amber)] text-xl sm:text-2xl font-bold tracking-wider">
              <Trophy className="inline w-5 h-5 mr-2" />
              {formatNumber(jackpot)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="p-6">
        {/* Slot Reels */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 h-32 sm:h-36 mb-4">
            {reels.map((symbol, index) => (
              <SlotReel
                key={index}
                symbol={symbol}
                isSpinning={isSpinning}
                delayFactor={index * 0.3}
                isWinning={winResult?.isWin && winResult?.winningPositions?.includes(index)}
                className="bg-gradient-to-b from-[var(--color-surface-secondary)] to-[var(--color-surface-tertiary)]"
              />
            ))}
          </div>
          
          {/* Win Display */}
          <AnimatePresence>
            {winResult?.isWin && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className="text-center mb-4 p-3 bg-gradient-to-r from-[var(--color-accent-amber)]/20 to-[var(--color-accent-yellow)]/20 border border-[var(--color-accent-amber)]/50 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 text-[var(--color-accent-amber)] text-lg font-bold">
                  <Star className="w-5 h-5" />
                  WIN! +{winResult.payout}
                  <Star className="w-5 h-5" />
                </div>
                <div className="text-[var(--color-text-secondary)] text-sm">
                  {winResult.multiplier}x multiplier
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bet Controls */}
        <BetControl
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          maxBet={Math.min(balance, 100)}
          disabled={isSpinning}
          className="mb-6"
        />

        {/* Spin Button */}
        <div className="text-center mb-6">
          <Button
            onClick={handleSpin}
            disabled={!canSpin}
            size="lg"
            className={cn(
              "w-full h-14 text-xl font-bold rounded-xl transition-all duration-200",
              !canSpin 
                ? "opacity-50 cursor-not-allowed" 
                : "bg-gradient-to-r from-[var(--color-accent-amber)] to-[var(--color-accent-yellow)] hover:from-[var(--color-accent-yellow)] hover:to-[var(--color-accent-amber)] text-[var(--color-surface-primary)] shadow-lg hover:shadow-xl transform hover:scale-105"
            )}
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={isSpinning ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isSpinning ? Infinity : 0, ease: "linear" }}
            >
              <Zap className="w-6 h-6" />
              {isSpinning ? 'SPINNING...' : 'SPIN'}
            </motion.div>
          </Button>
          
          {!canSpin && balance < betAmount && (
            <div className="text-[var(--color-status-error)] text-sm mt-2">
              Insufficient balance
            </div>
          )}
        </div>

        {/* Game State Indicator */}
        <div className="text-center mb-4">
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

      {/* Footer */}
      <GameFooter className="border-t border-[var(--color-border-secondary)]" />
    </motion.div>
  );
};

export default SlotMachine;
