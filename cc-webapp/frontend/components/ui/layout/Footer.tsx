'use client';

import React from 'react';
import { cn } from '../utils/utils';
import styles from './Footer.module.css';

export interface FooterProps {
  /** 저작권 년도 */
  year?: number;
  /** 회사/브랜드명 */
  brandName?: string;
  /** 푸터 링크들 */
  links?: FooterLink[];
  /** 소셜 미디어 링크들 */
  socialLinks?: SocialLink[];
  /** 간단한 푸터 모드 (저작권만 표시) */
  simple?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 자식 요소 (커스텀 컨텐츠) */
  children?: React.ReactNode;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
  icon: React.ComponentType<any>;
}

const defaultLinks: FooterLink[] = [
  { id: 'privacy', label: '개인정보처리방침', href: '/privacy' },
  { id: 'terms', label: '이용약관', href: '/terms' },
  { id: 'support', label: '고객지원', href: '/support' },
];

/**
 * # Footer 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 푸터 컴포넌트입니다.
 * 간단한 저작권 표시부터 상세한 링크 메뉴까지 지원합니다.
 * 
 * ## 특징
 * - **간단한 모드**: 저작권만 표시하는 미니멀 디자인
 * - **상세 모드**: 링크, 소셜 미디어 등 포함
 * - **반응형 디자인**: 모바일/데스크톱 최적화
 * - **게임 브랜딩**: 네온 퍼플 디자인 시스템
 * - **접근성**: 키보드 네비게이션 지원
 * 
 * @example
 * ```tsx
 * // 간단한 푸터
 * <Footer simple brandName="GamePlatform" />
 * 
 * // 상세한 푸터
 * <Footer 
 *   brandName="GamePlatform"
 *   links={footerLinks}
 *   socialLinks={socialLinks}
 * />
 * ```
 */
export function Footer({
  year = new Date().getFullYear(),
  brandName = "GamePlatform",
  links = defaultLinks,
  socialLinks = [],
  simple = false,
  className,
  children
}: FooterProps) {
  if (simple) {
    return (
      <footer className={cn(styles.footer, styles.footerSimple, className)}>
        <div className={styles.container}>
          <div className={styles.copyright}>
            <div className={styles.brandIcon}>
              <span className={styles.brandIconText}>G</span>
            </div>
            <span>
              © {year} {brandName}. All rights reserved.
            </span>
          </div>
          {children}
        </div>
      </footer>
    );
  }

  return (
    <footer className={cn(styles.footer, className)}>
      <div className={styles.container}>
        {/* 상단: 브랜드 + 링크들 */}
        <div className={styles.content}>
          {/* 브랜드 영역 */}
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <span className={styles.brandIconText}>G</span>
            </div>
            <span className={styles.brandName}>{brandName}</span>
          </div>

          {/* 링크 영역 */}
          {links.length > 0 && (
            <nav className={styles.nav}>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className={styles.link}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* 소셜 링크 */}
          {socialLinks.length > 0 && (
            <div className={styles.social}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단: 저작권 + 커스텀 컨텐츠 */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <span>
              © {year} {brandName}. All rights reserved.
            </span>
          </div>
          {children}
        </div>
      </div>
    </footer>
  );
}

export default Footer;