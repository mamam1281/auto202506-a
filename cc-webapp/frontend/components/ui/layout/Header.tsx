'use client';

import React from 'react';
import { Menu, X, Search, Bell, User } from 'lucide-react';
import Button from '../basic/Button';
import { HeaderTokenDisplay } from './HeaderTokenDisplay';
import { cn } from '../utils/utils';
import styles from './Header.module.css';

export interface HeaderProps {
  /** 왼쪽 네비게이션 토글 핸들러 */
  onMenuToggle?: () => void;
  /** 메뉴가 열린 상태인지 */
  isMenuOpen?: boolean;
  /** 브랜드명 */
  brandName?: string;
  /** 검색 기능 활성화 여부 */
  showSearch?: boolean;
  /** 알림 기능 활성화 여부 */
  showNotifications?: boolean;
  /** 사용자 메뉴 활성화 여부 */
  showUserMenu?: boolean;
  /** 토큰 잔액 위젯 표시 여부 */
  showTokenBalance?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 자식 요소 (커스텀 컨텐츠) */
  children?: React.ReactNode;
}

/**
 * # Header 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 헤더 컴포넌트입니다.
 * 토큰 잔액 위젯과 함께 통합적인 헤더 경험을 제공합니다.
 * 
 * ## 특징
 * - **반응형 디자인**: 모바일/데스크톱 최적화
 * - **토큰 잔액**: TokenBalanceWidget 통합
 * - **네비게이션**: 햄버거 메뉴와 사이드바 연동
 * - **게임 브랜딩**: 네온 퍼플 디자인 시스템
 * - **검색/알림**: 선택적 기능 활성화
 * 
 * @example
 * ```tsx
 * <Header 
 *   onMenuToggle={toggleSidebar}
 *   isMenuOpen={sidebarOpen}
 *   brandName="GamePlatform"
 *   showTokenBalance={true}
 *   showSearch={true}
 * />
 * ```
 */
export function Header({
  onMenuToggle,
  isMenuOpen = false,
  brandName = "GamePlatform",
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  showTokenBalance = true,
  className,
  children
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.container}>
        {/* 왼쪽: 메뉴 토글 + 브랜드 */}
        <div className={styles.left}>          <Button
            variant="secondary"
            size="sm"
            onClick={onMenuToggle}
            className={cn(styles.menuButton, isMenuOpen && styles.menuButtonActive)}            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? (
              <X />
            ) : (
              <Menu />
            )}
          </Button>
          
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <span className={styles.brandIconText}>G</span>
            </div>
            <span className={styles.brandName}>{brandName}</span>
          </div>
        </div>

        {/* 중앙: 검색 (데스크톱) */}        {showSearch && (          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Search className="text-slate-400" />
              <input
                type="text"
                placeholder="게임 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        )}

        {/* 오른쪽: 토큰 잔액 + 알림 + 사용자 메뉴 */}
        <div className={styles.right}>          {/* 토큰 잔액 헤더 표시 */}
          {showTokenBalance && (
            <HeaderTokenDisplay 
              amount={1000} 
              onClick={() => console.log('토큰 상세 정보로 이동')}
            />
          )}          {/* 알림 버튼 */}
          {showNotifications && (
            <Button
              variant="secondary"
              size="sm"
              className={styles.iconButton}
              aria-label="알림"            >
              <Bell />
            </Button>
          )}

          {/* 사용자 메뉴 */}
          {showUserMenu && (
            <Button
              variant="secondary"
              size="sm"
              className={styles.iconButton}            aria-label="사용자 메뉴"
            >
              <User />
            </Button>
          )}

          {/* 커스텀 컨텐츠 */}
          {children}
        </div>
      </div>

      {/* 모바일 검색 (토글) */}      {showSearch && (        <div className={styles.mobileSearch}>
          <div className={styles.searchWrapper}>
            <Search className="text-slate-400" />
            <input
              type="text"
              placeholder="게임 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;