'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Assuming SYMBOLS are defined elsewhere, e.g., in a shared utils/slotLogic.ts
// For now, let's define a placeholder here or import if available
// import { SYMBOLS } from '@/utils/slotLogic'; // Adjust path as necessary
const SYMBOLS_PLACEHOLDER = ['💎', '👑', '🎰', '🍒', '🔔', '7️⃣', '⭐', '🍊', '🍉']; // Extended placeholder

interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  delayFactor: number; // Used for staggered stopping and spin animation variation
  isWinning?: boolean;
  className?: string;
}

export const SlotReel: React.FC<SlotReelProps> = ({
  symbol,
  isSpinning,
  delayFactor,
  isWinning,
  className,
}) => {
  const reelSymbols = SYMBOLS_PLACEHOLDER; // Use the actual imported SYMBOLS array

  // Animation variants for the reel itself (the symbols container)
  const reelAnimationVariants = {
    spinning: {
      y: `-${(reelSymbols.length - 1) * 100}%`, // Moves the strip up to show all symbols
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.3 + delayFactor * 0.1, // Vary speed slightly per reel
          ease: 'linear',
        },
      },
    },
    stopped: (finalSymbol: string) => {
      const finalIndex = reelSymbols.indexOf(finalSymbol);
      const yPosition = `-${finalIndex * (100 / reelSymbols.length) * (reelSymbols.length / 3)}%`; // Adjust based on visible symbols, assuming 3 are somewhat visible during spin. This needs refinement.

      // A better approach for stopping:
      // Calculate the y offset to bring the finalSymbol to the center.
      // Assuming each symbol has a height of 100% of the visible container part.
      // If the container shows 3 symbols, each is 1/3 height.
      // Let's simplify: the motion.div for each symbol inside will handle its position.
      // The outer container just needs to show the final symbol.
      // For now, a simple transition to y:0 and let individual symbol highlight.
      return {
        y: 0, // This will be handled by showing the final symbol directly
        transition: {
          duration: 0.5 + delayFactor * 0.2, // Staggered stop
          ease: 'easeOut',
        },
      };
    },
  };

  // Variants for the individual winning symbol's glow and particle effects
  const winningSymbolVariants = {
    initial: { scale: 1, filter: 'drop-shadow(0 0 0px transparent)' },
    winning: {
      scale: [1, 1.1, 1.05, 1.15, 1],
      filter: [
        'drop-shadow(0 0 0px transparent)',
        'drop-shadow(0 0 10px var(--color-accent-amber)) drop-shadow(0 0 5px var(--color-accent-amber))',
        'drop-shadow(0 0 15px var(--color-accent-amber)) drop-shadow(0 0 8px var(--color-accent-amber))',
        'drop-shadow(0 0 10px var(--color-accent-amber)) drop-shadow(0 0 5px var(--color-accent-amber))',
        'drop-shadow(0 0 0px transparent)',
      ],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      className={`relative h-full w-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 rounded-lg border border-purple-600/50 shadow-inner overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* Cylinder background effect - subtle */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 animate-pulse" style={{animationDuration: '5s'}}></div>
      </div>
      {/* Neon light accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/50 blur-sm"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500/50 blur-sm"></div>


      {isSpinning ? (
        <motion.div
          className="flex flex-col items-center justify-start h-full w-full"
          variants={reelAnimationVariants}
          animate="spinning"
          custom={symbol} // Pass final symbol for custom logic in variants if needed
        >
          {reelSymbols.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-full min-h-[calc(100%/1.5)] text-4xl sm:text-5xl text-slate-300 opacity-70" // Show roughly 1.5 symbols at a time
            >
              {s}
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center justify-center h-full w-full text-4xl sm:text-5xl"
          variants={winningSymbolVariants}
          initial="initial"
          animate={isWinning ? 'winning' : 'initial'}
        >
          {symbol}
          {isWinning && (
            <>
              {/* Particle effects - simplified for now */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-amber-400"
                  style={{
                    width: Math.random() * 3 + 2,
                    height: Math.random() * 3 + 2,
                  }}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 60,
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      )}
      {/* Top and Bottom Fades for spinning effect */}
      {isSpinning && (
        <>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-slate-900 via-slate-900/70 to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-10"></div>
        </>
      )}
    </div>
  );
};

export default SlotReel;
