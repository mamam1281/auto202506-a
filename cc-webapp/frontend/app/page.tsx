'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// 프로젝트 표준 컴포넌트들만 사용
import GameCard from '../components/GameCard';
import Button from '../components/Button';
import QuickStartItem from '../components/QuickStartItem';
import TokenDisplay from '../components/ui/data-display/TokenDisplay';

export default function CleanCasinoDashboard() {
  const router = useRouter();
  const [coins] = useState(2580);
  const [gems] = useState(127);

  // 게임 데이터 - 단순화
  const featuredGames = [
    {
      id: 'cosmic-fortune',
      title: 'Cosmic Fortune',
      rating: 4.8,
      players: '2.3K',
      imagePlaceholder: '🌌',
      onClick: () => router.push('/slots')
    },
    {
      id: 'royal-roulette',
      title: 'Royal Roulette',
      rating: 4.7,
      players: '1.8K',
      imagePlaceholder: '🎰',
      onClick: () => router.push('/roulette')
    },
    {
      id: 'rps-battle',
      title: 'RPS Battle',
      rating: 4.5,
      players: '956',
      imagePlaceholder: '✂️',
      onClick: () => router.push('/rps')
    },
    {
      id: 'lucky-gacha',
      title: 'Lucky Gacha',
      rating: 4.9,
      players: '3.1K',
      imagePlaceholder: '🎁',
      onClick: () => router.push('/gacha')
    }
  ];

  // 빠른 액션들
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

      {/* Main Content Area - 스크롤 가능한 중앙 정렬 */}
      <div className="overflow-y-auto flex justify-center"
           style={{
             gridArea: 'main',
             minHeight: '100%'
           }}>
        
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 웰컴 섹션 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span style={{ color: 'var(--color-purple-primary)' }}>환영합니다!</span>
            </h2>
            <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              최고의 카지노 게임을 즐겨보세요
            </p>
          </div>

          {/* 빠른 시작 */}
          <section className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">⚡ 빠른 시작</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <QuickStartItem
                  key={action.id}
                  id={action.id}
                  label={action.label}
                  iconPlaceholder={action.iconPlaceholder}
                  iconBgColor={action.iconBgColor}
                  onClick={action.onClick}
                />
              ))}
            </div>
          </section>

          {/* 인기 게임 */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold">🔥 인기 게임</h3>
              <Button
                variant="text"
                size="sm"
                onClick={() => router.push('/games')}
              >
                모든 게임 보기 →
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGames.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  rating={game.rating}
                  players={game.players}
                  imagePlaceholder={game.imagePlaceholder}
                  onClick={game.onClick}
                />
              ))}
            </div>
          </section>

          {/* 행동 유도 */}
          <section className="text-center py-8 sm:py-12 mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8">🎰 지금 시작하세요!</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/games')}
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                🎮 게임 플레이
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/wallet')}
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                💰 토큰 충전
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
