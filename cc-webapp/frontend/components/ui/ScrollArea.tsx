import React, { useRef, useEffect, useState } from 'react';
import styles from './ScrollArea.module.css';

export interface ScrollAreaProps {
  /** 스크롤 영역 내용 */
  children: React.ReactNode;
  
  /** 최대 높이 */
  maxHeight?: number | string;
  
  /** 스크롤바 자동 숨김 */
  autoHide?: boolean;
  
  /** 스크롤바 두께 */
  scrollbarSize?: number;
  
  /** 스크롤 이벤트 핸들러 */
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight = 300,
  autoHide = true,
  scrollbarSize = 8,
  onScroll,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const updateScrollInfo = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setScrollTop(scrollTop);
    setScrollHeight(scrollHeight);
    setClientHeight(clientHeight);
    setShowScrollbar(scrollHeight > clientHeight);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    updateScrollInfo();
    onScroll?.(e);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startScrollTop = scrollTop;

    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollRef.current) return;

      const deltaY = e.clientY - startY;
      const scrollRatio = deltaY / (clientHeight - getThumbHeight());
      const newScrollTop = startScrollTop + scrollRatio * (scrollHeight - clientHeight);

      scrollRef.current.scrollTop = Math.max(0, Math.min(newScrollTop, scrollHeight - clientHeight));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getThumbHeight = () => {
    const ratio = clientHeight / scrollHeight;
    return Math.max(20, clientHeight * ratio);
  };

  const getThumbTop = () => {
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    return scrollRatio * (clientHeight - getThumbHeight());
  };

  useEffect(() => {
    updateScrollInfo();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollInfo();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <div
      className={`${styles.scrollArea} ${className}`}
      style={{ maxHeight }}
    >
      <div
        ref={scrollRef}
        className={`${styles.scrollContent} ${
          autoHide ? styles.autoHide : ''
        }`}
        onScroll={handleScroll}
        style={{
          '--scrollbar-size': `${scrollbarSize}px`
        } as React.CSSProperties}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>

      {showScrollbar && (
        <div className={styles.scrollbar}>
          <div
            className={styles.scrollThumb}
            style={{
              height: getThumbHeight(),
              top: getThumbTop(),
              width: scrollbarSize
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
};

export default ScrollArea;
