import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-dark-charcoal to-dark-navy flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* 헤더 스켈레톤 */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            className="h-16 sm:h-20 md:h-24 lg:h-28 bg-glass rounded-2xl mx-auto mb-6 max-w-md"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.div
            className="h-16 sm:h-20 bg-glass rounded-2xl mx-auto max-w-md"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
        </div>

        {/* 게임 영역 스켈레톤 */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* 플레이어 영역 */}
          <motion.div
            className="bg-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-64 sm:h-80"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            <div className="h-8 bg-glass-bg rounded-lg mb-4 w-32 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 sm:h-24 lg:h-28 bg-glass-bg rounded-xl"
                />
              ))}
            </div>
          </motion.div>

          {/* AI 영역 */}
          <motion.div
            className="bg-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-64 sm:h-80"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          >
            <div className="h-8 bg-glass-bg rounded-lg mb-4 w-32 mx-auto" />
            <div className="flex items-center justify-center h-32 sm:h-40">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-glass-bg rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* 로딩 텍스트 */}
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-white/80 text-lg font-medium">
            게임을 로딩 중...
          </p>
          <div className="flex justify-center mt-4 space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-neon-purple-bright rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};