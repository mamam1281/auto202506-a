'use client';

import { motion } from 'framer-motion';
import { BaseCardProps } from '../types/card';

const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 2px 10px rgba(123, 41, 205, 0.08), 0 0 0 1px rgba(123, 41, 205, 0.1)'
  },
  hover: { 
    scale: 1.01, 
    y: -3,
    boxShadow: '0 8px 20px rgba(123, 41, 205, 0.15), 0 0 0 1px rgba(123, 41, 205, 0.2), 0 0 8px rgba(123, 41, 205, 0.1)'
  },
  active: { 
    scale: 0.99, 
    y: 0,
    boxShadow: '0 4px 15px rgba(135, 13, 209, 0.2), 0 0 0 2px rgba(135, 13, 209, 0.3)'
  }
};

export function CardBase({ 
  title, 
  description, 
  image, 
  className = '', 
  onClick 
}: BaseCardProps) {
  return (
<motion.div
    className={`
        relative overflow-hidden rounded-2xl cursor-pointer group
        bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]
        border border-[#7b29cd]/20
        min-h-[320px] h-full
        flex flex-col
        transition-all duration-300
        ${className}
      `}
      variants={cardVariants}
      initial="default"
      whileHover="hover"
      whileTap="active"
      onClick={onClick}
      layout
    >
      {/* 보라색 글로우 배경 애니메이션 - 강도 약화 */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#7b29cd]/3 via-[#870dd1]/2 to-[#5b30f6]/3 pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          background: [
            'radial-gradient(circle at 30% 30%, rgba(123, 41, 205, 0.03), transparent 70%)',
            'radial-gradient(circle at 70% 70%, rgba(135, 13, 209, 0.05), transparent 70%)',
            'radial-gradient(circle at 30% 30%, rgba(123, 41, 205, 0.03), transparent 70%)'
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 호버 시 네온 테두리 - 블러 제거 */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-[#7b29cd] via-[#870dd1] to-[#5b30f6] rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: '0 0 15px rgba(123, 41, 205, 0.4), inset 0 0 15px rgba(123, 41, 205, 0.2)'
        }}
        animate={{
          opacity: [0, 0.15, 0],
          scale: [1, 1.01, 1],
          boxShadow: [
            '0 0 10px rgba(123, 41, 205, 0.3), inset 0 0 10px rgba(123, 41, 205, 0.1)',
            '0 0 20px rgba(123, 41, 205, 0.5), inset 0 0 20px rgba(123, 41, 205, 0.3)',
            '0 0 10px rgba(123, 41, 205, 0.3), inset 0 0 10px rgba(123, 41, 205, 0.1)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 모서리 액센트 라인 - 효과 약화 */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <motion.div 
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#7b29cd] to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 3px rgba(123, 41, 205, 0.3)',
              '0 0 8px rgba(123, 41, 205, 0.5)',
              '0 0 3px rgba(123, 41, 205, 0.3)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-[#7b29cd] to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 3px rgba(123, 41, 205, 0.3)',
              '0 0 8px rgba(123, 41, 205, 0.5)',
              '0 0 3px rgba(123, 41, 205, 0.3)'
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
          className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-[#8054f2] to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 3px rgba(128, 84, 242, 0.3)',
              '0 0 8px rgba(128, 84, 242, 0.5)',
              '0 0 3px rgba(128, 84, 242, 0.3)'
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
          className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-[#8054f2] to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 3px rgba(128, 84, 242, 0.3)',
              '0 0 8px rgba(128, 84, 242, 0.5)',
              '0 0 3px rgba(128, 84, 242, 0.3)'
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
      
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* 이미지 영역 - 표준 높이 */}
        <div className="mb-4 h-40 flex-shrink-0">
          {image ? (
            <motion.div 
              className="h-full rounded-xl overflow-hidden relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-[#7b29cd]/10" />
            </motion.div>
          ) : (
            <div className="h-full rounded-xl border-2 border-dashed border-[#7b29cd]/20 flex items-center justify-center">
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
        
        {/* 컨텐츠 영역 - 플렉스 확장 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <h3 className="mb-2 text-white font-semibold text-lg min-h-[28px] flex items-center">
            {title}
          </h3>
          
          <div className="flex-1">
            {description && (
              <p className="text-[#D1D5DB] text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* 하단 네온 액센트 - 강도 약화 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7b29cd] via-[#870dd1] to-[#8054f2]"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          boxShadow: [
            '0 0 5px rgba(123, 41, 205, 0.2)',
            '0 0 10px rgba(123, 41, 205, 0.4)',
            '0 0 5px rgba(123, 41, 205, 0.2)'
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