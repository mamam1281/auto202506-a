import React, { useState } from 'react';
import styles from './Popover.module.css';

export interface PopoverProps {
  /** 트리거 요소 */
  trigger: React.ReactNode;
  
  /** 콘텐츠 */
  children: React.ReactNode;
  
  /** 위치 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const popoverClassNames = [
    styles.popover,
    className
  ].filter(Boolean).join(' ');

  const contentClassNames = [
    styles.content,
    styles[placement]
  ].join(' ');

  return (
    <div className={popoverClassNames}>
      <div
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={contentClassNames}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default Popover;
