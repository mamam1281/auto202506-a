'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import type { GachaState } from '../../../types/gacha';
import { cn } from '../../utils/cn';

interface PullButtonProps {
  state: GachaState;
  tickets: number;
  onPull: () => void;
  className?: string;
}

export function PullButton({ state, tickets, onPull, className = '' }: PullButtonProps) {
  const isDisabled = state !== 'ready' || tickets < 1;
  const isPulling = state === 'pulling';

  const buttonVariants = {
    default: {
      scale: 1,
      background: `linear-gradient(135deg, var(--color-accent-red) 0%, var(--color-accent-amber) 100%)`,
      borderColor: `rgba(var(--color-accent-red-rgb), 0.7)`,
    },
    pulling: {
      background: `linear-gradient(45deg, var(--color-accent-red), var(--color-accent-amber), var(--color-accent-red))`,
      backgroundSize: ['100% 100%', '400% 400%'], // Prepare for animation
      borderColor: `rgba(var(--color-accent-amber-rgb), 0.7)`,
      transition: {
        backgroundSize: { duration: 0.1, ease: "linear" }, // Quick change to large size
      }
    },
    disabled: {
      scale: 1,
      background: `linear-gradient(135deg, var(--muted) 0%, var(--border) 100%)`,
      borderColor: `rgba(var(--border-rgb), 0.5)`,
    },
  };

  const backgroundAnimation = isPulling ? {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' }
      }
  } : {};


  return (
    <motion.div className={cn('w-full', className)}>
      <motion.button
        onClick={onPull}
        disabled={isDisabled}
        className={cn(
          'relative w-full min-h-[52px] sm:min-h-[56px] px-6 py-3 text-base sm:text-lg font-semibold overflow-hidden group',
          'border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]',
          isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer glass-strong',
          isPulling ? 'focus:ring-[var(--color-accent-amber)]' : 'focus:ring-[var(--color-accent-red)]'
        )}
        variants={buttonVariants}
        initial="default"
        animate={isDisabled ? "disabled" : isPulling ? "pulling" : "default"}
        whileHover={!isDisabled ? { scale: 1.03, y: -2, boxShadow: '0 0 20px rgba(var(--color-accent-red-rgb), 0.5)' } : {}}
        whileTap={!isDisabled ? { scale: 0.97, y: 1 } : {}}
        transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
        style={{
           // backgroundSize is handled by variants for pulling state
        }}
        {...backgroundAnimation} // Spread the backgroundPosition animation here
      >
        {/* Subtle Glowing Border Animation (only when not disabled) */}
        {!isDisabled && (
          <motion.div
            className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-75"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, var(--color-accent-red) 50%, transparent 100%)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Animated Background for pulling state is handled by motion.button style + animate prop */}

        {/* Minimal Particle Effects on Hover (only when not disabled and not pulling) */}
        {!isDisabled && !isPulling && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`hover-particle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-accent-amber)]"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1 + Math.random() * 0.5, 0],
                  y: [0, -10 - Math.random() * 10],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  delay: Math.random() * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1 + Math.random() * 1,
                }}
              />
            ))}
          </div>
        )}

        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-3 z-10">
          {isPulling ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-clear-primary" />
              </motion.div>
              <motion.span
                className="text-clear-primary"
                initial={{opacity: 0.7}}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                뽑는 중...
              </motion.span>
            </>
          ) : (
            <>
              <motion.div
                animate={!isDisabled ? {
                  rotate: [0, 8, -8, 0, 8, -8, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-clear-primary"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor)'}}
                />
              </motion.div>
              <span className="text-clear-primary">가챠 뽑기</span>
              <motion.span
                className="text-clear-muted text-xs sm:text-sm"
                initial={{opacity: 0.8}}
                animate={!isDisabled ? { opacity: [0.6, 0.9, 0.6] } : {opacity: 0.6}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                (-1 티켓)
              </motion.span>
            </>
          )}
        </div>

        {/* Subtle Shine Effect (only when not disabled) */}
        {!isDisabled && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-md" // Ensure rounded to match button
          >
            <motion.div
              className="absolute w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: '-150%' }} // Start further left
              animate={{ x: '250%' }} // End further right
              transition={{
                duration: 1.5, // Faster shine
                repeat: Infinity,
                repeatDelay: 2 + Math.random() * 2, // Randomized delay
                ease: 'linear', // Consistent speed
              }}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Enhanced Error State (when tickets < 1 and not pulling) */}
      {tickets < 1 && state === 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--color-error-rgb), 0.2), rgba(var(--color-error-rgb), 0.1))',
            borderColor: 'rgba(var(--color-error-rgb), 0.5)',
            boxShadow: '0 0 15px rgba(var(--color-error-rgb),0.3)'
          }}
        >
          {/* Animated Warning Border */}
          <motion.div
            className="absolute inset-0 border-2 border-[var(--color-error)] rounded-xl"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-[var(--color-error)] text-xl sm:text-2xl"
            >
              <AlertTriangle strokeWidth={2.5} />
            </motion.div>
            <div>
              <p
                className="text-sm sm:text-base font-semibold"
                style={{
                  color: 'var(--color-error)',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                }}
              >
                티켓이 부족합니다
              </p>
              <p
                className="text-xs sm:text-sm mt-0.5"
                style={{ color: 'rgba(var(--color-error-rgb), 0.8)', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                상단의 '+5 티켓' 버튼으로 충전하세요.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
