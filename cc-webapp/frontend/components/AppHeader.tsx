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
}

const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  points,
  onSearchClick,
  onNotificationsClick,
  onSettingsClick,
  hasNotifications = false,
}) => {
  const iconSize = 24; // 24px로 통일 (더 적절한 크기)

  return (
    <header className="app-header layout-header-sticky safe-top">
      {/* .container는 globals.css에서 max-width와 중앙 정렬, 반응형 패딩을 담당 */}
      <div className="container flex items-center justify-between h-full py-[var(--app-header-padding-y)]">

        {/* 1. 좌측 영역: GamePlatform 로고 */}
        <div className="flex items-center gap-[var(--spacing-1)] flex-shrink-0">
          <span className="text-[var(--foreground)] heading-h3 font-[var(--font-weight-bold)]">{appName}</span>
        </div>

        {/* 2. 중앙 영역: 보석/포인트 - 모바일에서 완전히 숨김 */}
        {/* hidden: 모든 화면에서 숨김. md:flex: md(768px) 이상에서만 flex로 보이게 함. */}
        <div className="hidden md:flex items-center gap-[var(--spacing-1)] flex-shrink-0">
          <Diamond size={iconSize} className="text-[var(--color-purple-secondary)]" />
          <span className="text-[var(--foreground)] text-[var(--font-size-body)] font-[var(--font-weight-medium)]">
            {points.toLocaleString()}
          </span>
        </div>

        {/* 3. 우측 영역: 기능 아이콘 그룹 */}
        {/* 아이콘 간 간격은 gap-[var(--app-header-icon-gap)] 사용 */}
        <div className="flex items-center gap-[var(--app-header-icon-gap)] flex-shrink-0">
          <Button variant="text" iconOnly size="md" onClick={onSearchClick}>
            <Search size={iconSize} className="text-[var(--color-neutral-medium)] hover:text-[var(--foreground)] transition-colors" />
          </Button>
          <Button variant="text" iconOnly size="md" onClick={onNotificationsClick}>
            <Bell size={iconSize} className={`${hasNotifications ? 'text-[var(--color-accent-amber)]' : 'text-[var(--color-neutral-medium)]'} hover:text-[var(--foreground)] transition-colors`} />
          </Button>
          <Button variant="text" iconOnly size="md" onClick={onSettingsClick}>
            <Settings size={iconSize} className="text-[var(--color-neutral-medium)] hover:text-[var(--foreground)] transition-colors" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
