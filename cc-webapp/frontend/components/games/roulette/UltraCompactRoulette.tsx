'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/basic/button';
import { Card } from '../../ui/basic/card';
import { 
  SIMPLIFIED_ROULETTE_NUMBERS, 
  getSimplifiedNumberColor, 
  checkSimplifiedWin,
  SimplifiedBet,
  SimplifiedGameState,
  CHIP_VALUES,
  calculateSimplifiedWinnings,
  getWheelRotation
} from './SimplifiedRouletteConstants';

// CSS 변수 기반 스타일 적용 (README 참고)
const rouletteStyles = {
  container: {
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    borderRadius: 'var(--radius)',
  },
  card: {
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
  },
  primary: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  },
  secondary: {
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
  },
  accent: {
    backgroundColor: 'var(--accent)',
    color: 'var(--accent-foreground)',
  },
  // 룰렛 게임 전용 색상
  rouletteColors: {
    red: 'var(--semantic-error)',
    black: 'var(--primary-dark)',
    green: 'var(--semantic-success)',
    white: 'var(--text-primary)',
  }
};

export default function UltraCompactRoulette() {
  const [gameState, setGameState] = useState<SimplifiedGameState>({
    balance: 1000,
    isSpinning: false,
    winningNumber: null,
    bets: [],
    history: []
  });
  
  const [selectedChip, setSelectedChip] = useState(5);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // 베팅 추가
  const placeBet = useCallback((type: 'number' | 'color', value: number | 'red' | 'black') => {
    if (gameState.isSpinning || gameState.balance < selectedChip) return;

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - selectedChip,
      bets: [...prev.bets, { type, value, amount: selectedChip }]
    }));
  }, [gameState.isSpinning, gameState.balance, selectedChip]);

  // 스핀 시작
  const handleSpin = useCallback(async () => {
    if (gameState.bets.length === 0 || gameState.isSpinning) return;

    setGameState(prev => ({ ...prev, isSpinning: true }));
    
    // 랜덤 결과 생성
    const result = SIMPLIFIED_ROULETTE_NUMBERS[Math.floor(Math.random() * SIMPLIFIED_ROULETTE_NUMBERS.length)];
    
    // 휠 회전 애니메이션
    const finalRotation = wheelRotation + 1440 + getWheelRotation(result); // 4바퀴 + 결과 위치
    setWheelRotation(finalRotation);

    // 스핀 대기
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 승리 계산
    const winnings = calculateSimplifiedWinnings(gameState.bets, result);
    
    setGameState(prev => ({
      ...prev,
      isSpinning: false,
      winningNumber: result,
      balance: prev.balance + winnings,
      history: [result, ...prev.history.slice(0, 9)],
      bets: [] // 베팅 초기화
    }));

    setShowResult(true);
    setTimeout(() => setShowResult(false), 3000);
  }, [gameState.bets, gameState.isSpinning, wheelRotation]);

  // 베팅 초기화
  const clearBets = useCallback(() => {
    if (gameState.isSpinning) return;
    
    const totalBetAmount = gameState.bets.reduce((sum, bet) => sum + bet.amount, 0);
    setGameState(prev => ({
      ...prev,
      bets: [],
      balance: prev.balance + totalBetAmount
    }));
  }, [gameState.isSpinning, gameState.bets]);

  return (
    <div className="min-h-screen p-2" style={rouletteStyles.container}>
      <div className="max-w-sm mx-auto space-y-2">
        
        {/* 상태 표시 - 압축 */}
        <Card className="p-3" style={rouletteStyles.card}>
          <div className="flex justify-between items-center text-sm">
            <div>잔액: <span className="font-bold">${gameState.balance}</span></div>
            <div>베팅: <span className="font-bold">${gameState.bets.reduce((sum, bet) => sum + bet.amount, 0)}</span></div>
          </div>
        </Card>

        {/* 룰렛 휠 - 208px 크기 */}
        <Card className="p-4" style={rouletteStyles.card}>
          <div className="relative mx-auto w-52 h-52">
            <motion.div
              className="w-full h-full rounded-full border-4 relative"
              style={{ 
                backgroundColor: 'var(--muted)',
                borderColor: 'var(--accent)',
              }}
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {/* 숫자 표시 */}
              {SIMPLIFIED_ROULETTE_NUMBERS.map((num, index) => {
                const angle = (index * 30) - 90; // 12등분
                const color = getSimplifiedNumberColor(num);
                
                return (
                  <div
                    key={num}
                    className="absolute w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold"
                    style={{
                      backgroundColor: color === 'red' ? rouletteStyles.rouletteColors.red : color === 'black' ? rouletteStyles.rouletteColors.black : rouletteStyles.rouletteColors.green,
                      transform: `rotate(${angle}deg) translateY(-85px) rotate(-${angle}deg)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-16px',
                      marginTop: '-16px',
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              
              {/* 중앙 포인터 */}
              <div 
                className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8"
                style={{
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'var(--accent)',
                  top: '-4px',
                  left: '50%',
                  marginLeft: '-4px',
                }}
              />
            </motion.div>
          </div>
        </Card>

        {/* 칩 선택 - 압축 */}
        <Card className="p-3" style={rouletteStyles.card}>
          <div className="grid grid-cols-4 gap-1">
            {CHIP_VALUES.map(value => (
              <Button
                key={value}
                size="sm"
                variant={selectedChip === value ? "default" : "outline"}
                onClick={() => setSelectedChip(value)}
                className="h-8 text-xs"
                disabled={gameState.isSpinning}
              >
                ${value}
              </Button>
            ))}
          </div>
        </Card>

        {/* 베팅 영역 - 압축 */}
        <Card className="p-3" style={rouletteStyles.card}>
          {/* 숫자 베팅 */}
          <div className="mb-2">
            <div className="text-xs mb-1 font-semibold">숫자 베팅 (12x)</div>
            <div className="grid grid-cols-6 gap-1">
              {SIMPLIFIED_ROULETTE_NUMBERS.map(num => {
                const color = getSimplifiedNumberColor(num);
                return (
                  <Button
                    key={num}
                    size="sm"
                    onClick={() => placeBet('number', num)}
                    disabled={gameState.isSpinning || gameState.balance < selectedChip}
                    className="h-8 text-xs"
                    style={{
                      backgroundColor: color === 'red' ? rouletteStyles.rouletteColors.red : color === 'black' ? rouletteStyles.rouletteColors.black : rouletteStyles.rouletteColors.green,
                      color: 'white'
                    }}
                  >
                    {num}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 색상 베팅 */}
          <div>
            <div className="text-xs mb-1 font-semibold">색상 베팅 (2x)</div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                onClick={() => placeBet('color', 'red')}
                disabled={gameState.isSpinning || gameState.balance < selectedChip}
                className="h-8 text-xs"
                style={{ backgroundColor: rouletteStyles.rouletteColors.red, color: 'white' }}
              >
                빨강
              </Button>
              <Button
                size="sm"
                onClick={() => placeBet('color', 'black')}
                disabled={gameState.isSpinning || gameState.balance < selectedChip}
                className="h-8 text-xs"
                style={{ backgroundColor: rouletteStyles.rouletteColors.black, color: 'white' }}
              >
                검정
              </Button>
            </div>
          </div>
        </Card>

        {/* 게임 컨트롤 - 압축 */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleSpin}
            disabled={gameState.bets.length === 0 || gameState.isSpinning}
            className="h-10"
            style={rouletteStyles.primary}
          >
            {gameState.isSpinning ? '스핀 중...' : 'SPIN'}
          </Button>
          <Button
            onClick={clearBets}
            disabled={gameState.bets.length === 0 || gameState.isSpinning}
            variant="outline"
            className="h-10"
          >
            베팅 취소
          </Button>
        </div>

        {/* 결과 표시 */}
        <AnimatePresence>
          {showResult && gameState.winningNumber !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
              <Card className="p-6 text-center" style={rouletteStyles.card}>
                <div className="text-4xl mb-2">🎰</div>
                <div className="text-xl font-bold mb-2">
                  결과: {gameState.winningNumber}
                </div>
                <div className={`text-lg ${calculateSimplifiedWinnings(gameState.bets, gameState.winningNumber) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {calculateSimplifiedWinnings(gameState.bets, gameState.winningNumber) > 0 
                    ? `승리! +$${calculateSimplifiedWinnings(gameState.bets, gameState.winningNumber)}` 
                    : '아쉽게도 패배'}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 히스토리 - 압축 */}
        {gameState.history.length > 0 && (
          <Card className="p-2" style={rouletteStyles.card}>
            <div className="text-xs mb-1 font-semibold">최근 결과</div>
            <div className="flex gap-1">
              {gameState.history.slice(0, 10).map((num, index) => {
                const color = getSimplifiedNumberColor(num);
                return (
                  <div
                    key={index}
                    className="text-xs px-2 py-1 rounded text-white font-bold"
                    style={{
                      backgroundColor: color === 'red' ? rouletteStyles.rouletteColors.red : color === 'black' ? rouletteStyles.rouletteColors.black : rouletteStyles.rouletteColors.green,
                    }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}