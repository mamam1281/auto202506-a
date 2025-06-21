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
    accentColor: '#8b8c89',
    lightColor: '#c4c5c2',
    shadowColor: 'rgba(139, 140, 137, 0.3)'
  },
  paper: {
    emoji: '📄',
    label: '보',
    accentColor: '#7b29cd',
    lightColor: '#a855f7',
    shadowColor: 'rgba(123, 41, 205, 0.4)'
  },
  scissors: {
    emoji: '✂️',
    label: '가위',
    accentColor: '#06b6d4',
    lightColor: '#38bdf8',
    shadowColor: 'rgba(6, 182, 212, 0.4)'
  }
};

const buttonVariants = {
  default: { 
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  hover: { 
    scale: 1.02,
    y: -2,
    rotateX: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: { 
    scale: 0.98,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 35
    }
  },
  selected: { 
    scale: 1.05,
    y: -4,
    rotateX: 8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  disabled: {
    scale: 0.95,
    opacity: 0.6,
    transition: {
      duration: 0.3
    }
  }
};

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  onChoice,
  selectedChoice,
  disabled
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {(Object.entries(choiceConfig) as [Choice, typeof choiceConfig[Choice]][]).map(
        ([choice, config]) => {
          const isSelected = selectedChoice === choice;
          const isDisabled = disabled && !isSelected;
          
          return (
            <motion.div
              key={choice}
              className={`relative ${isDisabled ? 'pointer-events-none' : 'cursor-pointer'}`}
              variants={buttonVariants}
              initial="default"
              whileHover={!isDisabled ? "hover" : "default"}
              whileTap={!isDisabled ? "tap" : "default"}
              animate={
                isDisabled ? "disabled" : 
                isSelected ? "selected" : 
                "default"
              }
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* 메인 버튼 - 블러 효과 최소화 */}
              <motion.button
                onClick={() => !isDisabled && onChoice(choice)}
                className={`
                  relative w-full h-20 sm:h-24 lg:h-28
                  flex flex-col items-center justify-center gap-1 sm:gap-2
                  rounded-xl sm:rounded-2xl
                  transition-all duration-500 ease-out
                  group overflow-hidden
                  ${isSelected ? 'ring-1 ring-white/30' : ''}
                `}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, 
                        rgba(26, 26, 26, 0.95) 0%, 
                        rgba(26, 26, 26, 0.9) 100%)`
                    : `linear-gradient(135deg, 
                        rgba(26, 26, 26, 0.85) 0%, 
                        rgba(26, 26, 26, 0.9) 100%)`,
                  border: isSelected 
                    ? `1px solid ${config.accentColor}` 
                    : '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: isSelected
                    ? `0 8px 32px ${config.shadowColor}, 
                       0 0 0 1px ${config.accentColor}20,
                       inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                    : `0 4px 16px rgba(0, 0, 0, 0.3),
                       inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                  backdropFilter: 'blur(1px)',
                  WebkitBackdropFilter: 'blur(1px)'
                }}
              >
                {/* 배경 그라데이션 오버레이 */}
                <div 
                  className={`
                    absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 
                    transition-opacity duration-500 group-hover:opacity-100
                  `}
                  style={{
                    background: `linear-gradient(135deg, 
                      ${config.accentColor}08 0%, 
                      transparent 50%, 
                      ${config.accentColor}05 100%)`
                  }}
                />

                {/* 상단 하이라이트 */}
                <div 
                  className="absolute top-0 left-0 right-0 h-px rounded-t-xl sm:rounded-t-2xl"
                  style={{
                    background: isSelected 
                      ? `linear-gradient(90deg, 
                          transparent 0%, 
                          ${config.lightColor} 50%, 
                          transparent 100%)`
                      : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                  }}
                />

                {/* 이모지 */}
                <motion.div 
                  className="text-2xl sm:text-3xl lg:text-4xl relative z-10"
                  animate={
                    isSelected ? {
                      scale: [1, 1.1, 1],
                    } : {}
                  }
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                  }}
                >
                  {config.emoji}
                </motion.div>

                {/* 라벨 */}
                <motion.span 
                  className="text-xs sm:text-sm lg:text-base font-semibold relative z-10"
                  style={{
                    color: isSelected ? config.lightColor : '#ffffff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {config.label}
                </motion.span>

                {/* 선택된 상태의 미묘한 펄스 효과 */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, 
                        ${config.accentColor}15 0%, 
                        transparent 70%)`
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>

              {/* 플레이 중일 때 로딩 효과 */}
              {disabled && isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                  style={{
                    border: `1px solid ${config.accentColor}`,
                    background: 'transparent'
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          );
        }
      )}
    </div>
  );
};