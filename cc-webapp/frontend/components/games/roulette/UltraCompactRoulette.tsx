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
  // 룰렛 게임 전용 색상 (README 기반)
  rouletteColors: {
    red: 'var(--semantic-error)',
    black: 'var(--primary-dark)',
    green: 'var(--semantic-success)',
    white: 'var(--text-primary)',
    purple1: 'var(--purple-1)',
    purple2: 'var(--purple-2)',
    purple3: 'var(--purple-3)',
    purple4: 'var(--purple-4)',
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
    <div className="w-full h-full max-w-[450px] max-h-[700px] mx-auto" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, rgba(167, 139, 250, 0.1) 100%)',
      color: '#f8fafc',
      padding: '16px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      
      {/* 상태 표시 - 최상단 */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        <div>잔액: ${gameState.balance}</div>
        <div>베팅: ${gameState.bets.reduce((sum, bet) => sum + bet.amount, 0)}</div>
      </div>

      {/* 룰렛 휠 - 중앙 */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '4px solid #fbbf24',
              position: 'relative',
              background: `conic-gradient(
                from 0deg,
                #dc2626 0deg 30deg,
                #374151 30deg 60deg,
                #dc2626 60deg 90deg,
                #374151 90deg 120deg,
                #dc2626 120deg 150deg,
                #374151 150deg 180deg,
                #dc2626 180deg 210deg,
                #374151 210deg 240deg,
                #dc2626 240deg 270deg,
                #374151 270deg 300deg,
                #dc2626 300deg 330deg,
                #059669 330deg 360deg
              )`
            }}
            animate={{ rotate: wheelRotation }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            {/* 숫자들 */}
            {SIMPLIFIED_ROULETTE_NUMBERS.map((num, index) => {
              const angle = index * 30;
              return (
                <div
                  key={num}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${angle}deg) translateY(-75px) rotate(-${angle}deg)`,
                    marginLeft: '-12px',
                    marginTop: '-12px',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '14px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {num}
                </div>
              );
            })}
            
            {/* 포인터 */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              marginLeft: '-4px',
              width: '0',
              height: '0',
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '8px solid #fbbf24',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }} />
          </motion.div>
        </div>
      </div>

      {/* 칩 선택 */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '12px',
        padding: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {CHIP_VALUES.map((value, index) => (
            <button
              key={value}
              onClick={() => setSelectedChip(value)}
              disabled={gameState.isSpinning}
              style={{
                background: index === 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                          index === 1 ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' :
                          index === 2 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                          'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                color: 'white',
                border: selectedChip === value ? '2px solid #fbbf24' : 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: selectedChip === value ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
            >
              ${value}
            </button>
          ))}
        </div>
      </div>

      {/* 베팅 영역 */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '12px',
        padding: '12px'
      }}>
        {/* 숫자 베팅 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>숫자 베팅 (12x)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
            {SIMPLIFIED_ROULETTE_NUMBERS.map(num => {
              const color = getSimplifiedNumberColor(num);
              return (
                <button
                  key={num}
                  onClick={() => placeBet('number', num)}
                  disabled={gameState.isSpinning || gameState.balance < selectedChip}
                  style={{
                    backgroundColor: color === 'red' ? '#dc2626' : 
                                   color === 'black' ? '#374151' : 
                                   '#059669',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* 색상 베팅 */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>색상 베팅 (2x)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              onClick={() => placeBet('color', 'red')}
              disabled={gameState.isSpinning || gameState.balance < selectedChip}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              RED
            </button>
            <button
              onClick={() => placeBet('color', 'black')}
              disabled={gameState.isSpinning || gameState.balance < selectedChip}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              BLACK
            </button>
          </div>
        </div>
      </div>

      {/* 게임 컨트롤 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <button
          onClick={handleSpin}
          disabled={gameState.bets.length === 0 || gameState.isSpinning}
          style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            cursor: gameState.bets.length === 0 || gameState.isSpinning ? 'not-allowed' : 'pointer',
            opacity: gameState.bets.length === 0 || gameState.isSpinning ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          {gameState.isSpinning ? '스핀 중...' : 'SPIN'}
        </button>
        <button
          onClick={clearBets}
          disabled={gameState.bets.length === 0 || gameState.isSpinning}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            cursor: gameState.bets.length === 0 || gameState.isSpinning ? 'not-allowed' : 'pointer',
            opacity: gameState.bets.length === 0 || gameState.isSpinning ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          베팅 취소
        </button>
      </div>

      {/* 히스토리 */}
      {gameState.history.length > 0 && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderRadius: '12px',
          padding: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>최근 결과</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {gameState.history.slice(0, 10).map((num, index) => {
              const color = getSimplifiedNumberColor(num);
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: color === 'red' ? '#dc2626' : color === 'black' ? '#374151' : '#059669',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 결과 표시 */}
      <AnimatePresence>
        {showResult && gameState.winningNumber !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'var(--color-primary-dark-navy)' }}
          >
            <Card className="p-6 text-center glass-surface-strong pulse-subtle" style={rouletteStyles.card}>
              <div className="text-4xl mb-2">🎰</div>
              <div className="text-xl font-bold mb-2">
                결과: {gameState.winningNumber}
              </div>
              <div 
                className="text-lg"
                style={{
                  color: calculateSimplifiedWinnings(gameState.bets, gameState.winningNumber) > 0 
                    ? 'var(--semantic-success)' 
                    : 'var(--semantic-error)'
                }}
              >
                {calculateSimplifiedWinnings(gameState.bets, gameState.winningNumber) > 0 
                  ? `승리! +$${calculateSimplifiedWinnings(gameState.bets, gameState.winningNumber)}` 
                  : '아쉽게도 패배'}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}