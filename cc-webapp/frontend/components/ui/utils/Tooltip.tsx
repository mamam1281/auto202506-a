import React from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** 툴팁 내용 */
  content: string;
  
  /** 자식 요소 */
  children: React.ReactNode;
  
  /** 위치 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const tooltipClassNames = [
    styles.tooltip,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={tooltipClassNames}>
      {children}
      <div className={`${styles.content} ${styles[position]}`}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
