import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  headerRight?: React.ReactNode;
  className?: string;
  noPadding?: boolean; // 기본 패딩 제거 옵션
  onClick?: () => void; // 클릭 가능 카드일 경우
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  headerRight,
  className = '',
  noPadding = false,
  onClick,
}) => {
  // Apply modern mesh card styling with enhanced content layout
  // Using card and modern-mesh-card classes for enhanced visual effects and proper content spacing
  return (
    <motion.div
      className={`
        card modern-mesh-card
        ${onClick ? 'cursor-pointer hover-lift' : ''}
        transition-all duration-normal
        ${className}
      `}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.99 } : {}}
      whileHover={onClick ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* 헤더 영역 - title과 headerRight가 있을 때만 표시 */}
      {(title || headerRight) && (
        <div className="flex items-center justify-between flex-shrink-0 card-text-group">
          {title && (
            <h3 className="heading-h3 text-card-foreground leading-tight-card">
              {title}
            </h3>
          )}
          {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
        </div>
      )}
      
      {/* 주요 콘텐츠 영역 - global.css의 card 클래스가 자동으로 gap과 정렬 처리 */}
      <div className={`flex-1 ${noPadding ? '' : 'card-content'}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
