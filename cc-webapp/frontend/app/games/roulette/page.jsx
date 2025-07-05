// cc-webapp/frontend/app/roulette/page.jsx
'use client';

import React, { useEffect } from 'react';
import Button from '../../../components/Button';
import { useRouter } from 'next/navigation';

export default function RoulettePage() {
  const router = useRouter();

  // 페이지 타이틀 설정
  useEffect(() => {
    document.title = 'Roulette - CasinoClub';
  }, []);

  return (
    <div className="min-h-screen"
         style={{ 
           backgroundColor: 'var(--color-background-primary)',
           color: 'var(--color-text-primary)',
           fontFamily: 'var(--font-primary)',
           display: 'grid',
           gridTemplateRows: 'var(--app-header-height-mobile) 1fr var(--bottom-nav-height)',
           gridTemplateAreas: '"header" "main" "footer"'
         }}>
      
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            grid-template-rows: var(--app-header-height-desktop) 1fr var(--bottom-nav-height);
          }
        }
      `}</style>
      
      {/* Main Content Area - 완전 중앙 정렬 */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8"
           style={{
             gridArea: 'main',
             minHeight: '100%'
           }}>
        
        {/* Content Container - 완전 중앙 정렬 및 반응형 */}
        <div className="w-full max-w-4xl text-center space-y-6 sm:space-y-8 lg:space-y-12">
          
          {/* 헤더 */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span style={{ color: 'var(--color-purple-primary)' }}>🎰 룰렛 게임</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl" 
               style={{ color: 'var(--color-text-secondary)' }}>
              행운의 룰렛을 돌려보세요!
            </p>
          </div>

          {/* 룰렛 영역 - 반응형 크기 및 중앙 정렬 */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            <div 
              className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full border-4 flex items-center justify-center text-5xl sm:text-7xl lg:text-8xl xl:text-9xl transition-all duration-300 hover:scale-105 mx-auto"
              style={{ 
                backgroundColor: 'var(--color-background-secondary)',
                borderColor: 'var(--color-purple-primary)',
                boxShadow: '0 8px 32px rgba(var(--color-purple-primary-rgb), 0.3)'
              }}
            >
              🎲
            </div>
            <p className="text-sm sm:text-base lg:text-lg opacity-75 max-w-md sm:max-w-lg mx-auto">
              룰렛 게임이 곧 출시됩니다!
            </p>
          </div>

          {/* 액션 버튼들 - 중앙 정렬 및 반응형 간격 */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {/* 룰렛 게임 로직 */}}
              className="w-full max-w-xs sm:max-w-sm mx-auto"
            >
              🎰 룰렛 돌리기
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="mx-auto"
            >
              ← 홈으로 돌아가기
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}