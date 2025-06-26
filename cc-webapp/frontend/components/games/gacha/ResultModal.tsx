'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../Button';
import type { GachaResult } from '../../../types/gacha';
import { TIER_CONFIG } from '../../../types/gacha';
import { Sparkles as SparklesIcon, Star as StarIcon, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ResultModalProps {
  isOpen: boolean;
  result: GachaResult | null;
  onClose: () => void;
}

export function ResultModal({ isOpen, result, onClose }: ResultModalProps) {

  const tierConfig = result ? TIER_CONFIG[result.tier] : TIER_CONFIG.common;

  // Particle generation for confetti effect
  const numConfetti = 30;
  const confetti = Array.from({ length: numConfetti }).map((_, i) => ({
    id: i,
    x: Math.random() * 300 - 150, // spread horizontally
    y: Math.random() * 200 - 100, // spread vertically
    rotate: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 1 + 0.8, // 0.8 to 1.8 seconds
    delay: Math.random() * 0.5 + 0.2, // Start slightly after modal opens
    color: tierConfig.glowColor,
  }));

  return (
    <AnimatePresence>
      {isOpen && result && (
        <>
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                y: 30,
                transition: { duration: 0.2, ease: "easeIn" }
              }}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 max-w-md w-full pointer-events-auto"
              style={{
                borderColor: `${tierConfig.glowColor}BF`, // BF for ~75% opacity
                background: `linear-gradient(160deg, rgba(var(--card-rgb),0.95) 0%, rgba(var(--background-rgb),0.95) 100%)`,
                boxShadow: `0 0 30px ${tierConfig.glowColor}60, 0 0 60px ${tierConfig.glowColor}30, inset 0 1px 0 rgba(var(--pure-white-rgb), 0.1)`,
              }}
            >
              {/* Animated Conic Border Glow */}
              <motion.div
                className="absolute -inset-0.5 rounded-xl sm:rounded-2xl pointer-events-none opacity-80"
                style={{
                  background: `conic-gradient(from var(--angle), transparent 20%, ${tierConfig.glowColor}, transparent 80%)`,
                  padding: '2px', // Thickness of the border effect
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                }}
                initial={{ ['--angle' as keyof CSSStyleDeclaration]: '0deg' }}
                animate={{ ['--angle' as keyof CSSStyleDeclaration]: '360deg' }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Strong Radial Background Glow inside modal */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at center, ${tierConfig.glowColor} 0%, transparent 65%)`,
                  mixBlendMode: 'overlay', // Soft light or overlay can create nice effects
                }}
              />

              {/* CSS-based Confetti/Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {confetti.map(c => (
                  <motion.div
                    key={c.id}
                    className="absolute rounded-full"
                    style={{
                      left: '50%', top: '40%', // Emerge from center-top
                      width: Math.random() * 6 + 4, height: Math.random() * 6 + 4, // Slightly larger
                      backgroundColor: c.color,
                      boxShadow: `0 0 5px ${c.color}`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      x: c.x, y: c.y,
                      opacity: [0, 1, 1, 0],
                      scale: [0, c.scale, c.scale * 0.8, 0],
                      rotate: c.rotate,
                    }}
                    transition={{ duration: c.duration, delay: c.delay, ease: 'easeOut' }}
                  />
                ))}
              </div>

              {/* Close button */}
              <Button
                variant="text"
                size="sm"
                onClick={onClose}
                className="absolute top-3 right-3 z-50 text-clear-muted hover:text-clear-primary hover:bg-white/10 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Modal Content */}
              <div className="relative p-6 sm:p-8 text-center z-10">
                {/* Tier Display */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { delay: 0.3, type: 'spring', stiffness: 180 } }}
                  className="mb-4 sm:mb-6"
                >
                  <div
                    className={cn(
                        "inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 text-popup-tier",
                        "bg-[rgba(var(--black-rgb),0.5)] backdrop-blur-sm" // Subtle bg for readability
                    )}
                    style={{
                      borderColor: tierConfig.glowColor,
                      color: tierConfig.glowColor, // Tier color for text
                      textShadow: `0 0 8px ${tierConfig.glowColor}, 0 0 15px ${tierConfig.glowColor}80, 1px 1px 2px rgba(0,0,0,0.7)`,
                      boxShadow: `0 0 10px ${tierConfig.glowColor}30`,
                    }}
                  >
                    <SparklesIcon
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ filter: `drop-shadow(0 0 5px ${tierConfig.glowColor})` }}
                    />
                    <span>{tierConfig.name}</span>
                  </div>
                </motion.div>

                {/* Item Image/Emoji */}
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0, transition: { delay: 0.45, type: 'spring', stiffness: 150, damping: 10 } }}
                  className="mb-4 sm:mb-6 flex justify-center"
                >
                  <motion.div
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 sm:border-3 flex items-center justify-center text-6xl sm:text-7xl relative overflow-hidden"
                    style={{
                      borderColor: tierConfig.glowColor,
                      background: `radial-gradient(circle, ${tierConfig.gradientFrom}1A 20%, ${tierConfig.gradientTo}33 100%)`,
                      boxShadow: `0 0 20px ${tierConfig.glowColor}70, 0 0 35px ${tierConfig.glowColor}50, inset 0 0 15px ${tierConfig.glowColor}30`,
                    }}
                    animate={{
                        scale: [1, 1.03, 1],
                        boxShadow: [
                            `0 0 20px ${tierConfig.glowColor}70, 0 0 35px ${tierConfig.glowColor}50, inset 0 0 15px ${tierConfig.glowColor}30`,
                            `0 0 25px ${tierConfig.glowColor}99, 0 0 45px ${tierConfig.glowColor}70, inset 0 0 20px ${tierConfig.glowColor}50`,
                            `0 0 20px ${tierConfig.glowColor}70, 0 0 35px ${tierConfig.glowColor}50, inset 0 0 15px ${tierConfig.glowColor}30`,
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5}}
                  >
                    <span
                      className="relative z-10"
                      style={{
                        filter: `drop-shadow(0 0 10px ${tierConfig.glowColor})`,
                        textShadow: `0 0 15px ${tierConfig.glowColor}, 0 0 25px ${tierConfig.glowColor}80`,
                      }}
                    >
                      {result.image || '🎁'}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Item Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }}
                  className="mb-6 sm:mb-8 p-4 rounded-lg bg-[rgba(var(--black-rgb),0.3)] backdrop-blur-sm"
                >
                  <h3
                    className={cn("mb-2 text-popup-title")}
                    style={{ color: tierConfig.glowColor, textShadow: `0 0 10px ${tierConfig.glowColor}, 2px 2px 4px rgba(0,0,0,0.8)`}}
                  >
                    {result.name}
                  </h3>
                  <p className={cn("text-sm sm:text-base text-popup-content")}>
                    {result.description}
                  </p>
                </motion.div>

                {/* Confirmation Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.75, duration: 0.5 } }}
                >
                  <Button
                    onClick={onClose}
                    size="lg"
                    className={cn(
                        "w-full min-h-[48px] sm:min-h-[52px] text-lg sm:text-xl font-bold border-2 rounded-lg",
                        "transition-all duration-200 ease-out focus:outline-none focus:ring-4",
                        "text-clear-primary" // Text color
                    )}
                  >
                    <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    확인
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
