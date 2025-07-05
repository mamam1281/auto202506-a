'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Choice } from './RPSGame';

interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  disabled: boolean;
  selectedChoice?: Choice | null;
}

const choiceEmojis = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

const choiceLabels = {
  rock: '바위',
  paper: '보자기',
  scissors: '가위'
};

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ onChoice, disabled, selectedChoice }) => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  return (
    <div className="choice-buttons">
      {choices.map((choice, index) => (
        <motion.button
          key={choice}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          className={`choice-button ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onChoice(choice)}
          disabled={disabled}
        >
          <div className="choice-emoji">{choiceEmojis[choice]}</div>
          <div className="choice-label">{choiceLabels[choice]}</div>
        </motion.button>
      ))}
    </div>
  );
};
