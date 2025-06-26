'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw, Gift, Zap } from 'lucide-react';
import Button from '../../components/Button';
import { GachaBox } from '../../components/games/gacha/GachaBox';
import { TicketProvider, useTickets } from '../../components/games/gacha/TicketContext';
import { cn } from '../../utils/cn';

// Header actions component
function GachaPageHeaderActions() {
  const { state: ticketState, addTickets, resetTickets } = useTickets();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <motion.div
        className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, ease: "easeOut" }}
      >
        티켓: {ticketState.count}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, ease: "easeOut" }}
      >
        <Button
          onClick={() => addTickets(5)}
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-3 sm:px-4",
            "bg-[var(--card)] border-[var(--primary)] hover:bg-[var(--primary)]/10",
            "focus:ring-[var(--primary)]"
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">+5</span>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, ease: "easeOut" }}
      >
        <Button
          onClick={() => resetTickets()}
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-3 sm:px-4",
            "bg-[var(--card)] border-[var(--secondary)] hover:bg-[var(--secondary)]/10",
            "focus:ring-[var(--secondary)]"
          )}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xs:inline">초기화</span>
        </Button>
      </motion.div>
    </div>
  );
}

// Main Gacha Page Content
function GachaPageContent() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Floating Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 2.5 + 0.5;
          const duration = Math.random() * 20 + 15;
          const delay = Math.random() * 10;
          const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
          const color = colors[i % colors.length];
          
          return (
            <motion.div
              key={`bg-particle-${i}`}
              className="absolute rounded-full opacity-20"
              style={{
                width: size, 
                height: size,
                backgroundColor: color,
              }}
              initial={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      {/* Page Header */}
      <motion.header
        className="sticky top-0 z-40 py-3 sm:py-4 px-4 sm:px-6 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-md"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-2 sm:gap-3">
          <motion.h1
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent text-center"
            whileHover={{ scale: 1.02 }}
          >
            가챠 시스템
          </motion.h1>
          <GachaPageHeaderActions />
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="px-4 py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* GachaBox Wrapper */}
        <div className="w-full flex flex-col items-center justify-center gap-8 sm:gap-12">
          <motion.div
            className="relative w-full flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <div className="min-w-[280px] max-w-[420px] w-full mx-auto" style={{ paddingTop: '100px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                  </div>
                }
              >
                <GachaBox />
              </Suspense>
            </div>
          </motion.div>
        </div>

        {/* GachaBox와 Information Section 사이 충분한 세로 간격 */}
        <div className="h-10 sm:h-16" />

        {/* Information Section */}
        <motion.div
          className="mt-0 w-full flex flex-col md:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          {/* Pity System */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl min-w-[280px] max-w-[420px] w-full mx-auto md:mx-0 md:flex-1 flex flex-col items-center justify-center" style={{ paddingTop: '100px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2 justify-center">
              <Gift className="w-5 h-5 text-[var(--primary)]" />
              보상 시스템
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed text-center">
              90회 연속으로 전설 아이템을 획득하지 못하면, 
              다음 뽑기에서 반드시 전설 아이템을 획득합니다.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl min-w-[280px] max-w-[420px] w-full mx-auto md:mx-0 md:flex-1 flex flex-col items-center justify-center" style={{ paddingTop: '100px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2 justify-center">
              <Zap className="w-5 h-5 text-[var(--secondary)]" />
              팁
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed text-center">
              티켓은 게임 플레이나 출석 보상을 통해 획득할 수 있습니다. 
              전략적으로 사용하여 원하는 아이템을 얻어보세요!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Default export for the page, wrapping content with TicketProvider
export default function GachaPage() {
  return (
    <TicketProvider>
      <GachaPageContent />
    </TicketProvider>
  );
}
