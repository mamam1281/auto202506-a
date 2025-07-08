import React from 'react';
import { Home, Gamepad, Store, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

export interface NavItemData {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

export const navItems: NavItemData[] = [
  { id: 'home', label: '홈', icon: Home, path: '/' },
  { id: 'game', label: '게임', icon: Gamepad, path: '/games' },
  { id: 'shop', label: '상점', icon: Store, path: '/shop' },
  { id: 'community', label: '커뮤니티', icon: Users, path: '/community' },
  { id: 'profile', label: '프로필', icon: User, path: '/profile/view' },
];

export interface BottomNavigationBarProps {
  activeTab: string;
  onTabClick: (tabId: string, path: string) => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeTab,
  onTabClick,
}) => {
  const iconSize = 24; // Corresponds to --icon-lg
  // Design Tokens:
  // Spacing: --spacing-0-5 (4px), --spacing-1 (8px), --spacing-1-5 (12px), --spacing-2 (16px)
  // Colors: text-purple-primary, bg-purple-primary/10, text-text-secondary, hover:text-foreground, hover:bg-white/5
  // Font size: text-xs (12px)
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-20 w-full border-t flex justify-center"
      style={{
        position: 'fixed !important' as any,
        bottom: '0 !important' as any,
        left: '0 !important' as any,
        right: '0 !important' as any,
        width: '100vw !important' as any,
        height: '80px !important' as any,
        backgroundColor: 'rgba(26, 26, 26, 0.95) !important' as any,
        backdropFilter: 'blur(10px) !important' as any,
        WebkitBackdropFilter: 'blur(10px) !important' as any,
        borderTop: '1px solid #374151 !important' as any,
        zIndex: '999 !important' as any,
        display: 'flex !important' as any,
        justifyContent: 'center !important' as any,
        alignItems: 'center !important' as any,
        margin: '0 !important' as any,
        padding: '0 !important' as any,
        boxSizing: 'border-box !important' as any,
        maxWidth: 'none !important' as any,
        transform: 'none !important' as any,
        inset: 'auto 0 0 0 !important' as any,
      }}
    >
      <div 
        className="w-full flex items-center justify-around" 
        style={{ 
          height: '100%', 
          padding: 0, 
          margin: 0,
          maxWidth: '420px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;        return (
          <motion.button
            key={item.id}
            onClick={() => {
              console.log('BottomNav onClick triggered:', item.id, item.path);
              onTabClick(item.id, item.path);
            }}            className={`
              flex flex-col items-center justify-center gap-0.5 rounded-xl min-w-14 transition-all duration-200
              ${isActive
                ? 'bg-purple-400/20 shadow-lg' 
                : 'hover:bg-white/10'
              }
            `}
            style={{
              color: isActive ? '#5B30F6' : '#ffffff',
              padding: '8px 16px',
              margin: 0,
              boxSizing: 'border-box',
            }}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${item.label} 탭`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 17,
              duration: 0.2
            }}
          >            <IconComponent 
              size={iconSize} 
              className={`mb-0.5 transition-colors duration-200 ${
                isActive ? 'text-purple-400' : 'text-white'
              }`} 
            />            <span className={`text-[10px] font-normal transition-colors duration-200 ${
              isActive ? 'text-purple-300' : 'text-white'
            }`}
            >
              {item.label}
            </span>
          </motion.button>
        );
      })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
