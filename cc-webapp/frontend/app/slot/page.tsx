'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SlotMachine from '../../components/games/slot/SlotMachine';

export default function SlotPage() {
  return (
    <div className="miniapp-container min-h-screen bg-gradient-to-br from-[var(--color-surface-primary)] via-[var(--color-surface-secondary)] to-[var(--color-surface-tertiary)] flex flex-col">
      {/* Header - 고정 크기 컨테이너 */}
      <motion.header 
        className="bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] shadow-xl border-b border-[var(--color-border-primary)]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="miniapp-header px-4 py-6">
          <div className="text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              🎰 슬롯 머신 🎰
            </motion.h1>
            <motion.p 
              className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              운을 시험해보세요! 심볼을 맞추고 큰 상금을 획득하세요
            </motion.p>
          </div>
        </div>
      </motion.header>

      {/* Main Content - 고정 크기 컨테이너 */}
      <main className="flex-1 flex items-center justify-center miniapp-content py-4 sm:py-6 lg:py-8">
        <div className="w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <SlotMachine className="mx-auto" />
          </motion.div>

          {/* Game Info Cards */}
          <motion.div 
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="bg-[var(--color-surface-secondary)]/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--color-border-secondary)] text-center">
              <div className="text-2xl mb-2">🍒</div>
              <div className="text-[var(--color-text-primary)] font-semibold text-sm">체리</div>
              <div className="text-[var(--color-text-muted)] text-xs">5x 배수</div>
            </div>
            
            <div className="bg-[var(--color-surface-secondary)]/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--color-border-secondary)] text-center">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-[var(--color-text-primary)] font-semibold text-sm">다이아몬드</div>
              <div className="text-[var(--color-text-muted)] text-xs">20x 배수</div>
            </div>
            
            <div className="bg-[var(--color-surface-secondary)]/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--color-border-secondary)] text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-[var(--color-text-primary)] font-semibold text-sm">잭팟</div>
              <div className="text-[var(--color-accent-amber)] text-xs font-bold">100x 배수!</div>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div 
            className="mt-6 bg-[var(--color-surface-secondary)]/60 backdrop-blur-sm rounded-xl p-4 border border-[var(--color-border-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h3 className="text-[var(--color-text-primary)] font-semibold mb-2 text-center">🎯 게임 팁</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-accent-amber)] font-bold">•</span>
                <span>같은 심볼 3개를 맞추면 트리플 보너스!</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-accent-amber)] font-bold">•</span>
                <span>2개만 맞춰도 1.5x 배수 획득</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-accent-amber)] font-bold">•</span>
                <span>⭐ 3개로 메가 잭팟 도전!</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-accent-amber)] font-bold">•</span>
                <span>베팅 금액에 따라 배당금 증가</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['🎰', '🍒', '💎', '⭐', '🔔', '7️⃣'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
