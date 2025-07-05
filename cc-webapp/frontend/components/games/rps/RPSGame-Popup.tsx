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
            className="text-4xl font-bold text-white"
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
        <div className="opponent-display flex flex-col items-center justify-center">
          <div className="text-center text-9xl mb-4"></div>
          <OpponentDisplay
            choice={gameState.aiChoice}
            isThinking={gameState.isPlaying}
          />
        </div>

        {/* 게임 컨트롤 */}
        <div className="text-center mb-4">
          <button
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-slate-500 hover:border-slate-400"
            onClick={() => setShowScoreModal(true)}
            disabled={gameState.isPlaying}
          >
            📊 상세통계
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
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScoreModal(false)}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-600"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 게임 통계</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-300">총 게임 수</div>
                    <div className="text-3xl font-bold text-white">{totalGames}</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-300">승률</div>
                    <div className="text-3xl font-bold text-green-400">
                      {totalGames > 0 ? Math.round((gameState.score.player / totalGames) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-300">현재 연승</div>
                    <div className="text-3xl font-bold text-yellow-400">{gameState.playerWinStreak}</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-300">현재 연패</div>
                    <div className="text-3xl font-bold text-red-400">{gameState.playerLossStreak}</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => setShowScoreModal(false)}
                  >
                    닫기
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
