'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Choice } from './RPSGame';

interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  disabled: boolean;
}

const choiceConfig = {
  rock: {
    emoji: '🪨',
    label: '바위',
    accentColorVar: 'var(--color-neutral-medium)',
    lightColorVar: 'var(--color-neutral-light)',
    shadowColorVar: 'rgba(160, 160, 160, 0.3)',
  },
  paper: {
    emoji: '📄',
    label: '보',
    accentColorVar: 'var(--color-purple-primary)',
    lightColorVar: 'var(--color-purple-tertiary)',
    shadowColorVar: 'rgba(91, 48, 246, 0.4)',
  },
  scissors: {
    emoji: '✂️',
    label: '가위',
    accentColorVar: 'var(--color-info)',
    lightColorVar: 'var(--color-accent-amber)',
    shadowColorVar: 'rgba(19, 91, 121, 0.4)',
  }
};

const buttonVariants = {
  default: {
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 }
  },
  hover: {
    scale: 1.03,
    y: -3,
    rotateX: 4,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
    transition: { type: "spring" as const, stiffness: 400, damping: 20 }
  },
  tap: {
    scale: 0.97,
    y: 0,
    rotateX: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(0,0,0,0.1)",
    transition: { type: "spring" as const, stiffness: 500, damping: 30 }
  },
  selected: {
    scale: 1.05,
    y: -5,
    rotateX: 6,
    transition: { type: "spring" as const, stiffness: 250, damping: 20 }
  },
  disabled: {
    scale: 0.95,
    opacity: 0.5,
    transition: { duration: 0.25 }
  }
};

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  onChoice,
  selectedChoice,
  disabled
}) => {
  return (
    <div className="w-full flex justify-center" style={{ maxWidth: '400px', gap: 'var(--rps-gap)' }}>
      <div
        className="grid grid-cols-3"
        style={{
          gap: 'var(--rps-gap)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
      {(Object.entries(choiceConfig) as [Choice, typeof choiceConfig[Choice]][]).map(
        ([choice, config]) => {
          const isSelected = selectedChoice === choice;
          const isDisabledByPlay = disabled && !isSelected;
          const isOverallDisabled = isDisabledByPlay || (disabled && selectedChoice === null);

          return (
            <motion.div
              key={choice}
              className={`relative ${isOverallDisabled ? 'pointer-events-none' : 'cursor-pointer'}`}
              variants={buttonVariants}
              initial="default"
              whileHover={!isOverallDisabled ? "hover" : "default"}
              whileTap={!isOverallDisabled ? "tap" : "default"}
              animate={
                isOverallDisabled && !isSelected ? "disabled" :
                isSelected ? "selected" :
                "default"
              }
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px'
              }}
            >
              <motion.button
                onClick={() => {
                  if (!isOverallDisabled) {
                    onChoice(choice);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`${config.label} 선택 버튼`}
                className={`
                  relative w-full h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44
                  flex flex-col items-center justify-center gap-2 sm:gap-3
                  rounded-xl sm:rounded-2xl
                  transition-all duration-300 ease-out
                  group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  modern-mesh-card
                `}
                style={{
                  border: isSelected
                    ? `1.5px solid ${config.accentColorVar}`
                    : `1px solid var(--border)`,
                  boxShadow: isSelected
                    ? `0 6px 24px ${config.shadowColorVar},
                       0 0 0 1.5px ${config.accentColorVar}33,
                       inset 0 1px 1px rgba(255, 255, 255, 0.12)`
                    : `var(--shadow-card-default)`,
                }}
              >
                {/* Conditional Glassmorphism Overlay */}
                <div
                  className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-300
                    ${isSelected ? 'glassmorphism-dark opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:glassmorphism-dark'}`}
                  style={{
                    zIndex: 0,
                  }}
                />

                {/* Background Gradient Overlay (subtle) */}
                <div
                  className={`
                    absolute inset-0 rounded-xl sm:rounded-2xl opacity-0
                    transition-opacity duration-400 group-hover:opacity-100
                  `}
                  style={{
                    background: `linear-gradient(135deg,
                      ${config.accentColorVar}1A 0%,
                      transparent 60%,
                      ${config.accentColorVar}0D 100%)`,
                    zIndex: 1,
                  }}
                />

                {/* Top Highlight Border */}
                <div
                  className="absolute top-0 left-0 right-0 h-px rounded-t-xl sm:rounded-t-2xl"
                  style={{
                    background: isSelected
                      ? `linear-gradient(90deg, transparent 20%, ${config.lightColorVar} 50%, transparent 80%)`
                      : 'linear-gradient(90deg, transparent 20%, var(--border-hover) 50%, transparent 80%)',
                    opacity: isSelected ? 0.8 : 0.5,
                    zIndex: 2,
                  }}
                />

                {/* Emoji */}
                <motion.div
                  className="text-7xl md:text-8xl lg:text-9xl relative z-[5] flex items-center justify-center"
                  animate={ isSelected ? { scale: [1, 1.15, 1] } : {} }
                  transition={{ duration: 0.7, ease: "backInOut" }}
                  style={{
                    filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.35))',
                    width: '100%',
                    minHeight: '90px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                  }}
                >
                  {config.emoji}
                </motion.div>

                {/* Label */}
                <motion.span
                  className="rps-choice-label"
                  style={{
                    color: isSelected ? config.lightColorVar : 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 2px #38bdf8',
                    transition: 'color 0.25s ease'
                  }}
                >
                  {config.label}
                </motion.span>

                {/* Selected State Subtle Pulse/Glow Effect (Neon) */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none z-[3]"
                    style={{
                      background: `radial-gradient(circle at center,
                        ${config.accentColorVar}26 0%,
                        transparent 65%)`
                    }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.button>

              {/* Loading/Pulsing effect when AI is thinking and this button was selected */}
              {disabled && isSelected && !isOverallDisabled && (
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none border-2"
                  style={{ borderColor: config.accentColorVar, zIndex: 4 }}
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          );
        }
      )}
      </div>
    </div>
  );
};
