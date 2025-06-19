import React, { useState } from 'react';
import styles from './Collapsible.module.css';

export interface CollapsibleProps {
  /** 기본 열림 상태 */
  defaultOpen?: boolean;
  
  /** 트리거 요소 */
  trigger: React.ReactNode;
  
  /** 콘텐츠 */
  children: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  defaultOpen = false,
  trigger,
  children,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const collapsibleClassNames = [
    styles.collapsible,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={collapsibleClassNames}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {trigger}
        <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
