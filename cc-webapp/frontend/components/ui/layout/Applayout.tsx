'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Container } from './Container';
import { useLayout } from '../../../contexts/AppContext';
import { cn } from '../utils/utils';
import { pageVariants, containerVariants, childVariants } from '../../../lib/animations';

interface AppLayoutProps {
  /** 메인 컨텐츠 */
  children: ReactNode;
  
  /** 사이드바 표시 여부 */
  showSidebar?: boolean;
  
  /** 푸터 표시 여부 */
  showFooter?: boolean;
  
  /** 컨테이너 크기 */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /** 배경 스타일 */
  variant?: 'default' | 'dark' | 'game';
  
  /** 앱 테마 */
  theme?: 'light' | 'dark' | 'system';
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 앱 레이아웃 컴포넌트
 * 피그마_003게임 플랫폼 레이아웃 시스템 참조 구현
 */
export function AppLayout({ 
  children, 
  showSidebar = true, 
  showFooter = true,
  containerSize = 'xl',
  variant = 'default',
  theme = 'dark',
  className 
}: AppLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useLayout();

  // 배경 스타일 클래스
  const variantClasses = {
    default: 'bg-background',
    dark: 'bg-slate-900',
    game: 'bg-gradient-to-br from-slate-900 via-[var(--neon-purple-1)] to-slate-900'
  };

  // 테마 적용
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
        
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    return () => {
      root.classList.remove('light', 'dark');
    };
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className={cn(
          "min-h-screen flex flex-col",
          variantClasses[variant]
        )}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* 헤더 */}
        <Header />

        <div className="flex flex-1">
          {/* 사이드바 */}
          {showSidebar && <Sidebar />}

          {/* 메인 컨텐츠 */}
          <motion.main 
            className={cn(
              "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300",
              showSidebar && "md:ml-64",
              className
            )}
            variants={containerVariants}
            initial="hidden"
            animate="visible"            style={{
              marginLeft: showSidebar && sidebarOpen ? '16rem' : showSidebar ? '0' : '0'
            }}
          >
            <Container 
              size={containerSize} 
              className="py-6 min-h-full"
            >              {/* 자식 컴포넌트 렌더링 */}
              {children}
            </Container>
          </motion.main>
        </div>        {/* 푸터 */}
        {showFooter && <Footer />}
      </motion.div>
    </AnimatePresence>
  );
}