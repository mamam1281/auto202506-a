'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Container } from './Container';
import { cn } from '../utils/utils';
import styles from './AppLayout.module.css';

export interface AppLayoutProps {
  /** 자식 요소 (메인 컨텐츠) */
  children: React.ReactNode;
  /** 헤더 표시 여부 */
  showHeader?: boolean;
  /** 사이드바 표시 여부 */
  showSidebar?: boolean;
  /** 푸터 표시 여부 */
  showFooter?: boolean;
  /** 간단한 푸터 모드 */
  simpleFooter?: boolean;
  /** 사이드바 초기 축소 상태 */
  initialSidebarCollapsed?: boolean;  /** 메인 컨텐츠 컨테이너 크기 */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 메인 컨텐츠 패딩 제거 */
  noContentPadding?: boolean;
  /** 고정 레이아웃 (사이드바가 항상 보임) */
  fixedLayout?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 헤더 추가 속성 */
  headerProps?: Partial<React.ComponentProps<typeof Header>>;
  /** 사이드바 추가 속성 */
  sidebarProps?: Partial<React.ComponentProps<typeof Sidebar>>;
  /** 푸터 추가 속성 */
  footerProps?: Partial<React.ComponentProps<typeof Footer>>;
}

/**
 * # AppLayout 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템의 메인 레이아웃 컴포넌트입니다.
 * Header, Sidebar, Footer를 통합하여 일관된 앱 레이아웃을 제공합니다.
 * 
 * ## 특징
 * - **완전한 레이아웃**: Header + Sidebar + Main + Footer 구성
 * - **반응형 디자인**: 모바일/데스크톱 자동 최적화
 * - **유연한 구성**: 각 영역별 표시/숨김 제어
 * - **사이드바 상태**: 축소/확장 상태 관리
 * - **컨테이너 통합**: 메인 컨텐츠 컨테이너 자동 적용
 * 
 * ## 레이아웃 구조
 * ```
 * ┌─────────────────────────────────┐
 * │ Header (고정)                    │
 * ├──────────┬──────────────────────┤
 * │ Sidebar  │ Main Content         │
 * │ (선택적)  │ (Container 적용)      │
 * │          │                      │
 * ├──────────┴──────────────────────┤
 * │ Footer (선택적)                  │
 * └─────────────────────────────────┘
 * ```
 * 
 * @example
 * ```tsx
 * // 기본 앱 레이아웃
 * <AppLayout>
 *   <h1>메인 페이지</h1>
 *   <GameGrid />
 * </AppLayout>
 * 
 * // 사이드바 없는 레이아웃
 * <AppLayout showSidebar={false} containerSize="full">
 *   <GameDetailPage />
 * </AppLayout>
 * 
 * // 완전 커스텀 레이아웃
 * <AppLayout 
 *   fixedLayout
 *   simpleFooter
 *   initialSidebarCollapsed
 *   headerProps={{ showSearch: false }}
 * >
 *   <Dashboard />
 * </AppLayout>
 * ```
 */
export function AppLayout({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  simpleFooter = false,
  initialSidebarCollapsed = false,
  containerSize = 'lg',
  noContentPadding = false,
  fixedLayout = false,
  className,
  headerProps = {},
  sidebarProps = {},
  footerProps = {}
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapseToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={cn(
      styles.layout,
      fixedLayout && styles.layoutFixed,
      showSidebar && styles.layoutWithSidebar,
      sidebarCollapsed && styles.layoutSidebarCollapsed,
      className
    )}>
      {/* 헤더 */}
      {showHeader && (
        <Header
          onMenuToggle={showSidebar ? handleMenuToggle : undefined}
          isMenuOpen={sidebarOpen}
          {...headerProps}
        />
      )}

      <div className={styles.body}>
        {/* 사이드바 */}
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={handleMenuToggle}
            isCollapsed={sidebarCollapsed}
            onCollapseToggle={handleSidebarCollapseToggle}
            {...sidebarProps}
          />
        )}

        {/* 메인 컨텐츠 */}
        <main className={cn(
          styles.main,
          noContentPadding && styles.mainNoPadding
        )}>
          {noContentPadding ? (
            children
          ) : (
            <Container size={containerSize}>
              {children}
            </Container>
          )}
        </main>
      </div>

      {/* 푸터 */}
      {showFooter && (
        <Footer
          simple={simpleFooter}
          {...footerProps}
        />
      )}
    </div>
  );
}

export default AppLayout;