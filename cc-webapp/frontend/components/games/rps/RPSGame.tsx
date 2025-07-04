'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons-Popup';
import { OpponentDisplay } from './OpponentDisplay-new';
import { ResultScreen } from './ResultScreen-new';

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
const AI_THINKING_TIME = 1200; // 적절한 AI 생각 시간

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

// CJ AI 메시지 생성 함수
const generateCJMessage = (result: GameResult, streak: number): string => {
  const messages = {
    win: [
      "대단해요! 🎉 계속 이런 식으로 해보세요!",
      "훌륭한 선택이었어요! 🌟 다음 라운드도 기대돼요!",
      "완벽한 전략이네요! 💫 계속 승리하세요!",
    ],
    lose: [
      "아쉽네요! 😅 다음엔 더 좋은 결과가 있을 거예요!",
      "괜찮아요! 🤗 경험이 쌓이면 더 잘하게 될 거예요!",
      "포기하지 마세요! 💪 다시 한 번 도전해보세요!",
    ],
    draw: [
      "우연의 일치네요! 🤝 서로 비슷한 생각을 했군요!",
      "무승부도 나쁘지 않아요! 🎯 다시 도전해보세요!",
      "똑같은 선택이라니! 🤔 다음엔 어떻게 될까요?",
    ],
  };

  const streakMessages: Record<string, string[]> = {
    win: streak >= 3 ? [`대단한 연승이에요! 🔥 ${streak}연승 달성!`] : [],
    lose: streak >= 3 ? [`${streak}연패... 😔 하지만 곧 운이 돌아올 거예요!`] : [],
    draw: []
  };

  if (result && streakMessages[result] && streakMessages[result].length > 0) {
    return streakMessages[result][0];
  }

  if (result && messages[result] && messages[result].length > 0) {
    return messages[result][Math.floor(Math.random() * messages[result].length)];
  }

  return "게임을 시작해 보세요! 행운을 빌어요! 🚀";
};

// 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const scoreVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "backOut" as const },
  },
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

  const [showScoreModal, setShowScoreModal] = useState(false);

  // 게임 플레이 핸들러
  const handlePlayerChoice = useCallback((choice: Choice) => {
    if (gameState.isPlaying) return;
    
    setGameState(prev => ({
      ...prev,
      playerChoice: choice,
      aiChoice: null,
      result: null,
      isPlaying: true,
      showResultScreen: false,
      cjaiMessage: "AI가 선택을 고민하고 있어요... 🤔",
    }));

    // AI 선택 및 결과 계산
    setTimeout(() => {
      const aiChoice = getAIChoice();
      const result = getGameResult(choice, aiChoice);
      
      setGameState(prev => {
        const newScore = { ...prev.score };
        let newWinStreak = prev.playerWinStreak;
        let newLossStreak = prev.playerLossStreak;

        if (result === 'win') {
          newScore.player++;
          newWinStreak++;
          newLossStreak = 0;
        } else if (result === 'lose') {
          newScore.ai++;
          newLossStreak++;
          newWinStreak = 0;
        } else {
          newScore.draws++;
          newWinStreak = 0;
          newLossStreak = 0;
        }

        const newMessage = generateCJMessage(result, 
          result === 'win' ? newWinStreak : newLossStreak);

        return {
          ...prev,
          aiChoice,
          result,
          isPlaying: false,
          score: newScore,
          showResultScreen: true,
          cjaiMessage: newMessage,
          playerWinStreak: newWinStreak,
          playerLossStreak: newLossStreak,
        };
      });
    }, AI_THINKING_TIME);
  }, [gameState.isPlaying]);

  // 다시 플레이 핸들러
  const handlePlayAgain = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      showResultScreen: false,
      cjaiMessage: "다시 한 번 도전해보세요! 🎯",
    }));
  }, []);

  // 점수 리셋 핸들러
  const handleResetScore = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      score: { player: 0, ai: 0, draws: 0 },
      showResultScreen: false,
      cjaiMessage: "새로운 시작이에요! 화이팅! 🚀",
      playerWinStreak: 0,
      playerLossStreak: 0,
    }));
    setShowScoreModal(false);
  }, []);

  // 총 게임 수 계산
  const totalGames = gameState.score.player + gameState.score.ai + gameState.score.draws;

  return (
    <div className="game-container">
      <motion.div
        className="game-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 게임 헤더 */}
        <motion.header
          className="game-header"
          variants={headerVariants}
        >
          <h1 className="text-xl font-bold text-white">
            🎮 가위바위보
          </h1>
          {/* 점수판 */}
          <motion.div
            className="score-display flex justify-center gap-4 mt-2"
            variants={scoreVariants}
          >
            <div className="score-item">
              <div className="score-label">플레이어</div>
              <div className="score-value player-score">{gameState.score.player}</div>
            </div>
            <div className="score-item">
              <div className="score-label">무승부</div>
              <div className="score-value draw-score">{gameState.score.draws}</div>
            </div>
            <div className="score-item">
              <div className="score-label">AI</div>
              <div className="score-value ai-score">{gameState.score.ai}</div>
            </div>
          </motion.div>
        </motion.header>

        {/* AI 선택 영역 */}
        <div className="opponent-display">
          <h2 className="text-lg font-semibold text-white mb-2">AI의 선택</h2>
          <OpponentDisplay
            choice={gameState.aiChoice}
            isThinking={gameState.isPlaying}
          />
        </div>

        {/* VS 표시 */}
        <div className="text-center my-2">
          <motion.div
            className="text-2xl font-bold text-white"
            animate={{
              scale: gameState.isPlaying ? [1, 1.1, 1] : 1,
              rotate: gameState.isPlaying ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: 1,
              repeat: gameState.isPlaying ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            VS
          </motion.div>
        </div>

        {/* 플레이어 선택 영역 */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white mb-4">당신의 선택</h2>
          <ChoiceButtons
            onChoice={handlePlayerChoice}
            selectedChoice={gameState.playerChoice}
            disabled={gameState.isPlaying}
          />
        </div>

        {/* CJ AI 메시지 */}
        <motion.div
          className="text-center mt-4 px-4"
          key={gameState.cjaiMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="cj-avatar">🤖</div>
          <div className="cj-text">
            <strong>CJ AI:</strong> {gameState.cjaiMessage}
          </div>
        </motion.div>

        {/* 게임 컨트롤 */}
        <div className="rps-controls">
          <button
            className="rps-button secondary"
            onClick={() => setShowScoreModal(true)}
            disabled={gameState.isPlaying}
          >
            📊 상세 통계
          </button>
          <button
            className="rps-button danger"
            onClick={handleResetScore}
            disabled={gameState.isPlaying}
          >
            🔄 게임 리셋
          </button>
        </div>

        {/* 결과 화면 */}
        <AnimatePresence mode="wait">
          {gameState.showResultScreen && gameState.result && (
            <ResultScreen
              result={gameState.result}
              playerChoice={gameState.playerChoice!}
              aiChoice={gameState.aiChoice!}
              onPlayAgain={handlePlayAgain}
              onResetScore={handleResetScore}
            />
          )}
        </AnimatePresence>

        {/* 점수 상세 모달 */}
        <AnimatePresence>
          {showScoreModal && (
            <motion.div
              className="rps-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScoreModal(false)}
            >
              <motion.div
                className="rps-modal-content"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="modal-title">게임 통계</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-label">총 게임 수</div>
                    <div className="stat-value">{totalGames}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">승률</div>
                    <div className="stat-value">
                      {totalGames > 0 ? Math.round((gameState.score.player / totalGames) * 100) : 0}%
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">현재 연승</div>
                    <div className="stat-value">{gameState.playerWinStreak}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">현재 연패</div>
                    <div className="stat-value">{gameState.playerLossStreak}</div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    className="rps-button secondary"
                    onClick={() => setShowScoreModal(false)}
                  >
                    닫기
                  </button>
                  <button
                    className="rps-button danger"
                    onClick={handleResetScore}
                  >
                    통계 초기화
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RPSGame;
