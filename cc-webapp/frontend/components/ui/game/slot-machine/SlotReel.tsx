'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 심볼 정의 (slotLogic.ts와 동일)
const SYMBOLS = ['🍒', '🔔', '💎', '7️⃣', '⭐'];

interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  delay: number;
  isWinning?: boolean;
}

export const SlotReel: React.FC<SlotReelProps> = ({ 
  symbol, 
  isSpinning, 
  delay, 
  isWinning = false 
}) => {  const spinVariants = {
    spinning: {
      y: [-30, -60, -90, -60, -30, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
        delay
      }
    },
    stopped: {
      y: 0,
      transition: {
        duration: 0.4,
        delay: delay + 1.5,
        ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number]
      }
    }
  };

  const winningVariants = {
    winning: {
      scale: [1, 1.05, 1, 1.05, 1],
      rotate: [0, -1, 1, -1, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    },
    normal: {
      scale: 1,
      rotate: 0
    }
  };

  return (
    <div className="relative">
      {/* 메인 릴 컨테이너 - 다크 테마 적용 */}
      <div className="relative">
        {/* 릴 프레임 - 더 부드러운 테두리 */}
        <div className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-2xl p-1 border border-amber-500/20">
          {/* 릴 내부 - 다크 배경으로 변경 */}
          <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-xl h-24 flex items-center justify-center border border-gray-600 shadow-inner relative overflow-hidden">
            
            {/* 부드러운 내부 하이라이트 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-xl"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
            
            {isSpinning ? (
              <div className="flex flex-col items-center relative">
                {SYMBOLS.map((sym, index) => (
                  <motion.div
                    key={index}
                    variants={spinVariants}
                    animate="spinning"
                    className="text-4xl absolute"
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0.6 + Math.random() * 0.2,
                      filter: 'blur(0.5px)'
                    }}
                  >
                    {sym}
                  </motion.div>
                ))}
                
                {/* 스핀 중 부드러운 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent"></div>
              </div>
            ) : (
              <motion.div
                variants={winningVariants}
                animate={isWinning ? 'winning' : 'normal'}
                className="text-5xl relative z-10"
                style={{
                  filter: isWinning ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}
              >
                {symbol}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* 부드러운 반사 효과 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 via-transparent to-black/5 pointer-events-none"></div>
      </div>
      
      {/* 승리 시 부드러운 효과 - 강도 대폭 감소 */}
      {isWinning && (
        <>
          {/* 메인 글로우 효과 - 더 부드럽게 */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-amber-400/60 backdrop-blur-sm"
            animate={{
              boxShadow: [
                '0 0 0px rgba(251, 191, 36, 0.3)',
                '0 0 12px rgba(251, 191, 36, 0.5)',
                '0 0 8px rgba(251, 191, 36, 0.4)',
                '0 0 12px rgba(251, 191, 36, 0.5)',
                '0 0 0px rgba(251, 191, 36, 0.3)'
              ],
              backgroundColor: [
                'rgba(251, 191, 36, 0.05)',
                'rgba(251, 191, 36, 0.1)',
                'rgba(251, 191, 36, 0.05)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          />
          
          {/* 승리 파티클 효과 - 개수와 강도 감소 */}
          <div className="absolute -inset-3 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-amber-400/80 to-yellow-300/80 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `25px 0px`,
                  transform: `rotate(${i * 90}deg) translateY(-25px)`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
          
          {/* 부드러운 글리터 효과 - 더 적고 부드럽게 */}
          <motion.div
            className="absolute -inset-1 opacity-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-amber-300/60 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `20px 0px`,
                  transform: `rotate(${i * 60}deg) translateY(-20px)`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};
