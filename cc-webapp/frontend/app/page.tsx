'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/data-display/Card';
import Input from '../components/ui/basic/Input';
import Button from '../components/ui/basic/Button';
import TokenBalanceWidget from '../components/ui/TokenBalanceWidget';

export default function HomePage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [coins, setCoins] = useState(1250);
  const [gems, setGems] = useState(45);
  const [xp, setXp] = useState(8750);

  const gameCards = [
    {
      title: '🎰 Cosmic Slots',
      description: 'Spin the cosmic reels and align celestial symbols for magnificent rewards',
      href: '/slots',
      variant: 'neon',
      neonEffect: true
    },
    {
      title: '✂️ RPS Battle Arena',
      description: 'Challenge opponents in the ultimate rock-paper-scissors showdown',
      href: '/rps',
      variant: 'game',
      glassMorphism: true
    },
    {
      title: '🎁 Gacha Universe',
      description: 'Collect rare characters and items from mysterious gacha capsules',
      href: '/gacha',
      variant: 'premium',
      gradientBg: true
    },
    {
      title: '🧠 Quiz Master',
      description: 'Test your knowledge across various topics and earn rewards',
      href: '/quiz',
      variant: 'glass',
      glassMorphism: true
    },
    {
      title: '🎯 Mission Control',
      description: 'Complete daily missions and unlock exclusive achievements',
      href: '/responsive-learning',
      variant: 'gradient',
      neonEffect: true
    },
    {
      title: '👑 Premium Lounge',
      description: 'Access exclusive content and premium gaming experiences',
      href: '/adult_content',
      variant: 'hero',
      gradientBg: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <motion.div 
        className="relative z-10 container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 헤더 섹션 */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            CC Webapp
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Experience next-generation gaming with emotion-driven interactions and premium rewards
          </motion.p>
        </motion.div>

        {/* 토큰 잔액 섹션 */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >          <TokenBalanceWidget
            amount={coins}
            tokenType="coin"
            variant="neon"
            size="lg"
            animated={true}
            onRecharge={() => setCoins(prev => prev + 100)}
          />
          <TokenBalanceWidget
            amount={gems}
            tokenType="gem"
            variant="premium"
            size="lg"
            animated={true}
            onRecharge={() => setGems(prev => prev + 10)}
          />
          <TokenBalanceWidget
            amount={xp}
            tokenType="xp"
            variant="gaming"
            size="lg"
            animated={true}
          />
        </motion.div>

        {/* 검색 섹션 */}
        <motion.div 
          className="max-w-2xl mx-auto mb-16"
          variants={itemVariants}
        >
          <Input
            variant="neon"
            size="lg"
            label="게임 검색"
            placeholder="원하는 게임을 찾아보세요..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            neonEffect={true}
            glassMorphism={true}
            animatedPlaceholder={true}
          />
        </motion.div>

        {/* 게임 카드 그리드 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={itemVariants}
        >
          {gameCards.map((game, index) => (
            <motion.div
              key={game.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                variant={game.variant as any}
                size="lg"
                clickable={true}
                animated={true}
                neonEffect={game.neonEffect}
                glassMorphism={game.glassMorphism}
                gradientBg={game.gradientBg}
                onClick={() => router.push(game.href)}
                className="h-full"
              >
                <CardHeader>
                  <CardTitle className="text-white text-xl font-bold mb-2">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {game.description}
                  </p>
                  <Button
                    variant={game.variant === 'neon' ? 'neon' : game.variant === 'premium' ? 'premium' : 'primary'}
                    size="md"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(game.href);
                    }}
                  >
                    플레이 하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* 프로모션 섹션 */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          variants={itemVariants}
        >
          <Card
            variant="hero"
            size="2xl"
            animated={true}
            gradientBg={true}
            neonEffect={true}
            className="text-center"
          >
            <CardContent className="py-12">
              <motion.h2 
                className="text-4xl font-bold text-white mb-6"
                whileHover={{ scale: 1.05 }}
              >
                🚀 특별 이벤트 진행 중!
              </motion.h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                지금 가입하고 무료 코인 1000개와 프리미엄 젬 50개를 받아보세요!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="neon"
                  size="lg"
                  className="px-8"
                  onClick={() => router.push('/profile')}
                >
                  무료 보상 받기
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 border-white/30 text-white hover:bg-white/10"
                  onClick={() => router.push('/component-test')}
                >
                  컴포넌트 테스트
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 푸터 */}
        <motion.footer 
          className="text-center text-gray-400"
          variants={itemVariants}
        >
          <p className="text-sm">
            © 2025 CC Webapp. Powered by Next.js & Framer Motion.
          </p>
          <p className="text-xs mt-2">
            🎮 Premium Gaming Experience • 🎨 Figma-Level UI Design • ⚡ Lightning Fast Performance
          </p>
        </motion.footer>
      </motion.div>    </div>
  );
}
