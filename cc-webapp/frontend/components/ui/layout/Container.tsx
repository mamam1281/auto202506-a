'use client';

import React from 'react';
import { cn } from '../utils/utils';
import styles from './Container.module.css';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps {
  /** 컨테이너 크기 */
  size?: ContainerSize;
  /** 패딩 제거 */
  noPadding?: boolean;
  /** 중앙 정렬 */
  center?: boolean;
  /** 최대 너비 제한 해제 */
  fluid?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
  /** 자식 요소 */
  children: React.ReactNode;
  /** HTML 태그 타입 */
  as?: React.ElementType;
}

/**
 * # Container 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 반응형 컨테이너 컴포넌트입니다.
 * 다양한 크기 옵션과 패딩 제어 기능을 제공합니다.
 * 
 * ## 특징
 * - **반응형 크기**: sm, md, lg, xl, full 크기 옵션
 * - **패딩 제어**: noPadding으로 패딩 제거 가능
 * - **중앙 정렬**: center 옵션으로 자동 중앙 정렬
 * - **유동 너비**: fluid 옵션으로 최대 너비 제한 해제
 * - **태그 선택**: as 속성으로 HTML 태그 변경 가능
 * 
 * ## 크기별 최대 너비
 * - **sm**: 640px
 * - **md**: 768px  
 * - **lg**: 1024px
 * - **xl**: 1280px
 * - **full**: 100% (제한 없음)
 * 
 * @example
 * ```tsx
 * // 기본 컨테이너
 * <Container size="lg">
 *   <h1>게임 목록</h1>
 * </Container>
 * 
 * // 패딩 없는 전체 너비 컨테이너
 * <Container size="full" noPadding>
 *   <GameGrid />
 * </Container>
 * 
 * // 섹션 태그로 사용
 * <Container as="section" size="md" center>
 *   <About />
 * </Container>
 * ```
 */
export function Container({
  size = 'lg',
  noPadding = false,
  center = true,
  fluid = false,
  className,
  style,
  children,
  as: Component = 'div'
}: ContainerProps) {
  return (
    <Component 
      className={cn(
        styles.container,
        styles[`container${size.charAt(0).toUpperCase() + size.slice(1)}`],
        noPadding && styles.containerNoPadding,
        center && styles.containerCenter,
        fluid && styles.containerFluid,
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}

export default Container;