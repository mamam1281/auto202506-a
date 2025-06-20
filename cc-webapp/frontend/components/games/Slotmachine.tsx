'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { SlotReel } from './SlotReel';
import { BetControl } from './BetControl';
import { checkWinCondition, SYMBOLS, WinResult } from '../utils/slotLogic';
import { Crown, Star, Zap } from 'lucide-react';

// Dynamic import for canvas-confetti to avoid SSR issues
let confetti: any = null;
if (typeof window !== 'undefined') {
  import('canvas-confetti').then((module) => {
    confetti = module.default;
  });
}

export type GameState = 'idle' | 'spinning' | 'result';

interface SlotMachineProps {
  userCoins: number;
  onCoinsChange: (coins: number) => void;
  className?: string;
}

export function SlotMachine({ userCoins, onCoinsChange, className }: SlotMachineProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reels, setReels] = useState<string[]>(['🍒', '🔔', '💎']);
  const [betAmount, setBetAmount] = useState(10);
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [jackpot, setJackpot] = useState(125780);
  const [totalWins, setTotalWins] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  // 잭팟 증가 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    onCoinsChange(userCoins - betAmount);
    setWinResult(null);
    setSpinCount(prev => prev + 1);

    // 잭팟에 기여
    setJackpot(prev => prev + Math.floor(betAmount * 0.1));

    // 새로운 릴 결과 생성
    const newReels = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // 잭팟 확률 (매우 낮음)
    const isJackpot = Math.random() < 0.001 && betAmount >= 50;
    if (isJackpot) {
      newReels[0] = newReels[1] = newReels[2] = '⭐';
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
      if (isJackpot) {
        result.isWin = true;
        result.payout = jackpot;
        result.winType = '🎊 MEGA JACKPOT! 🎊';
        setJackpot(50000);
        triggerConfetti(true);
      } else if (result.isWin) {
        triggerConfetti(false);
      }
      
      setWinResult(result);
      
      if (result.isWin) {
        onCoinsChange(userCoins - betAmount + result.payout);
        setTotalWins(prev => prev + result.payout);
      }
      
      setGameState('result');
      setIsSpinning(false);
    }, 2000);
  }, [betAmount, userCoins, isSpinning, reels, jackpot, onCoinsChange, triggerConfetti]);

  const canSpin = userCoins >= betAmount && !isSpinning;

  return (
    <div className={`w-full ${className || ''}`}>
      {/* 메인 컨테이너 - 프리미엄 카지노 스타일 */}
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl border-2 border-amber-500/20 shadow-2xl p-6 relative overflow-hidden">
        
        {/* 카지노 프레임 장식 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"></div>

        {/* 잭팟 디스플레이 */}
        <div className="text-center mb-4">
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
              <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold">MEGA JACKPOT</div>
              <div className="font-['Epilogue'] font-bold text-amber-100">
                {jackpot.toLocaleString()}
              </div>
            </div>
            <Crown className="h-5 w-5 text-amber-300" />
          </motion.div>
        </div>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <motion.h1 
            className="font-['Exo'] font-bold text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text mb-2"
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
        </div>

        {/* 상태 정보 바 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 border border-amber-400/30">
            <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold mb-1">베팅</div>
            <div className="font-['Exo'] font-semibold text-amber-300">{betAmount}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 border border-yellow-500/20">
            <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold mb-1">총 승리</div>
            <div className="font-['Exo'] font-semibold text-yellow-400">{totalWins.toLocaleString()}</div>
          </div>
        </div>

        {/* 슬롯 릴 컨테이너 - ReelContainer x3 */}
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

        {/* WinAnimation (조건부) */}
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
                      className="font-['Exo'] font-bold mb-3"
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
                    <div className="font-['Exo'] font-bold text-amber-200 mb-2">
                      +{winResult.payout.toLocaleString()}
                    </div>
                    {winResult.winType && !winResult.winType.includes('JACKPOT') && (
                      <div className="font-['Exo'] text-amber-300/80">{winResult.winType}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-400/25 text-red-300 rounded-xl p-4">
                  <div className="font-['Exo'] font-semibold">운이 따르지 않았네요!</div>
                  <div className="font-['Exo'] text-red-400/80 mt-1">다시 도전해보세요</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* BetControls */}
        <BetControl
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          maxBet={Math.min(100, userCoins)}
          disabled={isSpinning}
        />

        {/* SpinButton */}
        <Button
          onClick={handleSpin}
          disabled={!canSpin}
          className="w-full h-16 font-['Exo'] font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 border-2 border-amber-400/50 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden text-black"
          style={{
            boxShadow: canSpin ? '0 0 15px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none'
          }}
        >
          {/* 버튼 하이라이트 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 rounded-2xl"></div>
          
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isSpinning ? (
              <motion.div
                className="flex items-center justify-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="h-6 w-6" />
                </motion.div>
                <span>SPINNING...</span>
              </motion.div>
            ) : (
              <>
                <Star className="h-6 w-6" />
                <span>SPIN TO WIN</span>
                <Star className="h-6 w-6" />
              </>
            )}
          </span>
        </Button>

        {/* 게임 통계 - 승률 제거, 최고 승리로 대체 */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-4 font-['IBM_Plex_Sans_KR'] text-gray-400">
            <span>스핀: {spinCount}</span>
            <span>•</span>
            <span>최고 승리: {totalWins.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}