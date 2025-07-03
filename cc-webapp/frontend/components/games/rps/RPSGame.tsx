'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
import { OpponentDisplay } from './OpponentDisplay';
import { ResultScreen } from './ResultScreen';

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
  showResultScreen: boolean;
  cjaiMessage: string;
  playerWinStreak: number;
  playerLossStreak: number;
}

const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];
const AI_THINKING_TIME = 150;

const getGameResult = (playerChoice: Choice, aiChoice: Choice): GameResult => {
  if (playerChoice === aiChoice) return 'draw';
  const winConditions: Record<Choice, Choice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };
  return winConditions[playerChoice] === aiChoice ? 'win' : 'lose';
};

const getAIChoice = (): Choice => {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
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

  // Score Modal State
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

  useEffect(() => {
    // ...confetti styles, localStorage 등 생략 (동일)
  }, []);

  const handlePlayerChoice = useCallback((choice: Choice): void => {
    setGameState(prev => {
      if (prev.isPlaying) return prev;
      return {
        ...prev,
        playerChoice: choice,
        aiChoice: null,
        result: null,
        isPlaying: true,
        showResultScreen: false,
      };
    });
    setTimeout(() => {
      const currentAiChoice = getAIChoice();
      const currentResult = getGameResult(choice, currentAiChoice);
      setGameState(prev => {
        if (!prev.isPlaying || prev.playerChoice !== choice) return prev;
        const newScore: GameScore = { ...prev.score };
        if (currentResult === 'win') newScore.player++;
        else if (currentResult === 'lose') newScore.ai++;
        else newScore.draws++;
        return {
          ...prev,
          aiChoice: currentAiChoice,
          result: currentResult,
          isPlaying: false,
          score: newScore,
          showResultScreen: true,
        };
      });
    }, AI_THINKING_TIME);
  }, []);

  // Scoreboard Modal open/close
  const openScoreModal = () => setScoreModalOpen(true);
  const closeScoreModal = () => setScoreModalOpen(false);

  return (
    <>
      <div className="rps-root">
        <link rel="stylesheet" href="./rps-theme.css" />
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(135deg, #135B79 0%, #0a2233 100%)' }}
          variants={backgroundVariants}
          animate={gameState.isPlaying ? "playing" : "idle"}
          transition={{
            duration: 2,
            ease: "easeInOut" as const
          }}
        />

        <div className="rps-content">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Header - 타이틀 */}
            <motion.header
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
              className="rps-header"
            >
              <motion.h1
                className="rps-title"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "backOut" as const }}
                style={{
                  textShadow: '0 2px 8px #0a2233, 0 1px 0 #fff, 0 0 16px #38bdf8, 0 0 2px #135B79, 0 4px 12px #135B79, 0 0 0 #fff',
                  color: '#fff',
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  letterSpacing: '0.01em',
                  lineHeight: 1.1
                }}
              >
                가위바위보
              </motion.h1>
            </motion.header>

            {/* Game Area - 플레이어 게임 섹션 */}
            <div className="w-full flex flex-col items-center" style={{ gap: 16 }}>
              {/* Player Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <button
                  className="rps-btn"
                  style={{
                    border: '1px solid var(--color-info)',
                    borderRadius: 8,
                    background: 'rgba(19,91,121,0.08)',
                    padding: '2px 10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                  onClick={openScoreModal}
                  aria-label="플레이어 점수판 열기"
                >
                  🎮 <span style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                    textShadow: '0 1px 2px #222, 0 0 4px #38bdf8'
                  }}>플레이어</span>
                </button>
                <button
                  className="rps-btn"
                  style={{
                    border: '1px solid var(--color-info)',
                    borderRadius: 8,
                    background: 'rgba(19,91,121,0.08)',
                    padding: '2px 10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                  onClick={openScoreModal}
                  aria-label="AI 점수판 열기"
                >
                  🤖 <span style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                    textShadow: '0 1px 2px #222, 0 0 4px #38bdf8'
                  }}>AI 상대방</span>
                </button>
              </div>
              <section className="rps-player" style={{ width: '100%' }}>
                <ChoiceButtons
                  onChoice={handlePlayerChoice}
                  selectedChoice={gameState.playerChoice}
                  disabled={gameState.isPlaying}
                />
              </section>
              {/* AI Opponent Section */}
              <section className="rps-ai" role="region" aria-labelledby="ai-section-heading">
                <OpponentDisplay
                  choice={gameState.aiChoice}
                  isThinking={gameState.isPlaying && !gameState.aiChoice}
                />
              </section>
            </div>

            {/* 점수판 버튼 */}
            <button
              className="rps-btn"
              style={{
                margin: '10px 0 0 0',
                padding: '4px 12px',
                border: '1px solid var(--color-info)',
                borderRadius: 8,
                background: 'rgba(19,91,121,0.13)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
              onClick={openScoreModal}
            >
              점수판 보기
            </button>

            {/* 점수판 모달 */}
            <AnimatePresence>
              {scoreModalOpen && (
                <motion.div
                  className="rps-modal"
                  initial={{ opacity: 0, scale: 0.95, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 40 }}
                  transition={{ duration: 0.22, type: "spring", bounce: 0.22 }}
                  style={{
                    minWidth: 240,
                    minHeight: 90,
                    padding: '32px 20px 20px 20px',
                    marginTop: 32,
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.93) 0%, rgba(30,41,59,0.89) 100%)',
                    border: '1.5px solid #38bdf8',
                    borderRadius: 18,
                    boxShadow: '0 8px 32px 0 rgba(30,41,59,0.28), 0 2px 8px 0 rgba(30,58,138,0.18), 0 1.5px 0 #fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 28
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12, color: '#fff', letterSpacing: '0.01em' }}>점수판</div>
                  <div style={{ display: 'flex', gap: 36, marginBottom: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1db67d', fontWeight: 900, fontSize: 22 }}>{gameState.score.player}</div>
                      <div style={{ fontSize: 15, color: '#1db67d', fontWeight: 700 }}>승리</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontWeight: 900, fontSize: 22 }}>{gameState.score.draws}</div>
                      <div style={{ fontSize: 15, color: '#1e3a8a', fontWeight: 700 }}>무승부</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#e23c3c', fontWeight: 900, fontSize: 22 }}>{gameState.score.ai}</div>
                      <div style={{ fontSize: 15, color: '#e23c3c', fontWeight: 700 }}>패배</div>
                    </div>
                  </div>
                  <button
                    className="rps-btn"
                    style={{
                      marginTop: 12,
                      padding: '6px 20px',
                      border: '1px solid #38bdf8',
                      borderRadius: 8,
                      background: 'rgba(30,41,59,0.85)',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#fff',
                      boxShadow: '0 1px 4px #222, 0 1px 2px #222',
                      cursor: 'pointer'
                    }}
                    onClick={closeScoreModal}
                  >
                    닫기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
                  key={gameState.cjaiMessage}
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
                  onPlayAgain={() => setGameState(prev => ({
                    ...prev,
                    playerChoice: null,
                    aiChoice: null,
                    result: null,
                    isPlaying: false,
                    showResultScreen: false,
                  }))}
                  onResetScore={() => setGameState(prev => ({
                    ...prev,
                    playerChoice: null,
                    aiChoice: null,
                    result: null,
                    isPlaying: false,
                    score: { player: 0, ai: 0, draws: 0 },
                    showResultScreen: false,
                  }))}
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
