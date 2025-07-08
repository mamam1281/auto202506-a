'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButtons } from './ChoiceButtons';
import OpponentDisplay from './OpponentDisplay';
import ResultScreen from './ResultScreen';
import { useRPSGame } from '../../../hooks/useRPSGame';
import './rps-compact-theme.css';

const RPSGamePopup: React.FC = () => {
  const { gameState, handlePlayerChoice, handlePlayAgain, handleResetScore } = useRPSGame(true);

  // 게임 영역 애니메이션
  const gameAreaVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // 각 섹션 애니메이션
  const sectionVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <div className="rps-popup-container">
      <AnimatePresence mode="wait">
        {gameState.showResultScreen ? (
          <ResultScreen
            key="result"
            result={gameState.result}
            playerChoice={gameState.playerChoice}
            aiChoice={gameState.aiChoice}
            onPlayAgain={handlePlayAgain}
            onReset={handleResetScore}
            cjaiMessage={gameState.cjaiMessage}
            score={gameState.score}
            playerWinStreak={gameState.playerWinStreak}
            playerLossStreak={gameState.playerLossStreak}
          />
        ) : (
          <motion.div 
            key="game" 
            className="rps-game-area"
            variants={gameAreaVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* 개선된 스코어 보드 */}
            <motion.div 
              className="score-board"
              variants={sectionVariants}
            >
              <motion.div 
                className="score-board-panel"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="score-item">
                  <span className="score-label">승리</span>
                  <span className="score-value win">{gameState.score.player}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">패배</span>
                  <span className="score-value lose">{gameState.score.ai}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">무승부</span>
                  <span className="score-value draw">{gameState.score.draws}</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div variants={sectionVariants}>
              <OpponentDisplay choice={gameState.aiChoice} isThinking={gameState.isPlaying} />
            </motion.div>
            
            {/* 게임 메시지 영역 개선 */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={gameState.cjaiMessage}
                className="game-message"
                variants={sectionVariants}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
              >
                <p className="text-white text-lg font-medium text-center">
                  {gameState.cjaiMessage}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="player-area"
              variants={sectionVariants}
            >
              <ChoiceButtons
                onChoice={handlePlayerChoice}
                selectedChoice={gameState.playerChoice}
                disabled={gameState.isPlaying}
                isPopup={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RPSGamePopup;
