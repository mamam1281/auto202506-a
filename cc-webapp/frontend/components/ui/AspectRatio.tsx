import React from 'react';
import styles from './AspectRatio.module.css';

export interface AspectRatioProps {
  /** 가로세로 비율 */
  ratio: number;
  
  /** 자식 요소 */
  children: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const AspectRatio: React.FC<AspectRatioProps> = ({
  ratio,
  children,
  className = ''
}) => {
  const containerClassNames = [
    styles.container,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClassNames}
      style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
    >
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default AspectRatio;
