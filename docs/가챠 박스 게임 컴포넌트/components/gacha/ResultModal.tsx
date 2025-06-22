import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { GachaResult, TIER_CONFIG } from '../../types/gacha';
import { Sparkles, Star } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  result: GachaResult | null;
  onClose: () => void;
}

export function ResultModal({ isOpen, result, onClose }: ResultModalProps) {
  if (!result) return null;

  const tierConfig = TIER_CONFIG[result.tier];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-4 p-0 overflow-hidden border-0 bg-transparent">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative rounded-2xl overflow-hidden border-2"
          style={{
            borderColor: `${tierConfig.glowColor}80`,
            background: `linear-gradient(135deg, rgba(20, 20, 20, 0.98), rgba(30, 30, 30, 0.98))`,
            boxShadow: `0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px ${tierConfig.glowColor}50, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          }}
        >
          {/* 숨겨진 접근성 요소들 */}
          <DialogHeader className="sr-only">
            <DialogTitle>가챠 결과</DialogTitle>
            <DialogDescription>
              {tierConfig.name} 등급의 {result.name}을(를) 획득했습니다. {result.description}
            </DialogDescription>
          </DialogHeader>

          {/* 강한 배경 그라디언트 */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-20"
            style={{
              background: `radial-gradient(circle at center, ${tierConfig.glowColor}40 0%, transparent 70%)`,
            }}
          />

          {/* CSS 기반 축하 파티클 효과 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ 
                  backgroundColor: i % 2 === 0 ? tierConfig.glowColor : '#ffffff',
                  left: '50%',
                  top: '50%'
                }}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (Math.cos(i * Math.PI / 6) * 100)],
                  y: [0, (Math.sin(i * Math.PI / 6) * 100)],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Ultra Clear Content */}
          <div className="relative p-8 text-center">
            {/* 등급 표시 - 훨씬 선명하게 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div 
                className="inline-flex items-center gap-3 px-6 py-4 rounded-full border-2"
                style={{
                  borderColor: `${tierConfig.glowColor}`,
                  background: `linear-gradient(135deg, ${tierConfig.glowColor}30, rgba(0, 0, 0, 0.8))`,
                  boxShadow: `0 0 20px ${tierConfig.glowColor}40, inset 0 2px 0 rgba(255, 255, 255, 0.2)`,
                }}
              >
                <Sparkles 
                  className="w-6 h-6" 
                  style={{ 
                    color: tierConfig.glowColor,
                    filter: `drop-shadow(0 0 6px ${tierConfig.glowColor})`,
                  }} 
                />
                <span 
                  className="font-black text-lg tracking-wide"
                  style={{
                    color: '#ffffff',
                    textShadow: `
                      0 0 10px ${tierConfig.glowColor}, 
                      2px 2px 4px rgba(0,0,0,1),
                      0 0 20px ${tierConfig.glowColor}80
                    `,
                  }}
                >
                  {tierConfig.name}
                </span>
              </div>
            </motion.div>

            {/* 아이템 이미지 */}
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="mb-6"
            >
              <div 
                className="w-40 h-40 mx-auto rounded-3xl border-3 flex items-center justify-center text-8xl relative overflow-hidden"
                style={{
                  borderColor: `${tierConfig.glowColor}`,
                  background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.9))`,
                  boxShadow: `
                    0 0 30px ${tierConfig.glowColor}60, 
                    inset 0 0 30px ${tierConfig.glowColor}20,
                    inset 0 2px 0 rgba(255, 255, 255, 0.3)
                  `,
                }}
              >
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${tierConfig.glowColor}30 0%, transparent 70%)`,
                  }}
                />
                <motion.span 
                  className="relative z-10"
                  style={{
                    filter: `drop-shadow(0 0 15px ${tierConfig.glowColor})`,
                    textShadow: `0 0 25px ${tierConfig.glowColor}`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {result.image || '🎁'}
                </motion.span>
              </div>
            </motion.div>

            {/* 아이템 정보 - 최대 가독성 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              {/* 매우 선명한 배경 */}
              <div 
                className="rounded-2xl p-6 border"
                style={{
                  background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.9))`,
                  borderColor: `${tierConfig.glowColor}60`,
                  boxShadow: `
                    0 0 20px ${tierConfig.glowColor}30,
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <h3 
                  className="text-3xl font-black mb-4 tracking-wide"
                  style={{
                    color: '#ffffff',
                    textShadow: `
                      0 0 15px ${tierConfig.glowColor}, 
                      3px 3px 6px rgba(0,0,0,1),
                      0 0 30px ${tierConfig.glowColor}60
                    `,
                  }}
                >
                  {result.name}
                </h3>
                <p 
                  className="text-lg leading-relaxed font-medium"
                  style={{
                    color: '#ffffff',
                    textShadow: `
                      2px 2px 4px rgba(0,0,0,1),
                      0 0 10px rgba(255,255,255,0.3)
                    `,
                  }}
                >
                  {result.description}
                </p>
              </div>
            </motion.div>

            {/* 확인 버튼 - 더 선명하게 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={onClose}
                className="w-full min-h-[56px] text-xl font-black border-2 hover:scale-105 transition-all duration-200 tracking-wide"
                style={{
                  borderColor: `${tierConfig.glowColor}`,
                  background: `linear-gradient(135deg, ${tierConfig.glowColor}40, rgba(0, 0, 0, 0.8))`,
                  color: '#ffffff',
                  textShadow: `
                    2px 2px 4px rgba(0,0,0,1),
                    0 0 15px ${tierConfig.glowColor}
                  `,
                  boxShadow: `
                    0 0 25px ${tierConfig.glowColor}40,
                    inset 0 2px 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
                variant="outline"
              >
                <Star className="w-6 h-6 mr-3" />
                확인
              </Button>
            </motion.div>
          </div>

          {/* Animated Border Glow - 더 강하게 */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${tierConfig.glowColor}60, transparent)`,
              padding: '2px',
              opacity: 0.8,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="bg-transparent rounded-2xl w-full h-full" />
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}