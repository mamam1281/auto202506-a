'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { Gem, ListOrdered, Info, Minus, Plus } from 'lucide-react';

// 슬롯 머신 컴포넌트 관련 파일 불러오기
import SlotReel from '../../../components/games/slot/SlotReel';
import BetControl from '../../../components/games/slot/BetControl';
import GameFooter from '../../../components/games/slot/GameFooter';

// SYMBOLS은 실제 게임에서 사용할 심볼입니다
const SYMBOLS = ['🍒', '🔔', '💎', '7️⃣', '⭐'];

// 스핀 결과 생성
const generateSpinResult = (): string[] => {
  return [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  ];
};

// 승리 조건 확인 및 배당 계산
const checkWinCondition = (reels: string[], betAmount: number): any => {
  const symbolMap: { [key: string]: number } = {};
  let allSame = true;
  
  // 카운팅 및 모두 같은지 확인
  for (let i = 0; i < reels.length; i++) {
    symbolMap[reels[i]] = (symbolMap[reels[i]] || 0) + 1;
    if (i > 0 && reels[i] !== reels[0]) {
      allSame = false;
    }
  }

  // 승리 조건 확인
  if (allSame) {
    // 잭팟 - 3개의 별
    if (reels[0] === '⭐') {
      return {
        isWin: true,
        payoutMultiplier: 100,
        winAmount: betAmount * 100,
        message: "🎊 메가 잭팟! 100배 당첨! 🎊",
        type: "jackpot"
      };
    }
    // 일반 3개 매치
    const multipliers: { [key: string]: number } = {
      '7️⃣': 50,
      '💎': 20,
      '🔔': 10,
      '🍒': 5
    };
    const multiplier = multipliers[reels[0]] || 5;
    return {
      isWin: true,
      payoutMultiplier: multiplier,
      winAmount: betAmount * multiplier,
      message: `🎉 ${multiplier}배 당첨! 3개 매치!`,
      type: "triple"
    };
  } 
  else {
    // 2개 매칭
    for (const symbol in symbolMap) {
      if (symbolMap[symbol] === 2) {
        return {
          isWin: true,
          payoutMultiplier: 1.5,
          winAmount: betAmount * 1.5,
          message: "👍 1.5배 당첨! 2개 매치!",
          type: "double"
        };
      }
    }
  }

  // 패배
  return {
    isWin: false,
    payoutMultiplier: 0,
    winAmount: 0,
    message: "다음 기회에... 다시 도전하세요!",
    type: "loss"
  };
};

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">코스믹 포츈 로딩 중...</p>
      </div>
    </div>
  );
}

// 코스믹 포츈 게임 메인 컴포넌트
function CosmicFortuneGamePage() {
  const [gameState, setGameState] = useState('idle');
  const [reels, setReels] = useState(['💎', '🔔', '🍒']); // 초기 심볼
  const [betAmount, setBetAmount] = useState(10);
  const [winResult, setWinResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [jackpot, setJackpot] = useState(125780);
  const [balance, setBalance] = useState(1000);
  const [shake, setShake] = useState(false);

  // 잭팟 애니메이션 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = useCallback(async () => {
    if (balance < betAmount || isSpinning) return;

    setIsSpinning(true);
    setGameState('spinning');
    setBalance(prev => prev - betAmount);
    setWinResult(null);
    setShake(false);

    // 스핀 결과 생성 및 적용
    setTimeout(() => {
      const newReels = generateSpinResult();
      const result = checkWinCondition(newReels, betAmount);
      
      setReels(newReels);
      setWinResult(result);
      
      if (result.isWin) {
        setBalance(prev => prev + result.winAmount);
        if (result.type === "jackpot") {
          setShake(true);
        }
      }
      
      setIsSpinning(false);
      setGameState('result');
      
      // 일정 시간 후 대기 상태로 되돌리기
      setTimeout(() => {
        setGameState('idle');
      }, 3000);
    }, 2000);
  }, [betAmount, balance, isSpinning]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{ textShadow: '0 0 20px var(--color-purple-tertiary), 0 0 10px var(--color-purple-primary), 0 4px 8px rgba(0,0,0,0.8)' }}>
            코스믹 포츈 🌠
          </h1>
          <p className="text-xl text-muted-foreground">우주의 행운을 시험해보세요!</p>
        </motion.div>
        
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={shake ? 
              { opacity: 1, scale: 1, x: [-5, 5, -5, 5, 0] } : 
              { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-xl p-6 text-center"
          >
            {/* 헤더 - 잭팟과 잔액 표시 */}
            <div className="bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] p-4 rounded-lg text-center relative overflow-hidden mb-6">
              <motion.div 
                className="absolute inset-0 bg-[url('/sparkles.png')] bg-repeat opacity-30"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10 flex justify-between items-center">
                <div className="text-left">
                  <div className="text-sm text-white/70 mb-0.5">내 잔액</div>
                  <div className="flex items-center text-white text-xl font-bold">
                    <Gem className="h-4 w-4 mr-1.5 text-amber-300" />
                    {balance.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-white/70 mb-0.5">잭팟 금액</div>
                  <div className="text-white text-xl font-bold">{jackpot.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            {/* 슬롯 머신 디스플레이 */}
            <div className="grid grid-cols-3 gap-4 mb-6 h-32 sm:h-40 lg:h-48">
              {reels.map((symbol, idx) => (
                <SlotReel 
                  key={idx}
                  symbol={symbol}
                  isSpinning={isSpinning}
                  delayFactor={idx}
                  isWinning={winResult?.isWin && ((winResult.type === "triple" && true) || (winResult.type === "double" && reels.filter(s => s === symbol).length >= 2))}
                />
              ))}
            </div>
            
            {/* 결과 메시지 */}
            <motion.div 
              className="h-16 flex items-center justify-center mb-6"
              key={winResult?.message || 'spin-to-win'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {winResult ? (
                <p className={cn(
                  "text-lg font-bold",
                  winResult.isWin ? 
                    (winResult.type === "jackpot" ? "text-amber-400 text-2xl" : "text-green-400") : 
                    "text-white/70"
                )}>
                  {winResult.message}
                </p>
              ) : (
                <p className="text-lg text-white/70">
                  {isSpinning ? "행운을 기원합니다..." : "스핀 버튼을 눌러 시작하세요!"}
                </p>
              )}
            </motion.div>
            
            {/* 베팅 컨트롤 */}
            <BetControl 
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              maxBet={Math.min(balance, 100)}
              disabled={isSpinning}
            />
            
            {/* 스핀 버튼 */}
            <motion.button
              onClick={handleSpin}
              disabled={!balance || isSpinning}
              whileHover={balance && !isSpinning ? { scale: 1.05 } : {}}
              whileTap={balance && !isSpinning ? { scale: 0.98 } : {}}
              className={cn(
                "bg-gradient-to-r w-full py-4 rounded-full text-xl font-bold shadow-lg transition-all duration-300 max-w-md mx-auto",
                balance && !isSpinning
                  ? "from-purple-600 to-pink-600 text-white hover:shadow-purple-500/50"
                  : "from-gray-600 to-gray-700 text-white/50 cursor-not-allowed"
              )}
            >
              🎰 스핀하기 ({betAmount})
            </motion.button>
            
            {/* 게임 푸터 */}
            <GameFooter className="mt-6 border-t border-[var(--color-border-secondary)] pt-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SlotsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CosmicFortuneGamePage />
    </Suspense>
  );
}
