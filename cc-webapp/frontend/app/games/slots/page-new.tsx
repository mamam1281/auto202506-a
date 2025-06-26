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

// 코스믹 포츈 게임 메인 컴포넌트
function CosmicFortuneGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-300/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <SlotMachine />
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function SlotsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CosmicFortuneGamePage />
    </Suspense>
  );
}
