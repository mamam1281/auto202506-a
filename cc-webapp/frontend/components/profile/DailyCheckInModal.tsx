'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Sparkles, X, Star, Award, Calendar, 
  TrendingUp, Clock 
} from 'lucide-react';
import { Button } from '../ui/basic/button';
import { Card } from '../ui/basic/card';

// canvas-confetti가 설치되지 않았으므로 간단한 대체 함수 제공
const confetti = (options: any) => {
  console.log('Confetti effect triggered with options:', options);
  // 실제 설치 후 활성화하려면 import confetti from 'canvas-confetti'; 사용
  return null;
};

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (day: number) => void;
  currentStreak: number;
  lastCheckIn: string | null;
  todayReward: number;
}

export function DailyCheckInModal({ 
  isOpen, 
  onClose, 
  onClaim, 
  currentStreak, 
  lastCheckIn,
  todayReward 
}: DailyCheckInModalProps) {
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [canClaim, setCanClaim] = useState(true);
  const confettiRef = useRef<HTMLDivElement>(null);

  const dailyRewards = [50, 75, 100, 150, 200, 300, 500]; // 7일 보상
  
  // confetti 효과를 위한 함수
  const triggerConfetti = () => {
    if (typeof window !== 'undefined' && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { 
            x: x / window.innerWidth, 
            y: y / window.innerHeight 
          },
          colors: ['#5b30f6', '#8054f2', '#FFD700', '#22c55e']
        });
      } catch (error) {
        console.error('Confetti error:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}시간 ${minutes}분`);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastCheckIn) {
      const lastCheckInDate = new Date(lastCheckIn).toDateString();
      const today = new Date().toDateString();
      setCanClaim(lastCheckInDate !== today);
    }
  }, [lastCheckIn]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 bg-card border-elegant shadow-elegant relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <motion.div 
              className="absolute top-0 left-0 w-full h-full opacity-20"
              animate={{ 
                background: [
                  'radial-gradient(circle at 10% 10%, var(--neon-purple-3) 0%, transparent 50%)',
                  'radial-gradient(circle at 90% 20%, var(--neon-purple-1) 0%, transparent 50%)',
                  'radial-gradient(circle at 30% 80%, var(--neon-purple-4) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            />
            
            <div className="relative" ref={confettiRef}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center border border-primary/30 shadow-elegant">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Gift className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-xl text-white game-title flex items-center gap-1">
                      데일리 체크인
                      <motion.div
                        animate={{ y: [0, -2, 0], rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="w-5 h-5 text-game-gold" />
                      </motion.div>
                    </h2>
                    <p className="text-sm text-muted-foreground">매일 접속하여 보상을 받으세요!</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Current streak display */}
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 streak-container">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Star className="w-5 h-5 text-color-yellow-400" />
                    </motion.div>
                    <span className="text-white game-subtitle exo-medium">연속 접속</span>
                  </div>
                  <motion.span 
                    className="text-2xl text-primary game-subtitle exo-bold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {currentStreak}일
                  </motion.span>
                </div>
                
                <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-primary rounded-full" 
                    style={{ width: `${(currentStreak % 7) * (100 / 7)}%` }}
                    initial={{ x: -50, opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
                <p className="text-xs text-color-yellow-400 mt-2 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3" />
                  7일 연속 접속 시 특별 보너스 <span className="text-game-gold exo-bold">+200💎!</span>
                </p>
              </div>

              {/* Today's reward */}
              <div className="mb-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    boxShadow: ['0 0 0px rgba(255, 215, 0, 0.3)', '0 0 15px rgba(255, 215, 0, 0.5)', '0 0 0px rgba(255, 215, 0, 0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-game-gold/10 border border-game-gold/20"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Calendar className="w-5 h-5 text-game-gold" />
                  </motion.div>
                  <span className="text-white exo-medium">오늘의 보상</span>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-xl text-game-gold game-title">{todayReward}💎</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Weekly reward calendar */}
              <div className="mb-6">
                <h3 className="text-sm text-white mb-3 exo-medium flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  주간 보상 캘린더
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {dailyRewards.map((reward, index) => {
                    const day = index + 1;
                    const isCompleted = currentStreak >= day;
                    const isToday = currentStreak === day - 1 && canClaim;
                    const isSpecial = day === 7; // 7일차는 특별 보상
                    
                    return (
                      <motion.div
                        key={day}
                        whileHover={{ scale: 1.05 }}
                        animate={
                          isToday 
                            ? { 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                  '0 0 0px rgba(91, 48, 246, 0.3)', 
                                  '0 0 10px rgba(91, 48, 246, 0.5)', 
                                  '0 0 0px rgba(91, 48, 246, 0.3)'
                                ] 
                              }
                            : {}
                        }
                        transition={{ duration: 1.5, repeat: isToday ? Infinity : 0 }}
                        className={`
                          aspect-square rounded-lg border flex flex-col items-center justify-center text-xs
                          ${isSpecial ? 'border-width: 2px' : ''}
                          ${isCompleted 
                            ? 'bg-game-success/20 border-game-success/50 text-game-success' 
                            : isToday 
                              ? 'bg-primary/20 border-primary/50 text-primary' 
                              : 'bg-muted/20 border-border text-muted-foreground'
                          }
                          ${isSpecial && !isCompleted ? 'border-game-gold/30 shadow-sm' : ''}
                        `}
                      >
                        <span className={`text-xs mb-1 ${isSpecial ? 'font-bold text-game-gold' : ''}`}>
                          Day {day}
                        </span>
                        <span className={`game-subtitle ${isSpecial ? 'text-lg' : ''}`}>{reward}💎</span>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <span className="text-xs bg-game-success/20 px-1.5 py-0.5 rounded-full">✓</span>
                          </motion.div>
                        )}
                        {isToday && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <span className="text-xs bg-primary/30 px-1.5 py-0.5 rounded-full">!</span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {canClaim ? (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.03, 1],
                      boxShadow: [
                        '0 4px 16px rgba(91, 48, 246, 0.3)', 
                        '0 6px 24px rgba(91, 48, 246, 0.5)', 
                        '0 4px 16px rgba(91, 48, 246, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Button
                      onClick={() => {
                        triggerConfetti();
                        onClaim(currentStreak + 1);
                      }}
                      className="w-full h-14 gradient-primary button-primary shadow-button text-white exo-bold text-lg"
                    >
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mr-2"
                      >
                        <Gift className="w-6 h-6" />
                      </motion.div>
                      {todayReward}💎 받기!
                      <motion.div 
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                      </motion.div>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="text-center p-5 rounded-xl bg-muted/20 border border-border">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="mx-auto mb-2"
                    >
                      <Clock className="w-8 h-8 text-muted-foreground" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">오늘은 이미 받았어요!</p>
                    <p className="text-xs text-muted-foreground bg-muted/30 py-1 px-2 rounded-lg inline-block">
                      다음 보상까지: <span className="text-white">{timeUntilReset}</span>
                    </p>
                  </div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full h-10 text-white border-border hover:bg-muted/20 exo-medium"
                  >
                    나중에 받기
                  </Button>
                </motion.div>
              </div>

              {/* FOMO text */}
              <motion.div
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  y: [0, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center mt-4 p-2 rounded-lg bg-game-warning/10"
              >
                <div className="text-xs text-game-warning font-medium flex items-center justify-center gap-1">
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚠️
                  </motion.span>
                  하루라도 놓치면 연속 기록이 초기화돼요!
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
