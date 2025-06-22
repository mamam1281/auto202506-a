// BottomNav.tsx - 하단 네비게이션 바 (모바일 전용)
'use client';

import React from 'react';
import { Home, Gamepad2, Trophy, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '../utils/utils';

export interface BottomNavProps {
  /** 선택적 추가 클래스 */
  className?: string;
}

// 기본 네비게이션 아이템 정의
const navItems = [
  { label: '홈', icon: Home, href: '/' },
  { label: '게임', icon: Gamepad2, href: '/games' },
  { label: '랭킹', icon: Trophy, href: '/ranking' },
  { label: '프로필', icon: User, href: '/profile' },
];

export default function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  // 현재 경로와 아이템 경로를 비교해 활성 상태 확인
  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav 
      style={{ 
        height: `calc(83px + env(safe-area-inset-bottom, 0px))`, 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }} 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-700",
        "flex justify-around items-center md:hidden",
        "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]",
        "backdrop-blur-xl transition-all duration-200",
        className
      )}
    >
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.label} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center", 
              "min-w-[20%] h-full px-1 py-2",
              "transition-all duration-200"
            )}
          >
            <div 
              className={cn(
                "flex flex-col items-center justify-center",
                "w-full h-full min-h-[44px]",
                "rounded-md transition-all duration-200",
                active && "bg-slate-800/50"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center",
                "w-8 h-8 mb-1"
              )}>
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-200",
                    active ? "text-purple-400 fill-purple-400" : "text-slate-400"
                  )} 
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-purple-500 rounded-full" />
                )}
              </div>
              <span className={cn(
                "text-[10px] text-center transition-all duration-200",
                active ? "text-white font-medium" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
