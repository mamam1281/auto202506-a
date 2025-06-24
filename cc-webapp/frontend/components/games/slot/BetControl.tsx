'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button'; // Assuming Button component is in @/components/Button
import { Minus, Plus, ChevronsDownUpIcon } from 'lucide-react'; // ChevronsDownUpIcon or similar for current bet display

interface BetControlProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  minBet?: number;
  maxBet: number; // Max bet user can make (e.g., their current token balance or a game limit)
  step?: number;
  quickBetOptions?: number[];
  disabled?: boolean;
  className?: string;
}

export const BetControl: React.FC<BetControlProps> = ({
  betAmount,
  setBetAmount,
  minBet = 5,
  maxBet,
  step = 5,
  quickBetOptions = [5, 10, 25, 50, 100],
  disabled = false,
  className = '',
}) => {
  const increaseBet = () => {
    setBetAmount(Math.min(betAmount + step, maxBet));
  };

  const decreaseBet = () => {
    setBetAmount(Math.max(betAmount - step, minBet));
  };

  const handleQuickBetSelect = (amount: number) => {
    if (amount <= maxBet && amount >= minBet) {
      setBetAmount(amount);
    } else if (amount > maxBet) {
        setBetAmount(maxBet); // If quick bet is higher than max, set to max
    } else {
        setBetAmount(minBet); // If quick bet is lower than min, set to min
    }
  };

  const buttonBaseStyle = "h-10 w-10 sm:h-12 sm:w-12 text-amber-300 rounded-xl shadow-lg transform transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed";
  const buttonNormalStyle = "bg-gradient-to-b from-slate-700/70 to-slate-800/70 border border-amber-500/30 hover:from-slate-600/70 hover:to-slate-700/70 hover:border-amber-400/50 active:scale-95";
  const buttonDisabledStyle = "bg-slate-800 border-slate-700";

  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      {/* Bet Amount Adjust Buttons & Display */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <motion.button
          onClick={decreaseBet}
          disabled={disabled || betAmount <= minBet}
          className={`${buttonBaseStyle} ${disabled || betAmount <= minBet ? buttonDisabledStyle : buttonNormalStyle}`}
          whileTap={!(disabled || betAmount <= minBet) ? { scale: 0.90 } : {}}
        >
          <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>

        <div className="text-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 border border-amber-400/40 rounded-2xl backdrop-blur-sm shadow-lg min-w-[100px] sm:min-w-[120px]">
          <div className="text-xs sm:text-sm font-medium text-amber-200/90 mb-0.5 tracking-wide">Current Bet</div>
          <div className="text-lg sm:text-xl font-bold text-amber-100 flex items-center justify-center gap-1">
            {betAmount} <Diamond size={14} className="opacity-70 inline-block" />
          </div>
        </div>

        <motion.button
          onClick={increaseBet}
          disabled={disabled || betAmount >= maxBet}
          className={`${buttonBaseStyle} ${disabled || betAmount >= maxBet ? buttonDisabledStyle : buttonNormalStyle}`}
          whileTap={!(disabled || betAmount >= maxBet) ? { scale: 0.90 } : {}}
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>
      </div>

      {/* Quick Bet Options */}
      <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
        {quickBetOptions.map((amount) => (
          <Button
            key={amount}
            onClick={() => handleQuickBetSelect(amount)}
            disabled={disabled || amount > maxBet} // Disable if option is greater than max possible bet
            variant={'default'} // Use 'default' and rely on className for specific styling
            size="sm" // Standardized size from Button component
            className={`
              h-8 px-3 text-xs sm:text-sm font-bold transition-all duration-150 ease-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400
              disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:hover:scale-100
              ${betAmount === amount && !disabled // Active and not disabled
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-900 border-2 border-yellow-200/80 shadow-lg scale-105'
                : disabled || amount > maxBet // Disabled or invalid option
                ? 'bg-slate-700 text-slate-500 border border-slate-600'
                : 'bg-slate-700/80 text-amber-200/90 border border-amber-500/40 hover:bg-slate-600/80 hover:border-amber-400/60 hover:scale-105 active:scale-98 shadow-md'
              }
              rounded-lg
            `}
          >
            {amount}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BetControl;
