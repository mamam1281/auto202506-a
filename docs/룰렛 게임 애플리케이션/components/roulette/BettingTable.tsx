'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Bet, BetType, getBetPayout, getNumberColor } from './constants';
import { Coins, Minus, Plus, RotateCcw, Target } from 'lucide-react';
import { useState } from 'react';

interface BettingTableProps {
  bets: Bet[];
  balance: number;
  isSpinning: boolean;
  onPlaceBet: (bet: Omit<Bet, 'id'>) => void;
  onRemoveBet: (betId: string) => void;
  onClearBets: () => void;
}

export function BettingTable({ bets, balance, isSpinning, onPlaceBet, onRemoveBet, onClearBets }: BettingTableProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedChip, setSelectedChip] = useState(10);

  const chipValues = [1, 5, 10, 25, 50, 100, 500];

  const handleNumberBet = (number: number) => {
    if (isSpinning || balance < betAmount) return;
    
    onPlaceBet({
      type: 'number',
      value: number,
      amount: betAmount,
      payout: getBetPayout('number')
    });
  };

  const handleOutsideBet = (type: BetType) => {
    if (isSpinning || balance < betAmount) return;
    
    onPlaceBet({
      type,
      value: type,
      amount: betAmount,
      payout: getBetPayout(type)
    });
  };

  const getBetForNumber = (number: number) => {
    return bets.find(bet => bet.type === 'number' && bet.value === number);
  };

  const getBetForType = (type: BetType) => {
    return bets.find(bet => bet.type === type);
  };

  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  // 칩 컴포넌트
  const ChipComponent = ({ value, isSelected, onClick, disabled }: { 
    value: number; 
    isSelected: boolean; 
    onClick: () => void; 
    disabled: boolean;
  }) => {
    const getChipColor = (val: number) => {
      if (val === 1) return 'from-white to-gray-200 text-black border-gray-400';
      if (val === 5) return 'from-red-500 to-red-700 text-white border-red-800';
      if (val === 10) return 'from-blue-500 to-blue-700 text-white border-blue-800';
      if (val === 25) return 'from-green-500 to-green-700 text-white border-green-800';
      if (val === 50) return 'from-purple-500 to-purple-700 text-white border-purple-800';
      if (val === 100) return 'from-black to-gray-800 text-white border-gray-700';
      return 'from-yellow-400 to-yellow-600 text-black border-yellow-700';
    };

    return (
      <motion.button
        className={`
          relative w-12 h-12 rounded-full border-4 bg-gradient-to-br ${getChipColor(value)}
          shadow-lg transition-all duration-200 font-bold text-sm
          ${isSelected ? 'scale-110 shadow-xl neon-glow' : 'hover:scale-105'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          ${value}
        </span>
        {/* 칩 테두리 효과 */}
        <div className="absolute inset-1 rounded-full border border-white/30" />
      </motion.button>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* 베팅 컨트롤 패널 */}
      <Card className="glass-surface border-[--color-game-gold]/30 bg-gradient-to-br from-[--color-bg-secondary] to-[--color-bg-primary]">
        <div className="p-6">
          {/* 상단 정보 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-[--color-game-gold]" />
                <span className="text-lg">Balance:</span>
                <Badge className="text-xl px-4 py-2 bg-gradient-to-r from-[--color-game-gold] to-yellow-500 text-black border-0">
                  ${balance.toLocaleString()}
                </Badge>
              </div>
              {totalBetAmount > 0 && (
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[--color-game-warning]" />
                  <span>Total Bet:</span>
                  <Badge className="text-lg px-3 py-1 bg-[--color-game-warning] text-black">
                    ${totalBetAmount}
                  </Badge>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={onClearBets}
              disabled={isSpinning || bets.length === 0}
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All Bets
            </Button>
          </div>

          {/* 칩 선택 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-[--color-game-gold]">Select Chip Value:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {chipValues.map(value => (
                <ChipComponent
                  key={value}
                  value={value}
                  isSelected={selectedChip === value}
                  onClick={() => {
                    setSelectedChip(value);
                    setBetAmount(value);
                  }}
                  disabled={isSpinning || balance < value}
                />
              ))}
            </div>

            {/* 베팅 금액 조정 */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <span className="text-lg">Bet Amount:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                  disabled={isSpinning}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Badge className="text-lg px-4 py-2 min-w-[80px] justify-center bg-[--color-neon-purple-2] text-white">
                  ${betAmount}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.min(balance, betAmount + 1))}
                  disabled={isSpinning}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 메인 베팅 테이블 */}
      <Card className="glass-surface border-[--color-game-gold]/30 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10">
        <div className="p-6">
          <div className="bg-emerald-900/30 rounded-xl p-6 border-2 border-[--color-game-gold]/20">
            
            {/* 0과 00 (유럽식 룰렛이므로 0만) */}
            <div className="mb-4">
              <motion.button
                className="w-full h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-lg flex items-center justify-center relative disabled:opacity-50 transition-all shadow-lg border-2 border-emerald-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNumberBet(0)}
                disabled={isSpinning}
              >
                <span className="text-2xl font-bold">0</span>
                {getBetForNumber(0) && (
                  <Badge className="absolute -top-3 -right-3 bg-[--color-game-gold] text-black text-sm font-bold border-2 border-yellow-600">
                    ${getBetForNumber(0)!.amount}
                  </Badge>
                )}
              </motion.button>
            </div>

            {/* 1-36 숫자 그리드 */}
            <div className="grid grid-cols-12 gap-1 mb-6">
              {Array.from({ length: 36 }, (_, i) => i + 1).map(number => {
                const color = getNumberColor(number);
                const bgColor = color === 'red' 
                  ? 'from-red-600 to-red-800 border-red-500' 
                  : 'from-gray-700 to-gray-900 border-gray-600';
                const hoverColor = color === 'red'
                  ? 'hover:from-red-500 hover:to-red-700'
                  : 'hover:from-gray-600 hover:to-gray-800';
                const bet = getBetForNumber(number);
                
                return (
                  <motion.button
                    key={number}
                    className={`
                      h-12 bg-gradient-to-br ${bgColor} ${hoverColor} text-white rounded 
                      flex items-center justify-center relative disabled:opacity-50 
                      transition-all font-bold border-2 shadow-md
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNumberBet(number)}
                    disabled={isSpinning}
                  >
                    <span>{number}</span>
                    {bet && (
                      <Badge className="absolute -top-2 -right-2 bg-[--color-game-gold] text-black text-xs font-bold border border-yellow-600">
                        ${bet.amount}
                      </Badge>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 외부 베팅 영역 */}
            <div className="space-y-3">
              {/* 1:1 베팅 */}
              <div className="grid grid-cols-6 gap-2">
                {[
                  { type: 'red' as BetType, label: 'Red', color: 'from-red-600 to-red-800 border-red-500' },
                  { type: 'black' as BetType, label: 'Black', color: 'from-gray-700 to-gray-900 border-gray-600' },
                  { type: 'odd' as BetType, label: 'Odd', color: 'from-[--color-neon-purple-2] to-[--color-neon-purple-1] border-purple-500' },
                  { type: 'even' as BetType, label: 'Even', color: 'from-[--color-neon-purple-2] to-[--color-neon-purple-1] border-purple-500' },
                  { type: 'low' as BetType, label: '1-18', color: 'from-blue-600 to-blue-800 border-blue-500' },
                  { type: 'high' as BetType, label: '19-36', color: 'from-blue-600 to-blue-800 border-blue-500' },
                ].map(({ type, label, color }) => {
                  const bet = getBetForType(type);
                  return (
                    <motion.button
                      key={type}
                      className={`
                        h-14 bg-gradient-to-br ${color} hover:opacity-90 text-white rounded-lg 
                        flex items-center justify-center relative disabled:opacity-50 
                        transition-all font-bold border-2 shadow-lg
                      `}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleOutsideBet(type)}
                      disabled={isSpinning}
                    >
                      <div className="text-center">
                        <div className="text-sm font-bold">{label}</div>
                        <div className="text-xs opacity-80">1:1</div>
                      </div>
                      {bet && (
                        <Badge className="absolute -top-2 -right-2 bg-[--color-game-gold] text-black text-xs font-bold border border-yellow-600">
                          ${bet.amount}
                        </Badge>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* 2:1 베팅 (다즌과 컬럼) */}
              <div className="grid grid-cols-6 gap-2">
                {[
                  { type: 'dozen1' as BetType, label: '1st Dozen', sublabel: '1-12' },
                  { type: 'dozen2' as BetType, label: '2nd Dozen', sublabel: '13-24' },
                  { type: 'dozen3' as BetType, label: '3rd Dozen', sublabel: '25-36' },
                  { type: 'column1' as BetType, label: '1st Column', sublabel: '2:1' },
                  { type: 'column2' as BetType, label: '2nd Column', sublabel: '2:1' },
                  { type: 'column3' as BetType, label: '3rd Column', sublabel: '2:1' },
                ].map(({ type, label, sublabel }) => {
                  const bet = getBetForType(type);
                  return (
                    <motion.button
                      key={type}
                      className="
                        h-14 bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 
                        text-white rounded-lg flex items-center justify-center relative disabled:opacity-50 
                        transition-all font-bold border-2 border-amber-500 shadow-lg
                      "
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleOutsideBet(type)}
                      disabled={isSpinning}
                    >
                      <div className="text-center">
                        <div className="text-xs font-bold">{label}</div>
                        <div className="text-xs opacity-80">{sublabel}</div>
                      </div>
                      {bet && (
                        <Badge className="absolute -top-2 -right-2 bg-[--color-game-gold] text-black text-xs font-bold border border-yellow-600">
                          ${bet.amount}
                        </Badge>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}