import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  /** 너비 */
  width?: string | number;
  
  /** 높이 */
  height?: string | number;
  
  /** 모양 */
  variant?: 'text' | 'rectangular' | 'circular';
  
  /** 애니메이션 */
  animation?: 'pulse' | 'wave' | 'none';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
  className = ''
}) => {
  const skeletonClassNames = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return <div className={skeletonClassNames} style={style} />;
};

export default Skeleton;
