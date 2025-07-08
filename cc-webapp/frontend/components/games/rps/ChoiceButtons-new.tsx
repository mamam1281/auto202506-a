'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Choice } from './types';

interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  disabled: boolean;
  isPopup?: boolean;
}

const choiceConfig = {
  rock: { emoji: '🪨', label: '바위' },
  paper: { emoji: '📄', label: '보' },
  scissors: { emoji: '✂️', label: '가위' }
};

const choices: Choice[] = ['rock', 'paper', 'scissors'];

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  onChoice,
  selectedChoice,
  disabled,
  isPopup = false
}) => {
  const containerClass = "choice-buttons-container";
  const buttonClass = isPopup ? "choice-button-popup" : "choice-button-normal";

  return (
    <div className={containerClass}>
      {choices.map((choice, index) => {
        const config = choiceConfig[choice];
        const isSelected = selectedChoice === choice;
        
        return (
          <motion.button
            key={choice}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={disabled ? {} : { 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={`${buttonClass} ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onChoice(choice)}
            disabled={disabled}
          >
            <div className="icon">{config.emoji}</div>
            <div className="text">{config.label}</div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChoiceButtons;
