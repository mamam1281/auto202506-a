import React from 'react';
import styles from './Label.module.css';

export interface LabelProps {
  /** 라벨 텍스트 */
  children: React.ReactNode;
  
  /** 연결된 폼 요소 ID */
  htmlFor?: string;
  
  /** 필수 여부 */
  required?: boolean;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  size = 'md',
  className = ''
}) => {
  const labelClassNames = [
    styles.label,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <label htmlFor={htmlFor} className={labelClassNames}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
};

export default Label;
