'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice } from './types';

interface OpponentDisplayProps {
  choice: Choice | null;
  isThinking: boolean;
}

const choiceConfig = {
  rock: { emoji: '🪨', label: '바위', color: 'var(--casino-border)' },
  paper: { emoji: '📄', label: '보', color: 'var(--casino-primary)' },
  scissors: { emoji: '✂️', label: '가위', color: 'var(--casino-secondary)' }
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
    <div className="ai-area">
      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div
            key="thinking"
            className="flex flex-col items-center justify-center space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="text-7xl"
              variants={thinkingVariants}
              animate="thinking"
            >
              {thinkingEmojis[currentThinkingEmojiIndex]}
            </motion.div>
            <motion.div
              className="text-center px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 max-w-[280px]"
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
            className="flex flex-col items-center justify-center space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={`opponent-choice-icon rounded-2xl border-2 bg-white/5 backdrop-blur-sm choice-${choice}`}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
            >
              {choiceConfig[choice].emoji}
            </motion.div>
            <motion.p
              className="text-base text-slate-200 font-medium mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {choiceConfig[choice].label}
            </motion.p>
            <motion.p
              className="text-xs text-slate-400 bg-black/20 px-3 py-1 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI의 선택
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            className="flex flex-col items-center justify-center space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-7xl p-3 rounded-2xl border-2 border-dashed border-white/20 bg-white/5">❔</div>
            <p className="text-sm text-slate-400 bg-black/20 px-3 py-1 rounded-full">AI가 선택을 준비 중입니다</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpponentDisplay;
