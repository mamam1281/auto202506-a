import React from 'react';
import { motion } from 'framer-motion';
import type { Choice, GameResult } from './RPSGame';

interface ResultScreenProps {
  result: GameResult;
  playerChoice: Choice;
  aiChoice: Choice;
  onPlayAgain: () => void;
  onResetScore: () => void;
}

const choiceEmojis: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

const choiceLabels: Record<Choice, string> = {
  rock: '바위',
  paper: '보',
  scissors: '가위'
};

const resultConfig = {
  win: {
    title: '🎉 승리!',
    message: '축하합니다! 당신이 이겼습니다!',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  lose: {
    title: '😔 패배',
    message: '아쉽습니다. 다시 도전해보세요!',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  draw: {
    title: '🤝 무승부',
    message: '비겼습니다! 한 번 더 시도해보세요!',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  }
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  playerChoice,
  aiChoice,
  onPlayAgain,
  onResetScore
}) => {
  if (!result) return null;

  const config = resultConfig[result];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.6 
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative max-w-md w-full mx-auto rounded-3xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, 
            rgba(26, 26, 26, 0.98) 0%, 
            rgba(26, 26, 26, 0.95) 100%), 
            ${config.bgGradient}`,
          border: `1px solid ${config.borderColor}`,
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px ${config.borderColor},
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(1px)'
        }}
      >
        {/* 결과 제목 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{
              color: config.color,
              textShadow: `0 0 20px ${config.color}40, 0 2px 4px rgba(0,0,0,0.8)`
            }}
          >
            {config.title}
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            {config.message}
          </p>
        </motion.div>

        {/* 선택 비교 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-6 sm:gap-8 mb-8"
        >
          {/* 플레이어 선택 */}
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: result === 'win' ? [1, 1.2, 1] : [1, 1.1, 1],
                rotate: result === 'win' ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl mb-2"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
              }}
            >
              {choiceEmojis[playerChoice]}
            </motion.div>
            <div className="text-white/60 text-xs sm:text-sm">플레이어</div>
            <div 
              className="font-medium text-sm sm:text-base"
              style={{ color: result === 'win' ? config.color : '#ffffff' }}
            >
              {choiceLabels[playerChoice]}
            </div>
          </div>

          {/* VS */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 0.5 
            }}
            className="text-white/40 text-lg sm:text-xl font-bold"
          >
            VS
          </motion.div>

          {/* AI 선택 */}
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: result === 'lose' ? [1, 1.2, 1] : [1, 1.1, 1],
                rotate: result === 'lose' ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl mb-2"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
              }}
            >
              {choiceEmojis[aiChoice]}
            </motion.div>
            <div className="text-white/60 text-xs sm:text-sm">AI</div>
            <div 
              className="font-medium text-sm sm:text-base"
              style={{ color: result === 'lose' ? config.color : '#ffffff' }}
            >
              {choiceLabels[aiChoice]}
            </div>
          </div>
        </motion.div>

        {/* 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          {/* 다시 플레이 버튼 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlayAgain}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
              boxShadow: `0 4px 16px ${config.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
              textShadow: '0 1px 2px rgba(0,0,0,0.6)'
            }}
          >
            🎮 다시 플레이
          </motion.button>

          {/* 점수 초기화 버튼 */}
          <motion.button
            whileHover={{ scale: 1.01, opacity: 0.8 }}
            whileTap={{ scale: 0.99 }}
            onClick={onResetScore}
            className="w-full py-2.5 px-6 rounded-xl font-medium text-white/70 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              textShadow: '0 1px 2px rgba(0,0,0,0.6)'
            }}
          >
            🔄 점수 초기화
          </motion.button>
        </motion.div>

        {/* 장식적 요소 */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, 
              ${config.color}15 0%, 
              transparent 70%)`
          }}
        />
      </motion.div>
    </motion.div>
  );
};