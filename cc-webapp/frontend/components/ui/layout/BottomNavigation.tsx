// BottomNavigation.tsx - 글로벌 하단 네비게이션 바 (모바일 우선)
'use client';
import React from 'react';
import { Home, Gamepad2, User, Bell } from 'lucide-react';
import { cn } from '../utils/utils';
import styles from './BottomNavigation.module.css';

export interface BottomNavigationProps {
  className?: string;
}

const navItems = [
  { icon: <Home />, label: '홈', href: '/' },
  { icon: <Gamepad2 />, label: '게임', href: '/slots' },
  { icon: <Bell />, label: '알림', href: '/notifications' },
  { icon: <User />, label: '프로필', href: '/profile' },
];

export function BottomNavigation({ className }: BottomNavigationProps) {
  return (
    <nav className={cn(styles.bottomNav, className)}>
      {navItems.map((item) => (
        <a key={item.label} href={item.href} className={styles.navItem} aria-label={item.label}>
          {item.icon}
          <span className={styles.label}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default BottomNavigation;
