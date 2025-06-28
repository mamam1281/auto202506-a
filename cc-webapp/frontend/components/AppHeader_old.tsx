import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Settings, UserCircle } from 'lucide-react';
import Button from './Button';
import { useRouter, usePathname } from 'next/navigation';

export interface AppHeaderProps {
  appName: string;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  hasNotifications?: boolean;
  showTokenBalanceOnMobile?: boolean;
  // New responsive props
  compact?: boolean; // For minimal header layout
  showAppName?: boolean; // Control app name visibility
  tokenDisplayVariant?: 'full' | 'compact' | 'icon-only'; // Token display modes
}

const AppHeader: React.FC<AppHeaderProps> = ({
  appName,
  onNotificationsClick,
  onSettingsClick,
  onProfileClick,
  hasNotifications = false,
  showTokenBalanceOnMobile = true,
  compact = false,
  showAppName = true,
  tokenDisplayVariant = 'full',
}) => {
  const cyberTokenBalance = useSelector((state: RootState) => state.cyberToken.balance);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Responsive token display component
  const TokenDisplay = () => {
    if (!showTokenBalanceOnMobile && isMobile) {
      return null;
    }

    const baseClasses = "flex items-center gap-1 flex-shrink-0 min-w-0";
    const iconSize = compact ? 16 : 20;
    
    switch (tokenDisplayVariant) {
      case 'icon-only':
        return (
          <div className={`${baseClasses} px-2 sm:px-3`}>
            <Diamond 
              size={iconSize}
              className="text-neon-purple-3 flex-shrink-0"
            />
            <span className="hidden sm:inline text-foreground text-body font-medium whitespace-nowrap">
              {cyberTokenBalance.toLocaleString()}
            </span>
          </div>
        );
      case 'compact':
        return (
          <div className={`${baseClasses} px-2`}>
            <Diamond 
              size={iconSize}
              className="text-neon-purple-3 flex-shrink-0"
            />
            <span className="text-foreground text-sm font-medium whitespace-nowrap">
              {cyberTokenBalance > 999 ? `${(cyberTokenBalance / 1000).toFixed(1)}K` : cyberTokenBalance.toLocaleString()}
            </span>
          </div>
        );
      case 'full':
      default:
        return (
          <div className={`${baseClasses} px-3 sm:px-4`}>
            <Diamond 
              size={iconSize}
              className="text-neon-purple-3 flex-shrink-0"
            />
            <span className="text-foreground text-body font-medium whitespace-nowrap">
              {cyberTokenBalance.toLocaleString()}
            </span>
          </div>
        );
    }
  };

  // Responsive app name component
  const AppName = () => {
    if (!showAppName) return null;
    
    return (
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 min-w-0">
        <span className={`${compact ? 'text-lg' : 'heading-h3'} truncate text-center max-w-full`}>
          {appName}
        </span>
      </div>
    );
  };

  // Responsive action buttons
  const ActionButtons = () => {
    const buttonSize = compact ? "sm" : "md";
    const iconSize = compact ? 18 : 20;
    const baseButtonClasses = "p-1 hover:bg-muted/50 active:scale-95 transition-all duration-normal rounded-full";
    
    return (
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 px-2 sm:px-3">
        <Button 
          variant="text" 
          iconOnly 
          size={buttonSize}
          icon={(props) => <Bell {...props} size={iconSize} />}
          onClick={handleNotificationsClick}
          className={`${baseButtonClasses} ${hasNotifications ? 'text-accent-amber animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
          aria-label="알림"
        />
        
        <Button 
          variant="text" 
          iconOnly 
          size={buttonSize}
          icon={(props) => <Settings {...props} size={iconSize} />}
          onClick={handleSettingsClick}
          className={`${baseButtonClasses} text-muted-foreground hover:text-foreground`}
          aria-label="설정"
        />
        
        <Button
          variant="text"
          iconOnly
          size={buttonSize}
          icon={(props) => <UserCircle {...props} size={iconSize} />}
          onClick={handleProfileClick}
          className={`${baseButtonClasses} text-muted-foreground hover:text-foreground`}
          aria-label="프로필"
        />
      </div>
    );
  };
  return (
    <header
      className={`
        app-header fixed top-0 left-0 right-0 z-20 safe-top pl-safe-left pr-safe-right
        ${compact 
          ? 'h-12 sm:h-14' 
          : 'h-[var(--app-header-height-mobile)] md:h-[var(--app-header-height-desktop)]'
        }
        glassmorphism-header
        border-b border-border/20
        flex justify-center
      `}
    >
      <div className="w-full max-w-[480px] flex items-center h-full relative px-4">
        {/* Left: Token Balance - Responsive positioning */}
        <TokenDisplay />

        {/* Center: App Name - Responsive sizing and visibility */}
        <AppName />

        {/* Right: Action Icons - Responsive sizing and spacing */}
        <ActionButtons />
      </div>
    </header>
  );
};

export default AppHeader;
