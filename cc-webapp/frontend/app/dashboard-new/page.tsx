'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Crown, 
  Zap, 
  TrendingUp, 
  Star, 
  Gift, 
  Calendar,
  Trophy,
  Gamepad2,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  Bell,
  Settings,
  User,
  Coins,
  Diamond,
  Flame,
  Activity,
  Award,
  Bookmark,
  Volume2,
  VolumeX
} from 'lucide-react';

interface UserStats {
  tokens: number;
  level: number;
  exp: number;
  maxExp: number;
  winStreak: number;
  totalWins: number;
  achievements: string[];
}

interface GameData {
  id: string;
  name: string;
  image: string;
  category: string;
  rtp: number;
  popularity: number;
  isNew?: boolean;
  isHot?: boolean;
  lastPlayed?: string;
}

interface PromotionData {
  id: string;
  title: string;
  description: string;
  type: 'bonus' | 'free_spins' | 'tournament' | 'daily';
  reward: string;
  timeLeft?: string;
  isActive: boolean;
  gradient: string;
}

interface NotificationData {
  id: string;
  type: 'win' | 'bonus' | 'level_up' | 'tournament' | 'friend';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon: string;
}

interface SettingsData {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'dark' | 'light';
}

const DashboardNew: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    tokens: 12750,
    level: 8,
    exp: 2340,
    maxExp: 3000,
    winStreak: 7,
    totalWins: 156,
    achievements: ['First Win', 'Lucky 7', 'High Roller']
  });

  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'favorites'>('popular');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: '1',
      type: 'win',
      title: '🎉 빅 윈!',
      message: '슬롯 게임에서 2,500 토큰 획득!',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      icon: '🎰'
    },
    {
      id: '2',
      type: 'level_up',
      title: '⭐ 레벨 업!',
      message: '축하합니다! 레벨 8 달성!',
      timestamp: new Date(Date.now() - 1800000),
      isRead: false,
      icon: '🏆'
    },
    {
      id: '3',
      type: 'bonus',
      title: '🎁 보너스 지급',
      message: '일일 로그인 보너스 500 토큰 지급',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      icon: '💝'
    }
  ]);
  const [settings, setSettings] = useState<SettingsData>({
    soundEnabled: true,
    notificationsEnabled: true,
    animationsEnabled: true,
    theme: 'dark'
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  // 실시간 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const promotions: PromotionData[] = [
    {
      id: '1',
      title: '💎 Daily Diamond Rush',
      description: '매일 로그인하고 특별 보너스를 받으세요!',
      type: 'daily',
      reward: '+500 토큰',
      timeLeft: '23:42:18',
      isActive: true,
      gradient: 'from-purple-600 via-pink-600 to-red-500'
    },
    {
      id: '2', 
      title: '🏆 Weekly Tournament',
      description: '이번 주 토너먼트에서 1등을 차지하세요!',
      type: 'tournament',
      reward: '10,000 토큰',
      timeLeft: '4일 12시간',
      isActive: true,
      gradient: 'from-yellow-400 via-orange-500 to-red-500'
    },
    {
      id: '3',
      title: '🎰 Free Spins Bonanza',
      description: '모든 슬롯 게임에서 20회 무료 스핀!',
      type: 'free_spins',
      reward: '20 Free Spins',
      isActive: true,
      gradient: 'from-green-400 via-blue-500 to-purple-600'
    }
  ];

  const popularGames: GameData[] = [
    {
      id: 'rps',
      name: '가위바위보',
      image: '🪨',
      category: 'Classic',
      rtp: 98.5,
      popularity: 95,
      isHot: true
    },
    {
      id: 'slots',
      name: '슬롯머신',
      image: '🎰',
      category: 'Slots',
      rtp: 96.2,
      popularity: 88,
      isNew: true
    },
    {
      id: 'roulette',
      name: '룰렛',
      image: '🎯',
      category: 'Table',
      rtp: 97.3,
      popularity: 82
    },
    {
      id: 'gacha',
      name: '가챠',
      image: '🎁',
      category: 'Special',
      rtp: 94.8,
      popularity: 76,
      isNew: true
    }
  ];

  const recentGames: GameData[] = [
    { ...popularGames[0], lastPlayed: '2분 전' },
    { ...popularGames[2], lastPlayed: '15분 전' },
    { ...popularGames[1], lastPlayed: '1시간 전' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const statsCardVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 헤더 섹션 */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">안녕하세요, 플레이어님!</h1>
                <p className="text-purple-200">
                  {currentTime.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* 네비게이션 메뉴 */}
              <nav className="flex items-center space-x-6 mr-6">
                <button 
                  onClick={() => router.push('/dashboard-new')}
                  className="text-white hover:text-purple-300 transition-colors font-medium"
                >
                  대시보드
                </button>
                <button 
                  onClick={() => router.push('/games')}
                  className="text-purple-300 hover:text-white transition-colors font-medium"
                >
                  게임 목록
                </button>
                <button 
                  onClick={() => router.push('/profile')}
                  className="text-purple-300 hover:text-white transition-colors font-medium"
                >
                  프로필
                </button>
              </nav>
              
              {/* 알림 버튼 */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
                >
                  <Bell className="w-6 h-6 text-white" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* 설정 버튼 */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
              
              {/* 토큰 표시 */}
              <div className="text-right">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xl font-bold">{userStats.tokens.toLocaleString()}</span>
                </div>
                <p className="text-purple-200 text-sm">토큰</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 통계 카드 섹션 */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30"
            variants={statsCardVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">레벨</p>
                <p className="text-2xl font-bold text-white">{userStats.level}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-blue-900/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(userStats.exp / userStats.maxExp) * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-200 mt-1">
                {userStats.exp} / {userStats.maxExp} EXP
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30"
            variants={statsCardVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">연승</p>
                <p className="text-2xl font-bold text-white">{userStats.winStreak}</p>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30"
            variants={statsCardVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">총 승수</p>
                <p className="text-2xl font-bold text-white">{userStats.totalWins}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30"
            variants={statsCardVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">업적</p>
                <p className="text-2xl font-bold text-white">{userStats.achievements.length}</p>
              </div>
              <Star className="w-8 h-8 text-orange-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* 프로모션 섹션 */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Gift className="w-6 h-6 mr-2 text-pink-400" />
              특별 프로모션
            </h2>
            <button className="text-purple-300 hover:text-white flex items-center transition-colors">
              모두 보기 <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                className={`bg-gradient-to-br ${promo.gradient} p-6 rounded-xl text-white relative overflow-hidden`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
                  <p className="text-sm text-white/90 mb-3">{promo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{promo.reward}</span>
                    {promo.timeLeft && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">
                        {promo.timeLeft}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 게임 추천 섹션 */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Gamepad2 className="w-6 h-6 mr-2 text-blue-400" />
              게임 추천
            </h2>
            <div className="flex items-center space-x-4">
              <button 
                className="text-purple-300 hover:text-white flex items-center transition-colors text-sm"
                onClick={() => {
                  console.log('모든 게임 보기 클릭');
                  router.push('/games');
                }}
              >
                모든 게임 보기 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
              <div className="flex space-x-2">
                {['popular', 'recent', 'favorites'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {tab === 'popular' ? '인기' : tab === 'recent' ? '최근' : '즐겨찾기'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {(activeTab === 'popular' ? popularGames : 
                activeTab === 'recent' ? recentGames : popularGames).map((game, index) => (
                <motion.div
                  key={game.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="relative">
                    <div className="text-4xl mb-4 text-center">{game.image}</div>
                    {game.isNew && (
                      <span className="absolute top-0 right-0 bg-green-500 text-xs px-2 py-1 rounded-full text-white">
                        NEW
                      </span>
                    )}
                    {game.isHot && (
                      <span className="absolute top-0 right-0 bg-red-500 text-xs px-2 py-1 rounded-full text-white">
                        HOT
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-white font-bold text-center mb-2">{game.name}</h3>
                  <p className="text-purple-200 text-sm text-center mb-3">{game.category}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-purple-300">RTP</span>
                      <span className="text-xs text-green-400">{game.rtp}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-purple-300">인기도</span>
                      <span className="text-xs text-yellow-400">{game.popularity}%</span>
                    </div>
                    {game.lastPlayed && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-300">마지막 플레이</span>
                        <span className="text-xs text-blue-400">{game.lastPlayed}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all group-hover:scale-105"
                    onClick={() => {
                      console.log('게임 클릭:', game.id);
                      router.push(`/${game.id}`);
                    }}
                  >
                    플레이하기
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 알림 패널 */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="fixed right-4 top-24 w-80 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 z-50"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">알림</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all ${
                    notification.isRead 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-purple-500/20 border-purple-500/30'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{notification.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                      <p className="text-purple-200 text-xs mt-1">{notification.message}</p>
                      <p className="text-purple-300 text-xs mt-2">
                        {new Date(notification.timestamp).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                  <p className="text-purple-200">새로운 알림이 없습니다</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 설정 패널 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed right-4 top-24 w-80 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 z-50"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">설정</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 사운드 설정 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-purple-300" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-purple-300" />
                  )}
                  <span className="text-white">사운드</span>
                </div>
                <button
                  onClick={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.soundEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* 알림 설정 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-purple-300" />
                  <span className="text-white">알림</span>
                </div>
                <button
                  onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* 애니메이션 설정 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-300" />
                  <span className="text-white">애니메이션</span>
                </div>
                <button
                  onClick={() => setSettings({...settings, animationsEnabled: !settings.animationsEnabled})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.animationsEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    settings.animationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* 사용자 프로필 */}
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">플레이어</p>
                    <p className="text-purple-200 text-sm">레벨 {userStats.level}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardNew;
