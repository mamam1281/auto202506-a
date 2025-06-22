import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface ParticleSystemProps {
  isActive: boolean;
}

const createParticle = (id: number): Particle => {
  // 스타일 가이드에서 가져온 생동감 있는 색상들
  const colors = [
    'rgba(123, 41, 205, 0.7)',   // 네온 퍼플 1
    'rgba(135, 13, 209, 0.6)',   // 네온 퍼플 2  
    'rgba(91, 48, 246, 0.7)',    // 네온 퍼플 3
    'rgba(128, 84, 242, 0.6)',   // 네온 퍼플 4
    'rgba(168, 85, 247, 0.8)',   // 브라이트 퍼플
    'rgba(99, 102, 241, 0.7)',   // 브라이트 블루
    'rgba(6, 182, 212, 0.6)',    // 네온 시안
    'rgba(255, 255, 255, 0.4)'   // 화이트 액센트
  ];

  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 3 + 4,
    delay: Math.random() * 2
  };
};

const particleVariants = {
  initial: {
    opacity: 0,
    scale: 0,
    rotateZ: 0
  },
  animate: {
    opacity: [0, 0.9, 0.7, 0],
    scale: [0, 1, 1.2, 0],
    rotateZ: [0, 180, 360],
    y: [0, -50, -100, -150],
    x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30]
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.2 }
  }
};

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // 파티클 생성
      const particleCount = window.innerWidth < 768 ? 6 : 10;
      const newParticles = Array.from({ length: particleCount }, (_, i) => 
        createParticle(i)
      );
      setParticles(newParticles);

      // 지속적으로 파티클 추가
      const interval = setInterval(() => {
        setParticles(prev => {
          const additionalParticles = Array.from({ length: 3 }, (_, i) => 
            createParticle(prev.length + i)
          );
          return [...prev.slice(-8), ...additionalParticles];
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // 게임이 끝나면 파티클 제거
      const timeout = setTimeout(() => {
        setParticles([]);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color.replace('0.', '0.2')}`,
              filter: 'blur(0.3px)'
            }}
            variants={particleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
              repeat: isActive ? Infinity : 0,
              repeatType: "loop"
            }}
          />
        ))}
      </AnimatePresence>

      {/* 배경 글로우 효과 - 더 생동감 있게 */}
      {isActive && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(123, 41, 205, 0.15) 0%, rgba(91, 48, 246, 0.1) 40%, transparent 70%)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* 추가 네온 글로우 링 */}
      {isActive && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, rgba(123, 41, 205, 0.1), rgba(135, 13, 209, 0.05), rgba(91, 48, 246, 0.1), rgba(128, 84, 242, 0.05), rgba(123, 41, 205, 0.1))',
            borderRadius: '50%',
            transform: 'scale(2)'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </div>
  );
};