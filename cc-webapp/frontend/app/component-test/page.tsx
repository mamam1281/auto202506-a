'use client';

import React, { useState } from 'react';

export default function ComponentTestPage() {
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [tokenAmount, setTokenAmount] = useState(437874);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto pt-16">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          고급 TSX 컴포넌트 테스트 준비 중
        </h1>

        {/* 토큰 디스플레이 시뮬레이션 */}
        <section className="mb-12">
          <h2 className="text-xl text-white mb-6">토큰 디스플레이 (시뮬레이션)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Critical 상태 시뮬레이션 */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚠️</span>
                </div>
                <div>
                  <p className="text-red-100 text-sm">Available Tokens</p>
                  <p className="text-red-400 text-xs">Critical: Token balance is very low</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2">437.9K</div>
              <div className="text-red-300 text-sm">437,874 tokens</div>
              <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm">
                토큰 상태 변경 시뮬레이션
              </button>
            </div>

            {/* Warning 상태 시뮬레이션 */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚠️</span>
                </div>
                <div>
                  <p className="text-yellow-100 text-sm">Available Tokens</p>
                  <p className="text-yellow-400 text-xs">Warning: Token balance is running low</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">282.8K</div>
              <div className="text-yellow-300 text-sm">282,833 tokens</div>
            </div>

            {/* Success 상태 시뮬레이션 */}
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Available Tokens</p>
                  <p className="text-green-400 text-xs">Healthy: Balance is healthy</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">1.25M</div>
              <div className="text-green-300 text-sm">1,250,000 tokens</div>
            </div>
          </div>
        </section>

        {/* 카드 베이스 시뮬레이션 */}
        <section className="mb-12">
          <h2 className="text-xl text-white mb-6">카드 베이스 (시뮬레이션)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Cosmic 카드 */}
            <div className="relative overflow-hidden rounded-2xl cursor-pointer group bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border border-indigo-400/30 min-h-[320px] h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:scale-102 hover:-translate-y-1">
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-4 h-32 flex-shrink-0">
                  <div className="h-full rounded-xl border-2 border-dashed border-indigo-400/30 flex items-center justify-center">
                    <div className="text-4xl opacity-60 text-indigo-200">⭐</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mb-2 text-white font-semibold text-lg leading-tight">
                    네온 게임 아레나
                  </h3>
                  <p className="text-indigo-200 text-sm leading-relaxed flex-1">
                    최신 게임들을 즐기고 토큰을 획득하세요!
                  </p>
                </div>
              </div>
            </div>

            {/* Gaming 카드 */}
            <div className="relative overflow-hidden rounded-2xl cursor-pointer group bg-gradient-to-br from-purple-900/90 to-pink-900/90 border border-purple-500/30 min-h-[320px] h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:scale-102 hover:-translate-y-1">
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-4 h-32 flex-shrink-0">
                  <div className="h-full rounded-xl border-2 border-dashed border-purple-500/30 flex items-center justify-center">
                    <div className="text-4xl opacity-60 text-purple-200">🎮</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mb-2 text-white font-semibold text-lg leading-tight">
                    프리미엄 리워드
                  </h3>
                  <p className="text-purple-200 text-sm leading-relaxed flex-1">
                    특별한 보상을 받을 수 있는 기회입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Minimal 카드 */}
            <div className="relative overflow-hidden rounded-2xl cursor-pointer group bg-gradient-to-br from-slate-100 to-white border border-slate-200 min-h-[320px] h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:scale-102 hover:-translate-y-1">
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-4 h-32 flex-shrink-0">
                  <div className="h-full rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <div className="text-4xl opacity-60 text-slate-600">⚙️</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mb-2 text-slate-900 font-semibold text-lg leading-tight">
                    계정 설정
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">
                    프로필과 설정을 관리하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 알림 배너 시뮬레이션 */}
        {notificationVisible && (
          <section className="mb-8">
            <div className="fixed top-0 left-0 right-0 z-50">
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-b border-yellow-500/20 backdrop-blur-md shadow-lg shadow-yellow-500/10 w-full px-4 sm:px-6 lg:px-8 py-3 text-base">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-yellow-400">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <p className="text-yellow-100 font-medium leading-relaxed text-base">
                      토큰 잔액이 부족합니다. 충전을 고려해보세요!
                    </p>
                  </div>
                  <button
                    onClick={() => setNotificationVisible(false)}
                    className="flex-shrink-0 ml-4 p-1 rounded-full text-yellow-100 hover:bg-white/10 transition-colors duration-200 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 컨트롤 패널 */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">시뮬레이션 컨트롤</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setNotificationVisible(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              알림 다시 보기
            </button>
            <button
              onClick={() => setTokenAmount(prev => Math.max(0, prev - 50000))}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              토큰 감소 (시뮬레이션)
            </button>
            <button
              onClick={() => setTokenAmount(prev => prev + 100000)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              토큰 증가 (시뮬레이션)
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <p className="text-white text-sm">
              <strong>상태:</strong> 고급 TSX 컴포넌트들이 준비되었습니다.<br/>
              • CardBase.tsx - 완료 ✅<br/>
              • TokenDisplay.tsx - 완료 ✅<br/>
              • NotificationBanner.tsx - 완료 ✅<br/>
              <br/>
              <strong>현재 토큰:</strong> {tokenAmount.toLocaleString()}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
