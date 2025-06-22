import { motion } from 'framer-motion';
import { Ticket, Sparkles } from 'lucide-react';

interface TicketCounterProps {
  count: number;
  className?: string;
}

export function TicketCounter({ count, className = '' }: TicketCounterProps) {
  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-3 px-5 py-3 glass-strong border border-[#ff4516]/40 relative overflow-hidden group ${className}`}
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: '50px',
        background: 'linear-gradient(135deg, rgba(255, 69, 22, 0.15), rgba(245, 158, 11, 0.15))',
      }}
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20"
        style={{
          background: 'linear-gradient(45deg, #ff4516, #f59e0b)',
          borderRadius: '50px',
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-[#ff4516] rounded-full opacity-60"
            style={{
              left: `${30 + i * 20}%`,
              top: '50%',
            }}
            animate={{
              y: [0, -6, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Ticket Icon with Minimal Glow */}
      <motion.div
        className="relative z-10"
        animate={{
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Ticket 
          className="w-5 h-5 text-clear-accent" 
          style={{
            filter: 'drop-shadow(0 0 3px #ff4516)',
          }}
        />
      </motion.div>

      {/* Animated Counter */}
      <motion.span
        key={count}
        initial={{ 
          scale: 1.2, 
          color: '#ff4516',
        }}
        animate={{ 
          scale: 1, 
          color: '#ffffff',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15
        }}
        className="font-bold tabular-nums text-lg relative z-10 text-clear-primary"
      >
        {count.toLocaleString()}
      </motion.span>

      {/* Label with Clear Text */}
      <motion.span 
        className="text-clear-muted text-sm font-medium relative z-10"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        티켓
      </motion.span>

      {/* Sparkle Effects */}
      {count > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${25 + i * 50}%`,
                top: `${35 + i * 30}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4,
                delay: i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-3 h-3 text-[#f59e0b] opacity-70" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Subtle Border Glow Animation */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#ff4516]/30 opacity-0"
        animate={{
          opacity: [0, 0.4, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}