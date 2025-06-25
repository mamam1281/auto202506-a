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
      title: 'Cosmic Fortune',
      description: '우주 테마 슬롯',
      image: '🌌',
      category: 'slots',
      onClick: () => router.push('/slots')
    },
    {
      title: 'Royal Roulette',
      description: '클래식 룰렛',
      image: '🎰',
      category: 'table',
      onClick: () => router.push('/roulette')
    },
    {
      title: 'RPS Battle',
      description: '가위바위보 대전',
      image: '✂️',
      category: 'casual',
      onClick: () => router.push('/rps')
    },
    {
      title: 'Lucky Gacha',
      description: '행운의 뽑기',
      image: '🎁',
      category: 'gacha',
      onClick: () => router.push('/gacha')
    }
  ];

  // 빠른 액션들
  const quickActions = [
    {
      title: '게임 시작',
      description: '바로 플레이',
      icon: '🎮',
      variant: 'primary' as const,
      onClick: () => router.push('/games')
    },
    {
      title: '입금하기',
      description: '토큰 충전',
      icon: '💰',
      variant: 'secondary' as const,
      onClick: () => router.push('/wallet')
    },
    {
      title: '프로모션',
      description: '보너스 받기',
      icon: '🎁',
      variant: 'accent' as const,
      onClick: () => router.push('/promotions')
    }
  ];

  return (
    <div className="min-h-screen"
         style={{ 
           backgroundColor: 'var(--color-background-primary)',
           color: 'var(--color-text-primary)',
           fontFamily: 'var(--font-primary)'
         }}>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* 웰컴 섹션 */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: 'var(--color-purple-primary)' }}>환영합니다!</span>
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            최고의 카지노 게임을 즐겨보세요
          </p>
        </div>

        {/* 빠른 시작 */}
        <section>
          <h3 className="text-2xl font-bold mb-6">⚡ 빠른 시작</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <QuickStartItem
                key={action.title}
                title={action.title}
                description={action.description}
                icon={action.icon}
                variant={action.variant}
                onClick={action.onClick}
              />
            ))}
          </div>
        </section>

        {/* 인기 게임 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">🔥 인기 게임</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/games')}
            >
              모든 게임 보기 →
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard
                key={game.title}
                title={game.title}
                description={game.description}
                image={game.image}
                category={game.category}
                onClick={game.onClick}
              />
            ))}
          </div>
        </section>

        {/* 행동 유도 - 세로 간격 대폭 확보 */}
        <section className="text-center py-16 md:py-20 mt-12 md:mt-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">🎰 지금 시작하세요!</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/games')}
              className="text-lg px-8 py-4"
            >
              🎮 게임 플레이
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/wallet')}
              className="text-lg px-8 py-4"
            >
              💰 토큰 충전
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
