'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw' | null;

interface ResultScreenProps {
  result: GameResult;
  playerChoice: Choice;
  aiChoice: Choice;
  onPlayAgain: () => void;
  onResetScore: () => void;
}

const choiceEmojis: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

const choiceLabels: Record<Choice, string> = {
  rock: '바위',
  paper: '보',
  scissors: '가위'
};

const resultConfig = {
  win: {
    title: '🎉 승리!',
    message: '축하합니다! 당신이 이겼습니다!',
    colorVar: '#1db67d', // 밝은 민트
    glowColorVar: '16, 185, 129',
    bgGradient: 'linear-gradient(135deg, rgba(120,255,210,0.22) 0%, rgba(120,255,210,0.13) 100%)',
    borderColorVar: 'rgba(16, 185, 129, 0.25)'
  },
  lose: {
    title: '😔 패배',
    message: '아쉽습니다. 다시 도전해보세요!',
    colorVar: '#e23c3c', // 밝은 레드
    glowColorVar: '185, 12, 41',
    bgGradient: 'linear-gradient(135deg, rgba(255,120,120,0.18) 0%, rgba(255,120,120,0.10) 100%)',
    borderColorVar: 'rgba(185, 12, 41, 0.18)'
  },
  draw: {
    title: '🤝 무승부',
    message: '비겼습니다! 한 번 더 시도해보세요!',
    colorVar: '#1e3a8a', // 남색
    glowColorVar: '30, 58, 138',
    bgGradient: 'linear-gradient(135deg, rgba(120,180,255,0.18) 0%, rgba(120,180,255,0.10) 100%)',
    borderColorVar: 'rgba(30, 58, 138, 0.18)'
  }
};

type ParticleType = 'confetti' | 'sad';

function getParticles(result: GameResult): { type: ParticleType, color: string, left: number, delay: number }[] {
  if (result === 'win') {
    // 팡파레: 위에서 아래로, 좌우로 흩어지는 confetti - 파티클 수 감소
    const colors = [
      '#fbbf24', '#f87171', '#34d399', '#60a5fa', '#f472b6', '#facc15', '#38bdf8', '#a78bfa'
    ];
    return Array.from({ length: 20 }, (_, i) => ({ // 32개에서 20개로 감소
      type: 'confetti',
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.12 // 더 빠른 애니메이션
    }));
  } else if (result === 'draw') {
    // 무승부: 중립적 confetti, 위에서 아래로 - 파티클 수 감소
    const colors = [
      '#64748b', '#a3a3a3', '#fbbf24', '#60a5fa'
    ];
    return Array.from({ length: 12 }, (_, i) => ({ // 18개에서 12개로 감소
      type: 'confetti',
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.2
    }));
  } else if (result === 'lose') {
    // 패배: 아래로 떨어지는 슬픈 파티클 - 파티클 수 감소
    const colors = [
      '#64748b', '#334155', '#94a3b8', '#60a5fa'
    ];
    return Array.from({ length: 12 }, (_, i) => ({ // 18개에서 12개로 감소
      type: 'sad',
      color: colors[i % colors.length],
      left: 20 + Math.random() * 60,
      delay: Math.random() * 0.2
    }));
  }
  return [];
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  playerChoice,
  aiChoice,
  onPlayAgain,
  onResetScore
}) => {
  const [showParticles, setShowParticles] = React.useState(false);

  React.useEffect(() => {
    if (result) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const particles = getParticles(result!);
  const config = result ? resultConfig[result] : undefined;

  return (
    <motion.div
      key="result-backdrop"
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        key="result-modal"
        initial={{ opacity: 0, scale: 0.7, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.1 } }}
        exit={{ opacity: 0, scale: 0.8, y: 30, transition: { duration: 0.25, ease: "easeIn" } }}
        className="relative max-w-sm w-full mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-8 modern-mesh-card glassmorphism-dark"
        role="alertdialog"
        aria-labelledby="result-title"
        aria-describedby="result-message"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(240,255,255,0.89) 100%), ${config ? config.bgGradient : ''}`,
          border: `1.5px solid ${config ? config.borderColorVar : '#ccc'}`,
          boxShadow: `
            0 8px 16px rgba(0,0,0,0.10),
            0 0 0 1px ${config ? config.borderColorVar : '#ccc'},
            inset 0 1px 1px rgba(255,255,255,0.10),
            0 0 12px -6px rgba(${config ? config.glowColorVar : '0,0,0'}, 0.10)
          `,
          backdropFilter: 'blur(3px) saturate(1.05)'
        }}
      >
        {/* 파티클 효과 */}
        {showParticles && (
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              overflow: 'hidden'
            }}
          >
            {particles.map((p, i) => {
              if (p.type === 'confetti') {
                // 팡파레: 위에서 아래로, 좌우로 흩어짐
                return (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${p.left}%`,
                      top: '-8%',
                      width: 10 + Math.random() * 12,
                      height: 10 + Math.random() * 12,
                      borderRadius: 4,
                      background: p.color,
                      opacity: 0.92,
                      animation: `rps-confetti-fall 0.7s cubic-bezier(.7,0,.7,1) ${p.delay}s both`,
                      zIndex: 21
                    }}
                  />
                );
              } else {
                // sad: 아래로 떨어짐, 투명도 더 낮음
                return (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${p.left}%`,
                      top: '-10%',
                      width: 10 + Math.random() * 8,
                      height: 10 + Math.random() * 8,
                      borderRadius: 6,
                      background: p.color,
                      opacity: 0.55,
                      filter: 'blur(0.5px)',
                      animation: `rps-sad-drop 1.2s cubic-bezier(.7,0,.7,1) ${p.delay}s both`,
                      zIndex: 21
                    }}
                  />
                );
              }
            })}
            <style>
              {`
                @keyframes rps-confetti-fall {
                  0% { transform: translateY(0) scale(0.7) rotate(0deg); opacity: 1; }
                  60% { transform: translateY(60px) scale(1.15) rotate(20deg); opacity: 0.95; }
                  80% { opacity: 0.85; }
                  100% { transform: translateY(180px) scale(1) rotate(360deg); opacity: 0; }
                }
                @keyframes rps-sad-drop {
                  0% { transform: translateY(0) scale(1); opacity: 0.7; }
                  80% { opacity: 0.5; }
                  100% { transform: translateY(180px) scale(0.7); opacity: 0; }
                }
              `}
            </style>
          </div>
        )}

        {/* Result Title */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4 } }}
          className="text-center mb-5 sm:mb-6"
        >
          <h2
            id="result-title"
            className="text-4xl sm:text-5xl font-extrabold mb-2"
            style={{
              color: config?.colorVar,
              textShadow: `0 0 3px rgba(${config?.glowColorVar}, 0.13), 0 2px 3px rgba(0,0,0,0.13)`
            }}
          >
            {config?.title}
          </h2>
          <p id="result-message" className="text-lg sm:text-xl font-bold" style={{ color: '#222', textShadow: '0 1px 2px #fff, 0 0 2px #38bdf8', marginTop: 8 }}>
            {config?.message}
          </p>
        </motion.div>

        {/* Choices Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.35, duration: 0.45, ease: "backOut" } }}
          className="flex items-center justify-around gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Player Choice */}
          <div className="text-center">
            <motion.div
              animate={{
                scale: result === 'win' ? [1, 1.25, 1] : [1, 1.05, 1],
                rotate: result === 'win' ? [0, 3, -3, 0] : 0
              }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl mb-1.5"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.13))' }}
            >
              {choiceEmojis[playerChoice]}
            </motion.div>
            <div
              style={{
                color: '#222',
                fontWeight: 900,
                fontSize: 15,
                textShadow: `0 1px 2px #fff, 0 0 2px #38bdf8`
              }}
            >플레이어</div>
            <div
              className="font-medium text-sm sm:text-base"
              style={{ color: result === 'win' ? config?.colorVar : '#222', fontWeight: 700, textShadow: '0 1px 2px #fff, 0 0 2px #38bdf8' }}
            >
              {choiceLabels[playerChoice]}
            </div>
          </div>

          <motion.div
            initial={{opacity:0, scale:0.5}}
            animate={{opacity:1, scale:1, transition: {delay:0.6, duration:0.3}}}
            className="text-[#222] text-lg sm:text-xl font-bold"
          >
            VS
          </motion.div>

          {/* AI Choice */}
          <div className="text-center">
            <motion.div
              animate={{
                scale: result === 'lose' ? [1, 1.25, 1] : [1, 1.05, 1],
                rotate: result === 'lose' ? [0, -3, 3, 0] : 0
              }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl mb-1.5"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.13))' }}
            >
              {choiceEmojis[aiChoice]}
            </motion.div>
            <div
              style={{
                color: '#222',
                fontWeight: 900,
                fontSize: 15,
                textShadow: `0 1px 2px #fff, 0 0 2px #38bdf8`
              }}
            >AI</div>
            <div
              className="font-medium text-sm sm:text-base"
              style={{ color: result === 'lose' ? config?.colorVar : '#222', fontWeight: 700, textShadow: '0 1px 2px #fff, 0 0 2px #38bdf8' }}
            >
              {choiceLabels[aiChoice]}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.4 } }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.9, y: -1, borderColor: 'var(--border-hover)' }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={onPlayAgain}
            className="w-full py-2.5 px-5 rounded-lg sm:rounded-xl font-bold transition-all duration-200 btn-animated"
            style={{
              background: 'linear-gradient(90deg, #222 60%, #1e293b 100%)',
              color: '#fff',
              border: '1.5px solid #1e3a8a',
              boxShadow: '0 1px 4px #222, 0 1px 2px #222',
              textShadow: '0 1px 2px #000'
            }}
          >
            다시 플레이
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.9, y: -1, borderColor: 'var(--border-hover)' }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={onPlayAgain}
            className="w-full py-2.5 px-5 rounded-lg sm:rounded-xl font-bold transition-all duration-200 btn-animated"
            style={{
              background: 'linear-gradient(90deg, #222 60%, #1e293b 100%)',
              color: '#fff',
              border: '1.5px solid #1e3a8a',
              boxShadow: '0 1px 4px #222, 0 1px 2px #222',
              textShadow: '0 1px 2px #000'
            }}
          >
            닫기
          </motion.button>
        </motion.div>

        {/* Decorative pulse */}
        <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none -z-10"
            style={{
                background: `radial-gradient(circle at center, rgba(${config?.glowColorVar}, 0.03) 0%, transparent 70%)`
            }}
            animate={{ opacity: [0, 0.15, 0], scale: [0.8, 1.1, 0.8] }}
            transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
            }}
        />
      </motion.div>
    </motion.div>
  );
};
