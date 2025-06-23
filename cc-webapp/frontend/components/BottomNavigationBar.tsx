import React from 'react';
import { Home, Gamepad, Store, Users, User } from 'lucide-react';

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
  const iconSize = 20;
  return (
    <nav className="bottom-nav-bar">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onTabClick(item.id, item.path)}
            className={`bottom-nav-item ${isActive ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--foreground)]'} relative group`}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-red)] animate-pulse"></span>
            )}            <IconComponent 
              size={iconSize} 
              className="mb-[var(--spacing-1)] transition-colors duration-[var(--transition-normal)]" 
            />
            <span className="transition-colors duration-[var(--transition-normal)]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
