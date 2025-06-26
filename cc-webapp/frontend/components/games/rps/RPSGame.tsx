'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
import { OpponentDisplay } from './OpponentDisplay';
import { ResultScreen } from './ResultScreen';
import { ParticleSystem, ParticleSystemStyleInjector } from './ParticleSystem';

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
const AI_THINKING_TIME = 1500; // ms

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

// Call to add styles once when component mounts
React.useEffect(() => {
  addConfettiStyles();
}, []);


const backgroundVariants = {
  idle: {
    background: [
      'radial-gradient(circle at 25% 75%, rgba(91, 48, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(19, 91, 121, 0.06) 0%, transparent 50%), linear-gradient(135deg, var(--color-primary-dark-navy) 0%, var(--color-primary-charcoal) 100%)',
      'radial-gradient(circle at 75% 75%, rgba(19, 91, 121, 0.08) 0%, transparent 50%), radial-gradient(circle at 25% 25%, rgba(91, 48, 246, 0.06) 0%, transparent 50%), linear-gradient(135deg, var(--color-primary-dark-navy) 0%, var(--color-primary-charcoal) 100%)'
    ]
  },
  playing: {
    background: [
      'radial-gradient(circle at 50% 50%, rgba(91, 48, 246, 0.12) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(19, 91, 121, 0.08) 0%, transparent 60%), linear-gradient(135deg, var(--color-primary-dark-navy) 0%, var(--color-primary-charcoal) 100%)',
      'radial-gradient(circle at 70% 30%, rgba(19, 91, 121, 0.12) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(91, 48, 246, 0.08) 0%, transparent 60%), linear-gradient(135deg, var(--color-primary-dark-navy) 0%, var(--color-primary-charcoal) 100%)'
    ]
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

  // Load score from localStorage
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rps-score', JSON.stringify(gameState.score));
    }
  }, [gameState.score]);

  const handlePlayerChoice = useCallback((choice: Choice): void => {
    if (gameState.isPlaying) return;

    setGameState(prev => ({
      ...prev,
      playerChoice: choice,
      aiChoice: null,
      result: null,
      isPlaying: true,
      showResultScreen: false, // Hide previous result if any
    }));

    // Record action API call
    try {
      fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: 'rps', choice, timestamp: new Date().toISOString() })
      });
      // Not waiting for response to keep UI snappy
    } catch (error) {
      console.warn('RPSGame: Failed to record action via API', error);
    }
    // TODO: Play sound for player choice selection (e.g., a click or whoosh)

    setTimeout(() => {
      const currentAiChoice = getAIChoice();
      // TODO: Play sound for AI choice reveal (e.g., a futuristic reveal sound)
      const currentResult = getGameResult(choice, currentAiChoice);

      let newPlayerWinStreak = gameState.playerWinStreak;
      let newPlayerLossStreak = gameState.playerLossStreak;
      let cjMessage = "";

      const newScore: GameScore = { ...gameState.score };
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
        if (newPlayerWinStreak >= 3) {
          cjMessage += ` ${newPlayerWinStreak}연승 중! 🔥 불타오르네요!`;
        } else if (newPlayerWinStreak === 2) {
          cjMessage += ` 2연승! 다음 판도 이길 수 있어요!`;
        }
      } else if (currentResult === 'lose') {
        newScore.ai++;
        newPlayerLossStreak++;
        newPlayerWinStreak = 0;
        const loseMessages = [
          "아쉬워요! 하지만 다음엔 꼭 이길 거예요. 😥",
          "괜찮아요, 누구나 질 때도 있는걸요. 다시 한번! 💪",
          "상대가 운이 좋았네요! 다시 도전해 보세요."
        ];
        cjMessage = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        if (newPlayerLossStreak >= 3) {
          cjMessage += ` ${newPlayerLossStreak}연패 중이지만, 곧 반전이 있을 거예요! 💫`;
        } else if (newPlayerLossStreak === 2) {
          cjMessage += ` 너무 자책하지 마세요! 다음 판엔 운이 따를 거예요.`;
        }
      } else if (currentResult === 'draw') {
        newScore.draws++;
        newPlayerWinStreak = 0; // Reset streaks on draw
        newPlayerLossStreak = 0;
        const drawMessages = [
          "무승부네요! 정말 막상막하였어요. 🤝",
          "아슬아슬했어요! 다음엔 승리합시다!",
          "팽팽한 접전! 다음엔 누가 이길까요? 🤔"
        ];
        cjMessage = drawMessages[Math.floor(Math.random() * drawMessages.length)];
      }

      setGameState(prev => ({
        ...prev,
        aiChoice: currentAiChoice,
        result: currentResult,
        isPlaying: false,
        score: newScore,
        showResultScreen: true, // Show result screen now
        cjaiMessage: cjMessage,
        playerWinStreak: newPlayerWinStreak,
        playerLossStreak: newPlayerLossStreak,
      }));

      // Emotional feedback API call
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
        });
        // Not waiting for response
      } catch (error) {
        console.warn('RPSGame: Failed to send feedback via API', error);
      }

      if (currentResult === 'win') {
        triggerVictoryFlash();
        setTimeout(() => {
          triggerWinConfetti();
        }, 300);
        // TODO: Play sound for WIN
      } else if (currentResult === 'lose') {
        // TODO: Play sound for LOSE
      } else { // Draw
        // TODO: Play sound for DRAW
      }
    }, AI_THINKING_TIME);
  }, [gameState.isPlaying, gameState.score, gameState.playerWinStreak, gameState.playerLossStreak]); // Added streaks to dependency array

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
    {/* Inject styles for ParticleSystem's transparent colors & general game specific styles */}
    <ParticleSystemStyleInjector />
    <style>{cssVariablesStyle}</style>
    {/* cssVariablesStyle is for RPSGame's own dynamic background, distinct from ParticleSystem's needs */}

    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Dynamic Background for RPSGame itself */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={backgroundVariants}
        animate={gameState.isPlaying ? "playing" : "idle"}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror" as const, // "reverse" in example, "mirror" is also good
          ease: "easeInOut" as const
        }}
      />

      <ParticleSystem isActive={gameState.isPlaying || (gameState.result === 'win' && gameState.showResultScreen)} />

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}              transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "backOut" as const }}
              style={{
                textShadow: '0 0 20px var(--color-purple-tertiary), 0 0 10px var(--color-purple-primary), 0 4px 8px rgba(0,0,0,0.8)'
              }}
            >
              가위바위보
            </motion.h1>

            {/* Scoreboard */}
            <motion.div
              className="mx-auto max-w-md bg-card/50 backdrop-blur-sm border border-border/20" // Using system CSS variables
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div
                className="rounded-2xl p-4 sm:p-6 bg-card/30 backdrop-blur-sm border border-border/10" // Using system variables
              >
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {/* Player Wins */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    aria-live="polite"
                  >
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-green-400" // Using Tailwind color
                      style={{ textShadow: '0 0 10px var(--color-success), 0 2px 4px rgba(0,0,0,0.8)'}}
                      animate={{
                        scale: gameState.result === 'win' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.8, type: "spring" as const, stiffness: 300 }}
                    >
                      {gameState.score.player}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium" id="player-score-label">승리</div>
                  </motion.div>

                  {/* Draws */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    aria-live="polite"
                  >
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-amber-400" // Using Tailwind color
                      style={{ textShadow: '0 0 10px var(--color-accent-amber), 0 2px 4px rgba(0,0,0,0.8)'}}
                       animate={{ scale: gameState.result === 'draw' ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {gameState.score.draws}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium" id="draw-score-label">무승부</div>
                  </motion.div>

                  {/* AI Wins */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    aria-live="polite"
                  >
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-red-400" // Using Tailwind color
                      style={{ textShadow: '0 0 10px var(--color-error), 0 2px 4px rgba(0,0,0,0.8)'}}
                      animate={{ scale: gameState.result === 'lose' ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {gameState.score.ai}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium" id="ai-score-label">패배</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.header>

          {/* Game Area */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Player Section */}
            <motion.section
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" as const }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 bg-card/50 backdrop-blur-sm border border-border/20"
              role="region"
              aria-labelledby="player-section-heading"
            >
              <motion.h2
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-text-primary mb-4 sm:mb-6 text-center"
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
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 bg-card/50 backdrop-blur-sm border border-border/20"
              role="region"
              aria-labelledby="ai-section-heading"
            >
              <motion.h2
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-text-primary mb-4 sm:mb-6 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
              >
                🤖 AI 상대방
              </motion.h2>

              <OpponentDisplay
                choice={gameState.aiChoice}
                isThinking={gameState.isPlaying && !gameState.aiChoice} // Pass true only when AI is actually thinking
              />
            </motion.section>
          </div>

          {/* CJ AI Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center p-4 mb-8 bg-card/30 backdrop-blur-sm border border-border/10 rounded-xl min-h-[60px] flex items-center justify-center"
            role="log"
            aria-live="polite"
          >
            <p className="text-muted-foreground">
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
