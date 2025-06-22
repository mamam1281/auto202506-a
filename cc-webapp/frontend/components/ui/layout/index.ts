// New Layout System - Figma 003 게임 플랫폼 레이아웃 시스템
export { Header } from './Header';
export type { HeaderProps } from './Header';

export { Sidebar } from './Sidebar';
export type { SidebarProps, SidebarItem } from './Sidebar';

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

// AuthLayout (파일명 수정 필요: Authlayout.tsx → AuthLayout.tsx)
// export { AuthLayout } from './AuthLayout';
// export type { AuthLayoutProps } from './AuthLayout';
