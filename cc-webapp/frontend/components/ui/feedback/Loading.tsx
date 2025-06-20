import React from 'react';
import styles from './Loading.module.css';

export interface LoadingProps {
  /** 로딩 변형 */
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  
  /** 로딩 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** 로딩 색상 */
  color?: 'primary' | 'secondary' | 'neon' | 'white';
  
  /** 중앙 정렬 여부 */
  centered?: boolean;
  
  /** 오버레이 여부 */
  overlay?: boolean;
  
  /** 로딩 텍스트 */
  text?: string;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  centered = false,
  overlay = false,
  text,
  className = ''
}) => {
  const containerClassNames = [
    styles.container,
    centered && styles.centered,
    overlay && styles.overlay,
    className
  ].filter(Boolean).join(' ');

  const loadingClassNames = [
    styles.loading,
    styles[variant],
    styles[size],
    styles[color]
  ].filter(Boolean).join(' ');

  const renderLoading = () => {
    switch (variant) {
      case 'spinner':
        return <div className={loadingClassNames} />;
      
      case 'dots':
        return (
          <div className={loadingClassNames}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        );
      
      case 'pulse':
        return <div className={loadingClassNames} />;
      
      case 'skeleton':
        return (
          <div className={loadingClassNames}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
          </div>
        );
      
      default:
        return <div className={loadingClassNames} />;
    }
  };

  return (
    <div className={containerClassNames} role="status" aria-label="로딩 중">
      {renderLoading()}
      {text && <div className={styles.text}>{text}</div>}
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};

export default Loading;
