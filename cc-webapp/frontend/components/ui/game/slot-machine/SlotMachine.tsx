'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlotReel } from './SlotReel';
import { BetControl } from './BetControl';
import { SpinButton } from './SpinButton';
import { 
  SYMBOLS, 
  checkWinCondition, 
  getWeightedRandomSymbol, 
  adjustWinChance, 
  calculateJackpotChance,
  type WinResult 
} from './slotLogic';
import type { GameState as SlotGameState } from './types';
import { playSlotFeedback } from './soundEffects';
import { Crown, Star, Zap, TrendingUp } from 'lucide-react';
import './slotMachine.css';
import { Card, CardHeader, CardContent } from '../../card';

// Dynamic import for canvas-confetti to avoid SSR issues
let confetti: any = null;
if (typeof window !== 'undefined') {
  import('canvas-confetti').then((module) => {
    confetti = module.default;
  });
}

export type GameState = 'idle' | 'spinning' | 'result';

interface SlotMachineProps {
  onCoinsChange?: (coins: number) => void;
  initialCoins?: number;
  className?: string;
}

export function SlotMachine({ onCoinsChange, initialCoins = 1000, className }: SlotMachineProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reels, setReels] = useState<string[]>(['🍒', '🔔', '💎']);
  const [userCoins, setUserCoins] = useState(initialCoins);
  const [betAmount, setBetAmount] = useState(10);
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [jackpot, setJackpot] = useState(125780);
  const [totalWins, setTotalWins] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // 잭팟 증가 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 코인 변경 콜백
  const handleCoinsChange = useCallback((newCoins: number) => {
    setUserCoins(newCoins);
    onCoinsChange?.(newCoins);
  }, [onCoinsChange]);

  // 승리 시 confetti 효과
  const triggerConfetti = useCallback((isJackpot: boolean = false) => {
    if (!confetti) return;
    
    if (isJackpot) {
      // 잭팟 시 더 화려한 confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FFB6C1']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FFB6C1']
        });
      }, 250);
    } else {
      // 일반 승리 시 confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FFFF00']
      });
    }
  }, []);

  const handleSpin = useCallback(async () => {
    if (userCoins < betAmount || isSpinning) return;
    
    setIsSpinning(true);
    setGameState('spinning');
    handleCoinsChange(userCoins - betAmount);
    setWinResult(null);
    setSpinCount(prev => prev + 1);

    // 잭팟에 기여
    setJackpot(prev => prev + Math.floor(betAmount * 0.1));    // 사운드 피드백
    playSlotFeedback.spinStart();

    // 가중치 기반 심볼 생성
    let newReels: string[];
    
    // 연속 패배 시 승리 확률 증가
    const shouldWin = adjustWinChance(consecutiveLosses);
    const isJackpotWin = calculateJackpotChance(betAmount, spinCount);

    if (isJackpotWin) {
      newReels = ['⭐', '⭐', '⭐'];
    } else if (shouldWin) {
      // 의도적인 승리 패턴 생성
      const winSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      newReels = [winSymbol, winSymbol, winSymbol];
    } else {
      // 일반적인 랜덤 생성
      newReels = [
        getWeightedRandomSymbol(),
        getWeightedRandomSymbol(),
        getWeightedRandomSymbol()
      ];
    }

    // 스핀 애니메이션 시간 (각 릴이 순차적으로 멈춤)
    setTimeout(() => {
      setReels([newReels[0], reels[1], reels[2]]);
    }, 1000);

    setTimeout(() => {
      setReels([newReels[0], newReels[1], reels[2]]);
    }, 1500);

    setTimeout(() => {
      setReels(newReels);
      const result = checkWinCondition(newReels, betAmount);
      
      // 잭팟 처리
      if (isJackpotWin) {
        result.isWin = true;
        result.payout = jackpot;
        result.winType = '🎊 MEGA JACKPOT! 🎊';
        setJackpot(50000);
        triggerConfetti(true);
        playSlotFeedback.jackpot();
      } else if (result.isWin) {
        triggerConfetti(false);
        playSlotFeedback.win();
        setConsecutiveLosses(0);      } else {
        playSlotFeedback.spinStop();
        setConsecutiveLosses(prev => prev + 1);
      }
      
      setWinResult(result);
      setShowWinAnimation(result.isWin);
      
      if (result.isWin) {
        handleCoinsChange(userCoins - betAmount + result.payout);
        setTotalWins(prev => prev + result.payout);
      }
      
      setGameState('result');
      setIsSpinning(false);
      
      // 승리 애니메이션 자동 숨김
      if (result.isWin) {
        setTimeout(() => setShowWinAnimation(false), 4000);
      }
    }, 2000);  }, [betAmount, userCoins, isSpinning, reels, jackpot, handleCoinsChange, triggerConfetti, consecutiveLosses, spinCount]);

  const canSpin = userCoins >= betAmount && !isSpinning;

  return (
    <Card className={`w-full max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black border-2 border-amber-500/20 shadow-2xl p-0 relative overflow-hidden ${className || ''}`}>
      {/* 카지노 프레임 장식 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"></div>

      <CardHeader className="text-center mb-4 border-b border-amber-400/10 bg-gradient-to-r from-amber-600/10 via-yellow-500/10 to-amber-600/10 rounded-t-3xl">
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 border border-amber-400/30 rounded-2xl backdrop-blur-xl shadow-lg"
          animate={{
            boxShadow: [
              '0 0 8px rgba(251, 191, 36, 0.2)',
              '0 0 12px rgba(251, 191, 36, 0.3)',
              '0 0 8px rgba(251, 191, 36, 0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Crown className="h-5 w-5 text-amber-300" />
          <div className="text-center">
            <div className="text-amber-200 font-bold text-sm">MEGA JACKPOT</div>
            <div className="font-bold text-amber-100">
              {jackpot.toLocaleString()}
            </div>
          </div>
          <Crown className="h-5 w-5 text-amber-300" />
        </motion.div>
        <motion.h1 
          className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text mb-2 mt-4"
          animate={{ 
            textShadow: winResult?.isWin ? [
              '0 0 5px rgba(251, 191, 36, 0.6)', 
              '0 0 8px rgba(251, 191, 36, 0.8)', 
              '0 0 5px rgba(251, 191, 36, 0.6)'
            ] : '0 0 0px rgba(251, 191, 36, 0)'
          }}
          transition={{ duration: 1, repeat: winResult?.isWin ? 3 : 0, repeatType: 'reverse' }}
        >
          💎 ROYAL SLOTS 💎
        </motion.h1>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
      </CardHeader>

      <CardContent className="p-6">
        {/* 상태 정보 바 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 border border-amber-400/30">
            <div className="text-amber-200 font-bold mb-1 text-sm">베팅</div>
            <div className="font-semibold text-amber-300">{betAmount}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 border border-yellow-500/20">
            <div className="text-amber-200 font-bold mb-1 text-sm">총 승리</div>
            <div className="font-semibold text-yellow-400">{totalWins.toLocaleString()}</div>
          </div>
        </div>

        {/* 슬롯 릴 컨테이너 */}
        <div className="relative mb-6">
          {/* 릴 머신 프레임 */}
          <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-2xl p-1 border border-amber-500/20 shadow-inner">
            <div className="bg-gradient-to-b from-black to-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <SlotReel 
                  symbol={reels[0]} 
                  isSpinning={isSpinning} 
                  delay={0}
                  isWinning={winResult?.winningPositions?.includes(0)}
                />
                <SlotReel 
                  symbol={reels[1]} 
                  isSpinning={isSpinning} 
                  delay={0.5}
                  isWinning={winResult?.winningPositions?.includes(1)}
                />
                <SlotReel 
                  symbol={reels[2]} 
                  isSpinning={isSpinning} 
                  delay={1}
                  isWinning={winResult?.winningPositions?.includes(2)}
                />
              </div>
            </div>
          </div>
          {/* 릴 하이라이트 효과 */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-40 pointer-events-none"></div>
        </div>

        {/* 승리 애니메이션 (조건부) */}
        <AnimatePresence>
          {winResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="text-center mb-6"
            >
              {winResult.isWin ? (
                <div className="relative">
                  {/* 승리 파티클 배경 */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-amber-400/80 rounded-full"
                        initial={{ 
                          x: '50%', 
                          y: '50%', 
                          scale: 0,
                          opacity: 0 
                        }}
                        animate={{
                          x: `${50 + (Math.random() - 0.5) * 150}%`,
                          y: `${50 + (Math.random() - 0.5) * 150}%`,
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{
                          duration: 2.5,
                          delay: i * 0.15,
                          repeat: winResult.winType?.includes('JACKPOT') ? 3 : 1
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative backdrop-blur-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-amber-100 rounded-2xl p-6 shadow-xl">
                    <motion.div 
                      className="font-bold mb-3"
                      animate={{ 
                        scale: winResult.winType?.includes('JACKPOT') ? [1, 1.1, 1] : [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: winResult.winType?.includes('JACKPOT') ? 5 : 3
                      }}
                    >
                      {winResult.winType?.includes('JACKPOT') ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <Star className="h-6 w-6 text-amber-300" />
                            <span>🎊 MEGA JACKPOT! 🎊</span>
                            <Star className="h-6 w-6 text-amber-300" />
                          </div>
                        </div>
                      ) : (
                        '🎉 BIG WIN! 🎉'
                      )}
                    </motion.div>
                    <div className="font-bold text-amber-200 mb-2">
                      +{winResult.payout.toLocaleString()}
                    </div>
                    {winResult.winType && !winResult.winType.includes('JACKPOT') && (
                      <div className="text-amber-300/80">{winResult.winType}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-400/25 text-red-300 rounded-xl p-4">
                  <div className="font-semibold">운이 따르지 않았네요!</div>
                  <div className="text-red-400/80 mt-1">다시 도전해보세요</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 베팅 컨트롤 */}
        <BetControl
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          maxBet={Math.min(100, userCoins)}
          disabled={isSpinning}
        />

        {/* 스핀 버튼 */}
        <SpinButton
          onSpin={handleSpin}
          disabled={!canSpin}
          isSpinning={isSpinning}
        />        {/* 게임 통계 */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-4 text-gray-400 text-sm">
            <span>스핀: {spinCount}</span>
            <span>•</span>
            <span>최고 승리: {totalWins.toLocaleString()}</span>
          </div>        </div>
      </CardContent>
    </Card>
  );
}
