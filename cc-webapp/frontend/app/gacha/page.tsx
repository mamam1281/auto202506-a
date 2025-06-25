'use client';

import { motion } from 'framer-motion';
import { Plus, RotateCcw, Gift, Zap, ShieldHalf, Wand2, Crown } from 'lucide-react';
import Button from '../../components/Button';
import { ModernCard } from '../../components/ui/data-display/ModernCard';
import { cn } from '../../components/utils';

// Mock hooks and configs for placeholders
const useTickets = () => ({
  addTickets: (count: number) => console.log(`Adding ${count} tickets`),
  resetTickets: (config: any) => console.log('Resetting tickets'),
  state: { count: 10, spent: 0 }
});

const TIER_CONFIG = {
  legendary: { color: 'text-yellow-400', glowColor: '#fbbf24' },
  epic: { color: 'text-purple-400', glowColor: '#a855f7' },
  rare: { color: 'text-blue-400', glowColor: '#3b82f6' },
  common: { color: 'text-gray-400', glowColor: '#9ca3af' }
};

// Placeholder Card components
function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={className}>{children}</h3>;
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

// Placeholder TicketProvider
function TicketProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Placeholder GachaBox component
function GachaBox() {
  return (
    <div className="flex items-center justify-center h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
      <div className="text-center">
        <Gift className="w-12 h-12 mx-auto mb-2 text-purple-400" />
        <p className="text-sm text-gray-300">가챠 박스 (개발중)</p>
      </div>
    </div>
  );
}

// Sub-component for the header actions, to easily use useTickets hook
function GachaPageHeaderActions() {
  const { addTickets, resetTickets, state } = useTickets();
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => addTickets(5)}
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 micro-bounce text-clear-primary",
            "glass-strong border-[var(--neon-purple-1)] hover:bg-[var(--neon-purple-1)]/20 hover:border-[var(--neon-purple-2)]",
            "focus:ring-[var(--neon-purple-3)]"
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">티켓</span>+5
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => resetTickets({ initialCount: 10, initialSpent: 0 })}
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 micro-bounce text-clear-primary",
            "glass-strong border-[var(--color-accent-amber)] hover:bg-[var(--color-accent-amber)]/20 hover:border-[var(--gacha-legendary-glow)]",
            "focus:ring-[var(--color-accent-amber)]"
          )}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xs:inline">초기화</span>
        </Button>
      </motion.div>
    </div>
  );
}

// Sub-component for the item gallery
function ItemGallery() {
    const galleryItems = [
        { emoji: <Zap size={28} />, name: '전설급 아이템', tier: TIER_CONFIG.legendary },
        { emoji: <Crown size={28} />, name: '에픽 아이템', tier: TIER_CONFIG.epic },
        { emoji: <ShieldHalf size={28} />, name: '레어 아이템', tier: TIER_CONFIG.rare },
        { emoji: <Wand2 size={28} />, name: '일반 아이템', tier: TIER_CONFIG.common },
    ];

    return (
        <motion.div
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
            <div className="glass-strong rounded-xl sm:rounded-2xl overflow-hidden p-1 shadow-lg">
                 {/* Animated Border for Gallery Card */}
                <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-50 pointer-events-none"
                    style={{
                        background: `conic-gradient(from var(--angle), transparent 20%, var(--neon-purple-2) 40%, var(--color-accent-red) 60%, transparent 80%)`,
                        padding: '1px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude', WebkitMaskComposite: 'xor',
                    }}
                    initial={{ ['--angle' as any]: '0deg' }}
                    animate={{ ['--angle' as any]: '360deg' }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <CardHeader className="pb-3 sm:pb-4 pt-4 sm:pt-5 px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center justify-center sm:justify-start gap-2 text-clear-primary">
                        <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--neon-purple-1)]" style={{filter: 'drop-shadow(0 0 4px var(--neon-purple-1))'}} />
                        <span className="text-minimal-glow">획득 가능한 아이템 등급</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 sm:px-4 pb-4 sm:pb-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {galleryItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                className="glass-light p-3 sm:p-4 rounded-lg sm:rounded-xl text-center relative overflow-hidden group cursor-default shadow-md hover:shadow-xl transition-shadow duration-300"
                                style={{ borderColor: `${item.tier.glowColor}80`}}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.15, ease: "easeOut" }}
                                whileHover={{ scale: 1.04, y: -3, transition: { type: 'spring', stiffness:300, damping:10 } }}
                            >
                                <motion.div
                                    className="text-3xl sm:text-4xl mb-2 flex justify-center items-center"
                                    style={{ color: item.tier.glowColor, filter: `drop-shadow(0 0 6px ${item.tier.glowColor})`}}
                                    animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0]}}
                                    transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {item.emoji}
                                </motion.div>
                                <div
                                    className={cn("text-xs sm:text-sm font-medium", item.tier.color)} // Apply Tailwind class for color
                                    style={{
                                        // color: item.tier.glowColor, // Color is now from Tailwind class
                                        textShadow: `0 0 4px ${item.tier.glowColor}90, 0 0 8px ${item.tier.glowColor}70, 1px 1px 1px rgba(0,0,0,0.8)`,
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
    );
}


// Main Gacha Page Content
function GachaPageContent() {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-[var(--neon-purple-2)] selection:text-white">
      {/* Floating Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(12)].map((_, i) => {
            const size = Math.random() * 2.5 + 0.5; // 0.5px to 3px
            const duration = Math.random() * 20 + 15; // 15s to 35s
            const delay = Math.random() * 10;
            const colors = ['var(--neon-purple-1)', 'var(--color-accent-red)', 'var(--color-accent-amber)'];
            const color = colors[i % colors.length];
            return (
                 <motion.div
                    key={`bg-particle-${i}`}
                    className="absolute rounded-full"
                    style={{
                        width: size, height: size,
                        backgroundColor: color,
                        boxShadow: `0 0 6px ${color}, 0 0 10px ${color}80`,
                        // CSS variables for particleFloat animation
                        ['--particle-end-x' as any]: `${Math.random() * 200 - 100}px`,
                        ['--particle-end-y' as any]: `${Math.random() * 200 - 200}px`,
                        ['--particle-end-rotate' as any]: `${Math.random() * 720 - 360}deg`,
                        ['--particle-duration' as any]: `${duration}s`,
                        ['--particle-delay' as any]: `${delay}s`,
                    }}
                    initial={{
                        x: `${Math.random() * 100}vw`,
                        y: `${Math.random() * 100}vh`,
                        opacity: 0,
                    }}
                    className="animate-particle-float"
                />
            );
        })}
      </div>

      {/* Page Header */}
      <motion.header
        className="sticky top-0 z-40 py-3 sm:py-4 px-4 sm:px-6 glass-light shadow-md"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.h1
            className="text-xl sm:text-2xl font-bold text-minimal-glow"
            style={{
              background: 'linear-gradient(45deg, var(--neon-purple-1), var(--color-accent-red), var(--color-accent-amber))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            whileHover={{ scale: 1.02, textShadow: '0 0 10px var(--neon-purple-2)'}}
          >
            NEON GACHA
          </motion.h1>
          <GachaPageHeaderActions />
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="px-4 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        {/* GachaBox Wrapper Card */}
        <motion.div
          className="mb-8 sm:mb-12 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
            <div className="glass-strong rounded-xl sm:rounded-2xl overflow-hidden p-1 shadow-xl">
                {/* Animated Border for GachaBox Card */}
                <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-60 pointer-events-none"
                    style={{
                        background: `conic-gradient(from var(--angle), transparent 20%, var(--neon-purple-1) 40%, var(--color-accent-amber) 60%, transparent 80%)`,
                        padding: '1px', // This creates the border effect with the mask
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude', WebkitMaskComposite: 'xor', // Ensures only border is visible
                    }}
                    initial={{ ['--angle' as any]: '0deg' }}
                    animate={{ ['--angle' as any]: '360deg' }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative z-10 bg-[rgba(var(--background-rgb),0.5)] rounded-[calc(0.75rem-1px)] sm:rounded-[calc(1rem-1px)]"> {/* Inner background to respect border */}
                    <GachaBox />
                </div>
            </div>
        </motion.div>

        <ItemGallery />

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
