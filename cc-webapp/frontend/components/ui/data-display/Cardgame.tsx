'use client';

import { motion } from 'framer-motion';
import { GameCardProps } from '../types/card';

const gameStyles = {
  roulette: {
    gradient: 'from-[#7b29cd] to-[#870dd1]',
    accentColor: '#7b29cd',
    icon: '🎯',
    neonColor: 'rgba(123, 41, 205, 0.3)'
  },
  slots: {
    gradient: 'from-[#870dd1] to-[#5b30f6]',
    accentColor: '#870dd1',
    icon: '✨',
    neonColor: 'rgba(135, 13, 209, 0.3)'
  },
  rps: {
    gradient: 'from-[#5b30f6] to-[#8054f2]',
    accentColor: '#5b30f6',
    icon: '⚡',
    neonColor: 'rgba(91, 48, 246, 0.3)'
  },
  gacha: {
    gradient: 'from-[#8054f2] to-[#7b29cd]',
    accentColor: '#8054f2',
    icon: '🎁',
    neonColor: 'rgba(128, 84, 242, 0.3)'
  }
};

const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.15)'
  },
  hover: { 
    scale: 1.01, 
    y: -4,
    boxShadow: '0 8px 20px rgba(123, 41, 205, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.25), 0 0 10px rgba(123, 41, 205, 0.15)'
  },
  active: { 
    scale: 0.98, 
    y: 0,
    boxShadow: '0 4px 15px rgba(135, 13, 209, 0.3), 0 0 0 2px rgba(135, 13, 209, 0.35)'
  }
};

export function CardGame({ 
  title, 
  description, 
  image, 
  gameType, 
  isNew = false, 
  badge, 
  onPlay, 
  className = '' 
}: GameCardProps) {
  const style = gameStyles[gameType];

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer group
        bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]
        border border-[#333333]
        min-h-[380px] h-full
        flex flex-col
        transition-all duration-300
        ${className}
      `}
      variants={cardVariants}
      initial="default"
      whileHover="hover"
      whileTap="active"
      layout
    >
      {/* 배경 네온 글로우 애니메이션 - 강도 약화 */}
      <motion.div 
        className="absolute inset-0 opacity-8 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${style.accentColor}20, transparent 70%)`
        }}
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${style.accentColor}20, transparent 70%)`,
            `radial-gradient(circle at 70% 70%, ${style.accentColor}25, transparent 70%)`,
            `radial-gradient(circle at 30% 70%, ${style.accentColor}20, transparent 70%)`,
            `radial-gradient(circle at 70% 30%, ${style.accentColor}22, transparent 70%)`,
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 호버 시 네온 테두리 - 블러 제거, box-shadow만 사용 */}
      <motion.div 
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(45deg, ${style.accentColor}, transparent, ${style.accentColor})`,
          boxShadow: `0 0 15px ${style.neonColor}, inset 0 0 15px ${style.neonColor}`
        }}
        animate={{
          rotate: [0, 360],
          boxShadow: [
            `0 0 10px ${style.neonColor}, inset 0 0 10px ${style.neonColor}`,
            `0 0 20px ${style.neonColor}, inset 0 0 20px ${style.neonColor}`,
            `0 0 10px ${style.neonColor}, inset 0 0 10px ${style.neonColor}`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* 모서리 네온 액센트 - 강도 약화 */}
      <div className="absolute top-2 left-2 w-6 h-6">
        <motion.div 
          className="absolute inset-0 border-l-2 border-t-2 rounded-tl-lg"
          style={{ borderColor: style.accentColor }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              `0 0 3px ${style.neonColor}`,
              `0 0 8px ${style.neonColor}`,
              `0 0 3px ${style.neonColor}`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="absolute bottom-2 right-2 w-6 h-6">
        <motion.div 
          className="absolute inset-0 border-r-2 border-b-2 rounded-br-lg"
          style={{ borderColor: style.accentColor }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              `0 0 3px ${style.neonColor}`,
              `0 0 8px ${style.neonColor}`,
              `0 0 3px ${style.neonColor}`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </div>
      
      <div className="relative p-6 z-10 flex flex-col h-full">
        {/* 헤더 - 고정 높이 */}
        <div className="flex justify-between items-start mb-4 min-h-[32px]">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="w-8 h-8 rounded-lg flex items-center justify-center border text-sm"
              style={{ 
                backgroundColor: `${style.accentColor}15`,
                borderColor: `${style.accentColor}30`
              }}
              animate={{
                boxShadow: [
                  `0 0 3px ${style.neonColor}`,
                  `0 0 8px ${style.neonColor}`,
                  `0 0 3px ${style.neonColor}`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {style.icon}
            </motion.div>
            <span className="text-xs uppercase tracking-wider text-[#D1D5DB] font-semibold">
              {gameType}
            </span>
          </motion.div>
          
          {(isNew || badge) && (
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${style.gradient} text-white border`}
              style={{ borderColor: style.accentColor }}
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  `0 0 5px ${style.neonColor}`,
                  `0 0 10px ${style.neonColor}`,
                  `0 0 5px ${style.neonColor}`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {badge || 'NEW'}
            </motion.div>
          )}
        </div>
        
        {/* 이미지 - 표준 높이 */}
        <div className="mb-4 h-32 flex-shrink-0">
          {image ? (
            <motion.div 
              className="h-full rounded-xl overflow-hidden border relative"
              style={{ borderColor: `${style.accentColor}20` }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-transparent to-[#7b29cd]/10"
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ) : (
            <div 
              className="h-full rounded-xl border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: `${style.accentColor}20` }}
            >
              <motion.div
                className="text-4xl opacity-70"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {style.icon}
              </motion.div>
            </div>
          )}
        </div>
        
        {/* 컨텐츠 영역 - 플렉스 확장 */}
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <h3 className="mb-2 text-white font-semibold text-lg min-h-[28px] flex items-center">
              {title}
            </h3>
            
            <div className="flex-1 mb-4">
              {description && (
                <p className="text-[#D1D5DB] text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {/* 버튼 - 하단 고정, 효과 약화 */}
            <motion.button
              className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${style.gradient} text-white font-semibold border-2 flex items-center justify-center gap-2 transition-all duration-300 min-h-[48px] mt-auto`}
              style={{ borderColor: style.accentColor }}
              whileHover={{ 
                scale: 1.01,
                boxShadow: `0 0 10px ${style.neonColor}`
              }}
              whileTap={{ scale: 0.99 }}
              onClick={onPlay}
            >
              <motion.span
                animate={{ x: [0, 1, 0] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ▶
              </motion.span>
              지금 플레이
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* 애니메이션 라이트 스위프 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
}