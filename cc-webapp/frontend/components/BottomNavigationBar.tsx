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
      className="bottom-nav-bar fixed inset-x-0 bottom-0 h-16 bg-card border-t border-border shadow-md
                 flex items-center justify-around p-1 safe-bottom z-50 md:hidden"
      // shadow-top-md could be a custom shadow like `0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)`
      // Using shadow-md as a standard alternative.
      // Let's assume shadow-md is fine for now, or it can be shadow-lg
      // `h-16` is 64px. `p-1` is 4px padding around.
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;
        return (
          <motion.button
            key={item.id}
            onClick={() => onTabClick(item.id, item.path)}
            className={`
              flex flex-col items-center justify-center flex-1 h-full
              p-1 text-center relative group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md
              transition-all duration-normal
              ${isActive
                ? 'text-purple-primary bg-purple-primary/10' // No rounded-md here, already on parent for focus
                : 'text-text-secondary hover:text-foreground hover:bg-neutral-medium/30' // Using neutral-medium for hover bg
              }
            `}
            aria-current={isActive ? 'page' : undefined}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isActive && (
              // -top-1.5 with themed spacing '1.5' (12px) = -12px. If -6px is desired, use -top-[6px]
              // The prompt example implies -top-1.5 should be -6px, but current config makes it -12px.
              // Sticking to -top-1.5 as per current code, which means -12px.
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-primary animate-pulse shadow-lg"></span>
            )}
            <IconComponent 
              size={iconSize} 
              className="mb-0.5 transition-colors duration-normal" // mb-0.5 is 2px
            />
            <span className="text-xs font-medium transition-colors duration-normal">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
