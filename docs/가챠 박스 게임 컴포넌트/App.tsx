import { motion } from 'framer-motion';
import { GachaBox } from './components/gacha/GachaBox';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Plus, RotateCcw, Gift } from 'lucide-react';
import { TicketProvider, useTickets } from './contexts/TicketContext';

// 메인 앱 컴포넌트 (Context 내부)
function AppContent() {
  const { state, addTickets, resetTickets } = useTickets();

  const mockGachaPull = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          name: '샘플 아이템',
          tier: 'rare',
          description: '멋진 아이템입니다!'
        });
      }, 1000);
    });
  };

  return (
    <div className="dark min-h-screen bg-background">
      {/* Clear Header with Minimal Blur */}
      <motion.header 
        className="glass-light sticky top-0 z-50 border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Animated Logo with Clear Background */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-2xl relative"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-minimal-glow">✨</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#ff4516] to-[#f59e0b] rounded-full blur-sm opacity-30"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.div>
              <motion.h1 
                className="text-lg sm:text-xl font-bold text-clear-primary"
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(45deg, #ff4516, #f59e0b, #7b29cd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NEON GACHA
              </motion.h1>
            </motion.div>
            
            {/* Clear Action Buttons */}
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => addTickets(5)}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 glass-strong border-[#ff4516]/40 hover:bg-[#ff4516]/15 hover:border-[#ff4516]/60 micro-bounce text-clear-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">티켓 </span>+5
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => resetTickets(10)}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 glass-strong border-[#f59e0b]/40 hover:bg-[#f59e0b]/15 hover:border-[#f59e0b]/60 micro-bounce text-clear-primary"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden xs:inline">초기화</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content with Optimized Blur */}
      <main className="px-4 py-6 sm:px-6 sm:py-8 max-w-6xl mx-auto relative">
        {/* Subtle Floating Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-[#ff4516] rounded-full opacity-15"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
              }}
              animate={{
                y: -100,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 8,
              }}
            />
          ))}
        </div>

        {/* Main Gacha Card with Strong Glass for Content */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-strong rounded-2xl overflow-hidden relative">
            {/* Subtle Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-40"
              style={{
                background: `conic-gradient(from 0deg, #ff451620, #f59e0b20, #7b29cd20, #ff451620)`,
                padding: '1px',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <div className="bg-transparent rounded-2xl w-full h-full" />
            </motion.div>
            
            <div className="relative z-10">
              <CardHeader className="text-center pb-3 px-3 pt-4 sm:px-6 sm:pt-6 sm:pb-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 text-clear-primary">
                    <motion.span
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      🎰
                    </motion.span>
                    <span className="text-minimal-glow">가챠 뽑기</span>
                  </CardTitle>
                  <motion.p 
                    className="text-clear-muted text-sm mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    티켓을 사용해서 랜덤 아이템을 획득하세요!
                  </motion.p>
                  <motion.div 
                    className="text-clear-accent text-xs mt-1 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    총 뽑기 횟수: {state.totalSpent}회 | 잔여 횟수: {state.count}회
                  </motion.div>
                </motion.div>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-4 sm:px-6 sm:pb-6">
                <GachaBox
                  tickets={state.count}
                  onPull={mockGachaPull}
                  onTicketUpdate={() => {}} // Context에서 관리하므로 빈 함수
                />
              </CardContent>
            </div>
          </div>
        </motion.div>

        {/* 간소화된 아이템 갤러리 */}
        <motion.div 
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-clear-primary">
                <Gift className="w-5 h-5 text-clear-accent" />
                <span>획득 가능한 아이템</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* 간단한 아이템 미리보기 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { emoji: '⚔️', name: '무기류', tier: 'common', color: '#cccccc' },
                  { emoji: '🛡️', name: '방어구', tier: 'rare', color: '#4fc3f7' },
                  { emoji: '🪄', name: '마법 아이템', tier: 'epic', color: '#e879f9' },
                  { emoji: '👑', name: '전설 장비', tier: 'legendary', color: '#ffc107' }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="glass-strong p-4 rounded-xl text-center relative overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <motion.div
                      className="text-3xl mb-2"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2 + index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.emoji}
                    </motion.div>
                    <div 
                      className="text-sm font-medium"
                      style={{ 
                        color: item.color,
                        textShadow: `1px 1px 2px rgba(0,0,0,0.8), 0 0 4px ${item.color}40`
                      }}
                    >
                      {item.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// 메인 App 컴포넌트 (Context Provider로 래핑)
export default function App() {
  return (
    <TicketProvider>
      <AppContent />
    </TicketProvider>
  );
}