'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice } from './RPSGame';

interface OpponentDisplayProps {
  choice: Choice | null;
  isThinking: boolean;
}

const choiceConfig = {
  rock: { emoji: '🪨', label: '바위', color: '#6b7280' },
  paper: { emoji: '📄', label: '보', color: '#8b5cf6' },
  scissors: { emoji: '✂️', label: '가위', color: '#3b82f6' }
};

const thinkingEmojis = ['🤔', '💭', '🎯', '💡', '⚙️'];
const thinkingMessages = [
  "AI가 다음 수를 생각 중입니다...",
  "전략을 분석하고 있습니다...",
  "최적의 선택을 고르는 중...",
  "심사숙고하고 있습니다...",
  "패턴을 파악하는 중..."
];

export const OpponentDisplay: React.FC<OpponentDisplayProps> = ({
  choice,
  isThinking
}) => {
  const [currentThinkingEmojiIndex, setCurrentThinkingEmojiIndex] = React.useState(0);
  const [currentThinkingMessageIndex, setCurrentThinkingMessageIndex] = React.useState(0);

  React.useEffect(() => {
    let emojiInterval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;
    
    if (isThinking) {
      emojiInterval = setInterval(() => {
        setCurrentThinkingEmojiIndex(prev => (prev + 1) % thinkingEmojis.length);
      }, 700);
      messageInterval = setInterval(() => {
        setCurrentThinkingMessageIndex(prev => (prev + 1) % thinkingMessages.length);
      }, 2500);
    }
    
    return () => {
      clearInterval(emojiInterval);
      clearInterval(messageInterval);
    };
  }, [isThinking]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const
      }
    }
  };

  const thinkingVariants = {
    thinking: {
      rotate: [0, -10, 10, -5, 5, 0],
      scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const revealVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80px] w-full">
      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div
            key="thinking"
            className="flex flex-col items-center justify-center space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="text-5xl sm:text-6xl"
              variants={thinkingVariants}
              animate="thinking"
            >
              {thinkingEmojis[currentThinkingEmojiIndex]}
            </motion.div>
            <motion.div
              className="text-center px-2 py-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              key={currentThinkingMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-slate-300 font-medium">
                {thinkingMessages[currentThinkingMessageIndex]}
              </p>
            </motion.div>
          </motion.div>
        ) : choice ? (
          <motion.div
            key="choice"
            className="flex flex-col items-center justify-center space-y-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="text-6xl sm:text-7xl p-2 rounded-xl border-2 bg-white/5 backdrop-blur-sm"
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              style={{
                borderColor: choiceConfig[choice].color,
                boxShadow: `0 0 20px ${choiceConfig[choice].color}40`,
              }}
            >
              {choiceConfig[choice].emoji}
            </motion.div>
            <motion.p
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {choiceConfig[choice].label}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            className="flex flex-col items-center justify-center space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-4xl sm:text-5xl">
              🤖
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpponentDisplay;
