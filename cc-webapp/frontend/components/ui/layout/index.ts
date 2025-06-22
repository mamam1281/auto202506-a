// New Layout System - Figma 003 게임 플랫폼 레이아웃 시스템
// 새 모바일 퍼스트 레이아웃 컴포넌트
export { default as AppBar } from './AppBar';
export { default as BottomNav } from './BottomNav';

// 레거시 컴포넌트 (AppBar로 점진적 교체 예정)
export { Header } from './Header';
export type { HeaderProps } from './Header';

export { Sidebar } from './Sidebar';
export type { SidebarProps, SidebarItem } from './Sidebar';

// 레거시 컴포넌트 (BottomNav로 점진적 교체 예정)
export { Footer } from './Footer';
export type { FooterProps, FooterLink, SocialLink } from './Footer';

export { Container } from './Container';
export type { ContainerProps, ContainerSize } from './Container';

export { AppLayout } from './AppLayout';
export type { AppLayoutProps } from './AppLayout';

export { GameLayout } from './GameLayout';
export type { GameLayoutProps } from './GameLayout';

// 추가 레이아웃 컴포넌트들
export { Sheet } from './sheet';
export { default as ScrollArea } from './ScrollArea';
export type { ScrollAreaProps } from './ScrollArea';

export { HeaderTokenDisplay } from './HeaderTokenDisplay';
export type { HeaderTokenDisplayProps } from './HeaderTokenDisplay';

// AuthLayout
export { AuthLayout } from './AuthLayout';
export type { AuthLayoutProps } from './AuthLayout';
