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
    color: '#10b981', // 초록색으로 변경
    lightColor: '#34d399',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
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
    <div className="choice-buttons">
      {Object.entries(choiceConfig).map(([key, config]) => {
        const choice = key as Choice;
        const isSelected = selectedChoice === choice;
        const isDisabled = disabled && !isSelected;

        return (
          <motion.button
            key={choice}
            className={`
              choice-button
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
                : 'rgba(255, 255, 255, 0.2)',
              borderColor: isSelected 
                ? config.color 
                : 'rgba(255, 255, 255, 0.3)',
              color: isSelected ? 'white' : '#ffffff',
              boxShadow: isSelected 
                ? `0 0 20px ${config.shadowColor}, 0 8px 25px rgba(0, 0, 0, 0.2)`
                : '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                className="text-5xl mb-1"
                variants={emojiVariants}
                initial="default"
                whileHover={!isDisabled ? "hover" : "default"}
                whileTap={!isDisabled ? "tap" : "default"}
                animate={isSelected ? "selected" : "default"}
              >
                {config.emoji}
              </motion.div>
              <span className="text-base font-bold">
                {config.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChoiceButtons;
