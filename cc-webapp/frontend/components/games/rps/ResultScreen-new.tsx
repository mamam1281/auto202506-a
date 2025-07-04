'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw' | null;

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

const resultConfig = {
  win: {
    title: '🎉 승리!',
    message: '축하합니다! 당신이 이겼습니다!',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.1) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  lose: {
    title: '😔 패배',
    message: '아쉽습니다. 다시 도전해보세요!',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.1) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  draw: {
    title: '🤝 무승부',
    message: '비겼습니다! 한 번 더 시도해보세요!',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.1) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  }
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  playerChoice,
  aiChoice,
  onPlayAgain,
  onResetScore
}) => {
  if (!result) return null;

  const config = resultConfig[result];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: 15,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const
      }
    }
  };

  const choiceVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: custom * 0.1,
        type: "spring" as const,
        stiffness: 400,
        damping: 20
      }
    })
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    },
    tap: {
      scale: 0.95,
      transition: { type: "spring" as const, stiffness: 600, damping: 30 }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="bg-slate-800/95 backdrop-blur-md rounded-2xl border shadow-2xl max-w-md w-full mx-4"
        style={{
          background: config.gradient,
          borderColor: config.borderColor,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px ${config.color}20`
        }}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="text-center p-6 pb-4">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{ color: config.color }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {config.title}
          </motion.h2>
          <motion.p
            className="text-slate-300 text-lg sm:text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {config.message}
          </motion.p>
        </div>

        {/* Choices Display */}
        <div className="flex items-center justify-center gap-6 px-6 py-4">
          <motion.div 
            className="text-center"
            variants={choiceVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="text-4xl sm:text-5xl mb-2 p-3 rounded-xl bg-white/10 border border-white/20">
              {choiceEmojis[playerChoice]}
            </div>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              당신: {choiceLabels[playerChoice]}
            </p>
          </motion.div>

          <motion.div
            className="text-3xl sm:text-4xl font-bold px-3"
            style={{ color: config.color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3, type: "spring" as const }}
          >
            VS
          </motion.div>

          <motion.div 
            className="text-center"
            variants={choiceVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <div className="text-4xl sm:text-5xl mb-2 p-3 rounded-xl bg-white/10 border border-white/20">
              {choiceEmojis[aiChoice]}
            </div>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              AI: {choiceLabels[aiChoice]}
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 pt-2">
          <motion.button
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200"
            style={{
              backgroundColor: config.color,
              boxShadow: `0 4px 15px ${config.color}40`
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onPlayAgain}
          >
            <span className="block text-center leading-tight">
              다시<br />플레이
            </span>
          </motion.button>
          <motion.button
            className="py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-700/80 hover:bg-slate-600/80 border border-slate-600 transition-all duration-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onResetScore}
          >
            리셋
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultScreen;
