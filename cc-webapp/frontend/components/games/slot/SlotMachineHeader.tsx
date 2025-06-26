'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Volume2, VolumeX } from 'lucide-react';
import Button from '../../Button';

interface SlotMachineHeaderProps {
  jackpot: number;
  balance: number;
  isSoundEnabled: boolean;
  onSoundToggle: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const SlotMachineHeader: React.FC<SlotMachineHeaderProps> = ({
  jackpot,
  balance,
  isSoundEnabled,
  onSoundToggle,
}) => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-blue)] p-10 sm:p-14 text-center relative overflow-hidden mb-8 sm:mb-12 rounded-2xl border border-[var(--color-border-primary)] shadow-2xl">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-16 sm:mb-20">
          <div className="text-[var(--color-text-primary)] text-sm md:text-base font-medium opacity-90">
            Balance: <span className="text-[var(--color-accent-amber)] font-bold">{formatNumber(balance)}</span>
          </div>
          <Button
            variant="text"
            size="sm"
            onClick={onSoundToggle}
            className="text-[var(--color-text-primary)] hover:bg-white/10"
          >
            {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
        
        <motion.div
          className="text-center mt-24 sm:mt-32 mb-6 sm:mb-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[var(--color-text-primary)] text-xs md:text-sm opacity-75 mb-12 sm:mb-16">JACKPOT</div>
          <div className="text-[var(--color-accent-amber)] text-2xl sm:text-4xl font-bold tracking-wider">
            <Trophy className="inline w-7 h-7 md:w-8 md:h-8 mr-4" />
            {formatNumber(jackpot)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SlotMachineHeader;
