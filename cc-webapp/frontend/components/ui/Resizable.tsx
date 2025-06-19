import React, { useRef, useState, useCallback } from 'react';
import styles from './Resizable.module.css';

export interface ResizableProps {
  /** 초기 너비 */
  defaultWidth?: number;
  
  /** 초기 높이 */
  defaultHeight?: number;
  
  /** 최소 너비 */
  minWidth?: number;
  
  /** 최소 높이 */
  minHeight?: number;
  
  /** 최대 너비 */
  maxWidth?: number;
  
  /** 최대 높이 */
  maxHeight?: number;
  
  /** 리사이즈 방향 */
  direction?: 'horizontal' | 'vertical' | 'both';
  
  /** 리사이즈 핸들 위치 */
  handlePosition?: 'right' | 'bottom' | 'corner';
  
  /** 리사이즈 중 콜백 */
  onResize?: (width: number, height: number) => void;
  
  /** 리사이즈 완료 콜백 */
  onResizeEnd?: (width: number, height: number) => void;
  
  /** 자식 요소 */
  children: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Resizable: React.FC<ResizableProps> = ({
  defaultWidth = 300,
  defaultHeight = 200,
  minWidth = 100,
  minHeight = 100,
  maxWidth = Infinity,
  maxHeight = Infinity,
  direction = 'both',
  handlePosition = 'corner',
  onResize,
  onResizeEnd,
  children,
  className = ''
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width, height };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    let newWidth = startSize.current.width;
    let newHeight = startSize.current.height;

    if (direction === 'horizontal' || direction === 'both') {
      newWidth = Math.min(Math.max(startSize.current.width + deltaX, minWidth), maxWidth);
    }

    if (direction === 'vertical' || direction === 'both') {
      newHeight = Math.min(Math.max(startSize.current.height + deltaY, minHeight), maxHeight);
    }

    setWidth(newWidth);
    setHeight(newHeight);
    onResize?.(newWidth, newHeight);
  }, [isResizing, direction, minWidth, maxWidth, minHeight, maxHeight, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    onResizeEnd?.(width, height);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [width, height, onResizeEnd, handleMouseMove]);

  const renderHandle = () => {
    if (handlePosition === 'right' && (direction === 'horizontal' || direction === 'both')) {
      return (
        <div
          className={`${styles.handle} ${styles.handleRight}`}
          onMouseDown={handleMouseDown}
        />
      );
    }

    if (handlePosition === 'bottom' && (direction === 'vertical' || direction === 'both')) {
      return (
        <div
          className={`${styles.handle} ${styles.handleBottom}`}
          onMouseDown={handleMouseDown}
        />
      );
    }

    if (handlePosition === 'corner' && direction === 'both') {
      return (
        <div
          className={`${styles.handle} ${styles.handleCorner}`}
          onMouseDown={handleMouseDown}
        />
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.resizable} ${className} ${
        isResizing ? styles.resizing : ''
      }`}
      style={{ width, height }}
    >
      <div className={styles.content}>
        {children}
      </div>
      {renderHandle()}
    </div>
  );
};

export default Resizable;
