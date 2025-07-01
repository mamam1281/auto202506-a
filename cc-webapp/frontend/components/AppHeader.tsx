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
  const router = useRouter();
  const pathname = usePathname();
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

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  // Handle back navigation
  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
    onNotificationsClick?.();
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    onSettingsClick?.();
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    onProfileClick?.();
  };

  // Back Button Component (replaces token display)
  const BackButton = () => {
    if (isHomePage) return <div className="w-8 h-8" />; // Spacer for home page
    
    return (
      <button
        onClick={handleBackClick}
        className="p-2 hover:bg-white/20 active:scale-95 transition-all duration-normal rounded-full text-white"
        aria-label="뒤로가기"
      >
        <ArrowLeft size={compact ? 18 : 20} />
      </button>
    );
  };

  // Responsive app name component
  const AppName = () => {
    if (!showAppName) return null;
    
    return (
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 min-w-0">
        <span 
          className={`${compact ? 'text-lg' : 'text-xl'} font-bold truncate text-center max-w-full`} 
          style={{ 
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '700',
            letterSpacing: '0.02em'
          }}
        >
          {appName}
        </span>
      </div>
    );
  };

  // Responsive action buttons
  const ActionButtons = () => {
    const buttonSize = compact ? "sm" : "md";
    const iconSize = compact ? 18 : 20;
    const baseButtonClasses = "p-1 hover:bg-white/20 active:scale-95 transition-all duration-normal rounded-full";
    
    return (
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 px-2 sm:px-3">
        <button
          onClick={handleNotificationsClick}
          className={`${baseButtonClasses} ${hasNotifications ? 'text-amber-400' : 'text-white'}`}
          aria-label="알림"
        >
          <Bell size={iconSize} />
        </button>
        
        <button
          onClick={handleSettingsClick}
          className={`${baseButtonClasses} text-white`}
          aria-label="설정"
        >
          <Settings size={iconSize} />
        </button>
        
        <button
          onClick={handleProfileClick}
          className={`${baseButtonClasses} text-white`}
          aria-label="프로필"
        >
          <UserCircle size={iconSize} />
        </button>
      </div>
    );
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full h-16 border-b border-gray-700 flex justify-center z-50"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #374151',
        width: '100%',
        height: '64px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div className="w-full max-w-[420px] flex items-center h-full relative px-4">
        {/* Left: Back Button (replaces token display) */}
        <BackButton />

        {/* Center: App Name */}
        <AppName />

        {/* Right: Action Icons */}
        <ActionButtons />
      </div>
    </header>
  );
};

export default AppHeader;
