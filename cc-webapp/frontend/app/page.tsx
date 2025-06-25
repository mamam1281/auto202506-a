'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import QuickStartItem from '../components/QuickStartItem';
import GameCard from '../components/GameCard';
import Button from '../components/Button';

export default function CleanCasinoDashboard() {
  const router = useRouter();

  const quickActions = [
    {
      id: 'game-start',
      label: '게임 시작',
      iconPlaceholder: '🎮',
      iconBgColor: 'var(--color-purple-primary)',
      onClick: () => console.log('게임 시작')
    },
    {
      id: 'deposit',
      label: '입금하기',
      iconPlaceholder: '💰',
      iconBgColor: 'var(--color-green-primary)',
      onClick: () => console.log('입금하기')
    },
    {
      id: 'promotion',
      label: '프로모션',
      iconPlaceholder: '🎁',
      iconBgColor: 'var(--color-amber-primary)',
      onClick: () => console.log('프로모션')
    }
  ];

  const featuredGames = [
    {
      id: 'cosmic-fortune',
      title: 'Cosmic Fortune',
      rating: 4.8,
      players: '23K명',
      imagePlaceholder: '🚀',
      category: 'cosmic',
      onClick: () => console.log('Cosmic Fortune')
    },
    {
      id: 'royal-roulette',
      title: 'Royal Roulette',
      rating: 4.7,
      players: '18K명',
      imagePlaceholder: '🎰',
      category: 'casino',
      onClick: () => router.push('/roulette')
    },
    {
      id: 'rps-battle',
      title: 'RPS Battle',
      rating: 4.5,
      players: '956명',
      imagePlaceholder: '✂️',
      category: 'battle',
      onClick: () => console.log('RPS Battle')
    },
    {
      id: 'lucky-gacha',
      title: 'Lucky Gacha',
      rating: 4.9,
      players: '3.1K명',
      imagePlaceholder: '🎁',
      category: 'gacha',
      onClick: () => console.log('Lucky Gacha')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col"
         style={{ 
           backgroundColor: 'var(--color-background-primary)',
           color: 'var(--color-text-primary)',
           fontFamily: 'var(--font-primary)'
         }}>

      {/* Main Content - 스크롤 가능 영역 */}
      <main className="flex-1 overflow-y-auto" 
            style={{ 
              paddingTop: 'calc(var(--app-header-height-mobile) + 1rem)',
              paddingBottom: 'calc(var(--bottom-nav-height) + 1.5rem)'
            }}>
        
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-6xl space-y-8 sm:space-y-10 lg:space-y-12">
          
          {/* 웰컴 섹션 - 중앙 정렬 강화 */}
          <div className="text-center px-4 py-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 break-words leading-tight">
              <span style={{ color: 'var(--color-purple-primary)' }}>환영합니다!</span>
            </h2>
          </div>

          {/* 빠른 시작 */}
          <section>
            <h3 className="text-xl sm:text-2xl font-bold mb-6">⚡ 빠른 시작</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold">🔥 인기 게임</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

          {/* 행동 유도 - 반응형 간격 적용 */}
          <section className="text-center py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16 lg:mb-8 w-full flex flex-col items-center justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 lg:mb-10 px-4 break-words leading-tight text-center">
              🎮 지금 시작하세요!
            </h3>
            <div className="w-full flex flex-col sm:flex-row px-4 gap-[10px] sm:gap-[15px] lg:gap-[20px]" 
                 style={{ 
                   display: 'flex !important', 
                   justifyContent: 'center !important', 
                   alignItems: 'center !important',
                   maxWidth: '32rem',
                   margin: '0 auto'
                 }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => console.log('게임 플레이')}
                className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] py-3 sm:py-4 text-base sm:text-lg"
              >
                🎮 게임 플레이
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={() => console.log('토큰 충전')}
                className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] py-3 sm:py-4 text-base sm:text-lg"
              >
                💰 토큰 충전
              </Button>
            </div>
          </section>
          
        </div>
      </main>

      <style jsx>{`
        /* 모바일: 반응형, 데스크탑: 고정 크기 + 중앙 정렬 */
        body {
          overflow-x: hidden;
        }
        
        .container {
          margin-left: auto;
          margin-right: auto;
        }
        
        /* 반응형 패딩 조정 */
        @media (min-width: 768px) {
          main {
            padding-top: calc(var(--app-header-height-desktop) + 1.5rem);
            padding-bottom: calc(var(--bottom-nav-height) + 2rem);
          }
        }
        
        @media (min-width: 1024px) {
          main {
            padding-top: calc(var(--app-header-height-desktop) + 2rem);
            padding-bottom: calc(var(--bottom-nav-height) + 2.5rem);
          }
        }
        
        /* 데스크탑에서만 고정 크기 + 중앙 정렬 */
        @media (min-width: 1200px) {
          body {
            width: 1200px;
            margin: 0 auto;
            background: var(--color-background-primary);
          }
          
          .container {
            width: 1200px !important;
            max-width: none !important;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* 모든 화면에서 버튼 중앙 정렬 강화 */
        .button-container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
        }
        
        /* 섹션 자체도 중앙 정렬 */
        section {
          text-align: center !important;
        }
        
        /* 모든 div에 중앙 정렬 강제 적용 */
        section div {
          justify-content: center !important;
          align-items: center !important;
        }
      `}</style>
    </div>
  );
}
