// BottomNav.tsx - 상용 앱 수준의 하단 네비게이션 바
'use client';

import React from 'react';
import { Home, Gamepad2, Trophy, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '../utils/utils';
import styles from './BottomNav.module.css';

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
  // Storybook 환경에서는 pathname이 null일 수 있으므로 안전한 기본값 제공
  let pathname = '/'; // 기본값을 '/'로 설정
  try {
    const currentPathname = usePathname();
    if (currentPathname && typeof currentPathname === 'string') {
      pathname = currentPathname;
    }
  } catch (error) {
    // Storybook이나 다른 환경에서 에러 발생 시 기본값 사용
    console.warn('usePathname hook failed, using default path:', error);
  }

  // 현재 경로와 아이템 경로를 비교해 활성 상태 확인
  const isActive = (href: string) => {
    // pathname이 null이거나 undefined일 경우 안전장치
    if (!pathname || typeof pathname !== 'string') return href === '/';
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };  return (
    <nav
      style={{
        height: '83px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        background: 'rgba(15,23,42,0.98)',
        zIndex: 99999,
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #33415580',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s',
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <a
            key={item.label}
            href={item.href}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: active ? '#a78bfa' : '#94a3b8',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: 11,
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
              position: 'relative',
              userSelect: 'none',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              padding: '0',
            }}
            tabIndex={0}
            aria-label={item.label}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              marginBottom: 2,
              color: active ? '#a78bfa' : '#94a3b8',
              transition: 'color 0.2s',
            }}>
              {item.label === '홈' && (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9"/><path d="M9 21V9h6v12"/></svg>
              )}
              {item.label === '게임' && (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h.01"/><path d="M18 12h.01"/><path d="M12 12h.01"/></svg>
              )}
              {item.label === '랭킹' && (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 17l4 4 4-4"/><path d="M12 12v9"/><path d="M17 8a5 5 0 1 0-10 0c0 2.5 2 4.5 5 4.5s5-2 5-4.5z"/></svg>
              )}
              {item.label === '프로필' && (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1"/></svg>
              )}
            </span>
            <span style={{
              fontSize: 11,
              color: active ? '#fff' : '#94a3b8',
              fontWeight: active ? 700 : 500,
              letterSpacing: '0.02em',
              textShadow: active ? '0 1px 4px #a78bfa80' : 'none',
              transition: 'color 0.2s',
              marginTop: 0,
              lineHeight: 1.2,
              textAlign: 'center',
              width: '100%',
              whiteSpace: 'nowrap',
            }}>{item.label}</span>
            {active && (
              <span style={{
                position: 'absolute',
                left: '50%',
                bottom: 6,
                transform: 'translateX(-50%)',
                width: 20,
                height: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg,#a78bfa,#8b5cf6)',
                boxShadow: '0 1px 4px #a78bfa80',
              }} />
            )}
          </a>
        );
      })}
    </nav>
  );
}
