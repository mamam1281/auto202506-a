'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// 프로젝트 표준 컴포넌트들만 사용
import GameCard from '../components/GameCard';
import Button from '../components/Button';
import QuickStartItem from '../components/QuickStartItem';
import LoadingSpinner from '../components/LoadingSpinner';

// 게임 팝업 유틸리티
import { openGamePopup } from '../utils/gamePopup';

export default function CasinoDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 시뮬레이션: 페이지 로딩
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 게임 데이터 - 팝업으로 열기
  const featuredGames = [
    {
      id: 'cosmic-fortune',
      title: '코스믹 포츈',
      rating: 4.9,
      players: '31K명',
      imagePlaceholder: '🎰',
      onClick: () => openGamePopup('slots')
    },
    {
      id: 'royal-roulette',
      title: 'Royal Roulette',
      rating: 4.7,
      players: '18K명',
      imagePlaceholder: '🎰',
      onClick: () => openGamePopup('roulette')
    },
    {
      id: 'rps-battle',
      title: 'RPS Battle',
      rating: 4.5,
      players: '956명',
      imagePlaceholder: '✂️',
      onClick: () => openGamePopup('rps')
    },
    {
      id: 'lucky-gacha',
      title: 'Lucky Gacha',
      rating: 4.9,
      players: '3.1K명',
      imagePlaceholder: '🎁',
      onClick: () => openGamePopup('gacha')
    }
  ];

  // 빠른 시작 액션들 - 일부 팝업으로 열기
  const quickActions = [
    {
      id: 'game-start',
      label: '게임 시작',
      iconPlaceholder: '🎮',
      iconBgColor: '#5B30F6',
      onClick: () => openGamePopup('slots') // 슬롯 게임 팝업으로 시작
    },
    {
      id: 'deposit',
      label: '입금하기',
      iconPlaceholder: '💰',
      iconBgColor: '#10B981',
      onClick: () => router.push('/wallet')
    },
    {
      id: 'promotion',
      label: '프로모션',
      iconPlaceholder: '🎁',
      iconBgColor: '#F59E0B',
      onClick: () => router.push('/promotions')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: '#1a1a1a' }}>
        <LoadingSpinner size="xl" variant="ring" text="카지노 로딩 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full"
         style={{ 
           backgroundColor: '#1a1a1a',
           color: '#ffffff',
           fontFamily: 'var(--font-primary)',
           overflow: 'hidden' // 가로 스크롤 방지
         }}>

      {/* Main Content - 스크롤 가능한 콘텐츠 */}
      <div className="w-full min-h-full" style={{ backgroundColor: '#1a1a1a' }}> 
        
        <div className="py-2 sm:py-4">
        
        {/* 웰컴 섹션 */}
        <motion.div 
          className="text-center"
          style={{ marginBottom: '10px', marginTop: '10px' }} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-1">
            <span style={{ color: '#5B30F6' }}>환영합니다!</span>
          </h2>
         </motion.div>

        {/* 행동 유도 섹션 - 상단으로 이동 */}
        <motion.section 
          className="text-center py-8"
          style={{ marginBottom: '30px' }} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-3">🎰 게임을 시작하세요!</h3>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full max-w-full overflow-hidden">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openGamePopup('slots')} // 팝업으로 게임 시작
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
              onClick={() => openGamePopup('gacha')} // 가챠 팝업으로 열기
            >
              🎁 보너스 받기
            </Button>
          </div>
        </motion.section>

        {/* 빠른 시작 액션들 - 프로젝트 표준 컴포넌트 사용 */}
        <motion.section
          style={{ marginBottom: '100px' }} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2">⚡ 빠른 시작</h3>
          <div style={{ marginTop: '20px' }}> 
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
          </div>
        </motion.section>

        {/* 인기 게임 섹션 - 프로젝트 표준 GameCard 사용 */}
        <motion.section
          style={{ marginBottom: '40px' }} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">🔥 인기 게임</h3>
            </div>
          
          <div style={{ marginTop: '20px' }}> 
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
          </div>
        </motion.section>
        
        </div>
      </div>
      
    </div>
  );
}
