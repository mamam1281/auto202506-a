'use client';

import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Coins, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameHeaderProps {
  userCoins: number;
  onExit?: () => void;
  className?: string;
}

export function GameHeader({ userCoins, onExit, className }: GameHeaderProps) {
  return (
    <header className={`w-full p-4 ${className || ''}`}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 나가기 버튼 */}
        <Button
          onClick={onExit}
          variant="outline"
          size="sm"
          className="h-12 px-4 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-['IBM_Plex_Sans_KR'] font-bold">나가기</span>
        </Button>

        {/* 잔액 표시 */}
        <motion.div 
          className="bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 border border-amber-400/30 rounded-2xl px-6 py-3 backdrop-blur-xl shadow-lg"
          animate={{
            boxShadow: [
              '0 0 8px rgba(251, 191, 36, 0.2)',
              '0 0 12px rgba(251, 191, 36, 0.3)',
              '0 0 8px rgba(251, 191, 36, 0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-300" />
            <div className="text-center">
              <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold">잔액</div>
              <div className="font-['Epilogue'] font-bold text-amber-100">
                {userCoins.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 홈 버튼 */}
        <Button
          variant="outline"
          size="sm"
          className="h-12 px-4 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Home className="h-5 w-5 mr-2" />
          <span className="font-['IBM_Plex_Sans_KR'] font-bold">홈</span>
        </Button>
      </div>
    </header>
  );
}