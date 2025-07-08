'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Choice } from './RPSGame';

interface ChoiceButtonProps {
  choice: Choice;
  onChoice: (choice: Choice) => void;
  selected: boolean;
  disabled: boolean;
}

const choiceConfig = {
  rock: { emoji: '🪨', label: '바위', color: 'var(--casino-blue)' },
  paper: { emoji: '📄', label: '보', color: 'var(--casino-green)' },
  scissors: { emoji: '✂️', label: '가위', color: 'var(--casino-red)' }
};

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ choice, onChoice, selected, disabled }) => {
  const config = choiceConfig[choice];

  const buttonVariants = {
    initial: { scale: 1, y: 0, opacity: 1 },
    hover: { 
      scale: 1.05, 
      y: -3,
      boxShadow: `0 10px 20px -5px ${config.color}40`,
      transition: { type: "spring" as const, stiffness: 400, damping: 15 }
    },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5, scale: 1, y: 0, boxShadow: 'none' },
    selected: {
      scale: 1.1,
      y: -5,
      boxShadow: `0 0 25px ${config.color}80`,
      borderColor: config.color,
      backgroundColor: `${config.color}30`,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  return (
    <motion.button
      onClick={() => onChoice(choice)}
      className="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 w-20 h-20 sm:w-24 sm:h-24"
      style={{
        background: 'var(--casino-gradient-choice)',
        borderColor: 'var(--casino-border)',
        color: 'var(--casino-text)'
      }}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? "" : "hover"}
      whileTap={disabled ? "" : "tap"}
      animate={disabled ? "disabled" : selected ? "selected" : "initial"}
      disabled={disabled}
    >
      <div className="text-3xl sm:text-4xl">{config.emoji}</div>
      <div className="text-xs sm:text-sm font-semibold mt-1">{config.label}</div>
    </motion.button>
  );
};

interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  disabled: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ onChoice, selectedChoice, disabled }) => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-4 p-2">
      {choices.map((choice) => (
        <ChoiceButton
          key={choice}
          choice={choice}
          onChoice={onChoice}
          selected={selectedChoice === choice}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default ChoiceButtons;
