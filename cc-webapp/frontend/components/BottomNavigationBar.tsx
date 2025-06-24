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
  { id: 'profile', label: '프로필', icon: User, path: '/profile' },
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
      className="bottom-nav-bar"
      // global.css의 .bottom-nav-bar 클래스를 사용하여 완전한 하단 고정 보장
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
              bottom-nav-item relative
              transition-all duration-normal
              ${isActive
                ? 'text-purple-primary bg-purple-primary/10 shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }
            `}
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
          >            {isActive && (
              <motion.div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full nav-indicator-bar"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 25,
                  duration: 0.4 
                }}
                layoutId="activeIndicator" // framer-motion의 layoutId로 부드러운 전환
              />
            )}            <IconComponent 
              size={iconSize} 
              className={`mb-0.5 transition-colors duration-normal ${
                isActive ? 'text-purple-primary' : 'text-muted-foreground'
              }`} 
              style={{
                color: isActive ? 'var(--color-purple-primary)' : undefined
              }}
            />            <span className={`text-[10px] font-normal transition-colors duration-normal ${
              isActive ? 'text-purple-primary/80' : 'text-muted-foreground/70'
            }`}
              style={{
                color: isActive ? 'rgba(91, 48, 246, 0.8)' : 'rgba(209, 213, 219, 0.7)'
              }}
            >
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
