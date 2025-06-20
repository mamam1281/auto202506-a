'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Container } from './Container';
import { useLayout } from '../../../contexts/AppContext';
import { cn } from '../utils/utils';
import { pageVariants } from '../../../lib/animations';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function AppLayout({ 
  children, 
  showSidebar = true, 
  showFooter = true,
  containerSize = 'lg',
  className 
}: AppLayoutProps) {
  const { sidebarOpen } = useLayout();

  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* 헤더 */}
      <Header />

      <div className="flex">
        {/* 사이드바 */}
        {showSidebar && <Sidebar />}

        {/* 메인 컨텐츠 */}
        <motion.main 
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300",
            showSidebar && "md:ml-64",
            className
          )}
          animate={{
            marginLeft: showSidebar && sidebarOpen ? '16rem' : showSidebar ? '0' : '0'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Container size={containerSize} className="py-6">
            {children}
          </Container>
        </motion.main>
      </div>

      {/* 푸터 */}
      {showFooter && <Footer />}
    </motion.div>
  );
}