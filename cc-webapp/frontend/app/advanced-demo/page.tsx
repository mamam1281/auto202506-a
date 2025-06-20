'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CardBase, 
  TokenDisplay, 
  NotificationBanner 
} from '../../components/ui';

export default function AdvancedComponentsDemo() {
  const [tokenAmount, setTokenAmount] = useState(437900);
  const [previousAmount, setPreviousAmount] = useState(500000);
  const [showNotification, setShowNotification] = useState(true);

  const handleTokenChange = (newAmount: number) => {
    setPreviousAmount(tokenAmount);
    setTokenAmount(newAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      {/* 알림 배너 */}
      <NotificationBanner
        message="새로운 고급 TSX 컴포넌트가 구현되었습니다!"
        type="success"
        visible={showNotification}
        onClose={() => setShowNotification(false)}
        position="top"
        size="md"
        autoClose={5000}
      />

      <div className="container mx-auto max-w-6xl pt-20 space-y-8">
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🚀 고급 TSX 컴포넌트 데모
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            통합_반응형_가이드.md 기반으로 구현된 프리미엄 컴포넌트들
          </motion.p>
        </div>

        {/* 토큰 디스플레이 섹션 */}
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">💰 토큰 디스플레이 (상태별)</h2>
          
          {/* 토큰 양 변경 버튼들 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleTokenChange(150000)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Critical (150K)
            </button>
            <button
              onClick={() => handleTokenChange(350000)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
            >
              Warning (350K)
            </button>
            <button
              onClick={() => handleTokenChange(750000)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              Healthy (750K)
            </button>
          </div>

          {/* 위젯 모드 (메인 디스플레이) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TokenDisplay
              amount={tokenAmount}
              previousAmount={previousAmount}
              variant="auto"
              mode="widget"
              size="md"
              animated={true}
              showIcon={true}
              showChange={true}
              showStatus={true}
              showProgress={true}
              glow={true}
              title="Token Balance"
              description="Available Tokens"
              actionButton={{
                text: "토큰 상태 보고서 시작레이어",
                onClick: () => alert('토큰 관리 페이지로 이동!')
              }}
            />

            <TokenDisplay
              amount={tokenAmount}
              change={-45000}
              variant="auto"
              mode="card"
              size="lg"
              animated={true}
              showIcon={true}
              showChange={true}
              showStatus={true}
              glow={true}
            />

            <div className="space-y-3">
              <TokenDisplay
                amount={tokenAmount}
                variant="auto"
                mode="compact"
                size="sm"
                animated={true}
                showIcon={true}
                glow={true}
              />
              <TokenDisplay
                amount={tokenAmount}
                change={12000}
                variant="auto"
                mode="compact"
                size="md"
                animated={true}
                showIcon={true}
                showChange={true}
                glow={true}
              />
              <TokenDisplay
                amount={tokenAmount}
                variant="cosmic"
                mode="compact"
                size="lg"
                animated={true}
                showIcon={true}
                glow={true}
              />
            </div>
          </div>
        </motion.section>

        {/* 카드베이스 섹션 */}
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">🎴 고급 카드 베이스</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardBase
              title="기본 코스믹 카드"
              description="다크 테마와 네온 효과가 적용된 기본 카드입니다. 호버 시 3D 효과가 나타납니다."
              variant="cosmic"
              size="md"
              glow={true}
              hover={true}
              onClick={() => alert('코스믹 카드 클릭!')}
            />

            <CardBase
              title="게이밍 카드"
              description="게임 전용 디자인으로 제작된 카드입니다."
              image="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop"
              variant="gaming"
              size="lg"
              glow={true}
              hover={true}
              onClick={() => alert('게이밍 카드 클릭!')}
            />

            <CardBase
              title="미니멀 카드"
              description="깔끔하고 심플한 라이트 테마 카드입니다."
              variant="minimal"
              size="sm"
              glow={false}
              hover={true}
              onClick={() => alert('미니멀 카드 클릭!')}
            >
              <div className="mt-3 p-2 bg-gray-100 rounded text-gray-800 text-sm">
                커스텀 컨텐츠 영역
              </div>
            </CardBase>
          </div>
        </motion.section>

        {/* 알림 배너 테스트 섹션 */}
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">🔔 알림 배너 테스트</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowNotification(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              정보 알림
            </button>
            <button
              onClick={() => {
                setShowNotification(false);
                setTimeout(() => setShowNotification(true), 100);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              성공 알림
            </button>
            <button
              onClick={() => {
                // 동적으로 경고 알림 생성 로직
                alert('경고 알림 (임시)');
              }}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
            >
              경고 알림
            </button>
            <button
              onClick={() => {
                // 동적으로 에러 알림 생성 로직
                alert('에러 알림 (임시)');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              에러 알림
            </button>
          </div>
        </motion.section>

        {/* 반응형 테스트 정보 */}
        <motion.section 
          className="bg-gray-800/50 rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold text-white">📱 반응형 테스트 가이드</h3>
          <div className="text-gray-300 space-y-2">
            <p>• <strong>모바일 (0-639px):</strong> 1열 그리드, 작은 패딩, 컴팩트 텍스트</p>
            <p>• <strong>태블릿 (640-1023px):</strong> 2열 그리드, 중간 패딩, 표준 텍스트</p>
            <p>• <strong>데스크톱 (1024px+):</strong> 3-4열 그리드, 큰 패딩, 큰 텍스트</p>
            <p>• <strong>터치 최적화:</strong> 44px 최소 터치 타겟, 호버 효과 조절</p>
            <p>• <strong>접근성:</strong> 키보드 네비게이션, 스크린 리더 지원, 고대비 색상</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
