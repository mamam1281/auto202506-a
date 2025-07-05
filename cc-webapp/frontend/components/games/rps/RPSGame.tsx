'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
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
  }, []);

  // 총 게임 수 계산
  const totalGames = gameState.score.player + gameState.score.ai + gameState.score.draws;

  return (
    <div className="rps-root">
      <div className="rps-content">
        <div className="rps-game-container">
          <div className="rps-game-content">
            {/* 게임 헤더 */}
            <header className="rps-header">
              <h1 className="rps-title">🎮 가위바위보</h1>
              <div className="rps-scoreboard">
                <div className="score-item">
                  <div className="score-label">플레이어</div>
                  <div className="score-value player-score">{gameState.score.player}</div>
                </div>
                <div className="score-item">
                  <div className="score-label">AI</div>
                  <div className="score-value ai-score">{gameState.score.ai}</div>
                </div>
                <div className="score-item">
                  <div className="score-label">무승부</div>
                  <div className="score-value draw-score">{gameState.score.draws}</div>
                </div>
              </div>
            </header>

            {/* 플레이어 선택 영역 */}
            <section className="rps-game-area">
              <div className="rps-player-section">
                <div className="section-title">내 선택</div>
                <ChoiceButtons
                  onChoice={handlePlayerChoice}
                  selectedChoice={gameState.playerChoice}
                  disabled={gameState.isPlaying}
                />
              </div>

              {/* VS 표시 */}
              <div className="rps-vs-display">
                <motion.div
                  className="vs-text"
                  animate={{
                    scale: gameState.isPlaying ? [1, 1.1, 1] : 1,
                    rotate: gameState.isPlaying ? [0, 180, 360] : 0,
                  }}
                >
                  VS
                </motion.div>
              </div>

              {/* AI 선택 영역 */}
              <div className="rps-ai-section">
                <div className="section-title">AI</div>
                <div className="ai-emoji">🤖</div>
              </div>

              {/* 게임 컨트롤 영역 */}
              <div className="rps-controls">
                {/* 컨트롤 버튼이 필요하면 이곳에 추가 */}
              </div>
            </section>

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

            {/* 점수 상세 모달 제거 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPSGame;
