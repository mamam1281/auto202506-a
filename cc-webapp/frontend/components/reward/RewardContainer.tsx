'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Star, 
  Zap, 
  TrendingUp, 
  Gift, 
  Target, 
  Sparkles,
  Trophy,
  Coins,
  Play,
  ArrowLeft,
  Crown,
  Flame,
  Percent,
  Calendar,
  Users,
  ShoppingCart,
  History,
  Award,
  Gem,
  Clock,
  ChevronRight
} from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'TOKEN' | 'BONUS' | 'ITEM' | 'SPECIAL';
  image: string;
  isAvailable: boolean;
  stock?: number;
  icon: React.ReactNode;
  accent: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

interface PointTransaction {
  id: string;
  type: 'EARN' | 'SPEND';
  amount: number;
  description: string;
  timestamp: string;
  relatedItem?: string;
}

interface UserLevel {
  currentLevel: number;
  currentPoints: number;
  pointsToNext: number;
  totalPoints: number;
  levelName: string;
}

function RewardDashboard({ userLevel }: { userLevel: UserLevel }) {
  const progressPercentage = ((userLevel.currentPoints) / (userLevel.currentPoints + userLevel.pointsToNext)) * 100;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative p-6 rounded-2xl backdrop-blur-xl border overflow-hidden
                      bg-gradient-to-br from-purple-900/30 to-purple-800/40 border-purple-600/50
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] transform-gpu">
        
        {/* 강화된 내부 테두리 */}
        <div className="absolute inset-[1px] rounded-2xl border border-purple-400/20 pointer-events-none"></div>
        
        {/* 포인트 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-black/20 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* 포인트 잔액 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gem className="w-6 h-6 text-purple-400" />
              <span className="text-2xl font-black text-white">
                {userLevel.currentPoints.toLocaleString()}
              </span>
              <span className="text-sm text-purple-300">포인트</span>
            </div>
            <div className="text-sm text-slate-300">
              사용 가능한 포인트
            </div>
          </div>

          {/* 레벨 정보 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-lg font-bold text-white">
                  레벨 {userLevel.currentLevel}
                </span>
              </div>
              <div className="text-amber-300 text-sm font-medium">
                {userLevel.levelName}
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="relative">
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>현재: {userLevel.currentPoints.toLocaleString()}</span>
                <span>다음: {userLevel.pointsToNext.toLocaleString()} 필요</span>
              </div>
            </div>
          </div>

          {/* 총 포인트 */}
          <div className="text-center text-sm text-slate-300">
            총 획득 포인트: {userLevel.totalPoints.toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RewardItemCard({ 
  item, 
  onExchange 
}: { 
  item: RewardItem; 
  onExchange: (itemId: string) => void;
}) {
  const handleExchange = () => {
    if (item.isAvailable) {
      onExchange(item.id);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'border-gray-500/50 bg-gray-900/20';
      case 'RARE': return 'border-blue-500/50 bg-blue-900/20';
      case 'EPIC': return 'border-purple-500/50 bg-purple-900/20';
      case 'LEGENDARY': return 'border-amber-500/50 bg-amber-900/20';
      default: return 'border-gray-500/50 bg-gray-900/20';
    }
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleExchange}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`relative h-[280px] p-4 rounded-2xl backdrop-blur-xl border overflow-hidden
                      bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-slate-600/50
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] 
                      transition-all duration-500 
                      hover:bg-opacity-100 flex flex-col justify-between
                      transform-gpu ${getRarityColor(item.rarity)}`}>
        
        {/* 강화된 내부 테두리 */}
        <div className="absolute inset-[1px] rounded-2xl border border-white/10 pointer-events-none"></div>
        
        {/* 아이템별 포인트 컬러 효과 */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${item.accent}/10 via-transparent to-black/20 pointer-events-none`}></div>
        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-${item.accent}/15 to-transparent rounded-full blur-2xl`}></div>
        
        {/* 상단 컨텐츠 */}
        <div className="relative z-10">
          {/* 등급 표시 */}
          <div className="absolute top-0 right-0 z-20">
            <div className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider
                            ${item.rarity === 'LEGENDARY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                              item.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' :
                              item.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' :
                              'bg-gray-500/20 text-gray-300 border border-gray-500/50'}`}>
              {item.rarity}
            </div>
          </div>

          {/* 아이콘 */}
          <div className="mb-4 mt-2">
            <motion.div 
              className="w-12 h-12 mx-auto rounded-xl 
                        bg-gradient-to-br from-slate-600/70 to-slate-700/90 
                        flex items-center justify-center border border-slate-500/50
                        group-hover:from-slate-500/70 group-hover:to-slate-600/90 
                        transition-all duration-500 shadow-lg backdrop-blur-md"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {item.icon}
            </motion.div>
          </div>

          {/* 제목과 설명 */}
          <div className="text-center mb-4">
            <motion.h3 
              className="text-base font-black text-white mb-2 leading-tight"
              style={{ 
                textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' 
              }}
            >
              {item.name}
            </motion.h3>
            <p className="text-xs text-slate-100 leading-relaxed px-1"
               style={{ 
                 textShadow: '0 1px 4px rgba(0,0,0,0.6)' 
               }}>
              {item.description.substring(0, 50)}...
            </p>
          </div>

          {/* 가격 및 재고 */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700/60 border border-slate-600/60 backdrop-blur-sm">
                <Gem className="w-3 h-3 text-purple-400" />
                <span className="text-white font-medium">{item.cost.toLocaleString()}</span>
              </div>
              {item.stock && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700/60 border border-slate-600/60 backdrop-blur-sm">
                  <span className="text-white font-medium">재고: {item.stock}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 교환 버튼 */}
        <div className="relative z-10">
          <motion.div
            className={`w-full py-3 px-4 rounded-xl 
                       border transition-all duration-500 
                       flex items-center justify-center gap-2 
                       shadow-lg hover:shadow-xl backdrop-blur-sm
                       text-white font-bold relative overflow-hidden
                       ${item.isAvailable 
                         ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border-purple-500/70 hover:border-purple-400/80' 
                         : 'bg-gradient-to-r from-slate-600 to-slate-700 border-slate-500/70 cursor-not-allowed'}`}
            whileHover={item.isAvailable ? { scale: 1.02 } : {}}
            whileTap={item.isAvailable ? { scale: 0.98 } : {}}
          >
            {item.isAvailable && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                              skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            )}
            <ShoppingCart className="w-4 h-4 text-white relative z-10 drop-shadow" />
            <span className="text-white relative z-10 drop-shadow">
              {item.isAvailable ? '교환하기' : '품절'}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function RewardHistory({ transactions }: { transactions: PointTransaction[] }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative p-6 rounded-2xl backdrop-blur-xl border overflow-hidden
                      bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-slate-600/50
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] transform-gpu">
        
        <div className="absolute inset-[1px] rounded-2xl border border-white/10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">포인트 히스토리</h3>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                  ${transaction.type === 'EARN' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {transaction.type === 'EARN' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-bold
                                ${transaction.type === 'EARN' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'EARN' ? '+' : '-'}{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RewardContainer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Mock 사용자 레벨 데이터
  const userLevel: UserLevel = {
    currentLevel: 5,
    currentPoints: 12500,
    pointsToNext: 7500,
    totalPoints: 45000,
    levelName: '실버 멤버'
  };

  // Mock 리워드 아이템 데이터
  const rewardItems: RewardItem[] = [
    {
      id: 'tokens-1000',
      name: '토큰 패키지',
      description: '1,000개의 게임 토큰으로 더 많은 게임을 즐겨보세요. 즉시 지급됩니다.',
      cost: 1000,
      category: 'TOKEN',
      image: '',
      isAvailable: true,
      icon: <Coins className="w-5 h-5 text-amber-400 drop-shadow-lg" />,
      accent: 'amber-400',
      rarity: 'COMMON'
    },
    {
      id: 'bonus-200',
      name: '보너스 부스터',
      description: '다음 게임에서 200% 보너스를 받으세요. 한정 시간 동안 사용 가능합니다.',
      cost: 2500,
      category: 'BONUS',
      image: '',
      isAvailable: true,
      icon: <Zap className="w-5 h-5 text-yellow-400 drop-shadow-lg" />,
      accent: 'yellow-400',
      rarity: 'RARE'
    },
    {
      id: 'exclusive-avatar',
      name: '전용 아바타',
      description: '특별한 우주 전사 아바타를 획득하세요. 다른 플레이어들에게 당신의 레벨을 보여주세요.',
      cost: 5000,
      category: 'ITEM',
      image: '',
      isAvailable: true,
      icon: <Crown className="w-5 h-5 text-purple-400 drop-shadow-lg" />,
      accent: 'purple-400',
      rarity: 'EPIC'
    },
    {
      id: 'legendary-chest',
      name: '레전더리 상자',
      description: '신비로운 레전더리 상자에서 최고 등급의 아이템을 획득할 기회를 잡으세요.',
      cost: 10000,
      category: 'SPECIAL',
      image: '',
      isAvailable: true,
      stock: 3,
      icon: <Sparkles className="w-5 h-5 text-pink-400 drop-shadow-lg" />,
      accent: 'pink-400',
      rarity: 'LEGENDARY'
    },
    {
      id: 'vip-access',
      name: 'VIP 액세스',
      description: '일주일간 VIP 혜택을 경험하세요. 전용 게임과 특별 보너스가 포함됩니다.',
      cost: 7500,
      category: 'SPECIAL',
      image: '',
      isAvailable: true,
      icon: <Trophy className="w-5 h-5 text-orange-400 drop-shadow-lg" />,
      accent: 'orange-400',
      rarity: 'EPIC'
    },
    {
      id: 'mega-tokens',
      name: '메가 토큰',
      description: '10,000개의 프리미엄 토큰 패키지. 대량 게임 플레이를 위한 최적의 선택입니다.',
      cost: 15000,
      category: 'TOKEN',
      image: '',
      isAvailable: false,
      icon: <Gem className="w-5 h-5 text-cyan-400 drop-shadow-lg" />,
      accent: 'cyan-400',
      rarity: 'LEGENDARY'
    }
  ];

  // Mock 거래 내역 데이터
  const transactions: PointTransaction[] = [
    {
      id: '1',
      type: 'EARN',
      amount: 500,
      description: '일일 로그인 보너스',
      timestamp: '2025-07-11T10:00:00Z'
    },
    {
      id: '2',
      type: 'SPEND',
      amount: 1000,
      description: '토큰 패키지 교환',
      timestamp: '2025-07-10T15:30:00Z'
    },
    {
      id: '3',
      type: 'EARN',
      amount: 2000,
      description: '게임 승리 보너스',
      timestamp: '2025-07-10T14:15:00Z'
    },
    {
      id: '4',
      type: 'EARN',
      amount: 750,
      description: '미션 완료 보상',
      timestamp: '2025-07-09T20:45:00Z'
    },
    {
      id: '5',
      type: 'SPEND',
      amount: 2500,
      description: '보너스 부스터 교환',
      timestamp: '2025-07-09T18:20:00Z'
    }
  ];

  const handleExchange = (itemId: string) => {
    const item = rewardItems.find(i => i.id === itemId);
    if (item && item.isAvailable) {
      console.log('아이템 교환:', itemId);
      // 실제로는 API 호출
      alert(`${item.name}을(를) 성공적으로 교환했습니다!`);
    }
  };

  const categories = [
    { key: 'ALL', label: '전체', icon: <Star className="w-4 h-4" /> },
    { key: 'TOKEN', label: '토큰', icon: <Coins className="w-4 h-4" /> },
    { key: 'BONUS', label: '보너스', icon: <Zap className="w-4 h-4" /> },
    { key: 'ITEM', label: '아이템', icon: <Gift className="w-4 h-4" /> },
    { key: 'SPECIAL', label: '특별', icon: <Crown className="w-4 h-4" /> }
  ];

  const filteredItems = selectedCategory === 'ALL' 
    ? rewardItems 
    : rewardItems.filter(item => item.category === selectedCategory);

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    relative overflow-hidden">
      
      {/* 부드러운 배경 효과 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full 
                        mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-amber-600/20 rounded-full 
                        mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-24 h-24 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl 
                        animate-pulse animation-delay-2000"></div>
      </div>

      {/* 부드러운 별빛 효과 */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col px-5">
        
        {/* 개선된 헤더 */}
        <motion.header
          className="py-8 text-center relative z-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl font-black mb-3 text-white leading-none"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 8px 40px rgba(0,0,0,0.4)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            🏆 REWARDS
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
            포인트로 특별한 아이템을 교환하세요
          </motion.p>
          
          {/* 통계 */}
          <motion.div
            className="flex items-center justify-center gap-3 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-slate-800/80 backdrop-blur-xl
                            border border-slate-600/60 shadow-lg">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium">레벨 {userLevel.currentLevel}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-slate-800/80 backdrop-blur-xl
                            border border-slate-600/60 shadow-lg">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">{userLevel.currentPoints.toLocaleString()}P</span>
            </div>
          </motion.div>
        </motion.header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 pb-8 space-y-8">
          {/* 포인트 대시보드 */}
          <section>
            <RewardDashboard userLevel={userLevel} />
          </section>

          {/* 카테고리 필터 */}
          <section>
            <motion.div
              className="flex gap-2 overflow-x-auto pb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl
                            transition-all duration-300 whitespace-nowrap
                            ${selectedCategory === category.key
                              ? 'bg-purple-600/80 border-purple-500/80 text-white shadow-lg'
                              : 'bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.icon}
                  <span className="text-sm font-medium">{category.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </section>

          {/* 리워드 아이템 그리드 */}
          <section>
            <motion.h2 
              className="text-xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              🎁 교환 가능한 아이템
            </motion.h2>
            <motion.div
              className="grid grid-cols-2 gap-4"
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
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <RewardItemCard item={item} onExchange={handleExchange} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* 포인트 히스토리 */}
          <section>
            <motion.h2 
              className="text-xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              📊 포인트 히스토리
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <RewardHistory transactions={transactions} />
            </motion.div>
          </section>
        </main>

        {/* 푸터 */}
        <motion.footer
          className="py-4 text-center border-t border-slate-600/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <p className="text-slate-300 text-sm"
             style={{
               textShadow: '0 1px 4px rgba(0,0,0,0.5)'
             }}>
            포인트는 게임 플레이로 획득할 수 있습니다 💎
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
