import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Choice } from './RPSGame';

interface OpponentDisplayProps {
  choice: Choice | null;
  isThinking: boolean;
}

const choiceConfig = {
  rock: { emoji: '🪨', label: '바위' },
  paper: { emoji: '📄', label: '보' },
  scissors: { emoji: '✂️', label: '가위' }
};

const thinkingDots = ['🤔', '💭', '🎯'];

export const OpponentDisplay: React.FC<OpponentDisplayProps> = ({
  choice,
  isThinking
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-32 sm:h-40">
      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl sm:text-6xl"
            >
              🤖
            </motion.div>
            <div className="flex gap-1">
              {thinkingDots.map((dot, index) => (
                <motion.span
                  key={index}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="text-xl"
                >
                  {dot}
                </motion.span>
              ))}
            </div>
            <p className="text-white/60 text-sm">AI가 선택하고 있습니다...</p>
          </motion.div>
        ) : choice ? (
          <motion.div
            key="choice"
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              className="text-6xl sm:text-8xl"
            >
              {choiceConfig[choice].emoji}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-lg font-medium"
            >
              {choiceConfig[choice].label}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 text-white/40"
          >
            <div className="text-6xl sm:text-8xl">🤖</div>
            <p className="text-lg">대기 중...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};