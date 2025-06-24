'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice } from './RPSGame'; // Assuming RPSGame.tsx is in the same directory

interface OpponentDisplayProps {
  choice: Choice | null;
  isThinking: boolean;
}

// Configuration for choices, consistent with ChoiceButtons if needed, but primarily for emoji/label here
const choiceConfig = {
  rock: { emoji: '🪨', label: '바위', colorVar: 'var(--color-neutral-medium)' },
  paper: { emoji: '📄', label: '보', colorVar: 'var(--neon-purple-1)' },
  scissors: { emoji: '✂️', label: '가위', colorVar: 'var(--color-info)' }
};

// Thinking state elements
const thinkingEmojis = ['🤔', '💭', '🎯', '💡', '⚙️']; // Added more variety
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
  // Cycle through thinking emojis and messages for more dynamism
  const [currentThinkingEmojiIndex, setCurrentThinkingEmojiIndex] = React.useState(0);
  const [currentThinkingMessageIndex, setCurrentThinkingMessageIndex] = React.useState(0);

  React.useEffect(() => {
    let emojiInterval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;
    if (isThinking) {
      emojiInterval = setInterval(() => {
        setCurrentThinkingEmojiIndex(prev => (prev + 1) % thinkingEmojis.length);
      }, 700); // Change emoji slightly faster
      messageInterval = setInterval(() => {
        setCurrentThinkingMessageIndex(prev => (prev + 1) % thinkingMessages.length);
      }, 2500); // Change message slower
    }
    return () => {
      clearInterval(emojiInterval);
      clearInterval(messageInterval);
    };
  }, [isThinking]);

  return (
    <div
      className="flex flex-col items-center justify-center h-32 sm:h-40 lg:h-48 text-center"
      aria-live="polite" // Announce changes in this region
      aria-atomic="true" // Ensure the entire region is announced
    >
      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 sm:gap-4"
          >
            <motion.div
              key={currentThinkingEmojiIndex} // Key change triggers re-animation for emoji
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={{ duration: 0.3, type: "spring", stiffness:300, damping:15 }}
              className="text-4xl sm:text-5xl lg:text-6xl" // Larger emoji
              style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)'}}
            >
              {thinkingEmojis[currentThinkingEmojiIndex]}
            </motion.div>
            {/* Pulsing dots are a bit generic, using dynamic message instead */}
            <motion.p
              key={currentThinkingMessageIndex} // Key change triggers re-animation for message
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay:0.1 }}
              className="text-sm sm:text-base text-text-secondary font-medium"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}
            >
              {thinkingMessages[currentThinkingMessageIndex]}
            </motion.p>
          </motion.div>
        ) : choice ? (
          <motion.div
            key="choice"
            initial={{ opacity: 0, scale: 0.3, rotateY: -180, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateY: 180, y: -30 }}
            transition={{ duration:0.6, type: "spring", stiffness: 200, damping: 15 }} // More dynamic spring
            className="flex flex-col items-center gap-2 sm:gap-3"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{
                scale: [0.5, 1.25, 1], // Bounce effect
                opacity: 1,
                rotate: 0,
              }}
              transition={{
                duration: 0.7,
                ease: "backInOut",
                times: [0, 0.7, 1]
              }}
              className="text-6xl sm:text-7xl lg:text-8xl" // Larger chosen emoji
              style={{
                color: choiceConfig[choice].colorVar,
                filter: `drop-shadow(0 0 15px ${choiceConfig[choice].colorVar}66) drop-shadow(0 5px 10px rgba(0,0,0,0.4))`
              }}
            >
              {choiceConfig[choice].emoji}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-text-primary text-base sm:text-lg font-semibold" // Bolder label
              style={{
                 color: choiceConfig[choice].colorVar,
                 textShadow: '0 1px 3px rgba(0,0,0,0.6)'
              }}
            >
              {choiceConfig[choice].label}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 text-text-secondary opacity-70" // More subtle waiting state
          >
            <div className="text-5xl sm:text-6xl lg:text-7xl">🤖</div>
            <p className="text-base sm:text-lg">AI 대기 중...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
