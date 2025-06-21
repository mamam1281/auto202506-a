'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { GameResult, getNumberColor } from './constants';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';

interface GameHistoryProps {
  history: GameResult[];
  maxItems?: number;
}

export function GameHistory({ history, maxItems = 15 }: GameHistoryProps) {
  const displayHistory = history.slice(-maxItems).reverse();

  const getColorClass = (color: 'red' | 'black' | 'green') => {
    switch (color) {
      case 'red': return 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-500';
      case 'black': return 'bg-gradient-to-br from-gray-700 to-gray-900 text-white border-gray-600';
      case 'green': return 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-emerald-500';
    }
  };

  const getAdvancedStats = () => {
    if (history.length === 0) return null;
    
    const recentResults = history.slice(-50);
    const redCount = recentResults.filter(r => r.color === 'red').length;
    const blackCount = recentResults.filter(r => r.color === 'black').length;
    const greenCount = recentResults.filter(r => r.color === 'green').length;
    const oddCount = recentResults.filter(r => r.number > 0 && r.number % 2 === 1).length;
    const evenCount = recentResults.filter(r => r.number > 0 && r.number % 2 === 0).length;
    const lowCount = recentResults.filter(r => r.number >= 1 && r.number <= 18).length;
    const highCount = recentResults.filter(r => r.number >= 19 && r.number <= 36).length;
    
    return {
      red: { count: redCount, percentage: (redCount / recentResults.length) * 100 },
      black: { count: blackCount, percentage: (blackCount / recentResults.length) * 100 },
      green: { count: greenCount, percentage: (greenCount / recentResults.length) * 100 },
      odd: { count: oddCount, percentage: (oddCount / recentResults.length) * 100 },
      even: { count: evenCount, percentage: (evenCount / recentResults.length) * 100 },
      low: { count: lowCount, percentage: (lowCount / recentResults.length) * 100 },
      high: { count: highCount, percentage: (highCount / recentResults.length) * 100 },
      total: recentResults.length
    };
  };

  const stats = getAdvancedStats();

  return (
    <div className="space-y-6">
      {/* 최근 결과 */}
      <Card className="glass-surface border-[--color-game-gold]/30">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[--color-game-gold]" />
            <h3 className="text-[--color-game-gold] neon-text font-semibold">Recent Results</h3>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            <AnimatePresence>
              {displayHistory.map((result, index) => (
                <motion.div
                  key={`${result.timestamp}-${result.number}`}
                  initial={{ opacity: 0, scale: 0.3, rotateY: -180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.3, rotateY: 180 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.05,
                    ease: "backOut"
                  }}
                  className="flex items-center justify-center"
                >
                  <Badge 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold 
                      shadow-xl border-2 ${getColorClass(result.color)}
                      hover:scale-110 transition-transform cursor-pointer
                    `}
                  >
                    {result.number}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {history.length === 0 && (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-border rounded-lg">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No games played yet</p>
              <p className="text-sm mt-1">Place your bets and spin to see results</p>
            </div>
          )}
        </div>
      </Card>

      {/* 상세 통계 */}
      {stats && (
        <Card className="glass-surface border-[--color-game-gold]/30">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[--color-game-gold]" />
              <h3 className="text-[--color-game-gold] neon-text font-semibold">
                Statistics (Last {stats.total} spins)
              </h3>
            </div>

            <div className="space-y-4">
              {/* 색상 통계 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Color Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-600 rounded-full border border-red-500" />
                      <span className="text-sm">Red</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.red.percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium min-w-[40px]">
                        {stats.red.count} ({stats.red.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-800 rounded-full border border-gray-600" />
                      <span className="text-sm">Black</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.black.percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium min-w-[40px]">
                        {stats.black.count} ({stats.black.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-600 rounded-full border border-emerald-500" />
                      <span className="text-sm">Green</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.green.percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium min-w-[40px]">
                        {stats.green.count} ({stats.green.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기타 통계 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Odd/Even</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Odd:</span>
                      <span className="font-medium">{stats.odd.count} ({stats.odd.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Even:</span>
                      <span className="font-medium">{stats.even.count} ({stats.even.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">High/Low</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Low (1-18):</span>
                      <span className="font-medium">{stats.low.count} ({stats.low.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High (19-36):</span>
                      <span className="font-medium">{stats.high.count} ({stats.high.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 핫/콜드 넘버 */}
      {history.length >= 10 && (
        <Card className="glass-surface border-[--color-game-success]/30">
          <div className="p-4">
            <h3 className="text-[--color-game-success] font-semibold mb-4">Number Trends</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <p className="text-sm font-medium text-red-400">Hot Numbers</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {getHotNumbers(history).map(({ number, count }) => (
                    <Badge 
                      key={number} 
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white text-xs px-2 py-1"
                    >
                      {number} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-medium text-blue-400">Cold Numbers</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {getColdNumbers(history).map(({ number, count }) => (
                    <Badge 
                      key={number} 
                      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs px-2 py-1"
                    >
                      {number} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// 자주 나온 숫자 (핫 넘버) - 카운트 포함
function getHotNumbers(history: GameResult[]): Array<{number: number, count: number}> {
  const counts = new Map<number, number>();
  
  history.slice(-100).forEach(result => {
    counts.set(result.number, (counts.get(result.number) || 0) + 1);
  });
  
  return Array.from(counts.entries())
    .map(([number, count]) => ({ number, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

// 적게 나온 숫자 (콜드 넘버) - 카운트 포함
function getColdNumbers(history: GameResult[]): Array<{number: number, count: number}> {
  const allNumbers = Array.from({ length: 37 }, (_, i) => i);
  const counts = new Map<number, number>();
  
  // 모든 숫자를 0으로 초기화
  allNumbers.forEach(num => counts.set(num, 0));
  
  // 최근 100게임의 결과 카운트
  history.slice(-100).forEach(result => {
    counts.set(result.number, (counts.get(result.number) || 0) + 1);
  });
  
  return Array.from(counts.entries())
    .map(([number, count]) => ({ number, count }))
    .sort((a, b) => a.count - b.count)
    .slice(0, 6);
}