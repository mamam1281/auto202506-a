// Layout Components
export { default as Layout } from './Layout';
export type { LayoutProps } from './Layout';

// Modern Layout System (2025년 표준)
export { ModernLayout, ModernContainer } from './ModernLayout';

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

export { AuthLayout } from './AuthLayout';
export type { AuthLayoutProps } from './AuthLayout';

// Legacy Layout Components
export { 
  Sidebar as LegacySidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from './Sidebar';

export { Sheet } from './sheet';

export { default as Resizable } from './Resizable';
export type { ResizableProps } from './Resizable';

export { default as ScrollArea } from './ScrollArea';
export type { ScrollAreaProps } from './ScrollArea';
