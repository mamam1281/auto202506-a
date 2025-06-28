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
      className="fixed bottom-0 left-0 right-0 z-50 h-20 w-full bg-gray-900/95 border-t border-gray-700 backdrop-blur-md flex justify-center"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
      }}
    >
      <div className="w-full max-w-[480px] flex items-center justify-around px-4 py-2">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;        return (
          <motion.button
            key={item.id}
            onClick={() => {
              console.log('BottomNav onClick triggered:', item.id, item.path);
              onTabClick(item.id, item.path);
            }}            className={`
              flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl min-w-14 transition-all duration-200
              ${isActive
                ? 'text-purple-400 bg-purple-400/10 shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
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
          >            <IconComponent 
              size={iconSize} 
              className={`mb-0.5 transition-colors duration-200 ${
                isActive ? 'text-purple-400' : 'text-gray-400'
              }`} 
            />            <span className={`text-[10px] font-normal transition-colors duration-200 ${
              isActive ? 'text-purple-300' : 'text-gray-500'
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
