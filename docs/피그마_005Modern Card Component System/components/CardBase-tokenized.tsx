'use client';

import { motion } from 'framer-motion';
import { BaseCardProps } from '../types/card';

const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    boxShadow: 'var(--cosmic-shadow-default)'
  },
  hover: { 
    scale: 1.01, 
    y: -3,
    boxShadow: 'var(--cosmic-shadow-hover)'
  },
  active: { 
    scale: 0.99, 
    y: 0,
    boxShadow: 'var(--cosmic-shadow-active)'
  }
};

export function CardBaseTokenized({ 
  title, 
  description, 
  image, 
  className = '', 
  onClick 
}: BaseCardProps) {
  return (
    <motion.div
      className={`
        cosmic-card-base
        relative overflow-hidden cursor-pointer group
        flex flex-col
        transition-all duration-[var(--cosmic-transition-default)]
        ${className}
      `}
      variants={cardVariants}
      initial="default"
      whileHover="hover"
      whileTap="active"
      onClick={onClick}
      layout
    >
      {/* 보라색 글로우 배경 애니메이션 - 토큰 사용 */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, var(--neon-bg-1), transparent 70%)`
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          background: [
            `radial-gradient(circle at 30% 30%, var(--neon-bg-1), transparent 70%)`,
            `radial-gradient(circle at 70% 70%, var(--neon-bg-2), transparent 70%)`,
            `radial-gradient(circle at 30% 30%, var(--neon-bg-1), transparent 70%)`
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 호버 시 네온 테두리 - 토큰 사용 */}
      <motion.div
        className="absolute -inset-0.5 rounded-[var(--cosmic-radius-card)] opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(45deg, var(--neon-purple-1), var(--neon-purple-2), var(--neon-purple-3))`,
          boxShadow: `0 0 15px var(--neon-glow-1), inset 0 0 15px var(--neon-glow-1)`
        }}
        animate={{
          opacity: [0, 0.15, 0],
          scale: [1, 1.01, 1],
          boxShadow: [
            `0 0 10px var(--neon-glow-1), inset 0 0 10px var(--neon-glow-1)`,
            `0 0 20px var(--neon-glow-1), inset 0 0 20px var(--neon-glow-1)`,
            `0 0 10px var(--neon-glow-1), inset 0 0 10px var(--neon-glow-1)`
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 모서리 액센트 라인 - 토큰 사용 */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <motion.div 
          className="absolute top-0 left-0 w-full h-0.5"
          style={{
            background: `linear-gradient(to right, var(--neon-purple-1), transparent)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              `0 0 3px var(--neon-glow-1)`,
              `0 0 8px var(--neon-glow-1)`,
              `0 0 3px var(--neon-glow-1)`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 left-0 h-full w-0.5"
          style={{
            background: `linear-gradient(to bottom, var(--neon-purple-1), transparent)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              `0 0 3px var(--neon-glow-1)`,
              `0 0 8px var(--neon-glow-1)`,
              `0 0 3px var(--neon-glow-1)`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8">
        <motion.div 
          className="absolute bottom-0 right-0 w-full h-0.5"
          style={{
            background: `linear-gradient(to left, var(--neon-purple-4), transparent)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              `0 0 3px var(--neon-glow-4)`,
              `0 0 8px var(--neon-glow-4)`,
              `0 0 3px var(--neon-glow-4)`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 h-full w-0.5"
          style={{
            background: `linear-gradient(to top, var(--neon-purple-4), transparent)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              `0 0 3px var(--neon-glow-4)`,
              `0 0 8px var(--neon-glow-4)`,
              `0 0 3px var(--neon-glow-4)`
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
      
      <div 
        className="relative z-10 flex flex-col h-full"
        style={{ padding: 'var(--cosmic-padding)' }}
      >
        {/* 이미지 영역 - 토큰 사용 */}
        <div 
          className="mb-4 flex-shrink-0"
          style={{ height: 'var(--image-height-base)' }}
        >
          {image ? (
            <motion.div 
              className="h-full overflow-hidden relative"
              style={{ borderRadius: 'var(--cosmic-radius-image)' }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, var(--cosmic-bg-dark-1)99, transparent, var(--neon-bg-1))`
                }}
              />
            </motion.div>
          ) : (
            <div 
              className="h-full border-2 border-dashed flex items-center justify-center"
              style={{ 
                borderRadius: 'var(--cosmic-radius-image)',
                borderColor: 'var(--neon-border-1)'
              }}
            >
              <motion.div
                className="text-4xl opacity-70"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⭐
              </motion.div>
            </div>
          )}
        </div>
        
        {/* 컨텐츠 영역 - 토큰 사용 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <h3 
            className="mb-2 font-semibold text-lg min-h-[28px] flex items-center"
            style={{ color: 'var(--cosmic-text-primary)' }}
          >
            {title}
          </h3>
          
          <div className="flex-1">
            {description && (
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--cosmic-text-secondary)' }}
              >
                {description}
              </p>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* 하단 네온 액센트 - 토큰 사용 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, var(--neon-purple-1), var(--neon-purple-2), var(--neon-purple-4))`
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          boxShadow: [
            `0 0 5px var(--neon-glow-1)`,
            `0 0 10px var(--neon-glow-1)`,
            `0 0 5px var(--neon-glow-1)`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 애니메이션 라이트 스위프 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
}