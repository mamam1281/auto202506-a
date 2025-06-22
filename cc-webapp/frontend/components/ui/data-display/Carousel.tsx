import React, { useState, useEffect, useRef } from 'react';
import styles from './Carousel.module.css';

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

export interface CarouselProps {
  /** 캐러셀 아이템들 */
  items: CarouselItem[];
  
  /** 자동 재생 여부 */
  autoPlay?: boolean;
  
  /** 자동 재생 간격 (ms) */
  interval?: number;
  
  /** 무한 루프 여부 */
  loop?: boolean;
  
  /** 네비게이션 버튼 표시 */
  showNavigation?: boolean;
  
  /** 인디케이터 표시 */
  showIndicators?: boolean;
  
  /** 슬라이드 변경 핸들러 */
  onSlideChange?: (index: number) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 3000,
  loop = true,
  showNavigation = true,
  showIndicators = true,
  onSlideChange,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const nextIndex = loop ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
    setCurrentIndex(nextIndex);
    onSlideChange?.(nextIndex);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const prevIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    onSlideChange?.(prevIndex);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    onSlideChange?.(index);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(nextSlide, interval);
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [autoPlay, interval, currentIndex]);

  const handleMouseEnter = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(nextSlide, interval);
    }
  };

  return (
    <div 
      className={`${styles.carousel} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={item.id} className={styles.carouselSlide}>
              {item.content}
            </div>
          ))}
        </div>

        {showNavigation && (
          <>
            <button
              className={`${styles.navButton} ${styles.navPrev}`}
              onClick={prevSlide}
              disabled={!loop && currentIndex === 0}
              aria-label="이전 슬라이드"
            >
              ‹
            </button>
            <button
              className={`${styles.navButton} ${styles.navNext}`}
              onClick={nextSlide}
              disabled={!loop && currentIndex === items.length - 1}
              aria-label="다음 슬라이드"
            >
              ›
            </button>
          </>
        )}
      </div>

      {showIndicators && (
        <div className={styles.indicators}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
