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
  const iconSize = 36;
  return (
    <header className="app-header layout-header-sticky safe-top">
      <div className="container flex items-center justify-between h-full py-[var(--spacing-2)]">
        <div className="flex items-center gap-[var(--spacing-1)]">
          <span className="text-[var(--foreground)] heading-h3 font-[var(--font-weight-bold)]">G</span>
          <span className="text-[var(--foreground)] heading-h3 font-[var(--font-weight-bold)]">{appName}</span>
        </div>
        <div className={`flex items-center gap-[var(--spacing-1)] ${!showPointsOnMobile ? 'hidden md:flex' : ''}`}>
          <Diamond size={iconSize} className="text-[var(--color-purple-secondary)]" />
          <span className="text-[var(--foreground)] text-[var(--font-size-body)] font-[var(--font-weight-medium)]">
            {points.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-[var(--spacing-2)]">
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
