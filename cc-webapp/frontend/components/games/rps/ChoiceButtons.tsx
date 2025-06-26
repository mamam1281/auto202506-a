'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Choice } from './RPSGame'; // Assuming RPSGame.tsx is in the same directory

interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  disabled: boolean;
}

// Configuration for each choice button, using CSS variables for colors
const choiceConfig = {
  rock: {
    emoji: '🪨',
    label: '바위',
    accentColorVar: 'var(--color-neutral-medium)', // Using neutral medium from globals.css
    lightColorVar: 'var(--color-neutral-light)', // Using neutral light from globals.css  
    shadowColorVar: 'rgba(160, 160, 160, 0.3)', // Using neutral medium with transparency
  },
  paper: {
    emoji: '📄',
    label: '보',
    accentColorVar: 'var(--color-purple-primary)', // Using purple primary from globals.css
    lightColorVar: 'var(--color-purple-tertiary)', // Using purple tertiary from globals.css
    shadowColorVar: 'rgba(91, 48, 246, 0.4)', // Using purple primary with transparency
  },
  scissors: {
    emoji: '✂️',
    label: '가위',
    accentColorVar: 'var(--color-info)', // Using info blue from globals.css
    lightColorVar: 'var(--color-accent-amber)', // Using accent amber as lighter alternative
    shadowColorVar: 'rgba(19, 91, 121, 0.4)', // Using info color with transparency
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
    scale: 1.03, // Slightly reduced from example for subtlety
    y: -3,       // Slightly reduced
    rotateX: 4,  // Slightly reduced
    boxShadow: "0 10px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
    transition: { type: "spring" as const, stiffness: 400, damping: 20 }
  },
  tap: {
    scale: 0.97, // Slightly reduced
    y: 0,
    rotateX: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(0,0,0,0.1)",
    transition: { type: "spring" as const, stiffness: 500, damping: 30 } // Adjusted stiffness/damping
  },
  selected: {
    scale: 1.05,
    y: -5,       // Slightly more pronounced when selected
    rotateX: 6,
    transition: { type: "spring" as const, stiffness: 250, damping: 20 } // Softer spring for selected state
  },
  disabled: {
    scale: 0.95,
    opacity: 0.5, // More visible than example's 0.6 for clarity
    transition: { duration: 0.25 }
  }
};

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  onChoice,
  selectedChoice,
  disabled
}) => {
  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full max-w-3xl"> {/* 단순하고 확실한 중앙정렬 */}
      {(Object.entries(choiceConfig) as [Choice, typeof choiceConfig[Choice]][]).map(
        ([choice, config]) => {
          const isSelected = selectedChoice === choice;
          // Button is truly disabled if (game is playing AND this button is not the selected one) OR (game is not playing but parent explicitly disabled)
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
                isOverallDisabled && !isSelected ? "disabled" : // Dim if disabled and not selected
                isSelected ? "selected" :
                "default"
              }
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px' // Increased perspective
              }}
            >
              <motion.button
                onClick={() => {
                  if (!isOverallDisabled) {
                    onChoice(choice);
                    // TODO: Play sound for choice button tap (e.g., a distinct sound for rock, paper, scissors or a generic UI tap)
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`${config.label} 선택 버튼`}
                className={`
                  relative w-full h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44 /* 모바일에서 더 적절한 높이 */
                  flex flex-col items-center justify-center gap-2 sm:gap-3
                  rounded-xl sm:rounded-2xl /* Standardized border radius */
                  transition-all duration-300 ease-out /* Faster transition */
                  group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  modern-mesh-card /* Applying the mesh card style for base */
                `}
                style={{
                  // Base style from modern-mesh-card, glassmorphism-dark will be applied conditionally
                  // Specific border and shadow for interaction states
                  border: isSelected
                    ? `1.5px solid ${config.accentColorVar}` // Thicker border when selected
                    : `1px solid var(--border)`,
                  boxShadow: isSelected
                    ? `0 6px 24px ${config.shadowColorVar},
                       0 0 0 1.5px ${config.accentColorVar}33, /* Softer glow */
                       inset 0 1px 1px rgba(255, 255, 255, 0.12)`
                    : `var(--shadow-card-default)`, // Use default card shadow
                  // Apply glassmorphism only when selected or hovered for performance
                }}
                // Apply glassmorphism class dynamically for hover too
                // onMouseEnter / onMouseLeave to add/remove a class, or use group-hover with Tailwind
              >
                {/* Conditional Glassmorphism Overlay - more performant */}
                <div
                  className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-300
                    ${isSelected ? 'glassmorphism-dark opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:glassmorphism-dark'}`}
                  style={{
                     // @ts-ignore
                    '--card-rgb': isSelected ? 'var(--accent-rgb)' : 'var(--card-rgb)', // Modify for selected state
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
                      ${config.accentColorVar}1A 0%, /* 10% opacity */
                      transparent 60%,
                      ${config.accentColorVar}0D 100%)`, /* 5% opacity */
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
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl relative z-[5]" // 모바일에서 더 적절한 이모지 크기
                  animate={ isSelected ? { scale: [1, 1.15, 1] } : {} }
                  transition={{ duration: 0.7, ease: "backInOut" }} // Smoother pop
                  style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.35))' }}
                >
                  {config.emoji}
                </motion.div>

                {/* Label */}
                <motion.span
                  className="text-xs sm:text-base md:text-lg lg:text-xl font-semibold relative z-[5]" // 모바일에서 더 적절한 라벨 크기
                  style={{
                    color: isSelected ? config.lightColorVar : 'var(--text-primary)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
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
                        ${config.accentColorVar}26 0%, /* 15% opacity */
                        transparent 65%)` // Larger transparent area
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }} // More noticeable pulse
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.button>

              {/* Loading/Pulsing effect when AI is thinking and this button was selected */}
              {disabled && isSelected && !isOverallDisabled && ( // Show only if it's the selected one during AI thinking
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none border-2"
                  style={{ borderColor: config.accentColorVar, zIndex: 4 }}
                  animate={{
                    scale: [1, 1.03, 1],    // Subtle scale pulse
                    opacity: [0.5, 1, 0.5] // Opacity pulse
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
