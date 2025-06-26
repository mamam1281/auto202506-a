'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface SlotMachineHeader1Props {
  jackpot: number;
  className?: string;
}

export const SlotMachineHeader1: React.FC<SlotMachineHeader1Props> = ({
  jackpot,
  className = '',
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`w-full bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl py-[15px] px-8 sm:px-12 text-center relative overflow-hidden mx-auto ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <motion.div
          className="w-full text-center flex flex-col items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[var(--color-text-primary)] text-xs md:text-sm opacity-75 mb-3 sm:mb-4">JACKPOT</div>
          <div className="text-[var(--color-accent-amber)] text-2xl sm:text-4xl font-bold tracking-wider flex items-center justify-center">
            <Trophy className="w-7 h-7 md:w-8 md:h-8 mr-4" />
            {formatNumber(jackpot)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SlotMachineHeader1;
