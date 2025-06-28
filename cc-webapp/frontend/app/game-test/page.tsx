import React from 'react';
import { motion } from 'framer-motion';

export default function GameTestPage() {
  return (
    <div className="miniapp-container min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)]">
      {/* Header */}
      <motion.header 
        className="bg-[var(--color-surface-primary)]/80 backdrop-blur-md shadow-md border-b border-[var(--color-border-primary)]"
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
              🎮 게임 테스트
            </motion.h1>
            <motion.p 
              className="text-[var(--color-text-secondary)] text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              게임 레이아웃 테스트 페이지
            </motion.p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 miniapp-content py-6 sm:py-8">
        <motion.div
          className="w-full bg-card/80 p-6 rounded-xl shadow-xl text-center flex flex-col items-center justify-center h-full min-h-[60vh]"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold mb-6 heading-h1 text-primary">Game Test Page</h2>
          <p className="text-xl text-foreground mb-4">
            이 페이지는 표준 미니앱 레이아웃을 사용합니다.
          </p>
          <p className="text-md text-muted-foreground mb-8">
            모든 페이지가 동일한 고정 크기 컨테이너(420px)를 사용하여 
            일관된 사용자 경험을 제공합니다.
          </p>
          <div className="bg-background p-8 rounded-lg shadow-inner w-full h-64 flex items-center justify-center">
            <p className="text-2xl text-accent animate-pulse">-- 실제 게임 콘텐츠가 여기에 표시됩니다 --</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
