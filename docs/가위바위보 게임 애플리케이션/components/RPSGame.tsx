'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
import { OpponentDisplay } from './OpponentDisplay';
import { ResultScreen } from './ResultScreen';
import { ParticleSystem } from './ParticleSystem';

export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw' | null;

interface GameScore {
  player: number;
  ai: number;
  draws: number;
}

interface GameState {
  playerChoice: Choice | null;
  aiChoice: Choice | null;
  result: GameResult;
  isPlaying: boolean;
  score: GameScore;
}

// 게임 로직 상수
const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];
const AI_THINKING_TIME = 1500;

// 게임 결과 계산
const getGameResult = (playerChoice: Choice, aiChoice: Choice): GameResult => {
  if (playerChoice === aiChoice) return 'draw';
  
  const winConditions: Record<Choice, Choice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  } as const;
  
  return winConditions[playerChoice] === aiChoice ? 'win' : 'lose';
};

// AI 선택
const getAIChoice = (): Choice => {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
};

// 폭발형 컨페티 효과 - 수정된 버전
const triggerWinConfetti = (): void => {
  const colors = [
    '#7b29cd', '#870dd1', '#5b30f6', '#8054f2',
    '#a855f7', '#c084fc', '#e879f9',
    '#06b6d4', '#38bdf8', '#0ea5e9',
    '#10b981', '#34d399', '#6ee7b7',
    '#ec4899', '#f472b6', '#f9a8d4',
    '#f59e0b', '#fbbf24', '#fcd34d'
  ];

  const shapes = ['●', '★', '♦', '▲', '♥', '✦', '◆', '⬢'];
  
  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 10000;
    overflow: hidden;
  `;
  
  // 화면 중앙 계산
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // 여러 파티클 생성
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 12 + 8;
    
    // 랜덤 방향과 속도
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 400 + 300;
    const endX = centerX + Math.cos(angle) * velocity;
    const endY = centerY + Math.sin(angle) * velocity + Math.random() * 200;
    
    particle.innerHTML = shape;
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${size}px;
      color: ${color};
      text-shadow: 0 0 10px ${color};
      pointer-events: none;
      user-select: none;
      z-index: ${10000 + i};
      animation: confetti-explode 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      --end-x: ${endX}px;
      --end-y: ${endY}px;
      --rotation: ${Math.random() * 720 - 360}deg;
      --scale: ${Math.random() * 0.5 + 0.5};
    `;
    
    container.appendChild(particle);
  }
  
  document.body.appendChild(container);
  
  // 3초 후 정리
  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 3000);
};

// 컨페티 스타일을 전역에 추가
const addConfettiStyles = (): void => {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.head.querySelector('#confetti-styles');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'confetti-styles';
  style.textContent = `
    @keyframes confetti-explode {
      0% {
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
        opacity: 1;
      }
      20% {
        transform: translate(calc(-50% + (var(--end-x) - 50vw) * 0.3), calc(-50% + (var(--end-y) - 50vh) * 0.3)) 
                   scale(1.2) rotate(calc(var(--rotation) * 0.3));
        opacity: 1;
      }
      70% {
        transform: translate(calc(-50% + (var(--end-x) - 50vw) * 0.9), calc(-50% + (var(--end-y) - 50vh) * 0.9)) 
                   scale(var(--scale)) rotate(calc(var(--rotation) * 0.9));
        opacity: 0.7;
      }
      100% {
        transform: translate(calc(-50% + (var(--end-x) - 50vw)), calc(-50% + (var(--end-y) - 50vh) + 100px)) 
                   scale(calc(var(--scale) * 0.3)) rotate(var(--rotation));
        opacity: 0;
      }
    }
    
    @keyframes victory-pulse {
      0%, 100% { 
        background: transparent; 
      }
      50% { 
        background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 60%); 
      }
    }
    
    .victory-flash {
      animation: victory-pulse 1s ease-out;
    }
  `;
  
  document.head.appendChild(style);
};

// 승리 플래시 효과
const triggerVictoryFlash = (): void => {
  const flash = document.createElement('div');
  flash.className = 'victory-flash';
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(flash);
  
  setTimeout(() => {
    if (document.body.contains(flash)) {
      document.body.removeChild(flash);
    }
  }, 1000);
};

// 배경 애니메이션 variants (블러 효과 최소화)
const backgroundVariants = {
  idle: {
    background: [
      'radial-gradient(circle at 25% 75%, rgba(123, 41, 205, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.06) 0%, transparent 50%), linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      'radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.08) 0%, transparent 50%), radial-gradient(circle at 25% 25%, rgba(123, 41, 205, 0.06) 0%, transparent 50%), linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
    ]
  },
  playing: {
    background: [
      'radial-gradient(circle at 50% 50%, rgba(123, 41, 205, 0.12) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 60%), linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      'radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.12) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(123, 41, 205, 0.08) 0%, transparent 60%), linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
    ]
  }
} as const;

// 메인 게임 컴포넌트
export const RPSGame: React.FC = () => {
  // 상태 관리
  const [gameState, setGameState] = useState<GameState>({
    playerChoice: null,
    aiChoice: null,
    result: null,
    isPlaying: false,
    score: { player: 0, ai: 0, draws: 0 }
  });

  // 컴포넌트 마운트 시 스타일 추가
  useEffect(() => {
    addConfettiStyles();
  }, []);

  // 로컬 스토리지에서 점수 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScore = localStorage.getItem('rps-score');
      if (savedScore) {
        try {
          const score = JSON.parse(savedScore);
          setGameState(prev => ({ ...prev, score }));
        } catch (error) {
          console.warn('Failed to load saved score:', error);
        }
      }
    }
  }, []);

  // 점수 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rps-score', JSON.stringify(gameState.score));
    }
  }, [gameState.score]);

  // 플레이어 선택 처리
  const handlePlayerChoice = useCallback((choice: Choice): void => {
    if (gameState.isPlaying) return;

    setGameState(prev => ({
      ...prev,
      playerChoice: choice,
      aiChoice: null,
      result: null,
      isPlaying: true
    }));

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiChoice = getAIChoice();
      const result = getGameResult(choice, aiChoice);
      
      // 점수 업데이트
      const newScore: GameScore = {
        player: gameState.score.player + (result === 'win' ? 1 : 0),
        ai: gameState.score.ai + (result === 'lose' ? 1 : 0),
        draws: gameState.score.draws + (result === 'draw' ? 1 : 0)
      };

      setGameState(prev => ({
        ...prev,
        aiChoice,
        result,
        isPlaying: false,
        score: newScore
      }));

      // 승리 시 효과
      if (result === 'win') {
        triggerVictoryFlash();
        setTimeout(() => {
          triggerWinConfetti();
        }, 300);
      }
    }, AI_THINKING_TIME);
  }, [gameState.isPlaying, gameState.score]);

  // 게임 재시작
  const resetGame = useCallback((): void => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false
    }));
  }, []);

  // 점수 초기화
  const resetScore = useCallback((): void => {
    const initialScore: GameScore = { player: 0, ai: 0, draws: 0 };
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      score: initialScore
    }));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 동적 배경 */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={backgroundVariants}
        animate={gameState.isPlaying ? "playing" : "idle"}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      {/* 파티클 시스템 */}
      <ParticleSystem isActive={gameState.isPlaying} />
      
      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              style={{
                textShadow: '0 0 20px rgba(123, 41, 205, 0.5), 0 4px 8px rgba(0,0,0,0.8)'
              }}
            >
              가위바위보
            </motion.h1>
            
            {/* 점수판 - 블러 효과 최소화 */}
            <motion.div 
              className="mx-auto max-w-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div 
                className="rounded-2xl p-4 sm:p-6 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(3px)',
                  WebkitBackdropFilter: 'blur(3px)'
                }}
              >
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {/* 승리 점수 */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1"
                      style={{ 
                        color: '#10b981',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                      animate={{ 
                        scale: gameState.result === 'win' ? [1, 1.2, 1] : 1,
                        textShadow: gameState.result === 'win' ? [
                          '0 2px 4px rgba(0,0,0,0.8)',
                          '0 0 20px rgba(16, 185, 129, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
                          '0 2px 4px rgba(0,0,0,0.8)'
                        ] : '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                      transition={{ duration: 0.8, type: "spring", stiffness: 300 }}
                    >
                      {gameState.score.player}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/80 font-medium">승리</div>
                  </motion.div>
                  
                  {/* 무승부 점수 */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1"
                      style={{ 
                        color: '#f59e0b',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                      animate={{ 
                        scale: gameState.result === 'draw' ? [1, 1.1, 1] : 1,
                        textShadow: gameState.result === 'draw' ? [
                          '0 2px 4px rgba(0,0,0,0.8)',
                          '0 0 16px rgba(245, 158, 11, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
                          '0 2px 4px rgba(0,0,0,0.8)'
                        ] : '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {gameState.score.draws}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/80 font-medium">무승부</div>
                  </motion.div>
                  
                  {/* 패배 점수 */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1"
                      style={{ 
                        color: '#ef4444',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                      animate={{ 
                        scale: gameState.result === 'lose' ? [1, 1.1, 1] : 1,
                        textShadow: gameState.result === 'lose' ? [
                          '0 2px 4px rgba(0,0,0,0.8)',
                          '0 0 16px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
                          '0 2px 4px rgba(0,0,0,0.8)'
                        ] : '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {gameState.score.ai}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/80 font-medium">패배</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.header>

          {/* 게임 영역 - 블러 효과 최소화 */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* 플레이어 영역 */}
            <motion.section
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)'
              }}
            >
              {/* 미묘한 배경 오버레이 */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(123, 41, 205, 0.02) 0%, transparent 50%, rgba(6, 182, 212, 0.02) 100%)'
                }}
                animate={{ 
                  opacity: gameState.playerChoice ? [0.02, 0.05, 0.02] : 0.02 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.h2 
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-4 sm:mb-6 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                }}
              >
                🎮 플레이어
              </motion.h2>
              
              <ChoiceButtons
                onChoice={handlePlayerChoice}
                selectedChoice={gameState.playerChoice}
                disabled={gameState.isPlaying}
              />
            </motion.section>

            {/* AI 영역 */}
            <motion.section
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)'
              }}
            >
              {/* 미묘한 배경 오버레이 */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.02) 0%, transparent 50%, rgba(123, 41, 205, 0.02) 100%)'
                }}
                animate={{ 
                  opacity: gameState.isPlaying ? [0.02, 0.08, 0.02] : 0.02 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.h2 
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-4 sm:mb-6 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                }}
              >
                🤖 AI 상대방
              </motion.h2>
              
              <OpponentDisplay
                choice={gameState.aiChoice}
                isThinking={gameState.isPlaying}
              />
            </motion.section>
          </div>

          {/* 결과 화면 */}
          <AnimatePresence>
            {gameState.result && (
              <ResultScreen
                result={gameState.result}
                playerChoice={gameState.playerChoice!}
                aiChoice={gameState.aiChoice!}
                onPlayAgain={resetGame}
                onResetScore={resetScore}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RPSGame;