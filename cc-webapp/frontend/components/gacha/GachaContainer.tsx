'use client';

import { motion } from 'framer-motion';
import { GachaState, GachaTier, TIER_CONFIG, PARTICLE_CONFIGS } from '../../../types/gacha';
import { cn } from '../../utils/cn';

interface GachaContainerProps {
  state: GachaState;
  tier?: GachaTier;
  className?: string;
}

export function GachaContainer({ state, tier, className = '' }: GachaContainerProps) {
  const currentTier = tier || 'common'; // Default to common if no tier provided
  const tierConfig = TIER_CONFIG[currentTier];
  const particleConfig = PARTICLE_CONFIGS[currentTier];

  const boxSizeClasses = "w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60";

  return (
    <div className={cn('relative flex items-center justify-center', boxSizeClasses, className)}>
      {/* Ultra Clear Background with dynamic glow */}
      <motion.div
        className={cn("absolute inset-[-20px] rounded-3xl glass-ultra-clear")} // Slightly larger than box for glow
        animate={{
          opacity: state === 'reveal' ? 0.6 : state === 'pulling' ? 0.2 : 0.1,
          scale: state === 'pulling' ? [1, 1.02, 1] : 1,
          boxShadow: state === 'reveal'
            ? `0 0 40px ${tierConfig.glowColor}, 0 0 60px ${tierConfig.glowColor}80`
            : state === 'pulling'
              ? `0 0 20px var(--color-accent-amber)50`
              : '0 0 10px rgba(0,0,0,0.2)',
        }}
        transition={{
          duration: state === 'pulling' ? 1.5 : 0.7,
          repeat: state === 'pulling' ? Infinity : 0,
          ease: state === 'pulling' ? 'easeInOut' : 'easeOut',
        }}
        style={{
          background: state === 'reveal'
            ? `radial-gradient(circle, ${tierConfig.glowColor}30 0%, transparent 60%)`
            : state === 'pulling'
              ? `radial-gradient(circle, var(--color-accent-amber)15 0%, transparent 70%)`
              : 'rgba(var(--background-rgb), 0.05)', // Very subtle base for ultra-clear
        }}
      />

      {/* Main Gacha Box with Crystal Clear Glass */}
      <motion.div
        className={cn("relative transform-3d", boxSizeClasses)}
        animate={{
          rotateY: state === 'pulling' ? [0, 720, 0] : 0, // More rotation
          rotateX: state === 'pulling' ? [0, 20, -20, 0] : 0,
          scale: state === 'reveal' ? 1.1 : state === 'pulling' ? 1.05 : 1,
          z: state === 'pulling' ? [0, 40, 0, -20, 0] : 0,
        }}
        transition={{
          duration: state === 'pulling' ? 2.5 : 0.8, // Slightly longer for pulling
          ease: state === 'pulling' ? 'easeInOut' : 'backOut', // backOut for reveal pop
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
        }}
      >
        {/* Crystal Clear Glass Box Face */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-3xl border-2 flex items-center justify-center overflow-hidden glass-crystal",
            boxSizeClasses
          )}
          style={{
            // Dynamic background gradient based on state/tier
            background: state === 'reveal'
              ? `linear-gradient(145deg, ${tierConfig.gradientFrom}40, ${tierConfig.gradientTo}60)`
              : state === 'pulling'
                ? `linear-gradient(145deg, rgba(var(--color-accent-red-rgb),0.3), rgba(var(--color-accent-amber-rgb),0.4))`
                : `linear-gradient(145deg, rgba(var(--card-rgb),0.5), rgba(var(--background-rgb),0.3))`, // Default subtle gradient
          }}
          animate={{
            borderColor: state === 'pulling'
              ? [`${tierConfig.glowColor}00`, `var(--color-accent-red)`, `var(--color-accent-amber)`, `${tierConfig.glowColor}00`]
              : state === 'reveal'
                ? `${tierConfig.glowColor}99` // More opaque border on reveal
                : `rgba(var(--pure-white-rgb), 0.2)`, // Default border
            boxShadow: state === 'reveal'
              ? `0 0 15px ${tierConfig.glowColor}70, 0 0 30px ${tierConfig.glowColor}40, inset 0 0 10px ${tierConfig.glowColor}30`
              : state === 'pulling'
                ? `0 0 10px var(--color-accent-red)50, 0 0 20px var(--color-accent-amber)30`
                : `inset 0 1px 2px rgba(var(--pure-white-rgb),0.1)`,
          }}
          transition={{
            duration: state === 'pulling' ? 0.7 : 0.5,
            repeat: state === 'pulling' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {/* Content: Tier Reveal or Box Icon */}
          <div className="relative z-10 text-center p-4">
            {state === 'reveal' && tier ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  delay: 0.2, // Delay reveal until box settles
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                }}
              >
                {/* Enhanced Tier Icon (e.g., from TIER_CONFIG or default) */}
                <motion.div
                  className={`text-4xl sm:text-5xl md:text-7xl mb-2`}
                  style={{ color: tierConfig.glowColor }}
                  animate={{
                    scale: [1, 1.15, 1],
                    textShadow: [
                      `0 0 10px ${tierConfig.glowColor}90, 0 0 20px ${tierConfig.glowColor}70`,
                      `0 0 15px ${tierConfig.glowColor}FF, 0 0 30px ${tierConfig.glowColor}90`,
                      `0 0 10px ${tierConfig.glowColor}90, 0 0 20px ${tierConfig.glowColor}70`,
                    ],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                >
                  ✨ {/* Or tierConfig.icon if you add it */}
                </motion.div>
                {/* Ultra Clear Tier Name */}
                <motion.h3
                  className={cn("text-base sm:text-lg md:text-xl font-bold")}
                  style={{
                    color: tierConfig.glowColor, // Use glowColor for direct style
                    textShadow: `1px 1px 0px rgba(0,0,0,0.7), 0 0 8px ${tierConfig.glowColor}, 0 0 15px ${tierConfig.glowColor}80`,
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.5)', // Subtle stroke for clarity
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {tierConfig.name}
                </motion.h3>
              </motion.div>
            ) : ( // Ready or Pulling state
              <motion.div
                animate={{
                  scale: state === 'pulling' ? [1, 1.1, 1, 1.1, 1] : 1,
                  opacity: state === 'pulling' ? [0.8, 1, 0.8, 1, 0.8] : 1,
                }}
                transition={{
                  duration: state === 'pulling' ? 0.8 : 0,
                  repeat: state === 'pulling' ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="text-5xl sm:text-6xl md:text-8xl"
                  style={{ color: 'var(--color-accent-red)'}}
                  animate={state === 'pulling' ? {
                    rotateY: [0, 180, 360],
                    filter: [
                        'drop-shadow(0 0 8px var(--color-accent-red))',
                        'drop-shadow(0 0 15px var(--color-accent-amber))',
                        'drop-shadow(0 0 8px var(--color-accent-red))'
                    ],
                    textShadow: [
                        '0 0 15px var(--color-accent-red)90',
                        '0 0 25px var(--color-accent-amber)70',
                        '0 0 15px var(--color-accent-red)90',
                    ]
                  } : {
                    filter: 'drop-shadow(0 0 8px var(--color-accent-red))',
                    textShadow: '0 0 15px var(--color-accent-red)90',
                  }}
                  transition={{
                    duration: state === 'pulling' ? 1.5 : 0,
                    repeat: state === 'pulling' ? Infinity : 0,
                    ease: 'linear'
                  }}
                >
                  📦
                </motion.div>
                <motion.p
                  className="text-sm sm:text-base md:text-lg font-medium text-clear-primary mt-2"
                  style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}
                  animate={{ opacity: state === 'pulling' ? [0.7, 1, 0.7] : 1 }}
                  transition={{ duration: 1, repeat: state === 'pulling' ? Infinity : 0 }}
                >
                  {state === 'pulling' ? '두근두근...' : '가챠 상자'}
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Optimized Particle System for Reveal State */}
      {state === 'reveal' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(particleConfig.count > 25 ? 25 : particleConfig.count)].map((_, i) => { // Cap particles for performance
            const angle = (i / (particleConfig.count > 25 ? 25 : particleConfig.count)) * (Math.PI * 2); // Distribute particles
            const distance = 80 + Math.random() * 80; // Spread further
            const particleColor = particleConfig.colors[i % particleConfig.colors.length];
            const size = Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min;

            return (
              <motion.div
                key={`reveal-particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: particleColor,
                  boxShadow: `0 0 8px ${particleColor}, 0 0 12px ${particleColor}80`,
                  left: '50%', // Start from center
                  top: '50%',  // Start from center
                }}
                initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
                animate={{
                  x: `calc(-50% + ${Math.cos(angle) * distance}px)`,
                  y: `calc(-50% + ${Math.sin(angle) * distance}px)`,
                  scale: [0, 1 + Math.random() * 0.5, 0], // Grow and shrink
                  opacity: [0, 1, 0.8, 0],
                  rotate: Math.random() * 720 - 360, // Random rotation
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.8, // Varied duration
                  delay: Math.random() * 0.5, // Staggered start
                  ease: [0.17, 0.67, 0.83, 0.67], // Custom cubic bezier for pop
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
