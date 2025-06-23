'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Container } from './Container';
import { cn } from '../utils/utils';
import styles from './AppLayout.module.css';
import AppBar from './AppBar';
import BottomNav from './BottomNav';
import MetricDisplay from '../data-display/MetricDisplay';
import PlayerStatsCard from '../data-display/PlayerStatsCard';
import ProgressBar from '../data-display/ProgressBar';

export interface AppLayoutProps {
  /** 자식 요소 (메인 컨텐츠) */
  children: React.ReactNode;
  /** 앱바 표시 여부 */
  showAppBar?: boolean;
  /** 사이드바 표시 여부 */
  showSidebar?: boolean;  /** 바텀 네비게이션 표시 여부 */
  showBottomNav?: boolean;
  /** 데스크톱에서도 바텀네비 표시 (Storybook용) */
  showBottomNavOnDesktop?: boolean;
  /** 사이드바 초기 축소 상태 */
  initialSidebarCollapsed?: boolean;  
  /** 메인 컨텐츠 컨테이너 크기 */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 메인 컨텐츠 패딩 제거 */
  noContentPadding?: boolean;
  /** 고정 레이아웃 (사이드바가 항상 보임) */
  fixedLayout?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 메인 지표 표시 여부 */
  showMetrics?: boolean;
  /** 플레이어 스탯 카드 표시 여부 */
  showPlayerStats?: boolean;
  /** 앱바 추가 속성 */
  appBarProps?: Partial<React.ComponentProps<typeof AppBar>>;  /** 사이드바 추가 속성 */
  sidebarProps?: Partial<React.ComponentProps<typeof Sidebar>>;
}

/**
 * # AppLayout 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템의 메인 레이아웃 컴포넌트입니다.
 * AppBar, Sidebar, BottomNav를 통합하여 일관된 앱 레이아웃을 제공합니다.
 * 
 * ## 특징
 * - **완전한 레이아웃**: AppBar + Sidebar + Main + BottomNav 구성
 * - **반응형 디자인**: 모바일/데스크톱 자동 최적화
 * - **유연한 구성**: 각 영역별 표시/숨김 제어
 * - **사이드바 상태**: 축소/확장 상태 관리
 * - **컨테이너 통합**: 메인 컨텐츠 컨테이너 자동 적용
 * - **Safe Area 지원**: 노치 및 하단 제스처 영역 자동 처리
 * 
 * ## 레이아웃 구조
 * ```
 * ┌─────────────────────────────────┐
 * │ AppBar (시스템바 포함)            │
 * ├──────────┬──────────────────────┤
 * │ Sidebar  │ Main Content         │
 * │ (선택적)  │ (Container 적용)      │
 * │          │                      │
 * ├──────────┴──────────────────────┤
 * │ BottomNav (모바일용)             │
 * └─────────────────────────────────┘
 * ``` * @example
 * ```tsx
 * // 기본 앱 레이아웃
 * <AppLayout>
 *   <h1>메인 페이지</h1>
 *   <GameGrid />
 * </AppLayout>
 * ```
 * 
 * @example
 * ```tsx
 * // 사이드바 없는 게임 화면 레이아웃
 * <AppLayout 
 *   showSidebar={false} 
 *   containerSize="full"
 *   appBarProps={{ 
 *     title: "슬롯 게임", 
 *     leftContent: "back",
 *     variant: "game" 
 *   }}
 * >
 *   <GameDetailPage />
 * </AppLayout>
 * 
 * // 완전 커스텀 레이아웃
 * <AppLayout 
 *   fixedLayout
 *   initialSidebarCollapsed
 *   appBarProps={{ 
 *     title: "대시보드", 
 *     rightContent: "notification" 
 *   }}
 * >
 *   <Dashboard />
 * </AppLayout>
 * ```
 */
export function AppLayout({
  children,
  showAppBar = true,
  showSidebar = true,
  showBottomNav = true,
  showBottomNavOnDesktop = false,
  initialSidebarCollapsed = false,
  containerSize = 'lg',
  noContentPadding = false,
  fixedLayout = false,
  showMetrics = false,
  showPlayerStats = false,  className,
  appBarProps = {},
  sidebarProps = {}
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapseToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };  return (
    <div className={cn(
      styles.layout,
      fixedLayout && styles.layoutFixed,
      showSidebar && styles.layoutWithSidebar,
      sidebarCollapsed && styles.layoutSidebarCollapsed,
      showBottomNav && styles.layoutWithBottomNav, // 바텀네비 여백 클래스 추가
      className
    )}>
      {/* AppBar는 시스템바(safe-area-inset-top) 영역을 자동으로 처리합니다 */}
      {showAppBar && (
        <AppBar
          leftContent={showSidebar ? "menu" : "back"}
          onMenuClick={showSidebar ? handleMenuToggle : undefined}
          {...appBarProps}
        />
      )}

      <div className={styles.body}>
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={handleMenuToggle}
            isCollapsed={sidebarCollapsed}
            onCollapseToggle={handleSidebarCollapseToggle}
            {...sidebarProps}
          />
        )}
        <main className={cn(
          styles.main,
          noContentPadding && styles.mainNoPadding
        )}>
          {/* 메인 지표 예시: MetricDisplay, PlayerStatsCard, ProgressBar 등 */}
          {showMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <MetricDisplay icon={<span>🪙</span>} label="토큰" value={12345} accentText="+120" />
              <MetricDisplay icon={<span>⭐</span>} label="XP" value={3200} accentText="Lv.12" />
              <MetricDisplay icon={<span>🔔</span>} label="알림" value={3} />
              <MetricDisplay icon={<span>❤️</span>} label="체력" value={80} accentText={<ProgressBar value={80} color="red" />} />
            </div>
          )}
          {showPlayerStats && (
            <PlayerStatsCard money={10000} xp={3200} notifications={3} health={80} stamina={60} profileImage="/profile.png" />
          )}
          {noContentPadding ? (
            children
          ) : (
            <Container size={containerSize}>
              {children}
            </Container>
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar - 최상위 레벨에서 렌더링 (fixed 포지션을 위해) */}
      {showBottomNav && (
        <BottomNav 
          className={showBottomNavOnDesktop ? '' : 'md:hidden'}
        />
      )}
    </div>
  );
}

export default AppLayout;