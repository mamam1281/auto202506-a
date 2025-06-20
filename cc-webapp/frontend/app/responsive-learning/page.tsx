'use client';

import { useState } from 'react';
import ResponsiveDebugger from '../../components/ui/utils/ResponsiveDebugger';
import { ResponsiveContainer, ResponsiveGrid, GameGrid, MissionGrid, CardGrid } from '../../components/ui/layout/ResponsiveContainer';

export default function ResponsiveLearningPage() {
  const [currentStage, setCurrentStage] = useState(1);

  const stages = [
    { id: 1, title: '기초 이해', description: '브레이크포인트와 디버깅 도구' },
    { id: 2, title: '컨테이너 & 그리드', description: '레이아웃 시스템 실습' },
    { id: 3, title: '컴포넌트 반응형', description: 'UI 컴포넌트 반응형 구현' },
    { id: 4, title: '고급 최적화', description: '성능과 사용자 경험 최적화' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <ResponsiveDebugger />
      
      <ResponsiveContainer maxWidth="2xl" className="py-8">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            📱 반응형 웹 개발 온보딩
          </h1>
          <p className="text-lg sm:text-xl text-center text-slate-400 mb-8">
            통합_반응형_가이드.md를 바탕으로 한 실습 학습
          </p>
          
          {/* 단계 네비게이션 */}
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStage === stage.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Stage {stage.id}: {stage.title}
              </button>
            ))}
          </nav>
        </header>

        {/* Stage 1: 기초 이해 */}
        {currentStage === 1 && (
          <section className="space-y-8">
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">🔥 Stage 1: 기초 이해</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">브레이크포인트 시스템</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-slate-700 px-3 py-2 rounded">
                      <span>XS (모바일)</span>
                      <span>&lt; 640px</span>
                    </div>
                    <div className="flex justify-between bg-slate-700 px-3 py-2 rounded">
                      <span>SM (작은 태블릿)</span>
                      <span>640px ~ 767px</span>
                    </div>
                    <div className="flex justify-between bg-slate-700 px-3 py-2 rounded">
                      <span>MD (태블릿)</span>
                      <span>768px ~ 1023px</span>
                    </div>
                    <div className="flex justify-between bg-slate-700 px-3 py-2 rounded">
                      <span>LG (데스크톱)</span>
                      <span>1024px ~ 1279px</span>
                    </div>
                    <div className="flex justify-between bg-slate-700 px-3 py-2 rounded">
                      <span>XL (큰 데스크톱)</span>
                      <span>1280px ~ 1535px</span>
                    </div>
                    <div className="flex justify-between bg-slate-700 px-3 py-2 rounded">
                      <span>2XL (초대형)</span>
                      <span>≥ 1536px</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">디버깅 도구 사용법</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-700 p-3 rounded">
                      <p className="font-medium">우상단 브레이크포인트 표시기</p>
                      <p className="text-slate-400">현재 화면 크기와 브레이크포인트 확인</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded">
                      <p className="font-medium">키보드 단축키</p>
                      <p className="text-slate-400">Ctrl+Shift+B: 브레이크포인트 토글</p>
                      <p className="text-slate-400">Ctrl+Shift+G: 그리드 오버레이 토글</p>
                    </div>
                    <div className="bg-green-800 p-3 rounded">
                      <p className="font-medium">✅ 실습 과제</p>
                      <p className="text-green-200">브라우저 크기를 조절하며 브레이크포인트 변화 관찰하기</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stage 2: 컨테이너 & 그리드 */}
        {currentStage === 2 && (
          <section className="space-y-8">
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">🎮 Stage 2: 컨테이너 & 그리드</h2>
              
              {/* 컨테이너 예시 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">반응형 컨테이너</h3>
                <div className="space-y-4">
                  <ResponsiveContainer maxWidth="sm" className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg">
                    <p className="text-center">Small Container (max-w-screen-sm)</p>
                    <p className="text-center text-sm text-slate-400">640px 최대 너비</p>
                  </ResponsiveContainer>
                  
                  <ResponsiveContainer maxWidth="lg" className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <p className="text-center">Large Container (max-w-screen-lg)</p>
                    <p className="text-center text-sm text-slate-400">1024px 최대 너비</p>
                  </ResponsiveContainer>
                  
                  <ResponsiveContainer maxWidth="2xl" className="bg-purple-900/20 border border-purple-500 p-4 rounded-lg">
                    <p className="text-center">2XL Container (max-w-screen-2xl)</p>
                    <p className="text-center text-sm text-slate-400">1536px 최대 너비</p>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 그리드 예시 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">반응형 그리드 시스템</h3>
                
                {/* 기본 그리드 */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">기본 그리드 (1→2→4열)</h4>
                  <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-slate-700 p-4 rounded-lg text-center">
                        아이템 {i + 1}
                      </div>
                    ))}
                  </ResponsiveGrid>
                </div>

                {/* 게임 그리드 */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">게임 카드 그리드</h4>
                  <GameGrid>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-purple-900/30 border border-purple-500 p-6 rounded-lg text-center">
                        <div className="text-2xl mb-2">🎮</div>
                        <p>게임 {i + 1}</p>
                      </div>
                    ))}
                  </GameGrid>
                </div>

                {/* 미션 그리드 */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">미션 카드 그리드</h4>
                  <MissionGrid>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-emerald-900/30 border border-emerald-500 p-4 rounded-lg text-center">
                        <div className="text-lg mb-2">🎯</div>
                        <p>미션 {i + 1}</p>
                      </div>
                    ))}
                  </MissionGrid>
                </div>
              </div>

              <div className="bg-green-800 p-4 rounded-lg">
                <p className="font-medium">✅ 실습 과제</p>
                <p className="text-green-200">브라우저 크기를 조절하며 그리드 컬럼 변화 관찰하기</p>
                <p className="text-green-200">Ctrl+Shift+G로 그리드 오버레이 활성화해서 정렬 확인하기</p>
              </div>
            </div>
          </section>
        )}

        {/* Stage 3 & 4는 다음 단계에서 구현 */}
        {currentStage === 3 && (
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">🎨 Stage 3: 컴포넌트 반응형</h2>
            <p className="text-slate-400">다음 단계에서 구현 예정...</p>
          </div>
        )}

        {currentStage === 4 && (
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Stage 4: 고급 최적화</h2>
            <p className="text-slate-400">다음 단계에서 구현 예정...</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}
