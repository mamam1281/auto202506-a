import React, { useState, useRef, useEffect } from 'react';
import styles from './HoverCard.module.css';

export interface HoverCardProps {
  /** 호버 트리거 요소 */
  trigger: React.ReactNode;
  
  /** 호버 시 표시될 내용 */
  content: React.ReactNode;
  
  /** 호버 지연 시간 (ms) */
  openDelay?: number;
  
  /** 닫기 지연 시간 (ms) */
  closeDelay?: number;
  
  /** 카드 위치 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  content,
  openDelay = 300,
  closeDelay = 150,
  placement = 'top',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (!isOpen) {
      openTimeoutRef.current = setTimeout(() => {
        setShouldRender(true);
        setIsOpen(true);
      }, openDelay);
    }
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    if (isOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setShouldRender(false), 150);
      }, closeDelay);
    }
  };

  const handleCardMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleCardMouseLeave = () => {
    if (isOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setShouldRender(false), 150);
      }, closeDelay);
    }
  };

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`${styles.hoverCard} ${className}`}>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </div>

      {shouldRender && (
        <div
          ref={cardRef}
          className={`${styles.card} ${styles[placement]} ${
            isOpen ? styles.open : styles.closed
          }`}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className={styles.content}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverCard;
