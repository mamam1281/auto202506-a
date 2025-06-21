'use client';

import { Roulette } from './components/roulette/Roulette';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f8f9fa] overflow-x-hidden">
      {/* 배경 그라디언트 오버레이 */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#151525] to-[#1a1a2e] -z-10" />
      
      {/* 애니메이션 배경 요소들 */}
      <div className="fixed inset-0 -z-5 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10">
        <Roulette />
      </div>
    </div>
  );
}