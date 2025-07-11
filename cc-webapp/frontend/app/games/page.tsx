'use client';

import './games.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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

// Individual Game Components
function SlotsGame({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_60%)]"></div>
      
      <div className="relative z-10 p-6">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-white hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로 가기</span>
        </motion.button>

        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
          >
            🎰 코스믹 포츈
          </motion.h1>
          <p className="text-slate-200">프리미엄 우주 슬롯 머신</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/40 shadow-2xl">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400 drop-shadow-lg" />
            <h3 className="text-xl font-bold mb-2 text-white">곧 출시 예정!</h3>
            <p className="text-slate-100 mb-4">
              우주에서 가장 스릴 넘치는 슬롯 머신이 곧 여러분을 찾아갑니다.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최소 베팅: 10💎</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최대 당첨: 100,000💎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouletteGame({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)]"></div>
      
      <div className="relative z-10 p-6">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-white hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로 가기</span>
        </motion.button>

        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
          >
            🎯 갤럭시 룰렛
          </motion.h1>
          <p className="text-slate-200">프리미엄 우주 룰렛</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/40 shadow-2xl">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-blue-400 drop-shadow-lg" />
            <h3 className="text-xl font-bold mb-2 text-white">곧 출시 예정!</h3>
            <p className="text-slate-100 mb-4">
              은하계를 돌아다니며 운명의 숫자를 맞춰보세요.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최소 베팅: 50💎</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최대 당첨: 350,000💎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RPSGame({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_60%)]"></div>
      
      <div className="relative z-10 p-6">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-white hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로 가기</span>
        </motion.button>

        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
          >
            ✊ 코스믹 배틀
          </motion.h1>
          <p className="text-slate-200">프리미엄 우주 가위바위보</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/40 shadow-2xl">
          <div className="text-center">
            <Dice1 className="w-12 h-12 mx-auto mb-4 text-emerald-400 drop-shadow-lg" />
            <h3 className="text-xl font-bold mb-2 text-white">곧 출시 예정!</h3>
            <p className="text-slate-100 mb-4">
              가위바위보의 우주 버전! 운과 전략이 만나는 짜릿한 대결.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최소 베팅: 20💎</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최대 당첨: 80,000💎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GachaGame({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.15)_0%,transparent_60%)]"></div>
      
      <div className="relative z-10 p-6">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-white hover:bg-slate-700/80 hover:border-slate-500/60 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로 가기</span>
        </motion.button>

        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-black text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
          >
            ⭐ 스텔라 가챠
          </motion.h1>
          <p className="text-slate-200">프리미엄 우주 아이템 가챠</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/40 shadow-2xl">
          <div className="text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-orange-400 drop-shadow-lg" />
            <h3 className="text-xl font-bold mb-2 text-white">곧 출시 예정!</h3>
            <p className="text-slate-100 mb-4">
              신비로운 우주 아이템을 발견하세요! 레어부터 레전더리까지.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최소 베팅: 100💎</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-100">최대 당첨: 1,000,000💎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
  isHot,
  onPlay
}: GameCardProps & { onPlay: (gameType: GameType) => void }) {
  const handleClick = () => {
    onPlay(gameType);
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
      {/* 새로운 카드 디자인 */}
      <div className="relative h-[320px] bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-600/40 overflow-hidden
                      shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_56px_rgba(0,0,0,0.5)] 
                      transition-all duration-300 flex flex-col">
        
        {/* 내부 글로우 효과 강화 */}
        <div className="absolute inset-[1px] rounded-2xl border border-slate-400/30 pointer-events-none"></div>
        
        {/* 배지들 */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
          {isNew && (
            <motion.div 
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 
                        text-black text-[9px] font-bold uppercase tracking-wide
                        shadow-lg shadow-yellow-400/30 backdrop-blur-sm
                        border border-yellow-300/50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              NEW
            </motion.div>
          )}
          {isHot && (
            <motion.div 
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 
                        text-white text-[9px] font-bold uppercase tracking-wide
                        shadow-lg shadow-red-500/30 backdrop-blur-sm
                        border border-red-400/50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              HOT
            </motion.div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col px-1 py-3">
          {/* 아이콘 영역 */}
          <div className="flex justify-center mb-4 mt-2">
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-slate-700/70 backdrop-blur-sm border border-slate-600/50
                        flex items-center justify-center
                        group-hover:bg-slate-600/70 transition-all duration-300 shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl">
                {icon}
              </div>
            </motion.div>
          </div>

          {/* 제목 */}
          <div className="text-center mb-3">
            <h3 className="text-base font-bold text-white leading-tight">
              {title}
            </h3>
          </div>

          {/* 설명 */}
          <div className="text-center mb-4 flex-1">
            <p className="text-xs text-slate-300 leading-relaxed px-1">
              {description.substring(0, 20)}...
            </p>
          </div>

          {/* 게임 정보 */}
          <div className="flex items-center justify-between text-xs mb-4 px-1">
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-yellow-400" />
              <span className="text-white font-medium">{minBet}💎</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(3)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < (difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-500'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* 플레이 버튼 */}
        <div className="p-4 pt-0">
          <motion.button
            className="w-full py-3 px-4 rounded-xl 
                       bg-slate-700 hover:bg-slate-600
                       border border-slate-600/50 hover:border-slate-500/60
                       transition-all duration-300 
                       flex items-center justify-center gap-2 
                       text-white font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4" />
            <span>플레이</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function HomePage({ onGameSelect }: { onGameSelect: (gameType: GameType) => void }) {
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
            className="gradient-text text-4xl font-black mb-3 text-white leading-none"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 8px 40px rgba(0,0,0,0.4)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            🎰 COSMIC CASINO
          </motion.h1>
          <motion.p
            className="text-base text-slate-200 font-medium mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            프리미엄 우주 카지노 익스피리언스
          </motion.p>
          
          {/* 개선된 통계 */}
          <motion.div
            className="flex items-center justify-center gap-2 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg 
                            bg-slate-800/70 backdrop-blur-sm
                            border border-slate-600/40">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-white font-medium text-sm">높은 당첨률</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg 
                            bg-slate-800/70 backdrop-blur-sm
                            border border-slate-600/40">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-white font-medium text-sm">즉시 지급</span>
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
                <GameCard {...game} onPlay={onGameSelect} />
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* 개선된 푸터 */}
        <motion.footer
          className="py-4 text-center border-t border-slate-600/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-slate-300 text-sm"
             style={{
               textShadow: '0 1px 4px rgba(0,0,0,0.5)'
             }}>
            책임감 있는 게임 플레이를 권장합니다 ⭐
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

  useEffect(() => {
    const gameNames = {
      home: '🎰 COSMIC CASINO - 프리미엄 우주 카지노',
      slots: '🎰 코스믹 포츈 - 우주 슬롯 머신',
      roulette: '🎯 갤럭시 룰렛 - 우주 룰렛',
      rps: '✊ 코스믹 배틀 - 우주 가위바위보',
      gacha: '⭐ 스텔라 가챠 - 우주 아이템 가챠'
    };
    
    document.title = gameNames[currentGame];
  }, [currentGame]);

  const handleGameSelect = (gameType: GameType) => {
    setCurrentGame(gameType);
  };

  const handleBackToHome = () => {
    setCurrentGame('home');
  };

  // Render current game
  switch (currentGame) {
    case 'slots':
      return <SlotsGame onBack={handleBackToHome} />;
    case 'roulette':
      return <RouletteGame onBack={handleBackToHome} />;
    case 'rps':
      return <RPSGame onBack={handleBackToHome} />;
    case 'gacha':
      return <GachaGame onBack={handleBackToHome} />;
    default:
      return <HomePage onGameSelect={handleGameSelect} />;
  }
}
