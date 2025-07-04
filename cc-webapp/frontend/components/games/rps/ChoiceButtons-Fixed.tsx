'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type Choice = 'rock' | 'paper' | 'scissors';

interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  disabled: boolean;
}

const choiceConfig = {
  rock: {
    emoji: '🪨',
    label: '바위',
    color: '#6b7280',
    lightColor: '#9ca3af',
    shadowColor: 'rgba(107, 114, 128, 0.4)',
  },
  paper: {
    emoji: '📄',
    label: '보',
    color: '#8b5cf6',
    lightColor: '#a78bfa',
    shadowColor: 'rgba(139, 92, 246, 0.4)',
  },
  scissors: {
    emoji: '✂️',
    label: '가위',
    color: '#3b82f6',
    lightColor: '#60a5fa',
    shadowColor: 'rgba(59, 130, 246, 0.4)',
  }
};

const buttonVariants = {
  default: {
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 }
  },
  hover: {
    scale: 1.05,
    y: -4,
    transition: { type: "spring" as const, stiffness: 500, damping: 20 }
  },
  tap: {
    scale: 0.95,
    y: 0,
    transition: { type: "spring" as const, stiffness: 600, damping: 30 }
  },
  selected: {
    scale: 1.1,
    y: -6,
    transition: { type: "spring" as const, stiffness: 600, damping: 25 }
  }
};

const emojiVariants = {
  default: { rotate: 0 },
  hover: { rotate: [0, -10, 10, -5, 5, 0] },
  tap: { rotate: 0 },
  selected: { rotate: [0, 360] }
};

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  onChoice,
  selectedChoice,
  disabled
}) => {
  const handleClick = (choice: Choice) => {
    if (!disabled) {
      onChoice(choice);
    }
  };

  return (
    <div className="flex justify-center gap-2 w-full max-w-xs mx-auto px-1">
      {Object.entries(choiceConfig).map(([key, config]) => {
        const choice = key as Choice;
        const isSelected = selectedChoice === choice;
        const isDisabled = disabled && !isSelected;

        return (
          <motion.button
            key={choice}
            className={`
              relative flex flex-col items-center justify-center
              w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40
              rounded-2xl
              border-3 transition-all duration-200
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isSelected ? 'ring-4 ring-offset-4 ring-offset-blue-500' : ''}
            `}
            variants={buttonVariants}
            initial="default"
            whileHover={!isDisabled ? "hover" : "default"}
            whileTap={!isDisabled ? "tap" : "default"}
            animate={isSelected ? "selected" : "default"}
            onClick={() => handleClick(choice)}
            disabled={isDisabled}
            style={{
              backgroundColor: isSelected 
                ? config.lightColor 
                : 'rgba(255, 255, 255, 0.05)',
              borderColor: isSelected 
                ? config.color 
                : 'rgba(255, 255, 255, 0.1)',
              color: isSelected ? 'white' : '#f1f5f9',
              boxShadow: isSelected 
                ? `0 0 20px ${config.shadowColor}, 0 8px 25px rgba(0, 0, 0, 0.2)`
                : '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <motion.div
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1"
              variants={emojiVariants}
              initial="default"
              whileHover={!isDisabled ? "hover" : "default"}
              whileTap={!isDisabled ? "tap" : "default"}
              animate={isSelected ? "selected" : "default"}
            >
              {config.emoji}
            </motion.div>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">
              {config.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChoiceButtons;
