'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import type { SpinButtonProps } from './types';
import { Button } from '../../Button';

export const SpinButton: React.FC<SpinButtonProps> = ({ 
  onSpin, 
  disabled, 
  isSpinning 
}) => {
  const canSpin = !disabled && !isSpinning;

  return (
    <Button
      onClick={onSpin}
      disabled={disabled}
      variant="default"
      size="lg"
      className={
        `w-full h-16 font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-amber-400/50 rounded-2xl shadow-2xl relative overflow-hidden text-black
        hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500
        transition-all duration-200
        ${canSpin ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`
      }
      style={{
        boxShadow: canSpin ? '0 0 15px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none'
      }}
      aria-label={
        isSpinning 
          ? '슬롯머신이 돌아가는 중입니다...'
          : disabled
          ? '베팅 금액이 부족합니다. 베팅을 조정해주세요.'
          : '스핀 버튼을 눌러 게임을 시작하세요'
      }
    >
      {/* 버튼 하이라이트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 rounded-2xl pointer-events-none"></div>
      <span className="relative z-10 flex items-center justify-center gap-3">
        {isSpinning ? (
          <motion.div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="h-6 w-6" />
            </motion.div>
            <span>SPINNING...</span>
          </motion.div>
        ) : (
          <>
            <Star className="h-6 w-6" />
            <span>SPIN TO WIN</span>
            <Star className="h-6 w-6" />
          </>
        )}
      </span>
    </Button>
  );
};
