'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Sparkles as SparklesIcon } from 'lucide-react'; // Renamed to avoid conflict
import { useTicketCount } from './TicketContext'; // Adjusted import path
import { cn } from '../../utils/cn'; // Assuming a cn utility exists like in shadcn

interface TicketCounterProps {
  className?: string;
}

export function TicketCounter({ className }: TicketCounterProps) {
  const count = useTicketCount();

  return (
    <motion.div
      layout
      className={cn(
        'inline-flex items-center gap-3 px-5 py-3 relative overflow-hidden group glass-strong', // Using new glass-strong
        'border border-[var(--color-accent-amber)]', // Amber border
        'shadow-[0_0_15px_rgba(245,158,11,0.3),_0_0_25px_rgba(245,158,11,0.2)]', // Amber glow
        className
      )}
      style={{
        borderRadius: '50px', // Pill shape
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {/* Animated Background Glow on Hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-25"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-amber) 0%, transparent 70%)',
          borderRadius: 'inherit', // Inherit border radius
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating Particles inside the counter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[var(--color-accent-red)] rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: '50%',
            }}
            initial={{ opacity: 0, scale: 0, y: '0%' }}
            animate={{
              y: ['0%', '-40%', '0%', '20%', '0%'],
              opacity: [0, 0.7, 0.7, 0.5, 0],
              scale: [0, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Ticket Icon */}
      <motion.div
        className="relative z-10 text-[var(--color-accent-red)]"
        animate={{
          rotate: [0, 5, -5, 0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Ticket
          className="w-5 h-5 sm:w-6 sm:h-6"
          style={{
            filter: 'drop-shadow(0 0 4px var(--color-accent-red))',
          }}
        />
      </motion.div>

      {/* Animated Counter Value - using AnimatePresence for enter/exit of count */}
      <div className="relative z-10 flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, duration: 0.4 }}
            className="font-bold tabular-nums text-lg sm:text-xl text-clear-primary"
            style={{
              textShadow: '0 0 5px rgba(255,255,255,0.5)',
            }}
          >
            {count.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* "티켓" Label */}
      <motion.span
        className="text-clear-muted text-sm sm:text-base font-medium relative z-10"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        티켓
      </motion.span>

      {/* Sparkle Effects near the count when tickets > 0 */}
      {count > 0 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                // Position sparkles around the number
                x: i === 0 ? -5 : 5,
                y: i === 0 ? -8 : 0,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                scale: [0, 1, 0.8, 1, 0],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
                delay: i * 0.3 + Math.random() * 0.5, // Staggered and randomized start
                ease: 'easeInOut',
              }}
            >
              <SparklesIcon className="w-3 h-3 text-[var(--color-accent-amber)] opacity-80" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Subtle Border Pulse Animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[var(--color-accent-amber)] opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </motion.div>
  );
}

// Helper for class names, create this file if it doesn't exist:
// cc-webapp/frontend/utils/cn.ts
// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
