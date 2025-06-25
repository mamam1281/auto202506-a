'use client';

import { Suspense } from 'react';

// Placeholder LoadingSkeleton component
function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-80">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );
}

// Placeholder RPSGame component
function RPSGame() {
  return (
    <div className="flex items-center justify-center h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
      <div className="text-center">
        <div className="text-6xl mb-4">✂️</div>
        <p className="text-lg text-gray-300">가위바위보 네온 게임 (개발중)</p>
      </div>
    </div>
  );
}

export default function RockPaperScissorsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">가위바위보 네온</h1>
        <Suspense fallback={<LoadingSkeleton />}>
          <RPSGame />
        </Suspense>
      </div>
    </main>
  );
}
