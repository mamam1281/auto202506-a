'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Coins, User, Settings, Search, Bell } from 'lucide-react';
import { Container } from './Container';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth, useLayout, useNotifications } from '../../contexts/AppContext';
import { buttonVariants, cardVariants } from '../../lib/animations';

interface HeaderProps {
  className?: string;
}

const TokenBalance = memo(() => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <motion.div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--neon-purple-4)] to-[var(--neon-purple-2)] text-white"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Coins className="h-4 w-4" />
      <span className="font-medium text-sm">
        {user.tokenBalance.toLocaleString()}
      </span>
    </motion.div>
  );
});

TokenBalance.displayName = 'TokenBalance';

const NotificationBell = memo(() => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      <Button variant="ghost" size="sm" className="p-2 relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Badge 
              variant="destructive" 
              className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-[var(--game-error)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
});

NotificationBell.displayName = 'NotificationBell';

export const Header = memo(({ className }: HeaderProps) => {
  const { isAuthenticated, user } = useAuth();
  const { sidebarOpen, toggleSidebar } = useLayout();

  const handleMenuToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 왼쪽: 로고 & 햄버거 메뉴 */}
          <div className="flex items-center gap-4">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={handleMenuToggle}
                aria-label="메뉴 토글"
              >
                <motion.div
                  animate={{ rotate: sidebarOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {sidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">GamePlatform</span>
            </motion.div>
          </div>

          {/* 중앙: 검색 (데스크톱) */}
          <motion.div 
            className="hidden md:flex flex-1 max-w-md mx-8"
            variants={cardVariants}
            initial="initial"
            animate="animate"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="게임 검색..."
                className="w-full px-4 py-2 pr-10 rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple-3)] transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </motion.div>

          {/* 오른쪽: 토큰 잔액 & 사용자 메뉴 */}
          <div className="flex items-center gap-3">
            {isAuthenticated && <TokenBalance />}

            {/* 사용자 메뉴 */}
            <div className="flex items-center gap-2">
              {isAuthenticated && <NotificationBell />}
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button variant="ghost" size="sm" className="p-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button variant="ghost" size="sm" className="p-2">
                  {isAuthenticated && user?.avatar ? (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 모바일 검색 */}
        <motion.div 
          className="md:hidden pb-4"
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <div className="relative">
            <input
              type="search"
              placeholder="게임 검색..."
              className="w-full px-4 py-2 pr-10 rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple-3)] transition-all duration-200"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </motion.div>
      </Container>
    </motion.header>
  );
});

Header.displayName = 'Header';