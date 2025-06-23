'use client';

import React from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function GameLayout({ children, className }: GameLayoutProps) {
  return (
    <div className={`min-h-screen bg-black relative overflow-hidden ${className || ''}`}>
      {/* 프리미엄 카지노 배경 레이어 */}
      <div className="absolute inset-0">
        {/* 메인 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-amber-800/15"></div>
        
        {/* 고급스러운 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, gold 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, gold 1px, transparent 1px)`,
            backgroundSize: '60px 60px, 40px 40px'
          }}
        ></div>
        
        {/* 동적 조명 효과 */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-radial from-amber-500/10 via-amber-500/3 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-gradient-radial from-yellow-500/8 via-yellow-500/2 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-radial from-amber-600/6 via-amber-600/1 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* 빛나는 입자들 */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-amber-400/40 rounded-full opacity-40 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* 고급스러운 테두리 효과 */}
      <div className="absolute inset-0 border border-amber-500/5 pointer-events-none"></div>
      <div className="absolute inset-4 border border-amber-500/3 pointer-events-none rounded-lg"></div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
