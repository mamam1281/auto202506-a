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
      className="app-header layout-header-sticky safe-top pl-safe-left pr-safe-right h-[var(--app-header-height-mobile)] md:h-[var(--app-header-height-desktop)] glassmorphism-header"
    >      <div className="container flex items-center h-full px-container-x relative"> {/* relative 추가 */}        {/* 좌측: 토큰 잔고 표시 */}
        <div className={`${showTokenBalanceOnMobile ? 'flex' : 'hidden md:flex'} items-center gap-1 flex-shrink-0 min-w-0 pl-2`}>
          <Diamond 
            size={20}
            className="text-neon-purple-3 flex-shrink-0"
          />
          <span className="text-foreground text-body font-medium whitespace-nowrap">
            {cyberTokenBalance.toLocaleString()}
          </span>
        </div>

        {/* 중앙: 로고/앱 이름 영역 - 수학적 완전 중앙 배치 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="heading-h3 truncate text-center pointer-events-auto">
            {appName}
          </span>
        </div>
        {/* 우측: 액션 아이콘들 */}
        <div className="ml-auto flex items-center gap-app-header-icon flex-shrink-0"> {/* ml-auto 추가로 우측 정렬 */}
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
