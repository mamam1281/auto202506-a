import React from 'react';
import { Diamond, Bell, Settings } from 'lucide-react';
import Button from './Button';

export interface AppHeaderProps {
  appName: string;
  points: number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  hasNotifications?: boolean;
  showPointsOnMobile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  points,
  onNotificationsClick,
  onSettingsClick,
  hasNotifications = false,
  showPointsOnMobile = true,
}) => {
  // 액션 핸들러
  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  return (
    <header className="app-header layout-header-sticky safe-top pl-safe-left pr-safe-right">      <div className="container flex items-center justify-between h-full py-app-header-y px-container-x">        {/* 좌측: 로고/앱 이름 영역 */}
        <div className="flex items-center flex-shrink-0 min-w-0 mr-2 pl-3">
          <span className="heading-h3 truncate">
            {appName}
          </span>
        </div>        {/* 중앙: 포인트 표시 (반응형) */}
        <div className={`${showPointsOnMobile ? 'flex' : 'hidden md:flex'} items-center gap-1 flex-shrink-0 min-w-0`}>
          <Diamond 
            size={24} 
            className="text-neon-purple-2 flex-shrink-0" 
          />
          <span className="text-foreground text-body font-medium whitespace-nowrap">
            {points.toLocaleString()}
          </span>
        </div>        {/* 우측: 액션 아이콘들 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button 
            variant="text" 
            iconOnly 
            size="md" 
            icon={Bell}
            onClick={handleNotificationsClick}
            className={`flex items-center justify-center p-0 hover:bg-transparent active:scale-95 transition-transform duration-normal ${hasNotifications ? 'text-accent-amber' : 'text-neutral-medium'}`}
            aria-label="알림"
          />
          
          <Button 
            variant="text" 
            iconOnly 
            size="md" 
            icon={Settings}
            onClick={handleSettingsClick}
            className="flex items-center justify-center p-0 hover:bg-transparent active:scale-95 transition-transform duration-normal text-neutral-medium"
            aria-label="설정"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
