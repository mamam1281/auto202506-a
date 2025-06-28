'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import SlotMachine from '../../../components/games/slot/SlotMachine';

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">코스믹 포츈 로딩 중...</p>
      </div>
    </div>
  );
}

// 코스믹 포츈 슬롯 게임 페이지
function CosmicFortuneGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-dark-navy)] via-[var(--color-primary-charcoal)] to-[var(--color-primary-dark-navy)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--color-accent-purple)] rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[var(--color-accent-blue)] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[var(--color-accent-amber)] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center py-16 sm:py-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[var(--color-accent-amber)] via-[var(--color-accent-yellow)] to-[var(--color-accent-amber)] bg-clip-text text-transparent mb-4 tracking-wide">
            코스믹 포츈
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] font-medium">
            우주에서 가장 스릴 넘치는 슬롯 머신
          </p>
        </motion.div>

        {/* Main Game Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-[300px] min-h-screen flex justify-center">
          <motion.div
            className="w-full max-w-2xl min-h-screen flex flex-col justify-start pt-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SlotMachine />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 메인 익스포트
export default function SlotsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CosmicFortuneGamePage />
    </Suspense>
  );
}