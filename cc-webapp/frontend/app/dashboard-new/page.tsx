'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TokenBalanceWidget from '../../components/ui/data-display/TokenBalanceWidget';
import LoadingSpinner from '../../components/LoadingSpinner';

// 컴포넌트 임포트 (나중에 만들 예정)
// import Header from '../components/ui/layout/Header';
// import GameCard from '../components/ui/game/GameCard';
// import PromotionBanner from '../components/ui/data-display/PromotionBanner';

export default function CasinoDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState(2580);
  const [gems, setGems] = useState(127);
  const [vipPoints, setVipPoints] = useState(15340);

  // 시뮬레이션: 페이지 로딩
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 추천 게임 데이터 (나중에 API에서 가져올 예정)
  const featuredGames = [
    {
      id: 'cosmic-slots',
      title: 'Cosmic Fortune',
      category: 'slots',
      thumbnail: '/api/placeholder/300/200',
      rtp: '96.5%',
      jackpot: '€125,840',
      isHot: true,
      players: 1247
    },
    {
      id: 'royal-roulette',
      title: 'Royal Roulette',
      category: 'table',
      thumbnail: '/api/placeholder/300/200',
      rtp: '97.3%',
      isNew: true,
      players: 856
    },
    {
      id: 'dragon-poker',
      title: 'Dragon Poker',
      category: 'poker',
      thumbnail: '/api/placeholder/300/200',
      rtp: '98.1%',
      players: 432
    },
    {
      id: 'lightning-blackjack',
      title: 'Lightning Blackjack',
      category: 'table',
      thumbnail: '/api/placeholder/300/200',
      rtp: '99.5%',
      isLive: true,
      players: 2341
    }
  ];

  // 최근 플레이한 게임
  const recentGames = [
    { id: 'slots', title: 'Cosmic Slots', lastPlayed: '2시간 전', winnings: '+450' },
    { id: 'rps', title: 'RPS Battle', lastPlayed: '1일 전', winnings: '+120' },
    { id: 'roulette', title: 'French Roulette', lastPlayed: '2일 전', winnings: '-80' }
  ];

  // 프로모션 데이터
  const promotions = [
    {
      id: 1,
      title: '🎯 Welcome Bonus',
      subtitle: '200% 첫 입금 보너스',
      description: '최대 €500까지 + 100회 무료 스핀',
      bgGradient: 'from-purple-600 to-blue-600',
      timeLeft: '23:45:12'
    },
    {
      id: 2,
      title: '💎 VIP Weekend',
      subtitle: 'VIP 전용 토너먼트',
      description: '€10,000 상금 풀 + 럭셔리 상품',
      bgGradient: 'from-amber-500 to-orange-600',
      timeLeft: '2일 15시간'
    },
    {
      id: 3,
      title: '🔥 Hot Streak',
      subtitle: '연승 보너스',
      description: '5연승 달성 시 50% 보너스',
      bgGradient: 'from-red-500 to-pink-600',
      timeLeft: '12:30:45'
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
      
      {/* 임시 헤더 (나중에 컴포넌트로 분리) */}
      <motion.header 
        className="sticky top-0 z-50 border-b"
        style={{ 
          backgroundColor: 'var(--color-background-secondary)',
          borderColor: 'var(--color-border-primary)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span style={{ color: 'var(--color-purple-primary)' }}>Casino</span>
              <span style={{ color: 'var(--color-accent-amber)' }}>Club</span>
            </h1>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => router.push('/games')}
                className="hover:text-purple-400 transition-colors"
              >
                게임
              </button>
              <button 
                onClick={() => router.push('/promotions')}
                className="hover:text-purple-400 transition-colors"
              >
                프로모션
              </button>
              <button 
                onClick={() => router.push('/tournaments')}
                className="hover:text-purple-400 transition-colors"
              >
                토너먼트
              </button>
            </nav>
          </div>
          
          {/* 잔액 위젯들 */}
          <div className="flex items-center gap-4">
            <TokenBalanceWidget
              amount={coins}
              tokenType="coin"
              variant="neon"
              size="sm"
              animated={true}
              onRecharge={() => setCoins(prev => prev + 100)}
            />
            <TokenBalanceWidget
              amount={gems}
              tokenType="gem"
              variant="premium"
              size="sm"
              animated={true}
              onRecharge={() => setGems(prev => prev + 10)}
            />
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--gradient-neon)',
                color: 'var(--color-text-primary)'
              }}
              onClick={() => router.push('/auth')}
            >
              로그인
            </button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        
        {/* 웰컴 섹션 */}
        <motion.div 
          className="text-center mb-12"
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

        {/* 프로모션 배너 섹션 */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">🎁 특별 프로모션</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                className="rounded-xl p-6 relative overflow-hidden cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, var(--color-purple-primary), var(--color-purple-secondary))`,
                  border: '1px solid var(--color-border-subtle)'
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-2">{promo.title}</h4>
                  <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-accent-amber)' }}>
                    {promo.subtitle}
                  </p>
                  <p className="text-sm mb-4 opacity-90">{promo.description}</p>
                  <div className="text-xs opacity-75">⏰ {promo.timeLeft} 남음</div>
                </div>
                
                {/* 글로우 효과 */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'var(--gradient-neon)',
                    filter: 'blur(20px)'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 추천 게임 섹션 */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">🔥 인기 게임</h3>
            <button 
              onClick={() => router.push('/games')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              모든 게임 보기 →
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="rounded-xl overflow-hidden border cursor-pointer group"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border-subtle)'
                }}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => router.push(`/games/${game.id}`)}
              >
                {/* 게임 썸네일 */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ 
                      background: 'var(--gradient-purple-primary)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    🎰
                  </div>
                  
                  {/* 배지들 */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {game.isHot && (
                      <span className="px-2 py-1 text-xs font-bold rounded"
                            style={{ backgroundColor: 'var(--color-accent-amber)', color: 'black' }}>
                        HOT
                      </span>
                    )}
                    {game.isNew && (
                      <span className="px-2 py-1 text-xs font-bold rounded"
                            style={{ backgroundColor: 'var(--color-purple-primary)' }}>
                        NEW
                      </span>
                    )}
                    {game.isLive && (
                      <span className="px-2 py-1 text-xs font-bold rounded bg-red-500">
                        LIVE
                      </span>
                    )}
                  </div>
                  
                  {/* 플레이어 수 */}
                  <div className="absolute bottom-2 right-2 text-xs opacity-75">
                    👥 {game.players}
                  </div>
                </div>
                
                {/* 게임 정보 */}
                <div className="p-4">
                  <h4 className="font-bold mb-2">{game.title}</h4>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>RTP: {game.rtp}</span>
                    {game.jackpot && <span className="text-amber-400">💰 {game.jackpot}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 최근 게임 섹션 */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">⏰ 최근 플레이</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recentGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="p-4 rounded-lg border cursor-pointer hover:border-purple-400 transition-colors"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border-subtle)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push(`/${game.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{game.title}</h4>
                    <p className="text-sm opacity-75">{game.lastPlayed}</p>
                  </div>
                  <div className={`font-bold ${game.winnings.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {game.winnings}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 빠른 액션 버튼들 */}
        <motion.section 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => router.push('/wallet')}
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-purple-primary)',
                color: 'var(--color-text-primary)'
              }}
            >
              💰 입금하기
            </button>
            <button 
              onClick={() => router.push('/games')}
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-accent-amber)',
                color: 'black'
              }}
            >
              🎮 게임 시작
            </button>
            <button 
              onClick={() => router.push('/promotions')}
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                border: '2px solid var(--color-purple-primary)',
                color: 'var(--color-purple-primary)',
                backgroundColor: 'transparent'
              }}
            >
              🎁 보너스 받기
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
