'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  SIMPLIFIED_ROULETTE_NUMBERS, 
  getSimplifiedNumberColor, 
  checkSimplifiedWin,
  SimplifiedBet,
  SimplifiedGameState
} from './SimplifiedRouletteConstants';
import { 
  Play, 
  Info, 
  RotateCcw, 
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 더 큰 룰렛 휠 (압축 유지하면서 휠만 확대)
function EnhancedCompactWheel({ 
  isSpinning, 
  result, 
  onSpinComplete 
}: {
  isSpinning: boolean;
  result: number | null;
  onSpinComplete: (result: number) => void;
}) {
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    if (isSpinning && result !== null) {
      const segmentAngle = 360 / 12;
      const resultIndex = SIMPLIFIED_ROULETTE_NUMBERS.indexOf(result);
      const targetAngle = resultIndex * segmentAngle + (segmentAngle / 2);
      const fullRotations = 3;
      const finalRotation = fullRotations * 360 + (360 - targetAngle);
      
      setRotation(finalRotation);
      
      setTimeout(() => {
        onSpinComplete(result);
      }, 2000);
    }
  }, [isSpinning, result, onSpinComplete]);

  const segments = SIMPLIFIED_ROULETTE_NUMBERS.map((number, index) => {
    const startAngle = (360 / 12) * index;
    const endAngle = (360 / 12) * (index + 1);
    const color = getSimplifiedNumberColor(number);
    
    let segmentColor;
    if (color === 'red') segmentColor = '#dc2626';
    else if (color === 'black') segmentColor = '#374151';
    else segmentColor = '#059669';
    
    return `${segmentColor} ${startAngle}deg ${endAngle}deg`;
  }).join(', ');

  return (
    <div className="relative flex items-center justify-center">
      {/* 확대된 룰렛 휠 */}
      <div 
        className="relative w-52 h-52 rounded-full border-4 border-yellow-500 shadow-xl transition-transform duration-2000 ease-out overflow-hidden"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          background: `conic-gradient(from 0deg, ${segments})`
        }}
      >
        {/* 숫자 표시 - 크기 증가 */}
        {SIMPLIFIED_ROULETTE_NUMBERS.map((number, index) => {
          const angle = (360 / 12) * index + (360 / 24);
          const radius = 78; // 65 → 78로 증가
          const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
          const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
          
          return (
            <div
              key={number}
              className="absolute text-white font-black text-base flex items-center justify-center w-6 h-6" // text-sm → text-base
              style={{
                left: `calc(50% + ${x}px - 12px)`,
                top: `calc(50% + ${y}px - 12px)`,
                textShadow: '1px 1px 3px rgba(0,0,0,0.9)'
              }}
            >
              {number}
            </div>
          );
        })}
        
        {/* 중앙 허브 - 크기 증가 */}
        <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-300 shadow-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-yellow-800 rounded-full"></div>
        </div>
      </div>
      
      {/* 포인터 - 크기 증가 */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-lg"></div>
      </div>
      
      {/* 휠 베이스 그림자 */}
      <div className="absolute w-56 h-56 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 -z-10 shadow-xl"></div>
    </div>
  );
}

// 미니 룰 모달
function MiniRulesModal() {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
      <div className="text-center">
        <h3 className="text-sm font-bold text-white">🎰 Rules</h3>
      </div>
      
      <div className="glass-card p-2 rounded text-xs">
        <div className="space-y-1 text-[#cbd5e1]">
          <div>• 12 numbers (0-11)</div>
          <div>• Red/Black: 2x payout</div>
          <div>• Number: 12x payout</div>
          <div>• Green 0: House wins</div>
        </div>
      </div>
    </div>
  );
}

export default function UltraCompactRoulette() {
  const [gameState, setGameState] = useState<SimplifiedGameState>('idle');
  const [bets, setBets] = useState<SimplifiedBet[]>([]);
  const [balance, setBalance] = useState(1000);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [betAmount, setBetAmount] = useState(10);

  const handlePlaceBet = useCallback((newBet: Omit<SimplifiedBet, 'id'>) => {
    if (gameState !== 'idle' || balance < newBet.amount) return;

    const bet: SimplifiedBet = {
      ...newBet,
      id: `${Date.now()}-${Math.random()}`
    };

    setBets(prev => [...prev, bet]);
    setBalance(prev => prev - newBet.amount);
  }, [gameState, balance]);

  const handleClearBets = useCallback(() => {
    if (gameState !== 'idle') return;
    
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    setBalance(prev => prev + totalBetAmount);
    setBets([]);
  }, [gameState, bets]);

  const handleSpin = useCallback(() => {
    if (gameState !== 'idle' || bets.length === 0) return;

    setGameState('spinning');
    setWinAmount(0);
    
    const randomIndex = Math.floor(Math.random() * SIMPLIFIED_ROULETTE_NUMBERS.length);
    const result = SIMPLIFIED_ROULETTE_NUMBERS[randomIndex];
    setCurrentResult(result);
  }, [gameState, bets]);

  const handleSpinComplete = useCallback((result: number) => {
    setGameState('result');

    let totalWin = 0;
    
    bets.forEach(bet => {
      if (checkSimplifiedWin(bet, result)) {
        const winnings = bet.amount * (bet.payout + 1);
        totalWin += winnings;
      }
    });

    if (totalWin > 0) {
      setBalance(prev => prev + totalWin);
      setWinAmount(totalWin);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#a78bfa', '#10b981']
      });
    }

    setTimeout(() => {
      setGameState('idle');
      setBets([]);
      setCurrentResult(null);
    }, 2500);
  }, [bets]);

  const handleBet = (type: SimplifiedBet['type'], value: any, payout: number) => {
    if (gameState !== 'idle' || balance < betAmount) return;
    
    handlePlaceBet({
      type,
      value,
      amount: betAmount,
      payout
    });
  };

  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const chipAmounts = [5, 10, 25, 50];
  const chipColors = ['chip-gradient-1', 'chip-gradient-2', 'chip-gradient-3', 'chip-gradient-4'];

  return (
    <div className="min-h-screen bg-[rgba(37,72,69,0.43)] relative overflow-hidden">
      {/* 극한 압축 컨테이너 */}
      <div className="max-w-sm mx-auto p-2 space-y-2 min-h-screen ultra-compact-spacing">
        
        {/* 미니 헤더 */}
        <Card className="glass-surface border-[#a78bfa]/50 p-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-black text-white">🎰 ROULETTE</h1>
            
            <div className="flex items-center gap-2">
              <div className="text-xs">
                <span className="text-[#94a3b8]">$</span>
                <span className="text-[#a78bfa] font-bold">{balance}</span>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="glass-surface border-[#a78bfa]/50 text-white text-xs px-2 py-1 h-6"
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-surface border-[#a78bfa]/50 max-w-xs">
                  <DialogHeader>
                    <DialogTitle className="text-[#a78bfa] text-center text-sm">Rules</DialogTitle>
                  </DialogHeader>
                  <MiniRulesModal />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* 확대된 룰렛 휠 섹션 */}
        <Card className="glass-surface border-[#a78bfa]/50 p-4"> {/* p-3 → p-4로 약간 증가 */}
          <div className="text-center space-y-3"> {/* space-y-2 → space-y-3으로 약간 증가 */}
            <Badge 
              className={`text-xs px-3 py-1 font-bold ${
                gameState === 'idle' 
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white' 
                  : gameState === 'spinning' 
                  ? 'purple-gradient text-white animate-pulse' 
                  : 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white'
              }`}
            >
              {gameState === 'idle' ? '🟢 Ready' : gameState === 'spinning' ? '🟡 Spinning' : '🎉 Complete'}
            </Badge>
            
            <EnhancedCompactWheel
              isSpinning={gameState === 'spinning'}
              result={currentResult}
              onSpinComplete={handleSpinComplete}
            />
            
            {/* 결과 표시 */}
            <AnimatePresence>
              {gameState === 'result' && currentResult !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-center space-y-1"
                >
                  <Badge 
                    className={`text-2xl px-4 py-2 font-black shadow-lg ${
                      getSimplifiedNumberColor(currentResult) === 'red' ? 'bg-red-600' :
                      getSimplifiedNumberColor(currentResult) === 'black' ? 'bg-gray-700' :
                      'bg-green-600'
                    } text-white`}
                  >
                    {currentResult}
                  </Badge>
                  
                  {winAmount > 0 && (
                    <div className="glass-surface p-2 rounded text-center">
                      <div className="flex items-center justify-center gap-1 text-xs">
                        <Trophy className="w-3 h-3 text-[#f59e0b]" />
                        <span className="font-bold text-[#10b981]">+${winAmount}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* 압축된 베팅 섹션 */}
        <div className="space-y-2">
          {/* 칩 선택 - 미니 */}
          <Card className="glass-card border-[#a78bfa]/30 p-2">
            <div className="grid grid-cols-4 gap-1 mb-2">
              {chipAmounts.map((amount, index) => (
                <Button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={gameState !== 'idle' || balance < amount}
                  className={`h-8 text-white font-bold text-xs transition-all duration-300 ${
                    betAmount === amount 
                      ? `${chipColors[index]} scale-110` 
                      : `${chipColors[index]} opacity-70 hover:opacity-100`
                  }`}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            
            {totalBetAmount > 0 && (
              <div className="text-center">
                <Badge className="purple-gradient text-white text-xs px-2 py-1">
                  Bet: ${totalBetAmount}
                </Badge>
              </div>
            )}
          </Card>

          {/* 베팅 버튼들 - 미니 */}
          <Card className="glass-card border-[#8b5cf6]/30 p-2">
            {/* 색상 베팅 - 미니 */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              <Button
                onClick={() => handleBet('red', 'red', 1)}
                disabled={gameState !== 'idle'}
                className="h-10 bg-gradient-to-br from-red-600 to-red-800 text-white border border-red-400 relative text-xs"
              >
                <div className="text-center">
                  <div className="text-sm">❤️</div>
                  <div className="font-bold">RED</div>
                </div>
                {bets.find(b => b.type === 'red') && (
                  <Badge className="absolute -top-1 -right-1 bg-[#a78bfa] text-white text-xs scale-75">
                    ${bets.find(b => b.type === 'red')!.amount}
                  </Badge>
                )}
              </Button>
              
              <Button
                onClick={() => handleBet('black', 'black', 1)}
                disabled={gameState !== 'idle'}
                className="h-10 bg-gradient-to-br from-gray-700 to-gray-900 text-white border border-gray-500 relative text-xs"
              >
                <div className="text-center">
                  <div className="text-sm">🖤</div>
                  <div className="font-bold">BLACK</div>
                </div>
                {bets.find(b => b.type === 'black') && (
                  <Badge className="absolute -top-1 -right-1 bg-[#a78bfa] text-white text-xs scale-75">
                    ${bets.find(b => b.type === 'black')!.amount}
                  </Badge>
                )}
              </Button>
            </div>
            
            {/* 숫자 베팅 - 미니 */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              {SIMPLIFIED_ROULETTE_NUMBERS.map(number => {
                const color = getSimplifiedNumberColor(number);
                const bgColor = color === 'red' ? 'bg-red-600' : color === 'black' ? 'bg-gray-700' : 'bg-green-600';
                const bet = bets.find(b => b.type === 'number' && b.value === number);
                
                return (
                  <Button
                    key={number}
                    onClick={() => handleBet('number', number, 11)}
                    disabled={gameState !== 'idle'}
                    className={`h-8 ${bgColor} text-white font-bold relative text-xs transition-all duration-300 hover:scale-105`}
                  >
                    {number}
                    {bet && (
                      <Badge className="absolute -top-1 -right-1 bg-[#a78bfa] text-white text-xs scale-50">
                        ${bet.amount}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            
            {/* 액션 버튼들 - 미니 */}
            <div className="space-y-1">
              <Button
                onClick={handleSpin}
                disabled={gameState !== 'idle' || bets.length === 0}
                className="w-full h-10 purple-gradient text-white font-black text-sm"
              >
                {gameState === 'spinning' ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    SPINNING
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-2" />
                    SPIN ({bets.length})
                  </>
                )}
              </Button>
              
              {bets.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearBets}
                  disabled={gameState !== 'idle'}
                  className="w-full h-8 text-[#ef4444] border-[#ef4444]/50 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}