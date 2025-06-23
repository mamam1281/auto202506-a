import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { GachaState } from '../../types/gacha';
import { Sparkles, Loader2 } from 'lucide-react';

interface PullButtonProps {
  state: GachaState;
  tickets: number;
  onPull: () => void;
  className?: string;
}

export function PullButton({ state, tickets, onPull, className = '' }: PullButtonProps) {
  const isDisabled = state !== 'ready' || tickets < 1;
  const isPulling = state === 'pulling';

  return (
    <motion.div className={className}>
      <motion.div
        whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!isDisabled ? { scale: 0.98, y: 1 } : {}}
        transition={{ duration: 0.1 }}
      >
        <Button
          onClick={onPull}
          disabled={isDisabled}
          size="lg"
          className="relative w-full min-h-[52px] px-6 py-3 text-base sm:text-lg font-medium glass-strong border-2 border-[#ff4516]/50 hover:border-[#ff4516]/70 overflow-hidden group text-clear-primary"
          style={{
            background: isPulling 
              ? 'linear-gradient(45deg, #ff4516, #f59e0b, #ff4516)'
              : 'linear-gradient(135deg, #ff4516, #f59e0b)',
            backgroundSize: isPulling ? '400% 400%' : '100% 100%',
          }}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(45deg, #ff4516, #f59e0b, #7b29cd, #8054f2)',
              backgroundSize: '400% 400%',
            }}
            animate={{
              backgroundPosition: isPulling 
                ? ['0% 50%', '100% 50%', '0% 50%']
                : ['0% 50%'],
            }}
            transition={{
              duration: isPulling ? 2 : 0,
              repeat: isPulling ? Infinity : 0,
              ease: 'linear',
            }}
          />

          {/* Subtle Glowing Border Animation */}
          {!isDisabled && (
            <motion.div
              className="absolute inset-0 rounded-lg opacity-40"
              style={{
                background: `conic-gradient(from 0deg, transparent, #ff451640, transparent)`,
                padding: '2px',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="bg-transparent rounded-lg w-full h-full" />
            </motion.div>
          )}

          {/* Minimal Particle Effects on Hover */}
          {!isDisabled && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${25 + Math.random() * 50}%`,
                    top: `${30 + Math.random() * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    y: [0, -15],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3,
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
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <motion.span
                  className="text-clear-primary"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  뽑는 중...
                </motion.span>
              </>
            ) : (
              <>
                <motion.div
                  animate={!isDisabled ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="text-clear-primary">가챠 뽑기</span>
                <motion.span 
                  className="text-clear-muted text-sm"
                  animate={!isDisabled ? {
                    opacity: [0.8, 1, 0.8],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  (-1 티켓)
                </motion.span>
              </>
            )}
          </div>

          {/* Subtle Shine Effect */}
          {!isDisabled && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: 'easeInOut',
              }}
            />
          )}
        </Button>
      </motion.div>

      {/* Enhanced Error State */}
      {tickets < 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="mt-4 glass-strong p-4 rounded-xl border border-[#b90c29]/40 relative overflow-hidden"
        >
          {/* Animated Warning Border */}
          <motion.div
            className="absolute inset-0 border border-[#b90c29]/30 rounded-xl"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Warning Content */}
          <div className="flex items-center gap-3 relative z-10">
            <motion.div
              animate={{
                rotate: [0, 3, -3, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-[#b90c29] text-xl"
            >
              ⚠️
            </motion.div>
            <div>
              <motion.p 
                className="text-clear-accent text-sm font-medium"
                style={{ color: '#b90c29', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                티켓이 부족합니다
              </motion.p>
              <motion.p 
                className="text-clear-subtle text-xs mt-1"
                style={{ color: '#b90c29', opacity: 0.8, textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                상단의 '+5' 버튼을 눌러 티켓을 충전하세요
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}