'use client';

import { motion } from 'framer-motion';
import { RewardCardProps } from '../../../types/card';
import { Coins, Star, Gift, Sparkles } from 'lucide-react';

const rewardTypeStyles = {
  tokens: {
    icon: Coins,
    color: '#7b29cd',
    gradient: 'from-[#7b29cd] to-[#870dd1]',
    bgColor: 'rgba(123, 41, 205, 0.15)',
    neonColor: 'rgba(123, 41, 205, 0.3)'
  },
  points: {
    icon: Star,
    color: '#870dd1',
    gradient: 'from-[#870dd1] to-[#5b30f6]',
    bgColor: 'rgba(135, 13, 209, 0.15)',
    neonColor: 'rgba(135, 13, 209, 0.3)'
  },
  items: {
    icon: Gift,
    color: '#8054f2',
    gradient: 'from-[#8054f2] to-[#5b30f6]',
    bgColor: 'rgba(128, 84, 242, 0.15)',
    neonColor: 'rgba(128, 84, 242, 0.3)'
  }
};

const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.15)'
  },
  hover: { 
    scale: 1.01, 
    y: -4,
    boxShadow: '0 8px 20px rgba(123, 41, 205, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.25), 0 0 10px rgba(123, 41, 205, 0.15)'
  },
  active: { 
    scale: 0.98, 
    y: 0,
    boxShadow: '0 4px 15px rgba(135, 13, 209, 0.3), 0 0 0 2px rgba(135, 13, 209, 0.35)'
  }
};

const sparkleVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const claimPulse = {
  scale: [1, 1.02, 1],
  boxShadow: [
    '0 0 8px rgba(123, 41, 205, 0.3)',
    '0 0 15px rgba(123, 41, 205, 0.5)',
    '0 0 8px rgba(123, 41, 205, 0.3)'
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export function CardReward({ 
  title, 
  description, 
  image, 
  rewardType, 
  amount, 
  claimable = false, 
  state = 'default', 
  content = true, 
  onClaim, 
  className = '' 
}: RewardCardProps) {
  const rewardStyle = rewardTypeStyles[rewardType];
  const IconComponent = rewardStyle.icon;

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer group
        bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]
        border border-[#333333]
        min-h-[380px] h-full
        flex flex-col
        transition-all duration-300
        ${className}
      `}
      variants={cardVariants}
      initial="default"
      animate={state}
      whileHover="hover"
      whileTap="active"
    >
      {/* Floating neon particles - 수량 감소 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full opacity-60"
            style={{ backgroundColor: rewardStyle.color }}
            animate={{
              x: [0, 100, 0],
              y: [0, -80, 0],
              scale: [0, 0.8, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 20}%`,
              top: `${40 + i * 10}%`,
              filter: `drop-shadow(0 0 2px ${rewardStyle.color})`
            }}
          />
        ))}
      </div>
      
      {/* Claimable neon aura - 블러 제거 */}
      {claimable && (
        <motion.div
          className="absolute -inset-1 rounded-2xl"
          style={{
            background: `linear-gradient(45deg, ${rewardStyle.color}, transparent, ${rewardStyle.color})`,
            boxShadow: `0 0 15px ${rewardStyle.neonColor}, inset 0 0 15px ${rewardStyle.neonColor}`
          }}
          animate={{
            ...claimPulse,
            boxShadow: [
              `0 0 10px ${rewardStyle.neonColor}, inset 0 0 10px ${rewardStyle.neonColor}`,
              `0 0 20px ${rewardStyle.neonColor}, inset 0 0 20px ${rewardStyle.neonColor}`,
              `0 0 10px ${rewardStyle.neonColor}, inset 0 0 10px ${rewardStyle.neonColor}`
            ]
          }}
        />
      )}
      
      {/* Corner neon lines - 강도 약화 */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <motion.div 
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r to-transparent"
          style={{ backgroundColor: rewardStyle.color }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              `0 0 3px ${rewardStyle.neonColor}`,
              `0 0 8px ${rewardStyle.neonColor}`,
              `0 0 3px ${rewardStyle.neonColor}`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b to-transparent"
          style={{ backgroundColor: rewardStyle.color }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              `0 0 3px ${rewardStyle.neonColor}`,
              `0 0 8px ${rewardStyle.neonColor}`,
              `0 0 3px ${rewardStyle.neonColor}`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="relative p-6 z-10 flex flex-col h-full">
        {/* Header with sparkle */}
        <div className="flex items-center justify-between mb-4 min-h-[32px]">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="p-2 rounded-lg relative border"
              style={{ 
                backgroundColor: rewardStyle.bgColor,
                borderColor: `${rewardStyle.color}30`
              }}
              animate={{
                boxShadow: [
                  `0 0 5px ${rewardStyle.neonColor}`,
                  `0 0 10px ${rewardStyle.neonColor}`,
                  `0 0 5px ${rewardStyle.neonColor}`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <IconComponent 
                size={20} 
                style={{ color: rewardStyle.color }}
              />
              {claimable && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  variants={sparkleVariants}
                  animate="animate"
                >
                  <Sparkles 
                    size={12} 
                    style={{ 
                      color: rewardStyle.color,
                      filter: `drop-shadow(0 0 2px ${rewardStyle.color})`
                    }} 
                  />
                </motion.div>
              )}
            </motion.div>
            <span className="text-xs uppercase tracking-wider text-[#D1D5DB] font-semibold">
              {rewardType}
            </span>
          </motion.div>
          
          {claimable && (
            <motion.div
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[#8054f2] to-[#5b30f6] text-white text-xs font-semibold border"
              style={{ borderColor: rewardStyle.color }}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  `0 0 5px ${rewardStyle.neonColor}`,
                  `0 0 10px ${rewardStyle.neonColor}`,
                  `0 0 5px ${rewardStyle.neonColor}`
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ready!
            </motion.div>
          )}
        </div>
        
        {image && (
          <div className="mb-4 h-32 flex-shrink-0">
            <motion.div 
              className="h-full rounded-xl overflow-hidden relative border"
              style={{ borderColor: `${rewardStyle.color}20` }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-transparent to-[#7b29cd]/10" />
              <motion.div
                className="absolute inset-0"
                style={{
                  boxShadow: `inset 0 0 15px ${rewardStyle.neonColor}`
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <h3 className="mb-2 text-white font-semibold text-lg min-h-[28px] flex items-center">
            {title}
          </h3>
          
          {content && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {description && (
                <p className="text-[#D1D5DB] text-sm leading-relaxed mb-4 flex-1">
                  {description}
                </p>
              )}
              
              {/* Neon Amount Display */}
              <motion.div
                className="flex items-center justify-center py-6 mb-4 rounded-xl border-2"
                style={{ 
                  backgroundColor: rewardStyle.bgColor,
                  borderColor: `${rewardStyle.color}30`
                }}
                animate={claimable ? {
                  borderColor: [
                    `${rewardStyle.color}30`,
                    `${rewardStyle.color}50`,
                    `${rewardStyle.color}30`
                  ],
                  boxShadow: [
                    `0 0 5px ${rewardStyle.neonColor}`,
                    `0 0 15px ${rewardStyle.neonColor}`,
                    `0 0 5px ${rewardStyle.neonColor}`
                  ]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: claimable ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="flex items-center gap-3"
                  animate={claimable ? {
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: claimable ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <IconComponent 
                    size={32} 
                    style={{ 
                      color: rewardStyle.color,
                      filter: `drop-shadow(0 0 4px ${rewardStyle.color})`
                    }}
                  />
                  <span 
                    className="text-3xl font-bold"
                    style={{ 
                      color: rewardStyle.color,
                      textShadow: `0 0 8px ${rewardStyle.neonColor}`
                    }}
                  >
                    {amount.toLocaleString()}
                  </span>
                </motion.div>
              </motion.div>
              
              {/* Neon Claim Button */}
              <motion.button
                className={`w-full py-3 px-4 rounded-xl font-semibold border-2 transition-all duration-300 min-h-[48px] mt-auto ${
                  claimable
                    ? `bg-gradient-to-r ${rewardStyle.gradient} text-white`
                    : 'bg-[#333333] text-[#a0a0a0] border-[#333333] cursor-not-allowed'
                }`}
                style={claimable ? { 
                  borderColor: rewardStyle.color 
                } : {}}
                whileHover={claimable ? { 
                  scale: 1.01,
                  boxShadow: `0 0 15px ${rewardStyle.neonColor}`
                } : {}}
                whileTap={claimable ? { scale: 0.99 } : {}}
                onClick={claimable ? onClaim : undefined}
                disabled={!claimable}
                animate={claimable ? {
                  boxShadow: [
                    `0 0 5px ${rewardStyle.neonColor}`,
                    `0 0 12px ${rewardStyle.neonColor}`,
                    `0 0 5px ${rewardStyle.neonColor}`
                  ]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: claimable ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {claimable ? 'Claim Reward' : 'Not Available'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Top neon accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          boxShadow: [
            `0 0 3px ${rewardStyle.neonColor}`,
            `0 0 8px ${rewardStyle.neonColor}`,
            `0 0 3px ${rewardStyle.neonColor}`
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}