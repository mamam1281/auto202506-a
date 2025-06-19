import React from 'react';
import styles from './Layout.module.css';

export interface LayoutProps {
  /** 레이아웃 변형 */
  variant?: 'default' | 'centered' | 'split' | 'dashboard';
  
  /** 컨테이너 최대 너비 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /** 패딩 크기 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** 간격 크기 */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 헤더 영역 */
  header?: React.ReactNode;
  
  /** 사이드바 영역 (desktop만) */
  sidebar?: React.ReactNode;
  
  /** 메인 콘텐츠 */
  children: React.ReactNode;
  
  /** 푸터 영역 */
  footer?: React.ReactNode;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  variant = 'default',
  maxWidth = 'xl',
  padding = 'md',
  gap = 'md',
  header,
  sidebar,
  children,
  footer,
  className = ''
}) => {
  const containerClassNames = [
    styles.layout,
    styles[variant],
    styles[`maxWidth-${maxWidth}`],
    styles[`padding-${padding}`],
    styles[`gap-${gap}`],
    className
  ].filter(Boolean).join(' ');

  const renderLayout = () => {
    switch (variant) {
      case 'centered':
        return (
          <div className={styles.centeredContainer}>
            {header && <header className={styles.header}>{header}</header>}
            <main className={styles.centeredMain}>
              {children}
            </main>
            {footer && <footer className={styles.footer}>{footer}</footer>}
          </div>
        );

      case 'split':
        return (
          <div className={styles.splitContainer}>
            {header && <header className={styles.header}>{header}</header>}
            <div className={styles.splitContent}>
              {sidebar && (
                <aside className={styles.sidebar}>
                  {sidebar}
                </aside>
              )}
              <main className={styles.splitMain}>
                {children}
              </main>
            </div>
            {footer && <footer className={styles.footer}>{footer}</footer>}
          </div>
        );

      case 'dashboard':
        return (
          <div className={styles.dashboardContainer}>
            {header && <header className={styles.dashboardHeader}>{header}</header>}
            <div className={styles.dashboardBody}>
              {sidebar && (
                <aside className={styles.dashboardSidebar}>
                  {sidebar}
                </aside>
              )}
              <main className={styles.dashboardMain}>
                {children}
              </main>
            </div>
            {footer && <footer className={styles.footer}>{footer}</footer>}
          </div>
        );

      default:
        return (
          <div className={styles.defaultContainer}>
            {header && <header className={styles.header}>{header}</header>}
            <main className={styles.main}>
              {children}
            </main>
            {footer && <footer className={styles.footer}>{footer}</footer>}
          </div>
        );
    }
  };

  return (
    <div className={containerClassNames}>
      {renderLayout()}
    </div>
  );
};

export default Layout;
