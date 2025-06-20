'use client';

import React, { useState, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './SlotMachine.module.css';

export interface SlotMachineProps {
  /** 게임 상태 */
  state?: 'idle' | 'spinning' | 'result';
  
  /** 심볼 세트 */
  symbols?: string[];
  
  /** 베팅 금액 */
  betAmount?: number;
  
  /** 최소 베팅 */
  minBet?: number;
  
  /** 최대 베팅 */
  maxBet?: number;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 스핀 이벤트 */
  onSpin?: (betAmount: number) => void;
  
  /** 베팅 변경 이벤트 */
  onBetChange?: (amount: number) => void;
  
  /** 결과 이벤트 */
  onResult?: (result: { symbols: string[]; payout: number; isWin: boolean }) => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

// Framer Motion props와 SlotMachine props 결합
type SlotMachineMotionProps = SlotMachineProps & Omit<HTMLMotionProps<"div">, keyof SlotMachineProps>;

const SlotMachine = forwardRef<HTMLDivElement, SlotMachineMotionProps>(({
  state = 'idle',
  symbols = ['🎰', '💎', '🍒', '🔔', '⭐', '💰', '🎯'],
  betAmount = 100,
  minBet = 10,
  maxBet = 1000,
  size = 'md',
  onSpin,
  onBetChange,
  onResult,
  className = '',
  ...motionProps
}, ref) => {
  const [currentSymbols, setCurrentSymbols] = useState(['🎰', '🎰', '🎰']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentBet, setCurrentBet] = useState(betAmount);
  const [result, setResult] = useState<{ symbols: string[]; payout: number; isWin: boolean } | null>(null);

  // 베팅 증가/감소 핸들러
  const handleBetChange = (delta: number) => {
    const newBet = Math.max(minBet, Math.min(maxBet, currentBet + delta));
    setCurrentBet(newBet);
    onBetChange?.(newBet);
  };

  // 스핀 핸들러
  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    onSpin?.(currentBet);

    // 애니메이션 시뮬레이션
    setTimeout(() => {
      const newSymbols = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      
      setCurrentSymbols(newSymbols);
      
      // 승리 체크
      const isWin = newSymbols[0] === newSymbols[1] && newSymbols[1] === newSymbols[2];
      const payout = isWin ? currentBet * getPayoutMultiplier(newSymbols[0]) : 0;
      
      const gameResult = { symbols: newSymbols, payout, isWin };
      setResult(gameResult);
      setIsSpinning(false);
      
      onResult?.(gameResult);
    }, 2000);
  };

  // 배당 계산
  const getPayoutMultiplier = (symbol: string): number => {
    const multipliers: Record<string, number> = {
      '💎': 10, '🎰': 8, '💰': 6, '⭐': 4, '🔔': 3, '🍒': 2, '🎯': 5
    };
    return multipliers[symbol] || 2;
  };

  // 컨테이너 클래스명
  const containerClassNames = [
    styles.container,
    styles[size],
    isSpinning && styles.spinning,
    result?.isWin && styles.winner,
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div 
      ref={ref}
      className={containerClassNames}
      {...motionProps}
    >
      {/* 슬롯 머신 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>🎰 COSMIC SLOTS</h2>
        <div className={styles.subtitle}>Match 3 symbols to win!</div>
      </div>

      {/* 릴 컨테이너 */}
      <div className={styles.reelsContainer}>
        {currentSymbols.map((symbol, index) => (
          <div key={index} className={styles.reel}>
            <div className={styles.symbolWindow}>
              <motion.div
                className={styles.symbol}
                animate={isSpinning ? { rotateY: 360 } : {}}
                transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
              >
                {symbol}
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* 베팅 컨트롤 */}
      <div className={styles.betControls}>
        <div className={styles.betLabel}>BET AMOUNT</div>
        <div className={styles.betContainer}>
          <button 
            className={styles.betButton}
            onClick={() => handleBetChange(-10)}
            disabled={currentBet <= minBet}
          >
            -
          </button>
          <div className={styles.betAmount}>{currentBet.toLocaleString()}</div>
          <button 
            className={styles.betButton}
            onClick={() => handleBetChange(10)}
            disabled={currentBet >= maxBet}
          >
            +
          </button>
        </div>
        <div className={styles.betLimits}>Min: {minBet} | Max: {maxBet}</div>
      </div>

      {/* 스핀 버튼 */}
      <button
        className={styles.spinButton}
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? (
          <span className={styles.spinnerIcon}>⟳</span>
        ) : (
          'SPIN'
        )}
      </button>

      {/* 결과 표시 */}
      {result && (
        <motion.div 
          className={`${styles.resultDisplay} ${result.isWin ? styles.winResult : styles.loseResult}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {result.isWin ? (
            <>
              <div className={styles.winText}>🎉 WIN! 🎉</div>
              <div className={styles.payoutText}>+{result.payout.toLocaleString()}</div>
            </>
          ) : (
            <div className={styles.loseText}>Try Again!</div>
          )}
        </motion.div>
      )}

      {/* 배당표 */}
      <div className={styles.payoutTable}>
        <h3 className={styles.payoutTitle}>PAYTABLE</h3>
        <div className={styles.payoutGrid}>
          {symbols.slice(0, 4).map((symbol) => (
            <div key={symbol} className={styles.payoutRow}>
              <span className={styles.payoutSymbol}>{symbol}{symbol}{symbol}</span>
              <span className={styles.payoutMultiplier}>{getPayoutMultiplier(symbol)}x</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

SlotMachine.displayName = 'SlotMachine';

export default SlotMachine;
