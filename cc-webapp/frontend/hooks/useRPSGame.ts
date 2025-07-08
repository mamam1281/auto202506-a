'use client';

import { useState, useCallback } from 'react';
import { Choice, GameResult, GameScore, GameState } from '../components/games/rps/types';

export const useRPSGame = (isPopup = false) => {
  const [gameState, setGameState] = useState<GameState>({
    playerChoice: null,
    aiChoice: null,
    result: null,
    isPlaying: false,
    score: { player: 0, ai: 0, draws: 0 },
    showResultScreen: false,
    cjaiMessage: isPopup 
      ? "게임을 시작해 보세요! 행운을 빌어요! 🚀"
      : "가위, 바위, 보 중 하나를 선택하세요!",
    playerWinStreak: 0,
    playerLossStreak: 0,
  });

  const getAIChoice = useCallback((): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  }, []);

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

  return {
    gameState,
    handlePlayerChoice,
    handlePlayAgain,
    handleResetScore,
  };
};
