'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Heart,
  TrendingUp,
  Clock,
  Zap,
  Trophy,
  ChevronDown,
  Play,
  Eye,
  Users,
  Flame,
  Bookmark,
  Share2,
  Info,
  Award,
  Coins,
  Gamepad2
} from 'lucide-react';

interface GameData {
  id: string;
  name: string;
  image: string;
  category: string;
  provider: string;
  rtp: number;
  popularity: number;
  players: number;
  minBet: number;
  maxBet: number;
  isNew?: boolean;
  isHot?: boolean;
  isFavorite?: boolean;
  rating: number;
  lastPlayed?: string;
  thumbnail: string;
  description: string;
  features: string[];
}

interface FilterState {
  category: string;
  provider: string;
  rtp: [number, number];
  isNew: boolean;
  isHot: boolean;
}

type SortOption = 'popularity' | 'name' | 'rtp' | 'newest' | 'players';
type ViewMode = 'grid' | 'list';

const GamesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    provider: 'all',
    rtp: [90, 100],
    isNew: false,
    isHot: false
  });

  const gamesPerPage = 12;

  // 고급 게임 데이터 (더 많은 정보 포함)
  const allGames: GameData[] = [
    {
      id: 'rps',
      name: '가위바위보',
      image: '🪨',
      category: 'Classic',
      provider: 'CasinoClub',
      rtp: 98.5,
      popularity: 95,
      players: 1247,
      minBet: 10,
      maxBet: 1000,
      isHot: true,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
      description: '클래식한 가위바위보 게임으로 AI와 대결하세요!',
      features: ['실시간 대전', 'AI 상대', '빠른 게임']
    },
    {
      id: 'slots-mega',
      name: '메가 슬롯 마스터',
      image: '🎰',
      category: 'Slots',
      provider: 'MegaWin',
      rtp: 96.8,
      popularity: 88,
      players: 2156,
      minBet: 1,
      maxBet: 500,
      isNew: true,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400',
      description: '5릴 슬롯머신으로 대박의 기회를 잡아보세요!',
      features: ['5릴', 'Wild 심볼', '보너스 라운드', '프리스핀']
    },
    {
      id: 'roulette-european',
      name: '유럽식 룰렛',
      image: '🎯',
      category: 'Table',
      provider: 'Evolution',
      rtp: 97.3,
      popularity: 82,
      players: 892,
      minBet: 5,
      maxBet: 2000,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: '전통적인 유럽식 룰렛으로 운을 시험해보세요!',
      features: ['싱글 제로', '라이브 딜러', '채팅']
    },
    {
      id: 'gacha-premium',
      name: '프리미엄 가챠',
      image: '🎁',
      category: 'Special',
      provider: 'GachaMax',
      rtp: 94.8,
      popularity: 76,
      players: 1683,
      minBet: 50,
      maxBet: 5000,
      isNew: true,
      isHot: true,
      rating: 4.5,
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
      description: '희귀 아이템과 보상을 얻을 수 있는 프리미엄 가챠!',
      features: ['희귀 아이템', '누적 확률', '보너스 팩']
    },
    {
      id: 'blackjack-pro',
      name: '프로 블랙잭',
      image: '🃏',
      category: 'Table',
      provider: 'ProGaming',
      rtp: 99.2,
      popularity: 71,
      players: 567,
      minBet: 10,
      maxBet: 1500,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1541644424370-70906c4fd2e8?w=400',
      description: '전략이 필요한 클래식 블랙잭 게임!',
      features: ['멀티 핸드', '사이드 베팅', '인슈어런스']
    },
    {
      id: 'poker-tournament',
      name: '포커 토너먼트',
      image: '♠️',
      category: 'Tournament',
      provider: 'PokerPro',
      rtp: 96.5,
      popularity: 69,
      players: 234,
      minBet: 100,
      maxBet: 10000,
      rating: 4.4,
      thumbnail: 'https://images.unsplash.com/photo-1566494436786-8ad3e4e5c2a7?w=400',
      description: '실력을 겨루는 포커 토너먼트에 참가하세요!',
      features: ['토너먼트', '멀티플레이어', '리더보드']
    },
    {
      id: 'slots-diamond',
      name: '다이아몬드 슬롯',
      image: '💎',
      category: 'Slots',
      provider: 'MegaWin',
      rtp: 95.7,
      popularity: 85,
      players: 1892,
      minBet: 5,
      maxBet: 1000,
      isHot: true,
      rating: 4.3,
      thumbnail: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400',
      description: '다이아몬드 테마의 화려한 슬롯 게임!',
      features: ['보석 테마', '연속 당첨', '잭팟']
    },
    {
      id: 'baccarat-vip',
      name: 'VIP 바카라',
      image: '🎲',
      category: 'Table',
      provider: 'Evolution',
      rtp: 98.9,
      popularity: 79,
      players: 445,
      minBet: 25,
      maxBet: 5000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: '고급스러운 VIP 바카라 테이블에서 플레이하세요!',
      features: ['VIP 서비스', '높은 베팅', '개인 딜러']
    }
  ];

  const categories = ['all', 'Classic', 'Slots', 'Table', 'Special', 'Tournament'];
  const providers = ['all', 'CasinoClub', 'MegaWin', 'Evolution', 'GachaMax', 'ProGaming', 'PokerPro'];

  // 필터링 및 정렬된 게임 목록
  const filteredAndSortedGames = useMemo(() => {
    let filtered = allGames.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'all' || game.category === filters.category;
      const matchesProvider = filters.provider === 'all' || game.provider === filters.provider;
      const matchesRTP = game.rtp >= filters.rtp[0] && game.rtp <= filters.rtp[1];
      const matchesNew = !filters.isNew || game.isNew;
      const matchesHot = !filters.isHot || game.isHot;

      return matchesSearch && matchesCategory && matchesProvider && matchesRTP && matchesNew && matchesHot;
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rtp':
          return b.rtp - a.rtp;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'players':
          return b.players - a.players;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filters, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedGames.length / gamesPerPage);
  const paginatedGames = filteredAndSortedGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  // 검색 처리
  const handleSearch = (term: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSearchTerm(term);
      setCurrentPage(1);
      setIsLoading(false);
    }, 300);
  };

  // 즐겨찾기 토글
  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(gameId)) {
        newFavorites.delete(gameId);
      } else {
        newFavorites.add(gameId);
      }
      return newFavorites;
    });
  };

  // 애니메이션 variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 프리미엄 헤더 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">🎮 프리미엄 게임 센터</h1>
                <p className="text-purple-200">최고의 카지노 게임을 프리미엄 환경에서 즐겨보세요!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* 네비게이션 메뉴 */}
              <nav className="flex items-center space-x-6 mr-6">
                <button 
                  onClick={() => router.push('/dashboard-new')}
                  className="text-purple-300 hover:text-white transition-colors font-medium"
                >
                  대시보드
                </button>
                <button 
                  onClick={() => router.push('/games')}
                  className="text-white hover:text-purple-300 transition-colors font-medium"
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
              
              {/* 토큰 표시 */}
              <div className="text-right">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Coins className="w-5 h-5" />
                  <span className="text-xl font-bold">12,750</span>
                </div>
                <p className="text-purple-200 text-sm">토큰</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 검색 및 필터 바 */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* 검색 및 뷰 모드 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="게임 이름 또는 설명으로 검색..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              {/* 필터 토글 */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl transition-all hover:scale-105"
              >
                <Filter className="w-5 h-5" />
                <span>고급 필터</span>
              </button>
              
              {/* 뷰 모드 토글 */}
              <div className="flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/10'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/10'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 고급 필터 패널 */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-white/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* 카테고리 필터 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">카테고리</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-800">
                        {cat === 'all' ? '전체' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 제공업체 필터 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">제공업체</label>
                  <select
                    value={filters.provider}
                    onChange={(e) => setFilters({...filters, provider: e.target.value})}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {providers.map(provider => (
                      <option key={provider} value={provider} className="bg-slate-800">
                        {provider === 'all' ? '전체' : provider}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 정렬 옵션 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">정렬</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="popularity" className="bg-slate-800">인기순</option>
                    <option value="name" className="bg-slate-800">이름순</option>
                    <option value="rtp" className="bg-slate-800">RTP순</option>
                    <option value="newest" className="bg-slate-800">최신순</option>
                    <option value="players" className="bg-slate-800">플레이어수순</option>
                  </select>
                </div>

                {/* 특수 필터 */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">특수 필터</label>
                  <div className="space-y-2">
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={filters.isNew}
                        onChange={(e) => setFilters({...filters, isNew: e.target.checked})}
                        className="mr-2 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm">신규 게임</span>
                    </label>
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={filters.isHot}
                        onChange={(e) => setFilters({...filters, isHot: e.target.checked})}
                        className="mr-2 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm">인기 게임</span>
                    </label>
                  </div>
                </div>

                {/* 필터 초기화 */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({
                        category: 'all',
                        provider: 'all',
                        rtp: [90, 100],
                        isNew: false,
                        isHot: false
                      });
                      setSearchTerm('');
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all hover:scale-105"
                  >
                    초기화
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 게임 통계 대시보드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">총 게임 수</p>
                <p className="text-2xl font-bold text-white">{allGames.length}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-green-600/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">검색 결과</p>
                <p className="text-2xl font-bold text-white">{filteredAndSortedGames.length}</p>
              </div>
              <Search className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-yellow-600/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm">즐겨찾기</p>
                <p className="text-2xl font-bold text-white">{favorites.size}</p>
              </div>
              <Heart className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-blue-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">현재 페이지</p>
                <p className="text-2xl font-bold text-white">{currentPage}/{totalPages}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* 로딩 스피너 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-purple-200 mt-2">프리미엄 게임을 검색 중...</p>
          </div>
        )}

        {/* 프리미엄 게임 목록 */}
        {!isLoading && (
          <motion.div
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {paginatedGames.map((game) => (
                <motion.div
                  key={game.id}
                  variants={itemVariants}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all group cursor-pointer shadow-lg hover:shadow-2xl ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  layout
                  onClick={() => router.push(`/${game.id}`)}
                >
                  {/* 게임 이미지 */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
                      {game.image}
                    </div>
                    
                    {/* 프리미엄 배지들 */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {game.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ✨ NEW
                        </span>
                      )}
                      {game.isHot && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center font-bold">
                          <Flame className="w-3 h-3 mr-1" />
                          HOT
                        </span>
                      )}
                    </div>

                    {/* 즐겨찾기 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(game.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all hover:scale-110"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.has(game.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-white'
                        }`} 
                      />
                    </button>

                    {/* 빠른 액션 버튼들 */}
                    <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-110"
                        title="게임 정보"
                      >
                        <Info className="w-4 h-4 text-white" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-110"
                        title="공유하기"
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* 플레이 버튼 (호버 시) */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <div className="text-center">
                        <button 
                          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full transition-all hover:scale-110 mb-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${game.id}`);
                          }}
                        >
                          <Play className="w-8 h-8" />
                        </button>
                        <p className="text-white text-sm font-medium">지금 플레이</p>
                      </div>
                    </div>
                  </div>

                  {/* 게임 정보 */}
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-lg">{game.name}</h3>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1">{game.rating}</span>
                      </div>
                    </div>

                    <p className="text-purple-200 text-sm mb-3">{game.category} • {game.provider}</p>
                    
                    {viewMode === 'list' && (
                      <p className="text-purple-300 text-sm mb-3">{game.description}</p>
                    )}

                    {/* 통계 */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        RTP {game.rtp}%
                      </div>
                      <div className="flex items-center text-blue-400">
                        <Users className="w-3 h-3 mr-1" />
                        {game.players.toLocaleString()}명
                      </div>
                    </div>

                    {/* 베팅 범위 */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center text-purple-300">
                        <Coins className="w-3 h-3 mr-1" />
                        <span>베팅: {game.minBet} - {game.maxBet.toLocaleString()}토큰</span>
                      </div>
                    </div>

                    {/* 특징 태그들 */}
                    {viewMode === 'grid' && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {game.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 인기도 프로그레스 바 */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-purple-300">인기도</span>
                        <span className="text-yellow-400">{game.popularity}%</span>
                      </div>
                      <div className="w-full bg-purple-900/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${game.popularity}%` }}
                        />
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/${game.id}`);
                        }}
                      >
                        지금 플레이
                      </button>
                      <button 
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(game.id);
                        }}
                      >
                        <Bookmark className={`w-4 h-4 ${
                          favorites.has(game.id) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-white'
                        }`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 고급 페이지네이션 */}
        {!isLoading && totalPages > 1 && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-all hover:scale-105 ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 게임이 없을 때 */}
        {!isLoading && filteredAndSortedGames.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">게임을 찾을 수 없습니다</h3>
            <p className="text-purple-200 mb-4">검색 조건을 변경하거나 필터를 초기화해보세요.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: 'all',
                  provider: 'all',
                  rtp: [90, 100],
                  isNew: false,
                  isHot: false
                });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              필터 초기화
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
