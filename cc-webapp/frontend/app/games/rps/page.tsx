'use client';

import { Suspense } from 'react';
import RPSGame from '../../../components/games/rps/RPSGame';

// Loading skeleton for the RPS game
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">가위바위보 게임 로딩 중...</p>
      </div>
    </div>
  );
}

export default function RockPaperScissorsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RPSGame />
    </Suspense>
  );
}
