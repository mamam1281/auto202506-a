import React from 'react';
import styles from './Progress.module.css';

export interface ProgressProps {
  /** 진행률 (0-100) */
  value: number;
  
  /** 최대값 */
  max?: number;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 색상 변형 */
  variant?: 'default' | 'success' | 'warning' | 'error';
  
  /** 라벨 표시 */
  showLabel?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const progressClassNames = [
    styles.progress,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      {showLabel && (
        <div className={styles.label}>
          <span>진행률</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={progressClassNames}>
        <div 
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
