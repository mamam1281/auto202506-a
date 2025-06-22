import { motion } from 'framer-motion';
import { GachaState, GachaTier, TIER_CONFIG, PARTICLE_CONFIGS } from '../../types/gacha';

interface GachaContainerProps {
  state: GachaState;
  tier?: GachaTier;
  className?: string;
}

export function GachaContainer({ state, tier, className = '' }: GachaContainerProps) {
  const tierConfig = tier ? TIER_CONFIG[tier] : TIER_CONFIG.common;
  const particleConfig = tier ? PARTICLE_CONFIGS[tier] : PARTICLE_CONFIGS.common;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ultra Clear Background */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          scale: state === 'pulling' ? [1, 1.02, 1] : 1,
          opacity: state === 'reveal' ? 0.3 : 0.1,
        }}
        transition={{
          duration: state === 'pulling' ? 2 : 0.5,
          repeat: state === 'pulling' ? Infinity : 0,
          ease: state === 'pulling' ? 'linear' : 'easeOut',
        }}
        style={{
          background: state === 'reveal' 
            ? `radial-gradient(circle, ${tierConfig.glowColor}15 0%, transparent 70%)`
            : 'rgba(45, 45, 45, 0.05)',
          boxShadow: state === 'reveal' 
            ? `0 0 30px ${tierConfig.glowColor}20`
            : '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Main Gacha Box with Crystal Clear Glass */}
      <motion.div
        className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 transform-3d"
        animate={{
          rotateY: state === 'pulling' ? [0, 360] : 0,
          rotateX: state === 'pulling' ? [0, 15, 0] : 0,
          scale: state === 'reveal' ? 1.05 : 1,
          z: state === 'pulling' ? [0, 30, 0] : 0,
        }}
        transition={{
          duration: state === 'pulling' ? 2 : 0.6,
          ease: state === 'pulling' ? 'easeInOut' : 'easeOut',
          type: state === 'reveal' ? 'spring' : 'tween',
          stiffness: state === 'reveal' ? 300 : 100,
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Crystal Clear Glass Box Face */}
        <motion.div 
          className="absolute inset-0 glass-crystal rounded-3xl border-2 flex items-center justify-center overflow-hidden"
          style={{
            borderColor: state === 'reveal' ? `${tierConfig.glowColor}90` : 'rgba(255, 255, 255, 0.3)',
            background: state === 'reveal' 
              ? `linear-gradient(135deg, ${tierConfig.gradientFrom}20, ${tierConfig.gradientTo}20)`
              : 'rgba(45, 45, 45, 0.85)',
          }}
          animate={{
            borderColor: state === 'pulling' 
              ? ['rgba(255, 255, 255, 0.3)', '#ff451660', 'rgba(255, 255, 255, 0.3)']
              : state === 'reveal' 
                ? `${tierConfig.glowColor}90`
                : 'rgba(255, 255, 255, 0.3)'
          }}
          transition={{
            duration: state === 'pulling' ? 1 : 0.3,
            repeat: state === 'pulling' ? Infinity : 0,
          }}
        >
          {/* Content with Maximum Clarity */}
          {state === 'reveal' && tier ? (
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                delay: 0.3, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              className="text-center z-10 relative"
            >
              {/* Text Background for Readability */}
              <div className="absolute inset-0 bg-black/30 rounded-2xl blur-sm" />
              
              {/* Enhanced Tier Icon */}
              <motion.div 
                className={`text-3xl sm:text-4xl md:text-6xl ${tierConfig.color} mb-1 sm:mb-2 relative z-10`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  filter: `drop-shadow(0 0 8px ${tierConfig.glowColor})`,
                  textShadow: `0 0 15px ${tierConfig.glowColor}, 0 0 30px ${tierConfig.glowColor}`,
                }}
              >
                ✨
              </motion.div>
              
              {/* Ultra Clear Tier Name */}
              <motion.div 
                className={`text-sm sm:text-base md:text-lg font-bold ${tierConfig.color} relative z-10`}
                style={{
                  textShadow: `0 0 10px ${tierConfig.glowColor}, 0 0 20px ${tierConfig.glowColor}, 2px 2px 4px rgba(0,0,0,0.8)`,
                  WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                }}
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {tierConfig.name}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              animate={{
                opacity: state === 'pulling' ? [0.8, 1, 0.8] : 1,
                scale: state === 'pulling' ? [0.95, 1.05, 0.95] : 1,
              }}
              transition={{
                duration: state === 'pulling' ? 1.5 : 0,
                repeat: state === 'pulling' ? Infinity : 0,
              }}
              className="text-center z-10 relative"
            >
              {/* Text Background for Readability */}
              <div className="absolute inset-0 bg-black/20 rounded-2xl blur-sm" />
              
              {/* Enhanced Box Icon */}
              <motion.div 
                className="text-3xl sm:text-4xl md:text-6xl text-[#ff4516] mb-1 sm:mb-2 relative z-10"
                animate={state === 'pulling' ? {
                  rotateY: [0, 180, 360],
                  scale: [1, 1.15, 1],
                } : {}}
                transition={{
                  duration: state === 'pulling' ? 1.5 : 0,
                  repeat: state === 'pulling' ? Infinity : 0,
                }}
                style={{
                  filter: 'drop-shadow(0 0 12px #ff4516)',
                  textShadow: '0 0 20px #ff4516',
                }}
              >
                📦
              </motion.div>
              
              <motion.div 
                className="text-sm sm:text-base md:text-lg text-white font-medium relative z-10"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)',
                }}
                animate={{
                  opacity: state === 'pulling' ? [0.8, 1, 0.8] : 1,
                }}
                transition={{
                  duration: state === 'pulling' ? 1.5 : 0,
                  repeat: state === 'pulling' ? Infinity : 0,
                }}
              >
                {state === 'pulling' ? '뽑는 중...' : '가챠 박스'}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Optimized Particle System */}
      {state === 'reveal' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(Math.min(particleConfig.count, 12))].map((_, i) => {
            const angle = (i * Math.PI * 2) / Math.min(particleConfig.count, 12);
            const distance = 120 + Math.random() * 60;
            const color = particleConfig.colors[i % particleConfig.colors.length];
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
                  height: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}`,
                }}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `${50 + Math.cos(angle) * distance}%`,
                  y: `${50 + Math.sin(angle) * distance}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 0.9, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.3,
                  delay: 0.1 + i * 0.02,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}