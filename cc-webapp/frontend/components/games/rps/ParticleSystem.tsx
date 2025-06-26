'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string; // Use string for unique IDs like nanoid or similar
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  type: 'glow' | 'sparkle' | 'trail'; // Add particle types
}

interface ParticleSystemProps {
  isActive: boolean; // True when game is playing or certain results are shown
  intensity?: number; // Optional: e.g., 0.5 for less, 1 for normal, 1.5 for more
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Using CSS variables for colors from globals.css
const NEON_COLORS = [
  'var(--color-purple-primary)',
  'var(--color-purple-secondary)',
  'var(--color-purple-tertiary)',
  'var(--color-accent-red)',
  'var(--color-info)', // A cyan-like blue
  'var(--color-success)', // A vibrant green
  'var(--color-accent-amber)', // Amber/Orange
  'rgba(255, 255, 255, 0.7)', // Whiteish accent
];

const createParticle = (): Particle => {
  const type = Math.random() < 0.3 ? 'glow' : (Math.random() < 0.6 ? 'sparkle' : 'trail');
  const size = type === 'glow' ? Math.random() * 10 + 8 : (type === 'sparkle' ? Math.random() * 4 + 2 : Math.random() * 3 + 1);

  return {
    id: generateId(),
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    size,
    color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    duration: Math.random() * 2.5 + 2.5, // 2.5s to 5s
    delay: Math.random() * 1.5,
    type,
  };
};

const particleVariants = {
  initial: (particle: Particle) => ({
    opacity: 0,
    scale: 0.5,
    x: 0, // Relative to its percentage position
    y: 0, // Relative to its percentage position
  }),
  animate: (particle: Particle) => ({
    opacity: [0, 0.8, 0.8, 0],
    scale: particle.type === 'glow' ? [0.5, 1, 1.2, 0.8] : [0.5, 1.1, 1, 0.7],
    y: particle.type === 'trail' ? [0, -80, -160] : [0, -Math.random() * 60 - 40], // Trails move further
    x: [0, Math.random() * 60 - 30, Math.random() * 40 - 20],
    rotate: particle.type === 'sparkle' ? [0, Math.random() * 360] : 0,
    transition: {
      duration: particle.duration,
      delay: particle.delay,
      ease: "easeOut" as const,
      repeat: Infinity, // Particles will loop their animation
      repeatDelay: Math.random() * 2 + 1, // Staggered restart
    }
  }),
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};


export const ParticleSystem: React.FC<ParticleSystemProps> = ({ isActive, intensity = 1 }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleCount = useMemo(() => Math.floor((window.innerWidth < 768 ? 8 : 15) * intensity), [intensity]);

  useEffect(() => {
    if (isActive) {
      // Initial burst
      setParticles(Array.from({ length: particleCount }, createParticle));

      // Continuously add a few particles to maintain effect, remove old ones
      const intervalId = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(Math.max(0, prev.length - particleCount + Math.floor(3 * intensity))), // Keep most, remove a few oldest
          ...Array.from({ length: Math.floor(3 * intensity) }, createParticle) // Add a few new ones
        ].slice(-particleCount * 2)); // Cap total particles to avoid performance issues
      }, 1200 / intensity); // Faster for higher intensity

      return () => clearInterval(intervalId);
    } else {
      // When not active, gradually remove particles
      const timeoutId = setTimeout(() => setParticles([]), 800); // Allow existing to fade
      return () => clearTimeout(timeoutId);
    }
  }, [isActive, particleCount, intensity]);

  // Dynamic background glow based on active state from example
  const backgroundGlowVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
          opacity: [0.3, 0.7, 0.3],
          scale: [0.9, 1.15, 0.9],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }
      }
  };

  const neonRingVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        rotate: 360,
        transition: { duration: 25, repeat: Infinity, ease: "linear" as const }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none -z-[5]"> {/* Ensure it's behind game content but above main bg */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: p.type === 'glow'
                ? `0 0 ${p.size * 1.5}px ${p.color}, 0 0 ${p.size * 3}px ${p.color.replace(/[\d\.]+\)$/, '0.4)')}` // Softer glow
                : (p.type === 'sparkle' ? `0 0 ${p.size * 0.8}px ${p.color}` : 'none'),
              filter: p.type === 'glow' ? 'blur(1px)' : (p.type === 'sparkle' ? 'blur(0.5px)' : 'none'),
            }}
            variants={particleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={p} // Pass particle data to variants if needed for dynamic transitions
          />
        ))}
      </AnimatePresence>

      {/* Background Glow Effect */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="background-glow"
            variants={backgroundGlowVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, var(--neon-purple-1-t015) 0%, var(--neon-purple-3-t010) 40%, transparent 70%)',
              // Assuming --neon-purple-1-t015 is rgba(var(--neon-purple-1-rgb), 0.15) etc.
              // These transparent vars need to be defined in RPSGame.tsx's <style> or globals.css
            }}
          />
        )}
      </AnimatePresence>

      {/* Neon Ring Effect from example */}
      <AnimatePresence>
        {isActive && (
            <motion.div
                key="neon-ring"
                variants={neonRingVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute inset-0"
                style={{
                    background: 'conic-gradient(from 0deg, var(--neon-purple-1-t010), var(--neon-purple-2-t005), var(--neon-purple-3-t010), var(--neon-purple-4-t005), var(--neon-purple-1-t010))',
                    borderRadius: '50%', // This makes it a circle
                    width: '200%', // Larger than viewport
                    height: '200%',
                    left: '-50%', // Center it
                    top: '-50%',
                    transformOrigin: 'center center', // Ensure rotation is centered
                }}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for RPSGame to define transparent color variables if not globally available
// This should ideally be in globals.css or tailwind.config.js
export const ParticleSystemStyleInjector: React.FC = () => (
  <style>{`
    :root {
      --neon-purple-1-t015: rgba(91, 48, 246, 0.15);
      --neon-purple-3-t010: rgba(128, 84, 242, 0.10);
      --neon-purple-1-t010: rgba(91, 48, 246, 0.10);
      --neon-purple-2-t005: rgba(135, 13, 209, 0.05);
      --neon-purple-4-t005: rgba(128, 84, 242, 0.05);
    }
  `}</style>
);
