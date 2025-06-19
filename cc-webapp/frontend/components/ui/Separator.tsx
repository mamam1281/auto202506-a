import React from 'react';
import styles from './Separator.module.css';

export interface SeparatorProps {
  /** 방향 */
  orientation?: 'horizontal' | 'vertical';
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  size = 'md',
  className = ''
}) => {
  const separatorClassNames = [
    styles.separator,
    styles[orientation],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return <div className={separatorClassNames} />;
};

export default Separator;
