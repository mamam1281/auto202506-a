'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RouletteWheel } from './RouletteWheel';
import { BettingTable } from './BettingTable';
import { GameHistory } from './GameHistory';
import { 
  Bet, 
  GameResult, 
  GameState, 
  ROULETTE_NUMBERS, 
  getNumberColor, 
  checkWin,
  TIMINGS 
} from './constants';
import { 
  Play, 
  Pause, 
  Trophy, 
  Clock, 
  DollarSign, 
  Flame,
  Zap,
  Star,
  Crown,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function Roulette() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bets, setBets] = useState<Bet[]>([]);
  const [balance, setBalance] = useState(10000);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [winAmount, setWinAmount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [spinStartTime, setSpinStartTime] = useState<number | null>(null);

  // 베팅 추가
  const handlePlaceBet = useCallback((newBet: Omit<Bet, 'id'>) => {
    if (gameState !== 'idle' || balance < newBet.amount) return;

    const bet: Bet = {
      ...newBet,
      id: `${Date.now()}-${Math.random()}`
    };

    setBets(prev => [...prev, bet]);
    setBalance(prev => prev - newBet.amount);
  }, [gameState, balance]);

  // 베팅 제거
  const handleRemoveBet = useCallback((betId: string) => {
    if (gameState !== 'idle') return;

    setBets(prev => {
      const bet = prev.find(b => b.id === betId);
      if (bet) {
        setBalance(current => current + bet.amount);
      }
      return prev.filter(b => b.id !== betId);
    });
  }, [gameState]);

  // 모든 베팅 클리어
  const handleClearBets = useCallback(() => {
    if (gameState !== 'idle') return;

    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    setBalance(prev => prev + totalBetAmount);
    setBets([]);
  }, [gameState, bets]);

  // 게임 시작
  const handleSpin = useCallback(() => {
    if (gameState !== 'idle' || bets.length === 0) return;

    setGameState('spinning');
    setWinAmount(0);
    setSpinStartTime(Date.now());
    
    // 랜덤 결과 생성
    const randomIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const result = ROULETTE_NUMBERS[randomIndex];
    setCurrentResult(result);
  }, [gameState, bets]);

  // 스핀 완료 처리
  const handleSpinComplete = useCallback((result: number) => {
    setGameState('result');
    setGameCount(prev => prev + 1);

    // 결과 히스토리에 추가
    const gameResult: GameResult = {
      number: result,
      color: getNumberColor(result),
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, gameResult]);

    // 당첨 베팅 확인 및 배당금 지급
    let totalWin = 0;
    let hasWin = false;
    
    bets.forEach(bet => {
      if (checkWin(bet, result)) {
        const winnings = bet.amount * (bet.payout + 1); // 원금 + 배당금
        totalWin += winnings;
        hasWin = true;
      }
    });

    if (totalWin > 0) {
      setBalance(prev => prev + totalWin);
      setWinAmount(totalWin);
      setTotalWinnings(prev => prev + totalWin);
      
      // 최대 승리 기록 갱신
      if (totalWin > biggestWin) {
        setBiggestWin(totalWin);
      }
      
      // 연승 기록
      setCurrentStreak(prev => prev + 1);
      
      // 승리 애니메이션
      if (totalWin >= 1000) {
        // 큰 승리 시 특별한 애니메이션
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#8A2BE2']
        });
        
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            angle: 60
          });
        }, 200);
        
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            angle: 120
          });
        }, 400);
      } else {
        // 일반 승리 애니메이션
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      // 패배 시 연승 초기화
      setCurrentStreak(0);
    }

    // 4초 후 다음 게임 준비
    setTimeout(() => {
      setGameState('idle');
      setBets([]);
      setCurrentResult(null);
      setSpinStartTime(null);
    }, 4000);
  }, [bets, biggestWin]);

  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const profitLoss = balance - 10000 + totalBetAmount; // 초기 잔액 고려

  // 실시간 시계
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#151525] to-[#1a1a2e] relative">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto p-6 space-y-8">
        {/* 헤더 - 카지노 스타일 */}
        <Card className="glass-surface border-yellow-500/30 bg-gradient-to-r from-[#151525]/90 to-[#1a1a2e]/90 shadow-2xl">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl neon-glow-gold">
                  <Crown className="w-10 h-10 text-black" />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent neon-text">
                    🎰 ROYAL ROULETTE
                  </h1>
                  <p className="text-gray-300 text-lg mt-2">Premium Casino Experience • Live Gaming</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Live Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <p className="text-xl font-mono text-yellow-400">
                      {currentTime.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-16 bg-white/20" />
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Session Games</p>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <p className="text-xl font-semibold text-purple-400">{gameCount}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 상태 바 */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-yellow-400" />
                  <span className="text-2xl font-semibold text-white">Balance:</span>
                  <Badge className="text-3xl px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-0 shadow-xl font-bold">
                    ${balance.toLocaleString()}
                  </Badge>
                </div>
                
                {profitLoss !== 0 && (
                  <div className="flex items-center gap-3">
                    <TrendingUp className={`w-6 h-6 ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="text-lg text-white">P&L:</span>
                    <Badge className={`text-xl px-6 py-3 font-bold ${profitLoss >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'}`}>
                      {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}
                    </Badge>
                  </div>
                )}
                
                {totalBetAmount > 0 && (
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-orange-400" />
                    <span className="text-lg text-white">Total Bet:</span>
                    <Badge className="text-xl px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold">
                      ${totalBetAmount.toLocaleString()}
                    </Badge>
                  </div>
                )}

                {currentStreak > 0 && (
                  <div className="flex items-center gap-3">
                    <Flame className="w-6 h-6 text-red-400" />
                    <span className="text-lg text-white">Win Streak:</span>
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold">
                      {currentStreak} 🔥
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-6">
                <Badge 
                  className={`text-xl px-6 py-3 font-bold ${
                    gameState === 'idle' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                    gameState === 'spinning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' :
                    'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}
                >
                  {gameState === 'idle' ? '🟢 Ready to Play' : gameState === 'spinning' ? '🟡 Spinning...' : '🔴 Result'}
                </Badge>
                
                <Button
                  onClick={handleSpin}
                  disabled={gameState !== 'idle' || bets.length === 0 || balance < 0}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white neon-glow shadow-2xl px-10 py-5 text-xl font-bold transition-all duration-300 disabled:opacity-50"
                >
                  {gameState === 'spinning' ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Spinning...
                    </>
                  ) : (
                    <>
                      <Play className="w-7 h-7 mr-3" />
                      SPIN THE WHEEL
                      {bets.length > 0 && (
                        <Badge className="ml-3 bg-white text-purple-700 font-bold text-sm">
                          {bets.length} bets
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 승리 애니메이션 */}
            <AnimatePresence>
              {gameState === 'result' && winAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.3 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-12 py-6 rounded-2xl shadow-2xl border-4 border-yellow-300 neon-glow-gold">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        {winAmount >= 1000 ? <Crown className="w-12 h-12" /> : <Trophy className="w-8 h-8" />}
                        <span className="text-3xl font-bold">
                          {winAmount >= 5000 ? '🏆 MEGA WIN! 🏆' : winAmount >= 1000 ? '👑 BIG WIN! 👑' : '🎉 WIN! 🎉'}
                        </span>
                        {winAmount >= 1000 ? <Crown className="w-12 h-12" /> : <Trophy className="w-8 h-8" />}
                      </div>
                      <div className="text-5xl font-bold neon-text">
                        +${winAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* 메인 게임 영역 */}
        <div className="grid xl:grid-cols-12 gap-8">
          {/* 룰렛 휠과 히스토리 */}
          <div className="xl:col-span-4 space-y-8">
            {/* 룰렛 휠 */}
            <Card className="glass-surface border-yellow-500/30 bg-gradient-to-br from-[#151525]/80 to-[#1a1a2e]/60 shadow-2xl">
              <div className="p-6">
                <div className="flex flex-col items-center space-y-8">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-yellow-400 neon-text mb-2">European Roulette</h2>
                    <p className="text-gray-300">Single Zero • 37 Numbers</p>
                  </div>
                  
                  <RouletteWheel
                    isSpinning={gameState === 'spinning'}
                    result={currentResult}
                    onSpinComplete={handleSpinComplete}
                  />
                  
                  {/* 현재 결과 표시 */}
                  <AnimatePresence>
                    {gameState === 'result' && currentResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="text-center space-y-4 p-6 glass-surface rounded-xl border border-yellow-500/30"
                      >
                        <p className="text-2xl text-gray-300 font-semibold">🎯 Winning Number</p>
                        <Badge 
                          className={`text-6xl px-12 py-6 shadow-2xl border-4 font-bold ${
                            getNumberColor(currentResult) === 'red' ? 'bg-gradient-to-br from-red-600 to-red-800 border-red-400' :
                            getNumberColor(currentResult) === 'black' ? 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-500' :
                            'bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-400'
                          } text-white neon-glow`}
                        >
                          {currentResult}
                        </Badge>
                        <div className="space-y-2">
                          <p className="text-xl text-yellow-400 capitalize font-semibold">
                            {getNumberColor(currentResult)} Number
                          </p>
                          <p className="text-lg text-gray-300">
                            {currentResult === 0 ? 'Zero' : `${currentResult % 2 === 0 ? 'Even' : 'Odd'} • ${currentResult <= 18 ? 'Low' : 'High'}`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>

            {/* 통계 카드 */}
            {(totalWinnings > 0 || biggestWin > 0 || gameCount > 0) && (
              <Card className="glass-surface border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                <div className="p-6 space-y-4">
                  <h3 className="text-green-400 font-bold text-xl flex items-center gap-3 neon-text">
                    <Star className="w-6 h-6" />
                    Session Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Games Played:</span>
                        <span className="font-bold text-white">{gameCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Winnings:</span>
                        <span className="font-bold text-green-400">
                          ${totalWinnings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Biggest Win:</span>
                        <span className="font-bold text-yellow-400">
                          ${biggestWin.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Win Streak:</span>
                        <span className="font-bold text-orange-400">
                          {currentStreak} 🔥
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 게임 히스토리 */}
            <GameHistory history={history} />
          </div>

          {/* 베팅 테이블 */}
          <div className="xl:col-span-8">
            <BettingTable
              bets={bets}
              balance={balance}
              isSpinning={gameState !== 'idle'}
              onPlaceBet={handlePlaceBet}
              onRemoveBet={handleRemoveBet}
              onClearBets={handleClearBets}
            />
          </div>
        </div>

        {/* 현재 베팅 목록 */}
        <AnimatePresence>
          {bets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <Card className="glass-surface border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-violet-900/20 shadow-2xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-purple-400 flex items-center gap-3 neon-text">
                      <Zap className="w-7 h-7" />
                      Active Bets ({bets.length})
                    </h3>
                    <Badge className="text-2xl px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-xl">
                      Total: ${totalBetAmount.toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {bets.map((bet, index) => (
                      <motion.div
                        key={bet.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                        transition={{ delay: index * 0.05, type: "spring" }}
                        className="bg-gradient-to-br from-[#151525] to-[#1a1a2e] rounded-xl p-6 border border-yellow-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <p className="font-bold text-yellow-400 text-lg">
                              {bet.type === 'number' ? `Number ${bet.value}` : bet.type.toUpperCase().replace('_', ' ')}
                            </p>
                            <p className="text-gray-300">
                              ${bet.amount} @ {bet.payout}:1
                            </p>
                            <p className="text-green-400 font-semibold">
                              Win: ${(bet.amount * bet.payout).toLocaleString()}
                            </p>
                          </div>
                          {gameState === 'idle' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveBet(bet.id)}
                              className="h-10 w-10 p-0 border-red-500 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}