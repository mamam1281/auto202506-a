'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
import { OpponentDisplay } from './OpponentDisplay';
import { ResultScreen } from './ResultScreen';

// TODO: Temporarily comment out imports until those files are created.
// Will uncomment as I create each component.

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
  showResultScreen: boolean; // Added to control ResultScreen visibility explicitly
  cjaiMessage: string;
  playerWinStreak: number;
  playerLossStreak: number;
}

// Game Logic Constants
const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];
const AI_THINKING_TIME = 150; // ms - 더욱 빠르게 변경 (성능 최적화)

// Game Result Calculation (from example)
const getGameResult = (playerChoice: Choice, aiChoice: Choice): GameResult => {
  if (playerChoice === aiChoice) return 'draw';
  const winConditions: Record<Choice, Choice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };
  return winConditions[playerChoice] === aiChoice ? 'win' : 'lose';
};

// AI Choice (from example)
const getAIChoice = (): Choice => {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
};

// Detailed Confetti and Flash Effects from the example file

// 폭발형 컨페티 효과 - (Copied from docs/가위바위보 게임 애플리케이션/components/RPSGame.tsx)
const triggerWinConfetti = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const colors = [
    'var(--color-purple-primary)', 'var(--color-purple-secondary)', 'var(--color-purple-tertiary)',
    'var(--color-accent-red)', 'var(--color-info)', 'var(--color-success)', 'var(--color-accent-amber)',
    '#a855f7', '#c084fc', '#e879f9', // Extra purples/pinks
    '#06b6d4', '#38bdf8', '#0ea5e9', // Extra cyans/blues
    '#10b981', '#34d399', '#6ee7b7', // Extra greens
    '#ec4899', '#f472b6', '#f9a8d4', // Extra pinks
    '#f59e0b', '#fbbf24', '#fcd34d'  // Extra ambers/yellows
  ];

  const shapes = ['●', '★', '♦', '▲', '♥', '✦', '◆', '⬢', '✨', '✴️']; // Added more shapes

  const container = document.createElement('div');
  container.className = 'rps-confetti-container'; // Specific class name
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

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 90; i++) { // Increased particle count slightly
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 12 + 9; // Slightly larger base size

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 450 + 350; // Slightly increased velocity
    const endX = centerX + Math.cos(angle) * velocity;
    const endY = centerY + Math.sin(angle) * velocity + Math.random() * 250; // More downward drift

    particle.innerHTML = shape;
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${size}px;
      color: ${color};
      text-shadow: 0 0 8px ${color}, 0 0 15px ${color};
      pointer-events: none;
      user-select: none;
      z-index: ${10000 + i};
      animation: rps-confetti-explode 2.8s cubic-bezier(0.15, 0.5, 0.45, 0.95) forwards; // Slightly adjusted timing
      --end-x: ${endX}px;
      --end-y: ${endY}px;
      --rotation: ${Math.random() * 720 - 360}deg;
      --scale: ${Math.random() * 0.6 + 0.5};
    `;

    container.appendChild(particle);
  }

  document.body.appendChild(container);

  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 3500); // Increased cleanup time
};

// 컨페티 스타일을 전역에 추가 (Copied from example)
const addConfettiStyles = (): void => {
  if (typeof document === 'undefined') return;

  const styleId = 'rps-confetti-styles'; // Specific ID
  const existingStyle = document.head.querySelector(`#${styleId}`);
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes rps-confetti-explode { /* Renamed animation */
      0% {
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
        opacity: 1;
      }
      20% {
        transform: translate(calc(-50% + (var(--end-x) - 50vw) * 0.3), calc(-50% + (var(--end-y) - 50vh) * 0.3))
                   scale(1.25) rotate(calc(var(--rotation) * 0.3));
        opacity: 1;
      }
      70% {
        transform: translate(calc(-50% + (var(--end-x) - 50vw) * 0.9), calc(-50% + (var(--end-y) - 50vh) * 0.9))
                   scale(var(--scale)) rotate(calc(var(--rotation) * 0.9));
        opacity: 0.8;
      }
      100% {
        transform: translate(calc(-50% + (var(--end-x) - 50vw)), calc(-50% + (var(--end-y) - 50vh) + 120px))
                   scale(calc(var(--scale) * 0.2)) rotate(var(--rotation));
        opacity: 0;
      }
    }

    .victory-flash-overlay { /* Style for victory flash, moved here for co-location */
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      animation: rps-victory-pulse 1s ease-out; /* Renamed animation */
    }

    @keyframes rps-victory-pulse { /* Renamed animation */
      0%, 100% { background: transparent; }
      50% { background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 65%); }
      /* Using direct color value for success green with transparency */
    }
  `;
  document.head.appendChild(style);
};

// 승리 플래시 효과 (Copied from example, class name matches above style)
const triggerVictoryFlash = (): void => {
  if (typeof document === 'undefined') return;
  const flash = document.createElement('div');
  flash.className = 'victory-flash-overlay';
  document.body.appendChild(flash);
  setTimeout(() => {
    if (document.body.contains(flash)) {
      document.body.removeChild(flash);
    }
  }, 1000);
};


const backgroundVariants = {
  idle: {
    background: 'linear-gradient(135deg, var(--color-primary-dark-navy) 0%, var(--color-primary-charcoal) 100%)'
  },
  playing: {
    background: 'linear-gradient(135deg, var(--color-primary-dark-navy) 0%, var(--color-primary-charcoal) 100%)'
  }
};


export const RPSGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerChoice: null,
    aiChoice: null,
    result: null,
    isPlaying: false,
    score: { player: 0, ai: 0, draws: 0 },
    showResultScreen: false,
    cjaiMessage: "게임을 시작해 보세요! 행운을 빌어요! 🚀",
    playerWinStreak: 0,
    playerLossStreak: 0,
  });

  // Add confetti styles once when component mounts
  useEffect(() => {
    addConfettiStyles();
  }, []);

  // Load score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScore = localStorage.getItem('rps-score');
      if (savedScore) {
        try {
          const score = JSON.parse(savedScore);
          setGameState(prev => ({ ...prev, score }));
        } catch (error) {
          console.warn('RPSGame: Failed to load saved score:', error);
          localStorage.removeItem('rps-score'); // Clear corrupted data
        }
      }
    }
  }, []);

  // Save score to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rps-score', JSON.stringify(gameState.score));
    }
  }, [gameState.score]);

  const handlePlayerChoice = useCallback((choice: Choice): void => {
    // 현재 상태를 함수형 업데이트로 안전하게 체크
    setGameState(prev => {
      // 게임이 진행 중이면 아무것도 하지 않음
      if (prev.isPlaying) return prev;

      // 플레이어 선택 상태 즉시 업데이트
      return {
        ...prev,
        playerChoice: choice,
        aiChoice: null,
        result: null,
        isPlaying: true,
        showResultScreen: false,
      };
    });

    // Record action API call (non-blocking)
    try {
      fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'rps', choice, timestamp: new Date().toISOString() })
      }).catch(err => console.warn('RPSGame: API call failed', err));
    } catch (error) {
      console.warn('RPSGame: Failed to record action via API', error);
    }

    setTimeout(() => {
      const currentAiChoice = getAIChoice();
      const currentResult = getGameResult(choice, currentAiChoice);

      setGameState(prev => {
        // 이미 게임이 끝났거나 다른 게임이 시작된 경우 무시
        if (!prev.isPlaying || prev.playerChoice !== choice) {
          return prev;
        }

        const newScore: GameScore = { ...prev.score };
        let newPlayerWinStreak = prev.playerWinStreak;
        let newPlayerLossStreak = prev.playerLossStreak;
        let cjMessage = "";
        if (currentResult === 'win') {
          newScore.player++;
          newPlayerWinStreak++;
          newPlayerLossStreak = 0;
          const winMessages = [
            "엄청난 승리입니다! 🎉",
            "정말 잘하시네요! 계속 이 기세를 몰아가세요!",
            "완벽한 플레이! 🤩"
          ];
          cjMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
        } else if (currentResult === 'lose') {
          newScore.ai++;
          newPlayerLossStreak++;
          newPlayerWinStreak = 0;
          const loseMessages = [
            "아쉽네요! 다음엔 더 잘할 수 있을 거예요! �",
            "괜찮아요, 계속 도전해보세요!",
            "다음 기회에 꼭 이기세요!"
          ];
          cjMessage = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        } else {
          newScore.draws++;
          cjMessage = "무승부예요! 다시 한번 도전해보세요!";
        }

        return {
          ...prev,
          aiChoice: currentAiChoice,
          result: currentResult,
          isPlaying: false,
          score: newScore,
          showResultScreen: true,
          cjaiMessage: cjMessage,
          playerWinStreak: newPlayerWinStreak,
          playerLossStreak: newPlayerLossStreak,
        };
      });

      // 승리 시 시각 효과 (성능 최적화를 위해 조건부로 실행)
      if (currentResult === 'win') {
        // 즉시 플래시 효과
        triggerVictoryFlash();
        // 컨페티는 약간 지연해서 실행
        requestAnimationFrame(() => {
          setTimeout(() => {
            triggerWinConfetti();
          }, 200);
        });
      }

      // 감정 피드백 API 호출 (비차단, 성능 최적화)
      requestIdleCallback(() => {
        try {
          fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              game: 'rps',
              result: currentResult,
              playerChoice: choice,
              aiChoice: currentAiChoice,
              timestamp: new Date().toISOString()
            })
          }).catch(err => console.warn('RPSGame: Feedback API call failed', err));
        } catch (error) {
          console.warn('RPSGame: Failed to send feedback via API', error);
        }
      }, { timeout: 2000 });
    }, AI_THINKING_TIME);
  }, []); // 의존성 없음 - 함수형 업데이트로 안전하게 처리

  const handlePlayAgain = useCallback((): void => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      showResultScreen: false,
    }));
  }, []);

  const handleResetScore = useCallback((): void => {
    const initialScore: GameScore = { player: 0, ai: 0, draws: 0 };
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      score: initialScore,
      showResultScreen: false,
    }));
  }, []);

  // Define transparent color variables for backgroundVariants if not globally available
  // This is a workaround. Ideally, these should be in globals.css or tailwind.config.js
  const cssVariablesStyle = `
    :root {
      --neon-purple-1-t008: rgba(91, 48, 246, 0.08);
      --color-info-t006: rgba(19, 91, 121, 0.06);
      --color-info-t008: rgba(19, 91, 121, 0.08);
      --neon-purple-1-t006: rgba(91, 48, 246, 0.06);
      --neon-purple-1-t012: rgba(91, 48, 246, 0.12);
      --color-info-t012: rgba(19, 91, 121, 0.12);
      --color-success-rgb-t01: rgba(16, 185, 129, 0.1); /* For victory flash */
    }
  `;

  return (
    <>
    {/* Inject styles for game specific styles */}
    <style>{cssVariablesStyle}</style>

    <div className="h-screen w-full relative overflow-hidden bg-background text-foreground flex flex-col">
      {/* Dynamic Background for RPSGame itself */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={backgroundVariants}
        animate={gameState.isPlaying ? "playing" : "idle"}
        transition={{
          duration: 2, // 배경 전환도 빠르게
          ease: "easeInOut" as const
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start py-4 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Header - 타이틀 */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="text-center mb-5" // 20px 간격으로 조정
          >
            <motion.h1
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "backOut" as const }}
              style={{
                textShadow: '0 0 20px var(--color-purple-tertiary), 0 0 10px var(--color-purple-primary), 0 4px 8px rgba(0,0,0,0.8)'
              }}
            >
              가위바위보
            </motion.h1>
          </motion.header>

          {/* Game Area - 플레이어 게임 섹션 */}
          <div className="flex flex-col gap-4 w-full items-center">
            {/* Player Section */}
            <motion.section
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" as const }}
              className="w-full relative overflow-hidden rounded-xl p-4 bg-card/50 backdrop-blur-sm border border-border/20 flex flex-col items-center justify-center text-center"
              role="region"
              aria-labelledby="player-section-heading"
            >
              <motion.h2
                className="text-lg font-semibold text-text-primary mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                🎮 플레이어
              </motion.h2>

              <ChoiceButtons
                onChoice={handlePlayerChoice}
                selectedChoice={gameState.playerChoice}
                disabled={gameState.isPlaying}
              />
            </motion.section>

            {/* AI Opponent Section */}
            <motion.section
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" as const }}
              className="w-full relative overflow-hidden rounded-xl p-4 bg-card/50 backdrop-blur-sm border border-border/20 flex flex-col items-center justify-center text-center"
              role="region"
              aria-labelledby="ai-section-heading"
            >
              <motion.h2
                className="text-lg font-semibold text-text-primary mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                🤖 AI 상대방
              </motion.h2>

              <OpponentDisplay
                choice={gameState.aiChoice}
                isThinking={gameState.isPlaying && !gameState.aiChoice}
              />
            </motion.section>
          </div>

          {/* CJ AI Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center my-4 bg-card/30 backdrop-blur-sm border border-border/10 rounded-xl min-h-[50px] flex items-center justify-center px-4 py-3 w-full"
            role="log"
            aria-live="polite"
          >
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold text-accent">CJ AI:</span>
              <motion.span
                key={gameState.cjaiMessage} // Trigger animation on message change
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="ml-1.5 inline-block"
              >
                {gameState.cjaiMessage}
              </motion.span>
            </p>
          </motion.div>

          {/* Scoreboard - CJ AI 아래로 이동, 완전 가운데 정렬 */}
          <motion.div
            className="w-full flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-xl">
              <div className="bg-card/30 backdrop-blur-sm border border-border/10 rounded-xl px-6 py-4">
                <div className="grid grid-cols-3 gap-6">
                  {/* Player Wins */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    aria-live="polite"
                  >
                    <motion.div
                      className="text-2xl font-bold mb-2 text-green-400"
                      style={{ textShadow: '0 0 15px var(--color-success), 0 4px 8px rgba(0,0,0,0.8)'}}
                      animate={{
                        scale: gameState.result === 'win' ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.8, type: "spring", stiffness: 300, damping: 8 }}
                    >
                      {gameState.score.player}
                    </motion.div>
                    <div className="text-sm text-muted-foreground font-medium" id="player-score-label">승리</div>
                  </motion.div>

                  {/* Draws */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    aria-live="polite"
                  >
                    <motion.div
                      className="text-2xl font-bold mb-2 text-amber-400"
                      style={{ textShadow: '0 0 15px var(--color-accent-amber), 0 4px 8px rgba(0,0,0,0.8)'}}
                      animate={{ scale: gameState.result === 'draw' ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {gameState.score.draws}
                    </motion.div>
                    <div className="text-sm text-muted-foreground font-medium" id="draw-score-label">무승부</div>
                  </motion.div>

                  {/* AI Wins */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    aria-live="polite"
                  >
                    <motion.div
                      className="text-2xl font-bold mb-2 text-red-400"
                      style={{ textShadow: '0 0 15px var(--color-error), 0 4px 8px rgba(0,0,0,0.8)'}}
                      animate={{ scale: gameState.result === 'lose' ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {gameState.score.ai}
                    </motion.div>
                    <div className="text-sm text-muted-foreground font-medium" id="ai-score-label">패배</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Result Screen */}
          <AnimatePresence>
            {gameState.showResultScreen && gameState.result && gameState.playerChoice && gameState.aiChoice && (
              <ResultScreen
                result={gameState.result}
                playerChoice={gameState.playerChoice}
                aiChoice={gameState.aiChoice}
                onPlayAgain={handlePlayAgain}
                onResetScore={handleResetScore}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </>
  );
};

export default RPSGame;
