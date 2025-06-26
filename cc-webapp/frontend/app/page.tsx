'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// 프로젝트 표준 컴포넌트들만 사용
import GameCard from '../components/GameCard';
import Button from '../components/Button';
import QuickStartItem from '../components/QuickStartItem';
import TokenDisplay from '../components/ui/data-display/TokenDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CasinoDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState(2580);
  const [gems, setGems] = useState(127);

  // 시뮬레이션: 페이지 로딩
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 게임 데이터
  const featuredGames = [
    {
      id: 'cosmic-fortune',
      title: '코스믹 포츈',
      rating: 4.9,
      players: '31K명',
      imagePlaceholder: '�',
      onClick: () => router.push('/games/slots')
    },
    {
      id: 'royal-roulette',
      title: 'Royal Roulette',
      rating: 4.7,
      players: '18K명',
      imagePlaceholder: '🎰',
      onClick: () => router.push('/roulette')
    },
    {
      id: 'rps-battle',
      title: 'RPS Battle',
      rating: 4.5,
      players: '956명',
      imagePlaceholder: '✂️',
      onClick: () => router.push('/games/rps')
    },
    {
      id: 'lucky-gacha',
      title: 'Lucky Gacha',
      rating: 4.9,
      players: '3.1K명',
      imagePlaceholder: '🎁',
      onClick: () => router.push('/gacha')
    }
  ];

  // 빠른 시작 액션들
  const quickActions = [
    {
      id: 'game-start',
      label: '게임 시작',
      iconPlaceholder: '🎮',
      iconBgColor: 'var(--color-purple-primary)',
      onClick: () => router.push('/games')
    },
    {
      id: 'deposit',
      label: '입금하기',
      iconPlaceholder: '💰',
      iconBgColor: 'var(--color-green-primary)',
      onClick: () => router.push('/wallet')
    },
    {
      id: 'promotion',
      label: '프로모션',
      iconPlaceholder: '🎁',
      iconBgColor: 'var(--color-amber-primary)',
      onClick: () => router.push('/promotions')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: 'var(--color-background-primary)' }}>
        <LoadingSpinner size="xl" variant="ring" text="카지노 로딩 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full"
         style={{ 
           backgroundColor: 'var(--color-background-primary)',
           color: 'var(--color-text-primary)',
           fontFamily: 'var(--font-primary)',
           overflow: 'hidden' // 가로 스크롤 방지
         }}>

      {/* Main Content - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        
        <div className="w-full max-w-full px-4 py-6 sm:py-8 lg:py-12">
        
        {/* 웰컴 섹션 */}
        <motion.div 
          className="text-center"
          style={{ marginBottom: '40px', marginTop: '10px' }} // 타이틀을 위로, 작은 마진
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <div className="py-1"></div>
            <span style={{ color: 'var(--color-purple-primary)' }}>환영합니다!</span>
          </h2>
         </motion.div>

        {/* 행동 유도 섹션 - 상단으로 이동 */}
        <motion.section 
          className="text-center py-8"
          style={{ marginBottom: '60px' }} // 중간 마진
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-6">🎰 게임을 시작하세요!</h3>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full max-w-full overflow-hidden">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/games')}
            >
              🎮 게임 플레이
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/wallet')}
            >
              💰 토큰 충전
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={() => router.push('/promotions')}
            >
              🎁 보너스 받기
            </Button>
          </div>
        </motion.section>

        {/* 빠른 시작 액션들 - 프로젝트 표준 컴포넌트 사용 */}
        <motion.section
          style={{ marginBottom: '100px' }} // 인기게임과 100픽셀 간격
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6">⚡ 빠른 시작</h3>
          <div style={{ marginTop: '20px' }}> {/* 타이틀과 카드 사이 간격 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-full overflow-hidden">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                className="w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <QuickStartItem
                  id={action.id}
                  label={action.label}
                  iconPlaceholder={action.iconPlaceholder}
                  iconBgColor={action.iconBgColor}
                  onClick={action.onClick}
                />
              </motion.div>
            ))}
          </div>
          </div> {/* 타이틀과 카드 사이 간격 컨테이너 닫기 */}
        </motion.section>

        {/* 인기 게임 섹션 - 프로젝트 표준 GameCard 사용 */}
        <motion.section
          style={{ marginBottom: '100px' }} // 마지막 섹션은 더 큰 마진 (바텀 네비 고려)
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">🔥 인기 게임</h3>
            </div>
          
          <div style={{ marginTop: '20px' }}> {/* 타이틀과 카드 사이 간격 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-full overflow-hidden">
            {featuredGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GameCard
                  id={game.id}
                  title={game.title}
                  rating={game.rating}
                  players={game.players}
                  imagePlaceholder={game.imagePlaceholder}
                  onClick={game.onClick}
                />
              </motion.div>
            ))}
          </div>
          </div> {/* 타이틀과 카드 사이 간격 컨테이너 닫기 */}
        </motion.section>
        
        </div>
      </div>
      
    </div>
  );
}
