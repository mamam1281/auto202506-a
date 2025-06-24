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
  return (    <motion.div
      className={`
        card modern-mesh-card
        ${noPadding ? '' : 'p-[var(--spacing-4)]'}
        rounded-[var(--radius-lg)]
        ${onClick ? 'cursor-pointer hover-lift' : ''}
        ${className}
      `}
      onClick={onClick}      whileTap={onClick ? { scale: 0.99 } : {}}
      whileHover={onClick ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}    >
      {(title || headerRight) && (
        <div className="flex items-center justify-between mb-[var(--spacing-3)] flex-shrink-0">
          {title && (
            <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)] text-[var(--card-foreground)]">
              {title}
            </h3>
          )}
          {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
        </div>
      )}
      
      {/* Card의 주요 콘텐츠 영역 - flex-1로 남은 공간 모두 차지 */}
      <div className="flex-1 flex flex-col justify-start space-y-[var(--spacing-3)]">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
