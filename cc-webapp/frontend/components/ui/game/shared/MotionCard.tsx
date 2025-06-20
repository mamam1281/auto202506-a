import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardProps } from '../../data-display/Card';

export interface MotionCardProps extends Omit<CardProps, 'onClick'> {
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 애니메이션 지속시간 */
  animationDuration?: number;
  
  /** 초기 애니메이션 딜레이 */
  animationDelay?: number;
}

// 애니메이션 변형 정의
const cardVariants = {
  initial: { 
    scale: 0.95,
    opacity: 0,
    y: 20
  },
  animate: { 
    scale: 1,
    opacity: 1,
    y: 0
  },
  hover: { 
    scale: 1.02,
    y: -4
  },
  tap: { 
    scale: 0.98
  }
};

const MotionCard: React.FC<MotionCardProps> = ({
  animationDuration = 0.3,
  animationDelay = 0,
  onClick,
  children,
  ...cardProps
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: animationDuration,
        delay: animationDelay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      layout
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Card 
        {...cardProps}
        onClick={undefined} // Card 컴포넌트의 onClick 제거
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default MotionCard;
