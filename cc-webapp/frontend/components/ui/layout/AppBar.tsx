'use client';

import React from 'react';
import { ArrowLeft, Menu, Bell, Settings, User } from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../basic/Button';

export interface AppBarProps {
  /** 페이지 제목 */
  title?: string;
  
  /** 왼쪽 콘텐츠 (커스텀 또는 내장 타입) */
  leftContent?: React.ReactNode | 'back' | 'menu' | 'none';
  
  /** 중앙 콘텐츠 (커스텀 또는 내장 타입) */
  centerContent?: React.ReactNode | 'title' | 'logo' | 'none';
  
  /** 오른쪽 콘텐츠 (커스텀 또는 내장 타입) */
  rightContent?: React.ReactNode | 'notification' | 'profile' | 'settings' | 'none';
  
  /** 하단 그림자 유무 */
  hasShadow?: boolean;
  
  /** 하단 테두리 유무 */
  hasBorder?: boolean;
  
  /** 앱바 변형 */
  variant?: 'default' | 'game' | 'transparent';
  
  /** 뒤로가기 버튼 클릭 핸들러 */
  onBackClick?: () => void;
  
  /** 메뉴 버튼 클릭 핸들러 */
  onMenuClick?: () => void;
  
  /** 알림 버튼 클릭 핸들러 */
  onNotificationClick?: () => void;
  
  /** 설정 버튼 클릭 핸들러 */
  onSettingsClick?: () => void;
  
  /** 프로필 버튼 클릭 핸들러 */
  onProfileClick?: () => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
  
  /** 자식 요소 */
  children?: React.ReactNode;
}

/**
 * # AppBar 컴포넌트
 * 
 * 모든 화면에서 사용할 수 있는 앱바 컴포넌트입니다.
 * 시스템 바 영역(safe-area-inset-top)을 자동으로 처리합니다.
 * 
 * ## 사용 예시
 * ```tsx
 * // 기본 앱바
 * <AppBar 
 *   title="게임 대시보드"
 *   leftContent="menu"
 *   rightContent="notification"
 *   onMenuClick={() => setSidebarOpen(true)}
 * />
 * 
 * // 게임 내부 앱바
 * <AppBar 
 *   title="슬롯머신"
 *   leftContent="back"
 *   centerContent={<TokenBalance value={1000} />}
 *   rightContent="settings"
 *   variant="game"
 *   onBackClick={() => router.push('/games')}
 * />
 * ```
 */
export default function AppBar({
  title,
  leftContent = 'menu',
  centerContent = 'title',
  rightContent = 'none',
  hasShadow = true,
  hasBorder = true,
  variant = 'default',
  onBackClick,
  onMenuClick,
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
  className,
  children
}: AppBarProps) {
  // 시스템 바 + 앱바 높이 계산
  const getSystemBarHeight = () => 'env(safe-area-inset-top, 0px)';
  
  // 배경 및 효과 스타일 계산
  const getAppBarStyles = () => {
    switch(variant) {
      case 'game':
        return {
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: hasShadow ? '0 4px 16px rgba(0, 0, 0, 0.3)' : 'none',
          borderBottom: hasBorder ? '1px solid rgba(139, 92, 246, 0.3)' : 'none',
        };
      case 'transparent':
        return {
          background: 'transparent',
          backdropFilter: 'none',
          boxShadow: 'none',
          borderBottom: 'none',
        };
      default:
        return {
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: hasShadow ? '0 2px 12px rgba(0, 0, 0, 0.2)' : 'none',
          borderBottom: hasBorder ? '1px solid rgba(51, 65, 85, 0.5)' : 'none',
        };
    }
  };

  // 왼쪽 콘텐츠 렌더링
  const renderLeftContent = () => {
    if (React.isValidElement(leftContent)) {
      return leftContent;
    }

    switch (leftContent) {
      case 'back':
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className="text-slate-200 hover:text-white min-w-[44px] min-h-[44px]"
            aria-label="뒤로 가기"
          >
            <ArrowLeft size={24} />
          </Button>
        );
      case 'menu':
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-slate-200 hover:text-white min-w-[44px] min-h-[44px]"
            aria-label="메뉴"
          >
            <Menu size={24} />
          </Button>
        );
      case 'none':
        return <div className="w-[44px]" />;
      default:
        return <div className="w-[44px]" />;
    }
  };

  // 중앙 콘텐츠 렌더링
  const renderCenterContent = () => {
    if (React.isValidElement(centerContent)) {
      return centerContent;
    }

    switch (centerContent) {
      case 'title':
        return title ? (
          <h1 className="text-lg font-semibold text-white truncate max-w-[200px]">
            {title}
          </h1>
        ) : null;
      case 'logo':
        return (
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            카지노클럽
          </div>
        );
      case 'none':
        return null;
      default:
        return null;
    }
  };

  // 오른쪽 콘텐츠 렌더링
  const renderRightContent = () => {
    if (React.isValidElement(rightContent)) {
      return rightContent;
    }

    switch (rightContent) {
      case 'notification':
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="text-slate-200 hover:text-white min-w-[44px] min-h-[44px]"
            aria-label="알림"
          >
            <Bell size={22} />
          </Button>
        );
      case 'settings':
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="text-slate-200 hover:text-white min-w-[44px] min-h-[44px]"
            aria-label="설정"
          >
            <Settings size={22} />
          </Button>
        );
      case 'profile':
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="text-slate-200 hover:text-white min-w-[44px] min-h-[44px]"
            aria-label="프로필"
          >
            <User size={22} />
          </Button>
        );
      case 'none':
        return <div className="w-[44px]" />;
      default:
        return <div className="w-[44px]" />;
    }
  };

  const styles = getAppBarStyles();

  return (
    <div className="relative z-50">
      {/* 시스템 상태바 영역 */}
      <div 
        style={{ 
          height: getSystemBarHeight(), 
          paddingTop: getSystemBarHeight(),
          background: variant === 'transparent' ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: variant === 'transparent' ? 'none' : 'blur(10px)',
        }} 
      />
      
      {/* 실제 앱바 */}
      <header
        style={styles}
        className={cn(
          "sticky top-0 w-full z-50 transition-all duration-300",
          className
        )}
      >
        <div className="h-14 flex items-center justify-between px-4">
          {/* 왼쪽 영역 */}
          <div className="flex-none flex items-center">
            {renderLeftContent()}
          </div>
          
          {/* 중앙 영역 */}
          <div className="flex-1 flex items-center justify-center">
            {renderCenterContent()}
          </div>
          
          {/* 오른쪽 영역 */}
          <div className="flex-none flex items-center">
            {renderRightContent()}
          </div>
        </div>
        
        {/* 추가 컨텐츠 */}
        {children && (
          <div className="px-4 py-2">
            {children}
          </div>
        )}
      </header>
    </div>
  );
}
