'use client';

import { useState } from 'react';
import ResponsiveDebugger from '../../components/ui/utils/ResponsiveDebugger';
import { ResponsiveContainer, ResponsiveGrid, GameGrid, MissionGrid } from '../../components/ui/layout/ResponsiveContainer';

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
            <h2 className="text-2xl font-bold text-center mb-6">🔥 Stage 1: 기초 이해</h2>
            
            {/* 반응형 버튼 데모 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">⚡ 반응형 버튼 테스트</h3>
              <div className="space-y-4">
                <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:scale-105 transition-transform">
                  모바일: 전체폭 / 데스크톱: 자동폭
                </button>
                <button className="block mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all">
                  중앙 정렬 버튼
                </button>
              </div>
            </div>

            {/* 반응형 카드 그리드 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎨 반응형 카드 그리드</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-900 to-blue-900 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400 transition-colors">
                    <h4 className="font-semibold mb-2">카드 {i}</h4>
                    <p className="text-sm text-slate-300">
                      모바일: 1열<br/>
                      태블릿: 2열<br/>
                      데스크톱: 3열
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 반응형 네비게이션 데모 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🧭 반응형 네비게이션</h3>
              
              {/* 모바일/데스크톱 다른 네비게이션 */}
              <div className="space-y-4">
                {/* 모바일: 스택형 메뉴 */}
                <div className="sm:hidden">
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded text-left">홈</button>
                    <button className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded text-left">게임</button>
                    <button className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded text-left">프로필</button>
                    <button className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded text-left">설정</button>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">↑ 모바일: 세로 스택 메뉴</p>
                </div>
                
                {/* 데스크톱: 가로형 메뉴 */}
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">홈</button>
                    <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded">게임</button>
                    <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded">프로필</button>
                    <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded">설정</button>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">↑ 데스크톱: 가로 메뉴</p>
                </div>
              </div>
            </div>

            {/* 브레이크포인트 시스템 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📏 브레이크포인트 시스템</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                  <div className="space-y-3 text-sm">
                    <div className="bg-green-800 p-3 rounded">
                      <p className="font-medium">✅ 실습 과제</p>
                      <p className="text-green-200">브라우저 크기를 조절하며 위 요소들의 변화 관찰하기</p>
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
            <h2 className="text-2xl font-bold text-center mb-6">🎮 Stage 2: 컨테이너 & 그리드</h2>
            <div className="bg-slate-800 rounded-lg p-6">
              <p className="text-center text-slate-400">Stage 2 콘텐츠 구현 예정</p>
            </div>
          </section>
        )}

        {/* Stage 3: 컴포넌트 반응형 */}
        {currentStage === 3 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">🎯 Stage 3: 컴포넌트 반응형</h2>
            <div className="bg-slate-800 rounded-lg p-6">
              <p className="text-center text-slate-400">Stage 3 콘텐츠 구현 예정</p>
            </div>
          </section>
        )}

        {/* Stage 4: 고급 최적화 */}
        {currentStage === 4 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">🚀 Stage 4: 고급 최적화</h2>
            <div className="bg-slate-800 rounded-lg p-6">
              <p className="text-center text-slate-400">Stage 4 콘텐츠 구현 예정</p>
            </div>
          </section>
        )}
      </ResponsiveContainer>
    </div>
  );
}
