'use client';

import { ReactNode, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  Users, 
  Store, 
  History, 
  Settings,
  TrendingUp,
  Star,
  Wallet
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth, useLayout } from '../../contexts/AppContext';
import { sidebarVariants, listItemVariants, containerVariants, buttonVariants } from '../../lib/animations';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const mainNavItems: NavItem[] = [
  { label: '홈', icon: <Home className="h-5 w-5" />, href: '/', isActive: true },
  { label: '게임', icon: <Gamepad2 className="h-5 w-5" />, href: '/games' },
  { label: '랭킹', icon: <Trophy className="h-5 w-5" />, href: '/leaderboard' },
  { label: '커뮤니티', icon: <Users className="h-5 w-5" />, href: '/community' },
  { label: '상점', icon: <Store className="h-5 w-5" />, href: '/store', badge: 'NEW' },
];

const gameNavItems: NavItem[] = [
  { label: '인기 게임', icon: <TrendingUp className="h-5 w-5" />, href: '/games/popular' },
  { label: '즐겨찾기', icon: <Star className="h-5 w-5" />, href: '/games/favorites' },
  { label: '최근 플레이', icon: <History className="h-5 w-5" />, href: '/games/recent' },
];

const accountNavItems: NavItem[] = [
  { label: '지갑', icon: <Wallet className="h-5 w-5" />, href: '/wallet' },
  { label: '설정', icon: <Settings className="h-5 w-5" />, href: '/settings' },
];

const NavSection = memo(({ title, items }: { title: string; items: NavItem[] }) => (
  <motion.div 
    className="mb-6"
    variants={containerVariants}
    initial="initial"
    animate="animate"
  >
    <motion.h3 
      className="mb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider"
      variants={listItemVariants}
    >
      {title}
    </motion.h3>
    <nav className="space-y-1">
      {items.map((item) => (
        <motion.div
          key={item.href}
          variants={listItemVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant={item.isActive ? "secondary" : "ghost"}
              className={`w-full justify-start px-4 py-2.5 h-auto text-left transition-all duration-200 ${
                item.isActive 
                  ? "bg-[var(--neon-purple-4)]/10 text-[var(--neon-purple-2)] border-r-2 border-[var(--neon-purple-3)]" 
                  : "hover:bg-[var(--surface-glass)]"
              }`}
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3 w-full">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.div>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="px-2 py-0.5 text-xs font-medium bg-[var(--game-gold)] text-black">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </Button>
          </motion.div>
        </motion.div>
      ))}
    </nav>
  </motion.div>
));

NavSection.displayName = 'NavSection';

const UserProfile = memo(() => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || !user) return null;

  return (
    <motion.div 
      className="border-t p-4"
      variants={listItemVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="flex items-center gap-3 px-4"
        variants={buttonVariants}
        whileHover="hover"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user.username}</p>
          <p className="text-xs text-muted-foreground">레벨 {user.level}</p>
        </div>
      </motion.div>
    </motion.div>
  );
});

UserProfile.displayName = 'UserProfile';

export const Sidebar = memo(({ className }: SidebarProps) => {
  const { sidebarOpen, setSidebar } = useLayout();
  const { isAuthenticated } = useAuth();

  const handleClose = useCallback(() => {
    setSidebar(false);
  }, [setSidebar]);

  return (
    <>
      {/* 모바일 오버레이 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      
      {/* 사이드바 */}
      <motion.aside 
        className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:translate-x-0 md:static md:z-0"
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex h-full flex-col">
          <motion.div 
            className="flex-1 overflow-y-auto py-6"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <NavSection title="메인" items={mainNavItems} />
            <NavSection title="게임" items={gameNavItems} />
            {isAuthenticated && <NavSection title="계정" items={accountNavItems} />}
          </motion.div>
          
          {/* 사이드바 하단 정보 */}
          <UserProfile />
        </div>
      </motion.aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';