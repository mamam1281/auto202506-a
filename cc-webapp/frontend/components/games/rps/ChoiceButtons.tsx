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

  const buttonVariants = {
    initial: (index: number) => ({
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: { 
        delay: index * 0.1,
      }
    }),
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      // 프레이머모션 타입 호환성 문제 수정
      transition: { 
        duration: 0.5,
        // 문자열 타입 대신 명시적인 enum 값 사용
        type: "spring" as const, 
        stiffness: 300, 
        damping: 25
      }
    },
    hover: {
      scale: 1.08,
      y: -5,
      transition: { 
        duration: 0.2,
        type: "spring" as const,
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.95,
      transition: { 
        duration: 0.1,
        type: "tween" as const 
      }
    },
    selected: {
      scale: [1, 1.15, 1.1],
      boxShadow: ["0px 0px 0px rgba(255,199,0,0)", "0px 0px 30px rgba(255,199,0,0.8)", "0px 0px 20px rgba(255,199,0,0.6)"],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className={containerClass}>
      {choices.map((choice, index) => {
        const config = choiceConfig[choice];
        const isSelected = selectedChoice === choice;
        
        return (
          <motion.button
            key={choice}
            custom={index}
            variants={buttonVariants}
            initial="initial"
            animate={isSelected ? "selected" : "animate"}
            whileHover={disabled ? {} : "hover"}
            whileTap={disabled ? {} : "tap"}
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
