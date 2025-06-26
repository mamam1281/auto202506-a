'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Choice, GameResult } from './RPSGame'; // Assuming RPSGame.tsx is in the same directory

interface ResultScreenProps {
  result: GameResult;
  playerChoice: Choice;
  aiChoice: Choice;
  onPlayAgain: () => void;
  onResetScore: () => void;
}

const choiceEmojis: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

const choiceLabels: Record<Choice, string> = {
  rock: '바위',
  paper: '보',
  scissors: '가위'
};

// Configuration for result display, using CSS Variables
const resultConfig = {
  win: {
    title: '🎉 승리!',
    message: '축하합니다! 당신이 이겼습니다!',
    colorVar: 'var(--color-success)',
    glowColorVar: '16, 185, 129', // Success green RGB values
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
    borderColorVar: 'rgba(16, 185, 129, 0.4)'
  },
  lose: {
    title: '😔 패배',
    message: '아쉽습니다. 다시 도전해보세요!',
    colorVar: 'var(--color-error)',
    glowColorVar: '185, 12, 41', // Error red RGB values
    bgGradient: 'linear-gradient(135deg, rgba(185, 12, 41, 0.15) 0%, rgba(185, 12, 41, 0.05) 100%)',
    borderColorVar: 'rgba(185, 12, 41, 0.4)'
  },
  draw: {
    title: '🤝 무승부',
    message: '비겼습니다! 한 번 더 시도해보세요!',
    colorVar: 'var(--color-accent-amber)',
    glowColorVar: '245, 158, 11', // Amber RGB values
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
    borderColorVar: 'rgba(245, 158, 11, 0.4)'
  }
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  playerChoice,
  aiChoice,
  onPlayAgain,
  onResetScore
}) => {
  if (!result) return null; // Should not happen if gameState.showResultScreen controls this

  const config = resultConfig[result];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3, delay: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 20, delay: 0.1 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 30,
      transition: { duration: 0.25, ease: "easeIn" as const }
    }
  };

  return (
    <motion.div
      key="result-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      // Removed inline style, using Tailwind classes above
    >
      <motion.div
        key="result-modal"
        variants={modalVariants}
        className="relative max-w-sm w-full mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-8 modern-mesh-card glassmorphism-dark"
        role="alertdialog" // Use alertdialog if it's interrupting and needs immediate attention
        aria-labelledby="result-title"
        aria-describedby="result-message"
        style={{
          // @ts-ignore
          '--tw-gradient-from': `${config.colorVar}33`, // For mesh effect if used
          // @ts-ignore
          '--tw-gradient-to': `${config.colorVar}11`,
          background: `var(--card), ${config.bgGradient}`, // Layer card background with result gradient
          border: `1.5px solid ${config.borderColorVar}`,
          boxShadow: `
            0 16px 32px rgba(0,0,0,0.3), /* Softer, larger shadow */
            0 0 0 1px ${config.borderColorVar},
            inset 0 1px 1px rgba(255,255,255,0.12),
            0 0 40px -10px rgba(${config.glowColorVar}, 0.5) /* Result color glow */
          `,
        }}
      >
        {/* Result Title */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4 } }}
          className="text-center mb-5 sm:mb-6"
        >
          <h2
            id="result-title"
            className="text-3xl sm:text-4xl font-bold mb-1.5"
            style={{
              color: config.colorVar,
              textShadow: `0 0 15px rgba(${config.glowColorVar}, 0.6), 0 0 25px rgba(${config.glowColorVar}, 0.4), 0 2px 3px rgba(0,0,0,0.7)`
            }}
          >
            {config.title}
          </h2>
          <p id="result-message" className="text-text-secondary text-sm sm:text-base">
            {config.message}
          </p>
        </motion.div>

        {/* Choices Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.35, duration: 0.45, ease: "backOut" } }}
          className="flex items-center justify-around gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Player Choice */}
          <div className="text-center">
            <motion.div
              animate={{
                scale: result === 'win' ? [1, 1.25, 1] : [1, 1.05, 1],
                rotate: result === 'win' ? [0, 3, -3, 0] : 0
              }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl mb-1.5"
              style={{ filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.5))' }}
            >
              {choiceEmojis[playerChoice]}
            </motion.div>
            <div className="text-text-secondary text-xs sm:text-sm">플레이어</div>
            <div
              className="font-medium text-sm sm:text-base"
              style={{ color: result === 'win' ? config.colorVar : 'var(--text-primary)' }}
            >
              {choiceLabels[playerChoice]}
            </div>
          </div>

          <motion.div
            initial={{opacity:0, scale:0.5}}
            animate={{opacity:1, scale:1, transition: {delay:0.6, duration:0.3}}}
            className="text-text-secondary/70 text-lg sm:text-xl font-bold"
          >
            VS
          </motion.div>

          {/* AI Choice */}
          <div className="text-center">
            <motion.div
              animate={{
                scale: result === 'lose' ? [1, 1.25, 1] : [1, 1.05, 1],
                rotate: result === 'lose' ? [0, -3, 3, 0] : 0
              }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl mb-1.5"
              style={{ filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.5))' }}
            >
              {choiceEmojis[aiChoice]}
            </motion.div>
            <div className="text-text-secondary text-xs sm:text-sm">AI</div>
            <div
              className="font-medium text-sm sm:text-base"
              style={{ color: result === 'lose' ? config.colorVar : 'var(--text-primary)' }}
            >
              {choiceLabels[aiChoice]}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.4 } }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1, boxShadow: `0 6px 20px rgba(${config.glowColorVar}, 0.4), inset 0 1px 0 rgba(255,255,255,0.25)` }}
            whileTap={{ scale: 0.97, y: 0 }}
            onClick={() => {
              onPlayAgain();
              // TODO: Play sound for button click (Play Again)
            }}
            className="w-full py-3 px-5 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-200 btn-animated"
            // Using btn-animated class if it provides desired base animation style
            style={{
              background: `linear-gradient(135deg, ${config.colorVar} 0%, color-mix(in srgb, ${config.colorVar} 70%, black) 100%)`,
              border: `1px solid color-mix(in srgb, ${config.colorVar} 80%, black)`,
              boxShadow: `0 4px 15px rgba(${config.glowColorVar}, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
              textShadow: '0 1px 2px rgba(0,0,0,0.4)'
            }}
          >
            🎮 다시 플레이
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.9, y: -1, borderColor: 'var(--border-hover)' }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={() => {
              onResetScore();
              // TODO: Play sound for button click (Reset Score)
            }}
            className="w-full py-2.5 px-5 rounded-lg sm:rounded-xl font-medium text-text-secondary transition-all duration-200 btn-animated"
            style={{
              background: 'var(--card)', // Use card background
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-btn-default)', // Use default button shadow
            }}
          >
            🔄 점수 초기화
          </motion.button>
        </motion.div>

        {/* Decorative pulse from example, adapted */}
        <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none -z-10"
            style={{
                background: `radial-gradient(circle at center, rgba(${config.glowColorVar}, 0.1) 0%, transparent 70%)`
            }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.1, 0.8] }}
            transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
            }}
        />
      </motion.div>
    </motion.div>
  );
};
