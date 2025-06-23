import React from 'react';
import { Diamond, Search, Bell, Settings } from 'lucide-react';
import Button from './Button';

export interface AppHeaderProps {
  appName: string;
  points: number;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  hasNotifications?: boolean;
  showPointsOnMobile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  points,
  onSearchClick,
  onNotificationsClick,
  onSettingsClick,
  hasNotifications = false,
  showPointsOnMobile = false,
}) => {
  const iconSize = 36;  return (
    <header className="app-header layout-header-sticky safe-top">
      <div className="container flex items-center justify-start h-full py-[var(--app-header-padding-y)]">
        {/* 좌측: 로고 */}
        <div className="flex items-center gap-[var(--spacing-1)] flex-shrink-0">
          <span className="text-[var(--foreground)] heading-h3 font-[var(--font-weight-bold)]">G</span>
          <span className="text-[var(--foreground)] heading-h3 font-[var(--font-weight-bold)]">{appName}</span>
        </div>
        
        {/* 중앙: 보석/포인트 - 반응형 처리 강화 */}
        <div className={`flex items-center gap-[var(--spacing-1)] flex-shrink-0 mx-auto ${!showPointsOnMobile ? 'hidden md:flex' : ''}`}>
          <Diamond size={iconSize} className="text-[var(--color-purple-secondary)]" />
          <span className="text-[var(--foreground)] text-[var(--font-size-body)] font-[var(--font-weight-medium)]">
            {points.toLocaleString()}
          </span>
        </div>
        
        {/* 우측: 기능 아이콘 그룹 - 간격 조정 */}
        <div className="flex items-center gap-[var(--spacing-2)] flex-shrink-0">
          <Button variant="text" iconOnly size="lg" onClick={onSearchClick}>
            <Search size={iconSize} className="text-[var(--color-neutral-medium)] hover:text-[var(--foreground)] transition-colors" />
          </Button>
          <Button variant="text" iconOnly size="lg" onClick={onNotificationsClick}>
            <Bell size={iconSize} className={`${hasNotifications ? 'text-[var(--color-accent-amber)]' : 'text-[var(--color-neutral-medium)]'} hover:text-[var(--foreground)] transition-colors`} />
          </Button>
          <Button variant="text" iconOnly size="lg" onClick={onSettingsClick}>
            <Settings size={iconSize} className="text-[var(--color-neutral-medium)] hover:text-[var(--foreground)] transition-colors" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
