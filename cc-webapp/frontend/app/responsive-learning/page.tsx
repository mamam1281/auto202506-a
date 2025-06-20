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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-slate-900)' }}>
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
                }`}
                style={{
                  background: currentStage === stage.id 
                    ? 'linear-gradient(45deg, var(--neon-purple-1), var(--neon-purple-3))'
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
              >
                <h3 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--color-purple-400)' }}>
                  ⚡ 프리미엄 반응형 버튼 시스템
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Primary Gradient Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden group"
                    style={{
                      background: 'linear-gradient(45deg, var(--neon-purple-1), var(--neon-purple-3))',
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
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(45deg, var(--color-emerald-500), #059669)',
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
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(45deg, var(--color-amber-500), #d97706)',
                      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    경고 알림
                  </motion.button>

                  {/* Outline Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-purple-300 overflow-hidden"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '2px solid var(--neon-purple-2)',
                      boxShadow: '0 0 15px rgba(123, 41, 205, 0.2)'
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
                  </motion.button>

                  {/* Text Button */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-slate-300 overflow-hidden"
                    style={{ background: 'transparent' }}
                    whileHover={{ 
                      scale: 1.05,
                      color: 'var(--color-purple-400)',
                      background: 'rgba(123, 41, 205, 0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    텍스트 버튼
                  </motion.button>

                  {/* Full Width Responsive */}
                  <motion.button
                    className="relative px-6 py-4 rounded-xl font-bold text-white overflow-hidden sm:col-span-2 lg:col-span-1"
                    style={{
                      background: 'linear-gradient(45deg, var(--color-blue-500), var(--color-purple-500))',
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
