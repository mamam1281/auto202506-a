import React from 'react';
import { Diamond, Bell, Settings, UserCircle } from 'lucide-react';
import Button from './Button';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export interface AppHeaderProps {
  appName: string;
  // points prop removed, cyber token balance will be sourced from Redux
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void; // Added for profile icon
  hasNotifications?: boolean;
  showTokenBalanceOnMobile?: boolean; // Renamed for clarity from showPointsOnMobile
}

const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  onNotificationsClick,
  onSettingsClick,
  onProfileClick,
  hasNotifications = false,
  showTokenBalanceOnMobile = true,
}) => {
  const cyberTokenBalance = useSelector((state: RootState) => state.cyberToken.balance);

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

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <header
      className="app-header layout-header-sticky safe-top pl-safe-left pr-safe-right h-[var(--app-header-height-mobile)] md:h-[var(--app-header-height-desktop)]"
    >
      <div className="container flex items-center justify-between h-full px-container-x"> {/* Removed py-app-header-y as height is now fixed by parent */}
        {/* 좌측: 로고/앱 이름 영역 */}
        <div className="flex items-center flex-shrink-0 min-w-0 mr-2"> {/* Removed pl-3, container padding should handle spacing */}
          <span className="heading-h3 truncate">
            {appName}
          </span>
        </div>
        {/* 중앙: 토큰 잔고 표시 (반응형) */}
        <div className={`${showTokenBalanceOnMobile ? 'flex' : 'hidden md:flex'} items-center gap-1 flex-shrink-0 min-w-0`}>
          <Diamond 
            size={20} // Slightly adjusted icon size for balance
            className="text-neon-purple-3 flex-shrink-0" // Using a defined neon purple from globals.css
          />
          <span className="text-foreground text-body font-medium whitespace-nowrap">
            {cyberTokenBalance.toLocaleString()}
          </span>
        </div>
        {/* 우측: 액션 아이콘들 */}
        <div className="flex items-center gap-app-header-icon flex-shrink-0"> {/* Using CSS var --app-header-icon-gap for gap */}
          <Button 
            variant="text" 
            iconOnly 
            size="md" 
            icon={Bell}
            onClick={handleNotificationsClick}
            className={`p-1 hover:bg-muted/50 active:scale-95 transition-all duration-normal rounded-full ${hasNotifications ? 'text-accent-amber animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
            aria-label="알림"
          />
          
          <Button 
            variant="text" 
            iconOnly 
            size="md" 
            icon={Settings}
            onClick={handleSettingsClick}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95 transition-all duration-normal rounded-full"
            aria-label="설정"
          />
          <Button
            variant="text"
            iconOnly
            size="md"
            icon={UserCircle} // Added Profile Icon
            onClick={handleProfileClick}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95 transition-all duration-normal rounded-full"
            aria-label="프로필"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
