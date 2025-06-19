import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SlotMachine.module.css';

export interface SlotMachineProps {
  /** 게임 상태 */
  state?: 'idle' | 'spinning' | 'result';
  
  /** 심볼 세트 */
  symbols?: string[];
  
  /** 베팅 금액 */
  betAmount?: number;
  
  /** 최소/최대 베팅 */
  minBet?: number;
  maxBet?: number;
  
  /** 스핀 콜백 */
  onSpin?: (betAmount: number) => void;
  
  /** 베팅 변경 콜백 */
  onBetChange?: (amount: number) => void;
  
  /** 결과 콜백 */
  onResult?: (result: string[], isWin: boolean, payout: number) => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

const SlotMachine: React.FC<SlotMachineProps> = ({
  state = 'idle',
  symbols = ['🎰', '💎', '🍒', '🔔', '⭐', '💰', '🎯'],
  betAmount = 100,
  minBet = 10,
  maxBet = 1000,
  onSpin,
  onBetChange,
  onResult,
  className = ''
}) => {
  const [currentBet, setCurrentBet] = useState(betAmount);
  const [reelResults, setReelResults] = useState<string[]>(['🎰', '🎰', '🎰']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<{ isWin: boolean; payout: number } | null>(null);

  // 릴 스핀 애니메이션
  const spinReels = async () => {
    if (state === 'spinning' || isSpinning) return;
    
    setIsSpinning(true);
    setLastWin(null);
    onSpin?.(currentBet);

    // 3초 스핀 애니메이션
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 결과 생성
    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    setReelResults(results);
    setIsSpinning(false);

    // 승리 판정
    const isWin = results[0] === results[1] && results[1] === results[2];
    const payout = isWin ? currentBet * getPayoutMultiplier(results[0]) : 0;
    
    setLastWin({ isWin, payout });
    onResult?.(results, isWin, payout);
  };

  // 심볼별 배당률
  const getPayoutMultiplier = (symbol: string): number => {
    const multipliers: Record<string, number> = {
      '💎': 10,
      '🎰': 8,
      '💰': 6,
      '⭐': 5,
      '🎯': 4,
      '🔔': 3,
      '🍒': 2
    };
    return multipliers[symbol] || 2;
  };

  // 베팅 조절
  const adjustBet = (adjustment: number) => {
    const newBet = Math.max(minBet, Math.min(maxBet, currentBet + adjustment));
    setCurrentBet(newBet);
    onBetChange?.(newBet);
  };
  // 릴 애니메이션 설정
  const reelVariants = {
    idle: { y: 0 },
    spinning: { 
      y: [-20, -40, -20, 0],
      transition: { 
        duration: 0.3,
        repeat: Infinity,
        ease: "linear" as const
      }
    },
    result: {
      y: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const containerClassNames = [
    styles.container,
    isSpinning && styles.spinning,
    lastWin?.isWin && styles.winner,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassNames}>
      {/* 슬롯 머신 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>🎰 COSMIC SLOTS</h2>
        <div className={styles.subtitle}>Match 3 symbols to win!</div>
      </div>

      {/* 릴 컨테이너 */}
      <div className={styles.reelsContainer}>
        {reelResults.map((symbol, index) => (
          <motion.div
            key={index}
            className={styles.reel}
            variants={reelVariants}
            animate={isSpinning ? 'spinning' : 'result'}
          >
            <div className={styles.symbolWindow}>
              <motion.div
                className={styles.symbol}
                key={`${symbol}-${index}-${Date.now()}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {symbol}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 결과 표시 */}
      <AnimatePresence>
        {lastWin && (
          <motion.div
            className={`${styles.resultDisplay} ${lastWin.isWin ? styles.winResult : styles.loseResult}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {lastWin.isWin ? (
              <>
                <div className={styles.winText}>🎉 JACKPOT! 🎉</div>
                <div className={styles.payoutText}>+{lastWin.payout.toLocaleString()} TOKENS</div>
              </>
            ) : (
              <div className={styles.loseText}>Try Again!</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 베팅 컨트롤 */}
      <div className={styles.betControls}>
        <div className={styles.betLabel}>BET AMOUNT</div>
        <div className={styles.betContainer}>
          <button
            className={styles.betButton}
            onClick={() => adjustBet(-10)}
            disabled={currentBet <= minBet || isSpinning}
          >
            -
          </button>
          
          <div className={styles.betAmount}>
            {currentBet.toLocaleString()}
          </div>
          
          <button
            className={styles.betButton}
            onClick={() => adjustBet(10)}
            disabled={currentBet >= maxBet || isSpinning}
          >
            +
          </button>
        </div>
        
        <div className={styles.betLimits}>
          {minBet} - {maxBet.toLocaleString()}
        </div>
      </div>

      {/* 스핀 버튼 */}
      <motion.button
        className={styles.spinButton}
        onClick={spinReels}
        disabled={isSpinning || state === 'spinning'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isSpinning ? { 
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 20px rgba(123, 41, 205, 0.5)",
            "0 0 30px rgba(135, 13, 209, 0.8)",
            "0 0 20px rgba(123, 41, 205, 0.5)"
          ]
        } : {}}
        transition={{ 
          duration: 0.8,
          repeat: isSpinning ? Infinity : 0
        }}
      >
        {isSpinning ? (
          <motion.div
            className={styles.spinnerIcon}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⚡
          </motion.div>
        ) : (
          'SPIN'
        )}
      </motion.button>

      {/* 배당표 */}
      <div className={styles.payoutTable}>
        <div className={styles.payoutTitle}>PAYOUTS</div>
        <div className={styles.payoutGrid}>
          {symbols.slice(0, 4).map((symbol) => (
            <div key={symbol} className={styles.payoutRow}>
              <span className={styles.payoutSymbol}>{symbol}{symbol}{symbol}</span>
              <span className={styles.payoutMultiplier}>{getPayoutMultiplier(symbol)}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
