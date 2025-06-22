'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardBase } from './components/CardBase';
import { CardGame } from './components/CardGame';

export default function App() {
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <motion.div 
          className="text-white text-lg"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const gameCards = [
    {
      id: 1,
      gameType: 'roulette' as const,
      title: '네온 룰렛',
      description: '네온 코스모스에서 보라색 운명의 바퀴를 돌리세요',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      isNew: true,
      badge: 'HOT'
    },
    {
      id: 2,
      gameType: 'slots' as const,
      title: '사이버 슬롯',
      description: '전기 보라색 에너지를 가진 디지털 슬롯',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c15a?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      gameType: 'rps' as const,
      title: '퀀텀 배틀',
      description: '보라색 차원에서의 가위바위보',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      gameType: 'gacha' as const,
      title: '미스틱 가챠',
      description: '공허에서 희귀한 보라색 아티팩트를 수집하세요',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
      badge: 'Limited'
    }
  ];

  const handlePlayGame = (gameType: string) => {
    console.log(`${gameType} 게임을 시작합니다!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] p-4 relative overflow-hidden">
      {/* 배경 파티클 애니메이션 - 개수와 밝기 감소 */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-[#7b29cd] rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * 80 - 40, 0],
              y: [0, Math.random() * -150 - 50, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 0.8, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 10}%`,
              filter: 'drop-shadow(0 0 2px #7b29cd)'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 헤더 - 밝기 조정 */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{
              background: 'linear-gradient(45deg, #7b29cd, #870dd1, #5b30f6, #8054f2)',
              backgroundSize: '200% 200%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 15px rgba(123, 41, 205, 0.3)'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            NEON COSMIC DASHBOARD
          </motion.h1>
          <motion.p 
            className="text-[#D1D5DB] text-base sm:text-lg max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            보라색 네온 카드 시스템으로 우주를 탐험하세요
          </motion.p>
          
          {/* 네온 액센트 라인 - 효과 약화 */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#7b29cd] to-[#8054f2] mx-auto mt-6 rounded-full"
            animate={{
              boxShadow: [
                '0 0 5px rgba(123, 41, 205, 0.4)',
                '0 0 10px rgba(123, 41, 205, 0.6)',
                '0 0 5px rgba(123, 41, 205, 0.4)'
              ],
              width: ['6rem', '7rem', '6rem']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* 기본 카드 섹션 */}
        <motion.section 
          className="mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 px-2"
            variants={itemVariants}
            style={{
              textShadow: '0 0 8px rgba(123, 41, 205, 0.3)'
            }}
          >
            코스믹 허브
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <CardBase
                title="네온 포털"
                description="보라색 차원으로 들어가 코스믹 게임 에너지의 비밀을 발견하세요."
                image="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
                onClick={() => console.log('네온 포털 열림!')}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardBase
                title="사이버 커뮤니티"
                description="보라색 네트워크에서 동료 우주 여행자들과 연결하세요."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardBase
                title="퀀텀 설정"
                description="네온 경험과 보라색 에너지 설정을 커스터마이즈하세요."
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* 게임 카드 섹션 */}
        <motion.section 
          className="mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 px-2"
            variants={itemVariants}
            style={{
              textShadow: '0 0 8px rgba(135, 13, 209, 0.3)'
            }}
          >
            네온 게임 아레나
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
          >
            {gameCards.map((game, index) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                custom={index}
              >
                <CardGame
                  title={game.title}
                  description={game.description}
                  image={game.image}
                  gameType={game.gameType}
                  isNew={game.isNew}
                  badge={game.badge}
                  onPlay={() => handlePlayGame(game.gameType)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* 미션 섹션 - 효과 약화 */}
        <motion.section 
          className="mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 px-2"
            variants={itemVariants}
            style={{
              textShadow: '0 0 8px rgba(91, 48, 246, 0.3)'
            }}
          >
            코스믹 미션
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
          >
            {[
              { progress: 60, color: '#7b29cd', title: '퍼플 챔피언', description: '5게임을 승리해서 보라색 크라운 업적을 잠금해제하세요' },
              { progress: 90, color: '#870dd1', title: '네온 스트릭', description: '보라색 영역에서 10게임 연승 유지하기' },
              { progress: 100, color: '#8054f2', title: '차원 탐험가', description: '모든 보라색 게임 모드를 최소 한 번씩 경험하기', completed: true }
            ].map((mission, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border rounded-2xl p-6 relative overflow-hidden min-h-[280px] flex flex-col"
                style={{ borderColor: `${mission.color}20` }}
                whileHover={{ 
                  scale: 1.01,
                  y: -2,
                  boxShadow: `0 5px 15px ${mission.color}20`
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${mission.color}30, transparent 70%)`
                  }}
                  animate={{
                    opacity: [0.03, 0.08, 0.03]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{ 
                        backgroundColor: `${mission.color}15`,
                        borderColor: `${mission.color}30`
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 3px ${mission.color}40`,
                          `0 0 8px ${mission.color}50`,
                          `0 0 3px ${mission.color}40`
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {mission.completed ? '🏆' : '🎯'}
                    </motion.div>
                    <span className="text-xs uppercase text-[#D1D5DB]">
                      {mission.completed ? 'COMPLETE' : 'MISSION'}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2 text-lg">{mission.title}</h3>
                  <p className="text-[#D1D5DB] text-sm mb-4 flex-1">{mission.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#D1D5DB]">진행률</span>
                      <span style={{ color: mission.color }}>{mission.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#333333] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          background: `linear-gradient(90deg, ${mission.color}, ${mission.color}dd)`,
                          boxShadow: `0 0 5px ${mission.color}40`
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${mission.progress}%` }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      mission.completed
                        ? `bg-gradient-to-r from-[${mission.color}] to-[${mission.color}dd] text-white`
                        : `bg-[#333333] text-white border border-[${mission.color}30] hover:bg-[${mission.color}]/10`
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {mission.completed ? '완료됨' : '시작하기'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* 푸터 - 효과 약화 */}
        <motion.footer 
          className="text-center py-6 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.p 
            className="text-[#D1D5DB] text-sm sm:text-base"
            style={{
              textShadow: '0 0 5px rgba(123, 41, 205, 0.2)'
            }}
          >
            네온 코스믹 카드 • 보라색 에너지와 프레이머 모션으로 구동
          </motion.p>
          
          <motion.div
            className="w-16 h-0.5 bg-gradient-to-r from-[#7b29cd] to-[#8054f2] mx-auto mt-4 rounded-full"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              boxShadow: [
                '0 0 3px rgba(123, 41, 205, 0.4)',
                '0 0 8px rgba(123, 41, 205, 0.6)',
                '0 0 3px rgba(123, 41, 205, 0.4)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.footer>
      </div>
    </div>
  );
}