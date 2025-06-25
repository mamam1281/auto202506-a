'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// 기존에 만들어둔 컴포넌트들 제대로 활용!
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
      title: 'Cosmic Fortune',
      description: '우주를 테마로 한 슬롯 게임',
      image: '🌌',
      category: 'slots',
      rtp: '96.5%',
      isHot: true,
      onClick: () => router.push('/slots')
    },
    {
      title: 'Royal Roulette',
      description: '클래식 룰렛 게임',
      image: '🎰',
      category: 'table',
      rtp: '97.3%',
      isNew: true,
      onClick: () => router.push('/roulette')
    },
    {
      title: 'RPS Battle',
      description: '가위바위보 대전',
      image: '✂️',
      category: 'casual',
      rtp: '98.0%',
      onClick: () => router.push('/rps')
    },
    {
      title: 'Lucky Gacha',
      description: '행운의 뽑기 게임',
      image: '🎁',
      category: 'gacha',
      rtp: '95.8%',
      onClick: () => router.push('/gacha')
    }
  ];

  // 빠른 시작 액션들
  const quickActions = [
    {
      title: '게임 시작',
      description: '인기 게임 바로 플레이',
      icon: '🎮',
      variant: 'primary' as const,
      onClick: () => router.push('/games')
    },
    {
      title: '입금하기',
      description: '토큰 충전하여 게임 즐기기',
      icon: '💰',
      variant: 'secondary' as const,
      onClick: () => router.push('/wallet')
    },
    {
      title: '프로모션',
      description: '특별 보너스 받기',
      icon: '🎁',
      variant: 'accent' as const,
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
    <div className="min-h-screen"
         style={{ 
           backgroundColor: 'var(--color-background-primary)',
           color: 'var(--color-text-primary)',
           fontFamily: 'var(--font-primary)'
         }}>
      
      {/* 헤더 */}
      <motion.header 
        className="sticky top-0 z-50 border-b px-4 py-4"
        style={{ 
          backgroundColor: 'var(--color-background-secondary)',
          borderColor: 'var(--color-border-primary)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span style={{ color: 'var(--color-purple-primary)' }}>Casino</span>
              <span style={{ color: 'var(--color-accent-amber)' }}>Club</span>
            </h1>
          </div>
          
          {/* 토큰 디스플레이들 */}
          <div className="flex items-center gap-4">
            <TokenDisplay
              amount={coins}
              tokenType="coin"
              size="sm"
              variant="neon"
              showLabel={true}
            />
            <TokenDisplay
              amount={gems}
              tokenType="gem"
              size="sm"
              variant="premium"
              showLabel={true}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/auth')}
            >
              로그인
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* 웰컴 섹션 */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span style={{ color: 'var(--color-purple-primary)' }}>환영합니다!</span>
          </h2>
          <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
            최고의 카지노 게임과 흥미진진한 보너스를 즐겨보세요
          </p>
        </motion.div>

        {/* 빠른 시작 액션들 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">⚡ 빠른 시작</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <QuickStartItem
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  variant={action.variant}
                  onClick={action.onClick}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 인기 게임 섹션 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
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
            {featuredGames.map((game, index) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GameCard
                  title={game.title}
                  description={game.description}
                  image={game.image}
                  category={game.category}
                  onClick={game.onClick}
                  isHot={game.isHot}
                  isNew={game.isNew}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 최근 활동 섹션 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">⏰ 최근 활동</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { game: 'Cosmic Slots', time: '2시간 전', result: '+450 코인' },
              { game: 'RPS Battle', time: '1일 전', result: '+120 코인' },
              { game: 'Royal Roulette', time: '2일 전', result: '-80 코인' }
            ].map((activity, index) => (
              <motion.div
                key={activity.game}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border-subtle)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{activity.game}</h4>
                    <p className="text-sm opacity-75">{activity.time}</p>
                  </div>
                  <div className={`font-bold ${activity.result.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {activity.result}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 행동 유도 섹션 */}
        <motion.section 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-6">🎰 게임을 시작하세요!</h3>
          <div className="flex flex-wrap justify-center gap-4">
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
      </div>
    </div>
  );
}
