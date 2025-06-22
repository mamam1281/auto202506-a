'use client';

import React from 'react';
import { Home, Gamepad2, Trophy, Gift, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../basic/Button';
import { cn } from '../utils/utils';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  onClick?: () => void;
  badge?: string;
  active?: boolean;
}

export interface SidebarProps {
  /** 사이드바가 열린 상태인지 */
  isOpen?: boolean;
  /** 사이드바 토글 핸들러 */
  onToggle?: () => void;
  /** 사이드바가 축소된 상태인지 */
  isCollapsed?: boolean;
  /** 사이드바 축소/확장 핸들러 */
  onCollapseToggle?: () => void;
  /** 네비게이션 메뉴 항목들 */
  items?: SidebarItem[];
  /** 현재 활성화된 항목 ID */
  activeItem?: string;
  /** 브랜드 영역 표시 여부 */
  showBrand?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 자식 요소 (커스텀 컨텐츠) */
  children?: React.ReactNode;
}

const defaultItems: SidebarItem[] = [
  { id: 'home', label: '홈', icon: Home, href: '/' },
  { id: 'games', label: '게임', icon: Gamepad2, href: '/games' },
  { id: 'leaderboard', label: '랭킹', icon: Trophy, href: '/leaderboard' },
  { id: 'rewards', label: '리워드', icon: Gift, href: '/rewards', badge: 'NEW' },
  { id: 'settings', label: '설정', icon: Settings, href: '/settings' },
];

/**
 * # Sidebar 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 사이드바 컴포넌트입니다.
 * 반응형 디자인과 축소/확장 기능을 지원합니다.
 * 
 * ## 특징
 * - **반응형 디자인**: 모바일에서는 오버레이, 데스크톱에서는 고정
 * - **축소/확장**: 데스크톱에서 사이드바 크기 조절 가능
 * - **네비게이션**: 아이콘과 텍스트가 포함된 메뉴 시스템
 * - **게임 브랜딩**: 네온 퍼플 디자인 시스템
 * - **뱃지 지원**: 새로운 기능이나 알림 표시
 * 
 * @example
 * ```tsx
 * <Sidebar 
 *   isOpen={sidebarOpen}
 *   onToggle={toggleSidebar}
 *   isCollapsed={sidebarCollapsed}
 *   activeItem="games"
 * />
 * ```
 */
export function Sidebar({
  isOpen = false,
  onToggle,
  isCollapsed = false,
  onCollapseToggle,
  items = defaultItems,
  activeItem,
  showBrand = true,
  className,
  children
}: SidebarProps) {
  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    // 모바일에서는 항목 클릭 시 사이드바 닫기
    if (window.innerWidth < 768 && onToggle) {
      onToggle();
    }
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside className={cn(
        styles.sidebar,
        isOpen && styles.sidebarOpen,
        isCollapsed && styles.sidebarCollapsed,
        className      )}>
        {/* 사이드바 헤더 */}
        <div className={styles.sidebarHeader}>
          {/* 브랜드 영역 */}
          {showBrand && (
            <div className={styles.brand}>
              <div className={styles.brandIcon}>
                <span className={styles.brandIconText}>G</span>
              </div>
              {!isCollapsed && (
                <span className={styles.brandName}>GamePlatform</span>
              )}
            </div>
          )}
            {/* 닫기 버튼 (모바일) */}
          {!isCollapsed && onToggle && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggle}
              className={cn(styles.closeButton, 'md:hidden')}
              aria-label="사이드바 닫기"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    className={cn(
                      styles.navItem,
                      isActive && styles.navItemActive
                    )}
                    onClick={() => handleItemClick(item)}
                    aria-label={item.label}
                  >
                    <Icon className={styles.navIcon} />
                    {!isCollapsed && (
                      <>
                        <span className={styles.navLabel}>{item.label}</span>
                        {item.badge && (
                          <span className={styles.navBadge}>{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 커스텀 컨텐츠 */}
        {children && (
          <div className={styles.customContent}>
            {children}
          </div>
        )}        {/* 축소/확장 토글 (데스크톱만) */}
        {onCollapseToggle && (
          <div className={styles.collapseToggle}>
            <Button
              variant="secondary"
              size="sm"
              onClick={onCollapseToggle}
              className={styles.collapseButton}
              aria-label={isCollapsed ? "사이드바 확장" : "사이드바 축소"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
