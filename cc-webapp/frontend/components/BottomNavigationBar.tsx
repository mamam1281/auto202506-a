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
  const iconSize = 20;  return (
    <nav className="bottom-nav-bar">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;        return (
          <motion.button
            key={item.id}
            onClick={() => onTabClick(item.id, item.path)}
            className={`
              bottom-nav-item relative group
              transition-all duration-[var(--transition-normal)]
              ${isActive ? 
                'text-[var(--color-purple-primary)] bg-[rgba(91,48,246,0.1)] rounded-md' : 
                'text-[var(--color-text-secondary)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.05)] rounded-md'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
            whileTap={{ scale: 0.95 }} // 탭 시 5% 축소로 피드백 제공
            transition={{ type: "spring", stiffness: 400, damping: 17 }} // 부드러운 스프링 애니메이션
          >
            {isActive && (
              <span className="absolute -top-[6px] w-2 h-2 rounded-full bg-[var(--color-purple-primary)] animate-pulse shadow-lg"></span>
            )}
            <IconComponent 
              size={iconSize} 
              className="mb-[var(--spacing-0-5)] transition-colors duration-[var(--transition-normal)]" 
            />            <span className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] transition-colors duration-[var(--transition-normal)]">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
