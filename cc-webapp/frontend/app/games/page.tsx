'use client';

import { motion } from 'framer-motion';
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
  Play
} from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  gradient: string;
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
  route, 
  gradient, 
  difficulty, 
  minBet, 
  maxWin, 
  isNew, 
  isHot 
}: GameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 배경 카드 */}
      <div className={`relative p-6 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden
                      ${gradient} shadow-xl hover:shadow-2xl transition-all duration-300`}>
        
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none"></div>
        
        {/* 뱃지들 */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isNew && (
            <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-400/30">
              <span className="text-xs font-bold text-green-400">NEW</span>
            </div>
          )}
          {isHot && (
            <div className="px-2 py-1 rounded-full bg-red-500/20 border border-red-400/30">
              <span className="text-xs font-bold text-red-400">HOT</span>
            </div>
          )}
        </div>

        {/* 아이콘 */}
        <div className="relative z-10 mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center
                          group-hover:bg-white/20 transition-colors duration-300">
            {icon}
          </div>
        </div>

        {/* 제목 & 설명 */}
        <div className="relative z-10 text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-white/70 leading-relaxed">{description}</p>
        </div>

        {/* 게임 정보 */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">난이도</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < (difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-white/20'
                  }`} 
                />
              ))}
              <span className="text-white/80 ml-1 font-medium">{difficulty}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">최소 베팅</span>
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-yellow-400" />
              <span className="text-white/80 font-medium">{minBet.toLocaleString()}💎</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">최대 당첨</span>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{maxWin.toLocaleString()}💎</span>
            </div>
          </div>
        </div>

        {/* 플레이 버튼 */}
        <div className="relative z-10 mt-6">
          <div className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 
                          border border-white/20 transition-all duration-300 
                          flex items-center justify-center gap-2 group-hover:border-white/40">
            <Play className="w-4 h-4 text-white" />
            <span className="text-white font-medium">플레이 시작</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GamesPage() {
  const games: GameCardProps[] = [
    {
      title: "코스믹 포츈",
      description: "우주에서 가장 스릴 넘치는 슬롯 머신! 별자리가 만들어내는 황금 조합을 찾아보세요.",
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      route: "/games/slots",
      gradient: "bg-gradient-to-br from-purple-600/30 to-pink-600/20",
      difficulty: "Easy",
      minBet: 10,
      maxWin: 100000,
      isNew: true,
      isHot: true
    },
    {
      title: "갤럭시 룰렛",
      description: "은하계를 돌아다니며 운명의 숫자를 맞춰보세요. 우주의 기운이 당신을 도울 겁니다.",
      icon: <Target className="w-8 h-8 text-blue-400" />,
      route: "/games/roulette",
      gradient: "bg-gradient-to-br from-blue-600/30 to-cyan-600/20",
      difficulty: "Medium",
      minBet: 50,
      maxWin: 350000,
      isHot: true
    },
    {
      title: "코스믹 배틀",
      description: "가위바위보의 우주 버전! 운과 전략이 만나는 짜릿한 대결을 경험하세요.",
      icon: <Dice1 className="w-8 h-8 text-green-400" />,
      route: "/games/rps",
      gradient: "bg-gradient-to-br from-green-600/30 to-emerald-600/20",
      difficulty: "Easy",
      minBet: 20,
      maxWin: 80000
    },
    {
      title: "스텔라 가챠",
      description: "신비로운 우주 아이템을 발견하세요! 레어 등급부터 레전더리까지 다양한 보상이 기다립니다.",
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      route: "/games/gacha",
      gradient: "bg-gradient-to-br from-yellow-600/30 to-orange-600/20",
      difficulty: "Hard",
      minBet: 100,
      maxWin: 1000000,
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 
                    relative overflow-hidden">
      
      {/* 배경 효과 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full 
                        mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full 
                        mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full 
                        mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* 헤더 */}
        <motion.header
          className="py-8 px-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
                       bg-clip-text text-transparent mb-4"
            whileHover={{ scale: 1.05 }}
          >
            🎰 COSMIC CASINO
          </motion.h1>
          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            우주에서 가장 스릴 넘치는 카지노 게임들을 만나보세요
          </motion.p>
          
          {/* 통계 정보 */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white/70">97.3% 평균 환급률</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70">실시간 배당</span>
            </div>
          </motion.div>
        </motion.header>

        {/* 게임 그리드 */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
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
                <GameCard key={index} {...game} />
              ))}
            </motion.div>
          </div>
        </main>

        {/* 푸터 */}
        <motion.footer
          className="py-6 px-4 text-center border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/50 text-sm">
            책임감 있는 게임 플레이를 권장합니다 • 19세 이상 이용가능
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
