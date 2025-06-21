'use client';

import { motion } from 'framer-motion';
import { MissionCardProps } from '../types/card';
import { Clock, Target, Trophy, ChevronRight } from 'lucide-react';

const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.15)'
  },
  hover: { 
    scale: 1.01, 
    y: -3,
    boxShadow: '0 8px 20px rgba(123, 41, 205, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.25), 0 0 8px rgba(123, 41, 205, 0.15)'
  },
  active: { 
    scale: 0.99, 
    y: 0,
    boxShadow: '0 4px 15px rgba(135, 13, 209, 0.25), 0 0 0 2px rgba(135, 13, 209, 0.3)'
  }
};

const progressVariants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.3
    }
  })
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#8054f2'; // Completed purple
  if (progress >= 50) return '#870dd1'; // Progress purple
  return '#7b29cd'; // Start purple
};

const getProgressNeon = (progress: number) => {
  if (progress >= 80) return 'rgba(128, 84, 242, 0.3)';
  if (progress >= 50) return 'rgba(135, 13, 209, 0.3)';
  return 'rgba(123, 41, 205, 0.3)';
};

export function CardMission({ 
  title, 
  description, 
  image, 
  progress, 
  reward, 
  deadline, 
  state = 'default', 
  content = true, 
  onStart, 
  className = '' 
}: MissionCardProps) {
  const progressColor = getProgressColor(progress);
  const progressNeon = getProgressNeon(progress);
  const isCompleted = progress >= 100;

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer group
        bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]
        border border-[#333333]
        min-h-[280px] h-full
        flex flex-col
        transition-all duration-300
        ${className}
      `}
      variants={cardVariants}
      initial="default"
      animate={state}
      whileHover="hover"
      whileTap="active"
    >
      {/* Neon background based on progress */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${progressColor}30, transparent 70%)`
        }}
        animate={{
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Completion glow for finished missions - 블러 제거 */}
      {isCompleted && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-[#8054f2]/20 via-[#5b30f6]/20 to-[#8054f2]/20 rounded-2xl"
          style={{
            boxShadow: '0 0 20px rgba(128, 84, 242, 0.4), inset 0 0 20px rgba(128, 84, 242, 0.2)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.01, 1],
            boxShadow: [
              '0 0 15px rgba(128, 84, 242, 0.3), inset 0 0 15px rgba(128, 84, 242, 0.1)',
              '0 0 25px rgba(128, 84, 242, 0.5), inset 0 0 25px rgba(128, 84, 242, 0.3)',
              '0 0 15px rgba(128, 84, 242, 0.3), inset 0 0 15px rgba(128, 84, 242, 0.1)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Corner indicators */}
      <div className="absolute top-2 left-2 w-6 h-6">
        <motion.div 
          className="absolute inset-0 border-l-2 border-t-2 rounded-tl-lg"
          style={{ borderColor: progressColor }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              `0 0 3px ${progressNeon}`,
              `0 0 8px ${progressNeon}`,
              `0 0 3px ${progressNeon}`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="relative p-6 z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="p-2 rounded-lg border"
              style={{ 
                backgroundColor: `${progressColor}15`,
                borderColor: `${progressColor}30`
              }}
              animate={{
                boxShadow: [
                  `0 0 3px ${progressNeon}`,
                  `0 0 8px ${progressNeon}`,
                  `0 0 3px ${progressNeon}`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Target size={18} style={{ color: progressColor }} />
            </motion.div>
            <span className="text-xs uppercase tracking-wider text-[#D1D5DB] font-semibold">
              Mission
            </span>
          </motion.div>
          
          {deadline && (
            <motion.div
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#333333]/80 border text-xs text-[#D1D5DB]"
              style={{ borderColor: `${progressColor}30` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Clock size={12} />
              {deadline}
            </motion.div>
          )}
        </div>
        
        {image && (
          <motion.div 
            className="mb-4 rounded-xl overflow-hidden relative border"
            style={{ borderColor: `${progressColor}20` }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-transparent to-[#7b29cd]/10" />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-white font-semibold text-lg flex-1">
              {title}
            </h3>
            {isCompleted && (
              <motion.div
                className="ml-2 p-2 rounded-full border"
                style={{ 
                  backgroundColor: `${progressColor}15`,
                  borderColor: `${progressColor}30`
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  boxShadow: [`0 0 8px ${progressNeon}`]
                }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Trophy size={16} style={{ color: progressColor }} />
              </motion.div>
            )}
          </div>
          
          {content && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {description && (
                <p className="text-[#D1D5DB] text-sm leading-relaxed mb-4 flex-1">
                  {description}
                </p>
              )}
              
              {/* Neon Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-[#D1D5DB]">
                    Progress
                  </span>
                  <span className="text-xs font-semibold" style={{ color: progressColor }}>
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-[#333333] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{ 
                      background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`,
                      boxShadow: `0 0 5px ${progressNeon}`
                    }}
                    variants={progressVariants}
                    initial="initial"
                    animate="animate"
                    custom={progress}
                  >
                    {/* Animated neon pulse */}
                    <motion.div
                      className="absolute inset-y-0 right-0 w-1 bg-white/40 rounded-full"
                      animate={{
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    />
                  </motion.div>
                </div>
              </div>
              
              {/* Reward Info */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="p-1.5 rounded border"
                    style={{ 
                      backgroundColor: `${progressColor}15`,
                      borderColor: `${progressColor}30`
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 3px ${progressNeon}`,
                        `0 0 8px ${progressNeon}`,
                        `0 0 3px ${progressNeon}`
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Trophy size={14} style={{ color: progressColor }} />
                  </motion.div>
                  <span className="text-sm font-medium text-white">
                    {reward}
                  </span>
                </div>
                
                <motion.button
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 border-2 transition-all duration-300 min-h-[40px] ${
                    isCompleted
                      ? 'bg-gradient-to-r from-[#8054f2] to-[#5b30f6] text-white border-[#8054f2]'
                      : 'bg-[#333333] text-white border-[#7b29cd]/30 hover:bg-[#7b29cd]/10'
                  }`}
                  whileHover={{ 
                    scale: 1.01,
                    boxShadow: isCompleted 
                      ? '0 0 15px rgba(128, 84, 242, 0.4)'
                      : '0 0 10px rgba(123, 41, 205, 0.4)'
                  }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onStart}
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completed' : 'Start'}
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Bottom neon progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333333]">
        <motion.div
          className="h-full"
          style={{ 
            background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`,
            boxShadow: `0 0 5px ${progressNeon}`
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
        />
      </div>
    </motion.div>
  );
}