'use client';

import React from 'react';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';

interface BetControlProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  maxBet: number;
  disabled?: boolean;
}

export function BetControl({ betAmount, setBetAmount, maxBet, disabled }: BetControlProps) {
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
          className="h-12 w-12 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="text-center px-6 py-3 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 border border-amber-400/30 rounded-2xl backdrop-blur-xl shadow-lg min-w-[120px]">
          <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold">베팅</div>
          <div className="font-['Epilogue'] font-bold text-amber-100">
            {betAmount}
          </div>
        </div>

        <Button
          onClick={increaseBet}
          disabled={disabled || betAmount >= maxBet}
          variant="outline"
          size="icon"
          className="h-12 w-12 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* 퀵 베팅 옵션 */}
      <div className="flex justify-center gap-2">
        {betOptions.map((amount) => (
          <Button
            key={amount}
            onClick={() => setBetAmount(amount)}
            disabled={disabled || amount > maxBet}
            variant={betAmount === amount ? "default" : "outline"}
            size="sm"
            className={`h-8 px-3 font-['IBM_Plex_Sans_KR'] font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none ${
              betAmount === amount
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black border-amber-400/50 shadow-lg'
                : 'bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40'
            } rounded-lg`}
          >
            {amount}
          </Button>
        ))}
      </div>
    </div>
  );
}