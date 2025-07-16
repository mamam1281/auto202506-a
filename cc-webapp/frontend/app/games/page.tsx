'use client';

import './games.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  Zap, 
  TrendingUp, 
  Dice1, 
  Target, 
  Sparkles,
  Trophy,
  Coins,
  Play,
  ArrowLeft,
  Crown,
  Flame
} from 'lucide-react';

type GameType = 'home' | 'slots' | 'roulette' | 'rps' | 'gacha';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gameType: GameType;
  accent: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  minBet: number;
  maxWin: number;
  isNew?: boolean;
  isHot?: boolean;
}

function GameCard({ 
  title, 
  description, 
  icon, 
  gameType, 
  accent, 
  difficulty, 
  minBet, 
  maxWin, 
  isNew, 
  isHot
}: GameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // 실제 게임 페이지로 라우팅
    switch (gameType) {
      case 'slots':
        router.push('/games/slots/popup');
        break;
      case 'roulette':
        router.push('/games/roulette/popup');
        break;
      case 'rps':
        // RPS 게임은 별도 컴포넌트 경로로
        router.push('/games/rps');
        break;
      case 'gacha':
        router.push('/games/gacha/popup');
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* 프로페셔널 게임 카드 디자인 */}
      <div className="relative h-[180px] backdrop-blur-xl rounded-xl overflow-hidden
                      transition-all duration-500 flex group"
           style={{
             background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
             border: '1px solid rgba(255,255,255,0.12)',
             boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
           }}>
        
        {/* 고급 글로우 효과 */}
        <div className="absolute inset-[1px] rounded-xl pointer-events-none"
             style={{
               background: 'linear-gradient(145deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
               border: '1px solid rgba(255,255,255,0.08)'
             }}></div>

        {/* 왼쪽: 아이콘 영역 */}
        <div className="flex items-center justify-center w-24 p-4">
          <motion.div 
            className="w-16 h-16 rounded-lg flex items-center justify-center
                      group-hover:scale-110 transition-all duration-500"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-2xl">
              {icon}
            </div>
          </motion.div>
        </div>

        {/* 오른쪽: 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col justify-between p-4 pl-0">
          {/* 상단: 제목과 태그 */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white leading-tight mb-1"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.02em'
                  }}>
                {title}
              </h3>
              
              {/* 난이도 태그 */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {difficulty}
                </span>
                {isNew && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    NEW
                  </span>
                )}
                {isHot && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    HOT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 중간: 게임 정보 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{minBet}💎</span>
                <span className="text-gray-400">min</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-orange-400" />
                <span className="text-white font-medium">{maxWin.toLocaleString()}</span>
                <span className="text-gray-400">max</span>
              </div>
            </div>
          </div>

          {/* 하단: 플레이 버튼 */}
          <motion.button
            className="w-full py-2.5 px-4 rounded-lg 
                       bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500
                       border border-slate-500/50 hover:border-slate-400/60
                       transition-all duration-300 
                       flex items-center justify-center gap-2 
                       text-white font-semibold text-sm
                       shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4" />
            <span>PLAY NOW</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function HomePage() {
  const games: GameCardProps[] = [
    {
      title: "코스믹 포츈",
      description: "우주 슬롯머신의 짜릿한 재미",
      icon: <Sparkles className="w-5 h-5 text-purple-400 drop-shadow-lg" />,
      gameType: "slots",
      accent: "purple-400",
      difficulty: "Easy",
      minBet: 10,
      maxWin: 100000,
      isNew: true,
      isHot: true
    },
    {
      title: "갤럭시 룰렛",
      description: "운명의 숫자를 맞춰보세요",
      icon: <Target className="w-5 h-5 text-blue-400 drop-shadow-lg" />,
      gameType: "roulette",
      accent: "blue-400",
      difficulty: "Medium",
      minBet: 50,
      maxWin: 350000,
      isHot: true
    },
    {
      title: "코스믹 배틀",
      description: "가위바위보 우주 대결",
      icon: <Dice1 className="w-5 h-5 text-emerald-400 drop-shadow-lg" />,
      gameType: "rps",
      accent: "emerald-400",
      difficulty: "Easy",
      minBet: 20,
      maxWin: 80000
    },
    {
      title: "스텔라 가챠",
      description: "신비로운 우주 아이템 수집",
      icon: <Star className="w-5 h-5 text-orange-400 drop-shadow-lg" />,
      gameType: "gacha",
      accent: "orange-400",
      difficulty: "Hard",
      minBet: 100,
      maxWin: 1000000,
      isNew: true
    }
  ];

  return (
    <div className="game-dashboard w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    relative overflow-hidden">
      
      {/* 부드러운 배경 효과 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-500/20 rounded-full 
                        mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/20 rounded-full 
                        mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-24 h-24 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl 
                        animate-pulse animation-delay-2000"></div>
      </div>

      {/* 부드러운 별빛 효과 */}
      <div className="absolute inset-0 opacity-40">
        {[
          { left: 15, top: 20, delay: 0.5, duration: 3.2 },
          { left: 85, top: 35, delay: 1.2, duration: 4.1 },
          { left: 45, top: 15, delay: 2.0, duration: 3.8 },
          { left: 25, top: 70, delay: 0.8, duration: 3.5 },
          { left: 75, top: 60, delay: 1.8, duration: 4.2 },
          { left: 35, top: 85, delay: 1.0, duration: 3.7 },
          { left: 90, top: 25, delay: 2.5, duration: 3.3 },
          { left: 10, top: 50, delay: 0.3, duration: 4.0 },
          { left: 60, top: 40, delay: 1.5, duration: 3.6 },
          { left: 80, top: 80, delay: 2.2, duration: 3.9 },
          { left: 20, top: 30, delay: 0.7, duration: 3.4 },
          { left: 70, top: 10, delay: 1.7, duration: 4.3 },
          { left: 40, top: 65, delay: 1.3, duration: 3.1 },
          { left: 95, top: 45, delay: 2.8, duration: 3.8 },
          { left: 5, top: 75, delay: 0.9, duration: 4.1 },
          { left: 55, top: 55, delay: 2.1, duration: 3.5 },
          { left: 30, top: 90, delay: 1.4, duration: 3.7 },
          { left: 65, top: 20, delay: 0.6, duration: 4.0 },
          { left: 85, top: 65, delay: 2.3, duration: 3.2 },
          { left: 15, top: 40, delay: 1.1, duration: 3.9 }
        ].map((star, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col px-3">
        
        {/* 개선된 헤더 */}
        <motion.header
          className="py-5 text-center relative z-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl font-black tracking-tight mb-4 leading-tight"
            style={{
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              textShadow: '0 12px 40px rgba(0,0,0,0.6), 0 6px 20px rgba(168,85,247,0.4), 0 4px 12px rgba(255,255,255,0.1)'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="cosmic-gradient-text font-black tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 20%, #e2e8f0 40%, #cbd5e1 60%, #94a3b8 80%, #64748b 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    textShadow: 'none'
                  }}>
              COSMIC CASINO
            </span>
          </motion.h1>
          <motion.p
            className="text-lg font-semibold mb-8 tracking-wide"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(255, 255, 255, 0.85)',
              textShadow: '0 4px 16px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.03em',
              fontWeight: '600'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Premium Cosmic Gaming Experience
          </motion.p>
          
          {/* 프리미엄 통계 */}
          <motion.div
            className="flex items-center justify-center gap-4 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl 
                            bg-white/5 backdrop-blur-md
                            border border-white/10 hover:border-white/20
                            transition-all duration-300">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span style={{ 
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                letterSpacing: '0.02em'
              }}>99.2% RTP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl 
                            bg-white/5 backdrop-blur-md
                            border border-white/10 hover:border-white/20
                            transition-all duration-300">
              <Zap className="w-4 h-4 text-amber-300" />
              <span style={{ 
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                letterSpacing: '0.02em'
              }}>Instant Payout</span>
            </div>
          </motion.div>
        </motion.header>

        {/* 게임 그리드 */}
        <main className="flex-1 pb-8">
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {games.map((game, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* 프리미엄 푸터 */}
        <motion.footer
          className="py-6 text-center border-t border-white/10 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p style={{
               fontFamily: "'Inter', sans-serif",
               color: 'rgba(255, 255, 255, 0.6)',
               fontSize: '0.875rem',
               fontWeight: '400',
               letterSpacing: '0.025em',
               textShadow: '0 2px 8px rgba(0,0,0,0.3)'
             }}>
            Responsible Gaming • Licensed & Secure ⭐
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.title = '🎰 COSMIC CASINO - 프리미엄 우주 카지노';
    
    // 프리미엄 그라디언트 텍스트 스타일을 동적으로 추가
    const style = document.createElement('style');
    style.textContent = `
      .cosmic-gradient-text {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 20%, #e2e8f0 40%, #cbd5e1 60%, #94a3b8 80%, #64748b 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        color: transparent !important;
        display: inline-block !important;
        background-size: 200% 200% !important;
        animation: premium-gradient 3s ease-in-out infinite !important;
        font-weight: 900 !important;
        letter-spacing: -0.02em !important;
      }
      
      @keyframes premium-gradient {
        0%, 100% { 
          background-position: 0% 50%; 
          filter: drop-shadow(0 4px 12px rgba(255,255,255,0.2));
        }
        50% { 
          background-position: 100% 50%; 
          filter: drop-shadow(0 6px 16px rgba(255,255,255,0.3));
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <HomePage />;
}
