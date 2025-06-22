'use client';

import React from 'react';
import { Container } from './Container';
import styles from './AuthLayout.module.css';

// 간단한 클래스 이름 결합 함수
const cn = (...classes: (string | undefined | false)[]): string => 
  classes.filter(Boolean).join(' ');

export interface AuthLayoutProps {
  /** 자식 요소 (인증 폼) */
  children: React.ReactNode;
  /** 페이지 제목 */
  title?: string;
  /** 페이지 부제목 */
  subtitle?: string;
  /** 로고 표시 여부 */
  showLogo?: boolean;
  /** 배경 유형 */
  backgroundType?: 'gradient' | 'pattern' | 'solid';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 추가 액션 (예: 소셜 로그인) */
  additionalActions?: React.ReactNode;
}

/**
 * # AuthLayout 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 인증 전용 레이아웃입니다.
 * 로그인, 회원가입, 비밀번호 재설정 등 인증 관련 페이지에 최적화되어 있습니다.
 * 
 * ## 특징
 * - **중앙 정렬**: 인증 폼을 화면 중앙에 배치
 * - **브랜딩**: 게임 플랫폼 로고와 제목 표시
 * - **반응형**: 모바일/데스크톱 최적화
 * - **배경 옵션**: 그라데이션, 패턴, 단색 배경 선택
 * - **접근성**: 키보드 네비게이션 및 스크린 리더 지원
 * 
 * ## 레이아웃 구조
 * ```
 * ┌─────────────────────────────────┐
 * │                                 │
 * │         [로고]                   │
 * │        제목/부제목                │
 * │                                 │
 * │    ┌─────────────────────┐      │
 * │    │    인증 폼 영역       │      │
 * │    │                     │      │
 * │    └─────────────────────┘      │
 * │                                 │
 * │      추가 액션 영역               │
 * └─────────────────────────────────┘
 * ```
 * 
 * @example
 * ```tsx
 * // 로그인 페이지
 * <AuthLayout 
 *   title="로그인"
 *   subtitle="게임 플랫폼에 오신 것을 환영합니다"
 * >
 *   <LoginForm />
 * </AuthLayout>
 * 
 * // 회원가입 페이지
 * <AuthLayout 
 *   title="회원가입"
 *   backgroundType="pattern"
 *   additionalActions={<SocialLoginButtons />}
 * >
 *   <SignupForm />
 * </AuthLayout>
 * ```
 */
export function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true,
  backgroundType = 'gradient',
  className,
  additionalActions
}: AuthLayoutProps) {
  return (
    <div className={cn(
      styles.authLayout,
      styles[`background${backgroundType.charAt(0).toUpperCase() + backgroundType.slice(1)}`],
      className
    )}>
      <Container size="sm" className={styles.container}>
        <div className={styles.content}>
          {/* 브랜딩 영역 */}
          {showLogo && (
            <div className={styles.branding}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <span className={styles.logoIconText}>G</span>
                </div>
                <span className={styles.logoText}>GamePlatform</span>
              </div>
              
              {(title || subtitle) && (
                <div className={styles.headings}>
                  {title && (
                    <h1 className={styles.title}>{title}</h1>
                  )}
                  {subtitle && (
                    <p className={styles.subtitle}>{subtitle}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 인증 폼 영역 */}
          <div className={styles.formContainer}>
            <div className={styles.formCard}>
              {children}
            </div>
          </div>

          {/* 추가 액션 영역 */}
          {additionalActions && (
            <div className={styles.additionalActions}>
              {additionalActions}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AuthLayout;