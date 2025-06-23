'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../../Button';

interface BetControlProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  maxBet: number;
  disabled?: boolean;
}

export const BetControl: React.FC<BetControlProps> = ({ 
  betAmount, 
  setBetAmount, 
  maxBet, 
  disabled = false 
}) => {
  const minBet = 5;
  const betOptions = [5, 10, 25, 50, 100];

  const increaseBet = () => {
    const nextBet = Math.min(betAmount + 5, maxBet);
    setBetAmount(nextBet);
  };

  const decreaseBet = () => {
    const nextBet = Math.max(betAmount - 5, minBet);
    setBetAmount(nextBet);
  };

  return (
    <div className="mb-6">
      {/* 베팅 금액 조절 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          onClick={decreaseBet}
          disabled={disabled || betAmount <= minBet}
          variant="outline"
          size="icon"
          className="h-12 w-12 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
          aria-label={`베팅 금액 감소. 현재 ${betAmount} 토큰`}
          type="button"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="text-center px-6 py-3 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 border border-amber-400/30 rounded-2xl backdrop-blur-xl shadow-lg min-w-[120px]">
          <div className="font-bold text-amber-200 text-sm">베팅</div>
          <div className="font-bold text-amber-100 text-xl">
            {betAmount}
          </div>
        </div>

        <Button
          onClick={increaseBet}
          disabled={disabled || betAmount >= maxBet}
          variant="outline"
          size="icon"
          className="h-12 w-12 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
          aria-label={`베팅 금액 증가. 현재 ${betAmount} 토큰`}
          type="button"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* 베팅 옵션 버튼 */}
      <div className="flex items-center justify-center gap-2">
        {betOptions.map((option) => (
          <Button
            key={option}
            onClick={() => setBetAmount(option)}
            disabled={disabled || betAmount === option || option > maxBet}
            variant={betAmount === option ? 'secondary' : 'outline'}
            size="sm"
            className={`px-3 py-1 rounded-lg font-bold border border-amber-400/30 ${betAmount === option ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black shadow-md' : 'bg-gradient-to-b from-gray-800 to-gray-900 text-amber-200 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-100'} transition-all duration-150`}
            aria-label={`베팅 금액 ${option} 선택`}
            type="button"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
