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
  // The '.card' class from globals.css already includes:
  // - background: var(--card) (making 'modern-mesh-card' redundant if it only sets this)
  // - border-radius: var(--radius-lg) (making 'rounded-lg' utility class redundant)
  // - box-shadow: var(--shadow-card-default)
  // - display: flex, flex-direction: column
  // - transition properties

  // The 'p-4' utility class maps to var(--spacing-4) from the theme, which is 32px.
  // This is kept as conditional padding.
  return (
    <motion.div
      className={`
        card
        ${noPadding ? '' : 'p-4'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.99 } : {}}
      whileHover={onClick ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >{(title || headerRight) && (        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          {title && (
            <h3 className="heading-h3 text-card-foreground">
              {title}
            </h3>
          )}
          {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
        </div>
      )}
      
      {/* Card의 주요 콘텐츠 영역 - 간격 대폭 증가 */}
      <div className="flex-1 flex flex-col justify-start space-y-6">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
