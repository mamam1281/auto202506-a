'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { SlotReel } from './SlotReel'; // To be created
// import { BetControl } from './BetControl'; // To be created
import { Button } from '@/components/Button'; // Assuming Button component is in @/components/Button
import { Crown, Star, Zap, Diamond, TrendingUp, MessageSquare } from 'lucide-react';
// import confetti from 'canvas-confetti'; // Will be properly imported later

// Placeholder for slotLogic functions - to be replaced with actual imports
const placeholderCheckWinCondition = (reels: string[], bet: number) => ({ isWin: false, payout: 0, winType: '', winningPositions: [] });
const PLACEHOLDER_SYMBOLS = ['❓', '❓', '❓'];

// Placeholder for Redux hooks - to be replaced
const useAppSelector = (selector: any) => selector(mockReduxState);
const mockReduxState = {
  user: { cyberTokenBalance: 1000, streakCount: 0 },
};
// const useAppDispatch = () => (action: any) => console.log('Dispatching:', action);


export type GameState = 'idle' | 'spinning' | 'result';

interface SlotMachineProps {
  className?: string;
  // Props from backend/Redux will be added: userId, initialTokenBalance, initialStreakCount etc.
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ className }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reels, setReels] = useState<string[]>(['💎', '👑', '🎰']); // Initial symbols
  const [betAmount, setBetAmount] = useState(10); // Default bet
  const [winResult, setWinResult] = useState<any | null>(null); // Type from slotLogic
  const [isSpinning, setIsSpinning] = useState(false);
  const [jackpot, setJackpot] = useState(125780); // Example initial jackpot

  // State from Redux (placeholders for now)
  const { cyberTokenBalance, streakCount } = useAppSelector(state => state.user);
  // const dispatch = useAppDispatch();

  // Mock API call duration
  const API_CALL_DURATION = 1000; // ms

  // Jackpot animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 7) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = useCallback(async () => {
    // Logic to be implemented in later steps
    // 1. Check if user has enough tokens
    // 2. Set gameState to 'spinning', isSpinning to true
    // 3. Deduct betAmount from cyberTokenBalance (via Redux action)
    // 4. Call POST /games/slot/spin API
    // 5. Handle API response: update reels, winResult, cyberTokenBalance, streakCount
    // 6. Trigger animations, sounds, confetti
    // 7. Set gameState to 'result', isSpinning to false
    // 8. Call POST /api/actions, POST /api/feedback
    console.log('Spin initiated');
    setIsSpinning(true);
    setGameState('spinning');

    // Simulate API call and reel spin
    setTimeout(() => {
      const newReels = [
        PLACEHOLDER_SYMBOLS[Math.floor(Math.random() * PLACEHOLDER_SYMBOLS.length)],
        PLACEHOLDER_SYMBOLS[Math.floor(Math.random() * PLACEHOLDER_SYMBOLS.length)],
        PLACEHOLDER_SYMBOLS[Math.floor(Math.random() * PLACEHOLDER_SYMBOLS.length)],
      ];
      setReels(newReels);
      const result = placeholderCheckWinCondition(newReels, betAmount);
      setWinResult(result);
      setGameState('result');
      setIsSpinning(false);
      if (result.isWin) {
        // triggerConfetti(); // Confetti logic to be added
        console.log('WIN!', result.payout);
      } else {
        console.log('LOSE');
      }
    }, 2000 + API_CALL_DURATION); // Staggered stop simulation + API
  }, [betAmount, cyberTokenBalance]);

  const canSpin = cyberTokenBalance >= betAmount && !isSpinning;

  return (
    <div className={`w-full max-w-md mx-auto font-['Inter'] text-foreground ${className}`}>
      {/* Premium Casino Style Frame */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-[var(--brand-accent)] shadow-2xl p-4 sm:p-6 relative overflow-hidden modern-mesh-card ice-glassmorphism">
        {/* Optional: Inner glowing border accents */}
        <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}></div>

        {/* Jackpot Display */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-600/30 via-yellow-500/30 to-amber-600/30 border border-amber-400/50 rounded-2xl shadow-lg backdrop-blur-sm"
            animate={{ boxShadow: ['0 0 10px rgba(251, 191, 36, 0.3)', '0 0 20px rgba(251, 191, 36, 0.5)', '0 0 10px rgba(251, 191, 36, 0.3)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300 animate-glow" />
            <div className="text-center">
              <div className="text-sm sm:text-base font-bold text-amber-200 tracking-wider">MEGA JACKPOT</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-100">
                {jackpot.toLocaleString()}
              </div>
            </div>
            <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300 animate-glow" />
          </motion.div>
        </div>

        {/* Header/Title */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-glow"
            // Add dynamic glow on win later
          >
            💎 ROYAL SLOTS 💎
          </motion.h1>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mt-2"></div>
        </div>

        {/* Reels Container Placeholder */}
        <div className="relative mb-4 sm:mb-6">
          <div className="bg-slate-900/70 rounded-2xl p-3 sm:p-4 border border-purple-500/30 shadow-inner">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 h-32 sm:h-40">
              {/* SlotReel components will go here */}
              {reels.map((symbol, index) => (
                <div key={index} className="bg-slate-800 rounded-lg flex items-center justify-center text-4xl sm:text-5xl border border-slate-700 shadow-md">
                  {/* Placeholder for SlotReel component */}
                  <span className="animate-pulse">{symbol}</span>
                </div>
              ))}
            </div>
          </div>
           {/* Reel Highlight Overlay (Decorative) */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none animate-pulse" style={{animationDuration: '4s'}}></div>
        </div>

        {/* Win/Fail Feedback Placeholder */}
        <AnimatePresence>
          {gameState === 'result' && winResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-4 text-lg"
            >
              {winResult.isWin ? (
                <div className="p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-400/50">
                  🎉 WIN! +{winResult.payout} (Type: {winResult.winType || 'Basic'}) 🎉
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-400/50">
                  😢 No Luck This Time! 😢
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* BetControl Placeholder - will be replaced by BetControl component */}
        <div className="mb-4 sm:mb-6 p-3 bg-slate-800/50 rounded-xl border border-purple-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-purple-300">Bet Amount:</span>
            <span className="text-lg font-bold text-orange-300">{betAmount} 💎</span>
          </div>
          {/* Actual BetControl component will have +/- buttons and quick bet options */}
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={isSpinning}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Spin Button Area */}
        <div className="mb-4 sm:mb-6">
          <Button
            onClick={handleSpin}
            disabled={!canSpin}
            variant="primary" // Will use a more luxurious variant later
            size="lg"
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold btn-animated bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] hover:from-[var(--brand-secondary)] hover:to-[var(--brand-highlight)] border-2 border-purple-300/70 text-white relative overflow-hidden shadow-xl hover:shadow-purple-500/50 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Neon pulse effect for button */}
            {canSpin && <div className="absolute inset-0 rounded-lg border-2 border-purple-400 animate-neon-pulse opacity-70" style={{animationDuration: '1.5s'}}></div>}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSpinning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  SPINNING...
                </>
              ) : (
                <>
                  <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                  SPIN ({betAmount}💎)
                </>
              )}
            </span>
          </Button>
        </div>

        {/* State Display (Streak, Token Balance) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-slate-800/60 rounded-lg border border-purple-500/30">
            <div className="text-xs sm:text-sm text-purple-300 mb-1">Cyber Tokens</div>
            <div className="text-base sm:text-lg font-bold text-orange-300 flex items-center justify-center gap-1">
              <Diamond size={16} className="opacity-80"/> {cyberTokenBalance.toLocaleString()}
            </div>
          </div>
          <div className="p-2 sm:p-3 bg-slate-800/60 rounded-lg border border-purple-500/30">
            <div className="text-xs sm:text-sm text-purple-300 mb-1">Current Streak</div>
            <div className="text-base sm:text-lg font-bold text-orange-300 flex items-center justify-center gap-1">
             <TrendingUp size={16} className="opacity-80"/> {streakCount}
            </div>
          </div>
        </div>

        {/* CJ AI Chat Display */}
        <div className="mt-4 sm:mt-6 h-20"> {/* Reserve space for AI chat to prevent layout shift */}
          <AnimatePresence mode="wait">
            <motion.div
              key={aiChatMessage} // Animate when the message key changes
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
              className="p-3 bg-gradient-to-r from-slate-800/70 via-slate-850/70 to-slate-800/70 rounded-xl border border-purple-500/40 shadow-md text-sm text-slate-200"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-inner">
                  <Sparkles className="w-4 h-4 text-white opacity-90" />
                  {/* Changed from MessageSquare to Sparkles or Bot for more AI feel */}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-xs font-semibold text-purple-300 mb-0.5">CJ AI Says:</div>
                  <p className="text-sm text-slate-200 leading-relaxed break-words">
                    {aiChatMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div> // Closing the main motion.div for shake animation
    // Original closing div was here, ensure it's correctly paired with the motion.div that has shake
  );
};

// Default export for lazy loading or dynamic imports if needed
  );
};

// Default export for lazy loading or dynamic imports if needed
export default SlotMachine;

// Helper: Define a simple Button component if not available globally or for quick prototyping
// (This part would be removed if global Button is confirmed and fully compatible)
// interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: string; // basic styling
//   size?: string;
// }
// const SimpleButton: React.FC<SimpleButtonProps> = ({ children, className, ...props }) => (
//   <button className={`px-4 py-2 rounded font-semibold transition-opacity disabled:opacity-50 ${className}`} {...props}>
//     {children}
//   </button>
// );
// --- End of placeholder Button ---
