'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <ResponsiveDebugger />
      
      <ResponsiveContainer maxWidth="2xl" className="py-8">
        {/* 네온 헤더 */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-center mb-4 font-bold bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent"
            style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
            }}
          >
            🌟 프리미엄 반응형 웹 개발 온보딩
          </motion.h1>
          
          <motion.p 
            className="text-center text-slate-300 mb-8"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            통합 가이드를 바탕으로 한 실전 학습 플랫폼
          </motion.p>
          
          {/* 프리미엄 단계 네비게이션 */}
          <motion.nav 
            className="flex flex-wrap justify-center gap-2 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {stages.map((stage, index) => (
              <motion.button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`relative px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                  currentStage === stage.id
                    ? 'text-white shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}                    style={{
                      background: currentStage === stage.id 
                        ? 'linear-gradient(45deg, #7b29cd, #3730a3)'
                        : 'rgba(15, 23, 42, 0.6)',
                      border: currentStage === stage.id 
                        ? '1px solid rgba(168, 85, 247, 0.3)'
                        : '1px solid rgba(71, 85, 105, 0.3)',
                      boxShadow: currentStage === stage.id 
                        ? '0 0 20px rgba(168, 85, 247, 0.3)'
                        : 'none'
                    }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="relative z-10">
                  <div className="font-bold">Stage {stage.id}</div>
                  <div className="text-xs opacity-90">{stage.title}</div>
                </div>
                
                {/* 호버 효과 배경 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100"
                  style={{ borderRadius: 'inherit' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </motion.nav>
        </motion.header>        {/* Stage 1: 기초 이해 - 프리미엄 버전 */}
        {currentStage === 1 && (
          <AnimatePresence mode="wait">
            <motion.section 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* 스테이지 헤더 */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 
                  className="font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                >
                  🔥 Stage 1: 기초 이해
                </h2>
                <p className="text-slate-300 text-lg">브레이크포인트와 디버깅 도구 마스터하기</p>
              </motion.div>
              
              {/* 프리미엄 반응형 버튼 데모 */}
              <motion.div 
                className="rounded-2xl p-8 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >                <h3 className="text-xl font-bold mb-6 text-center" style={{ color: '#a855f7' }}>
                  ⚡ 프리미엄 반응형 버튼 시스템
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Primary Gradient Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden group"                    style={{
                      background: 'linear-gradient(45deg, #7b29cd, #3730a3)',
                      boxShadow: '0 4px 20px rgba(123, 41, 205, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 8px 30px rgba(123, 41, 205, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">프라이머리 그라데이션</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  {/* Success Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden"                    style={{
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    성공 액션
                  </motion.button>

                  {/* Warning Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden"                    style={{
                      background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    경고 알림
                  </motion.button>                  {/* Outline Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold overflow-hidden"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '2px solid #7b29cd',
                      boxShadow: '0 0 15px rgba(123, 41, 205, 0.2)',
                      color: '#c4b5fd'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      color: '#ffffff',
                      background: 'rgba(123, 41, 205, 0.1)',
                      boxShadow: '0 0 25px rgba(123, 41, 205, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    아웃라인 스타일
                  </motion.button>{/* Text Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold overflow-hidden"
                    style={{ 
                      background: 'rgba(15, 23, 42, 0)', 
                      color: '#cbd5e1' 
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      color: '#a855f7',
                      background: 'rgba(123, 41, 205, 0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    텍스트 버튼
                  </motion.button>

                  {/* Full Width Responsive */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden sm:col-span-2 lg:col-span-1"                    style={{
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 8px 30px rgba(59, 130, 246, 0.5)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    반응형 전체폭
                  </motion.button>
                </div>
              </motion.div>

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
              </div>            </div>
          </motion.section>
        </AnimatePresence>
        )}

        {/* Stage 2: 컨테이너 & 그리드 */}
        {currentStage === 2 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">🎮 Stage 2: 컨테이너 & 그리드</h2>
            
            {/* 컨테이너 예시 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📦 반응형 컨테이너</h3>
              <div className="space-y-4">
                <ResponsiveContainer maxWidth="sm" className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg">
                  <p className="text-center">Small Container (640px)</p>
                </ResponsiveContainer>
                <ResponsiveContainer maxWidth="lg" className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                  <p className="text-center">Large Container (1024px)</p>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 그리드 시스템 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎯 그리드 시스템</h3>
              
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
            </div>

            <div className="bg-green-800 p-4 rounded-lg">
              <p className="font-medium">✅ 실습 과제</p>
              <p className="text-green-200">브라우저 크기 조절하며 그리드 변화 관찰하기</p>
            </div>
          </section>
        )}{/* Stage 3: 컴포넌트 반응형 */}
        {currentStage === 3 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">🎯 Stage 3: 컴포넌트 반응형</h2>
            
            {/* 반응형 카드 컴포넌트 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">💎 프리미엄 카드 컴포넌트</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-xl border border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                  <div className="text-3xl mb-3">🎮</div>
                  <h4 className="font-bold text-lg mb-2">게임 카드</h4>
                  <p className="text-slate-300 text-sm">호버 시 글로우 효과</p>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-emerald-900 p-6 rounded-xl border border-green-500/50 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 transition-all">
                  <div className="text-3xl mb-3">💰</div>
                  <h4 className="font-bold text-lg mb-2">리워드 카드</h4>
                  <p className="text-slate-300 text-sm">부드러운 애니메이션</p>
                </div>
                <div className="bg-gradient-to-br from-orange-900 to-red-900 p-6 rounded-xl border border-orange-500/50 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 transition-all">
                  <div className="text-3xl mb-3">🏆</div>
                  <h4 className="font-bold text-lg mb-2">성과 카드</h4>
                  <p className="text-slate-300 text-sm">그라데이션 배경</p>
                </div>
              </div>
            </div>

            {/* 반응형 폼 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📝 반응형 폼 레이아웃</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="이름" />
                  <input className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="이메일" />
                </div>
                <div className="space-y-4">
                  <textarea className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" rows={4} placeholder="메시지"></textarea>
                </div>
              </div>
              <button className="mt-4 w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform">
                전송
              </button>
            </div>
          </section>
        )}        {/* Stage 4: 고급 최적화 */}
        {currentStage === 4 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">🚀 Stage 4: 고급 최적화</h2>
            
            {/* 성능 최적화 예시 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">⚡ 성능 최적화 기법</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">✅ 이미지 최적화</h4>
                    <p className="text-sm text-slate-300">WebP, AVIF 포맷 사용</p>
                    <p className="text-sm text-slate-300">lazy loading 적용</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">📱 모바일 우선 설계</h4>
                    <p className="text-sm text-slate-300">Mobile-first CSS</p>
                    <p className="text-sm text-slate-300">터치 친화적 UI</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">🎯 CSS 최적화</h4>
                    <p className="text-sm text-slate-300">Critical CSS 인라인</p>
                    <p className="text-sm text-slate-300">불필요한 스타일 제거</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-400 mb-2">🔧 번들 최적화</h4>
                    <p className="text-sm text-slate-300">코드 스플리팅</p>
                    <p className="text-sm text-slate-300">Tree shaking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 접근성 가이드 */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">♿ 접근성 체크리스트</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-green-400">✅</span>
                  <span>키보드 내비게이션 지원</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-400">✅</span>
                  <span>스크린 리더 호환성</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-400">✅</span>
                  <span>색상 대비 4.5:1 이상</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-400">✅</span>
                  <span>포커스 표시 명확화</span>
                </div>
              </div>
            </div>

            <div className="bg-green-800 p-4 rounded-lg text-center">
              <p className="font-bold">🎉 축하합니다!</p>
              <p className="text-green-200">반응형 웹 개발 온보딩을 완료했습니다!</p>
            </div>
          </section>
        )}
      </ResponsiveContainer>
    </div>
  );
}
