'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { HelpCircle, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameFooterProps {
  className?: string;
}

export function GameFooter({ className }: GameFooterProps) {
  const [showRules, setShowRules] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <footer className={`w-full p-4 ${className || ''}`}>
      <div className="max-w-md mx-auto space-y-3">
        
        {/* 카지노 브랜딩 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/15 to-amber-600/15 border border-amber-500/25 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-amber-400/80 rounded-full animate-pulse"></div>
            <span className="font-['Exo'] text-amber-200 font-medium">PREMIUM CASINO</span>
            <div className="w-1.5 h-1.5 bg-amber-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 justify-center">
          
          {/* 게임 규칙 버튼 */}
          <Button
            onClick={() => setShowRules(!showRules)}
            variant="outline"
            size="sm"
            className="flex-1 h-10 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Info className="h-4 w-4 mr-2" />
            <span className="font-['IBM_Plex_Sans_KR'] font-bold">게임 규칙</span>
            {showRules ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>

          {/* 도움말 버튼 */}
          <Button
            onClick={() => setShowHelp(!showHelp)}
            variant="outline"
            size="sm"
            className="flex-1 h-10 bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-500/20 text-amber-300 hover:bg-gradient-to-b hover:from-gray-700 hover:to-gray-800 hover:text-amber-200 hover:border-amber-400/40 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            <span className="font-['IBM_Plex_Sans_KR'] font-bold">도움말</span>
            {showHelp ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </div>

        {/* 게임 규칙 패널 */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-amber-500/15 backdrop-blur-sm"
            >
              <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold mb-3">🎰 게임 규칙</div>
              <div className="space-y-2 font-['IBM_Plex_Sans_KR'] text-gray-300">
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span>🍒🍒🍒 체리 트리플</span>
                  <span className="text-amber-400 font-bold">5배</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span>🔔🔔🔔 벨 트리플</span>
                  <span className="text-amber-400 font-bold">10배</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span>💎💎💎 다이아몬드 트리플</span>
                  <span className="text-amber-400 font-bold">20배</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span>7️⃣7️⃣7️⃣ 럭키 세븐</span>
                  <span className="text-amber-400 font-bold">50배</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-600/20 to-amber-500/20 rounded border border-amber-400/30">
                  <span className="text-amber-200">⭐⭐⭐ 메가 잭팟</span>
                  <span className="text-amber-300 font-bold">전체 잭팟!</span>
                </div>
                <div className="mt-3 text-amber-300/80">
                  • 같은 심볼 2개 매칭 시 1.5배 지급
                  • 최소 베팅: 5코인, 최대 베팅: 100코인
                  • 잭팟은 50코인 이상 베팅 시에만 가능
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 도움말 패널 */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-amber-500/15 backdrop-blur-sm"
            >
              <div className="font-['IBM_Plex_Sans_KR'] text-amber-200 font-bold mb-3">💡 도움말</div>
              <div className="space-y-3 font-['IBM_Plex_Sans_KR'] text-gray-300">
                <div>
                  <div className="text-amber-300 font-bold mb-1">🎯 게임 방법</div>
                  <div>1. 베팅 금액을 선택하세요</div>
                  <div>2. SPIN TO WIN 버튼을 누르세요</div>
                  <div>3. 3개의 릴이 멈출 때까지 기다리세요</div>
                  <div>4. 같은 심볼이 나오면 승리!</div>
                </div>
                <div>
                  <div className="text-amber-300 font-bold mb-1">💰 베팅 팁</div>
                  <div>• 높은 베팅일수록 더 큰 상금 기회</div>
                  <div>• 연속 패배 시 승리 확률 증가</div>
                  <div>• 잭팟은 50코인 이상 베팅 시 가능</div>
                </div>
                <div>
                  <div className="text-amber-300 font-bold mb-1">🎲 확률 정보</div>
                  <div>• 기본 승리 확률: 약 15%</div>
                  <div>• 연속 패배 시 확률 보너스 적용</div>
                  <div>• 잭팟 확률: 0.1% (고액 베팅 시)</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}