'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
import { OpponentDisplay } from './OpponentDisplay-new';
import { ResultScreen } from './ResultScreen-new';
import './rps-new-theme.css';

export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw' | null;

export interface GameScore {
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

const RPSGame: React.FC = () => {
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

  // AI 선택 로직
  const getAIChoice = useCallback((): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  }, []);

  // 게임 결과 판정
  const getGameResult = useCallback((playerChoice: Choice, aiChoice: Choice): GameResult => {
    if (playerChoice === aiChoice) return 'draw';
    if (
      (playerChoice === 'rock' && aiChoice === 'scissors') ||
      (playerChoice === 'paper' && aiChoice === 'rock') ||
      (playerChoice === 'scissors' && aiChoice === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  }, []);

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
        const newWinStreak = result === 'win' ? prev.playerWinStreak + 1 : 0;
        const newLossStreak = result === 'lose' ? prev.playerLossStreak + 1 : 0;
        
        if (result === 'win') {
          newScore.player++;
        } else if (result === 'lose') {
          newScore.ai++;
        } else {
          newScore.draws++;
        }

        let message = "좋은 게임이었어요! 🎮";
        if (result === 'win') {
          message = newWinStreak >= 3 ? "🔥 연승 중이에요! 대단해요!" : "🎉 승리했어요! 축하해요!";
        } else if (result === 'lose') {
          message = newLossStreak >= 3 ? "😅 다음엔 더 잘할 수 있어요!" : "😔 아쉽네요... 다시 도전해 보세요!";
        }

        return {
          ...prev,
          aiChoice,
          result,
          isPlaying: false,
          score: newScore,
          showResultScreen: true,
          cjaiMessage: message,
          playerWinStreak: newWinStreak,
          playerLossStreak: newLossStreak,
        };
      });
    }, 1000);
  }, [gameState.isPlaying, getAIChoice, getGameResult]);

  // 게임 재시작 핸들러
  const handlePlayAgain = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      showResultScreen: false,
      cjaiMessage: "다시 한번 도전해 보세요! 🎯",
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 게임 헤더 */}
        <motion.header
          className="game-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-lg font-bold text-white">
            🎮 가위바위보
          </h1>
          {/* 토큰 디스플레이 */}
          <motion.div
            className="token-display"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-400">🪙</span>
              <span className="text-white font-bold">1,250</span>
            </div>
          </motion.div>
        </motion.header>

        {/* 플레이어 선택 영역 */}
        <div className="player-choice">
          <h2>내 선택</h2>
          <ChoiceButtons
            onChoice={handlePlayerChoice}
            selectedChoice={gameState.playerChoice}
            disabled={gameState.isPlaying}
          />
        </div>

        {/* VS 표시 */}
        <div className="my-2">
          <motion.div
            className="text-xl"
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

        {/* AI 선택 영역 */}
        <div className="opponent-display">
          <h2>🤖 AI의 선택</h2>
          <OpponentDisplay
            choice={gameState.aiChoice}
            isThinking={gameState.isPlaying}
          />
        </div>

        {/* CJ AI 메시지 */}
        <motion.div
          className="text-center"
          key={gameState.cjaiMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs text-white opacity-90">
            <strong>CJ AI:</strong> {gameState.cjaiMessage}
          </p>
        </motion.div>

        {/* 게임 컨트롤 */}
        <div className="text-center">
          <div className="space-x-3">
            <button
              className="btn-primary"
              onClick={() => setShowScoreModal(true)}
              disabled={gameState.isPlaying}
            >
              📊 상세 통계
            </button>
            <button
              className="btn-primary"
              onClick={handleResetScore}
              disabled={gameState.isPlaying}
            >
              🔄 게임 리셋
            </button>
          </div>
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
              cjaiMessage={gameState.cjaiMessage}
              score={gameState.score}
              playerWinStreak={gameState.playerWinStreak}
              playerLossStreak={gameState.playerLossStreak}
            />
          )}
        </AnimatePresence>

        {/* 점수 상세 모달 */}
        <AnimatePresence>
          {showScoreModal && (
            <motion.div
              className="result-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScoreModal(false)}
            >
              <motion.div
                className="result-content"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="result-title">게임 통계</h3>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="text-center">
                    <div className="text-sm text-white opacity-80">총 게임 수</div>
                    <div className="text-xl font-bold text-white">{totalGames}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white opacity-80">승률</div>
                    <div className="text-xl font-bold text-white">
                      {totalGames > 0 ? Math.round((gameState.score.player / totalGames) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white opacity-80">현재 연승</div>
                    <div className="text-xl font-bold text-white">{gameState.playerWinStreak}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-white opacity-80">현재 연패</div>
                    <div className="text-xl font-bold text-white">{gameState.playerLossStreak}</div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    className="btn-primary"
                    onClick={() => setShowScoreModal(false)}
                  >
                    닫기
                  </button>
                  <button
                    className="btn-primary"
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
