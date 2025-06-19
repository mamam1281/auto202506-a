import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  /** 카드 변형 */
  variant?: 'default' | 'game' | 'mission' | 'reward' | 'glow' | 'gradient';
  
  /** 카드 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** 클릭 가능 여부 */
  clickable?: boolean;
  
  /** 호버 효과 */
  hoverable?: boolean;
  
  /** 그림자 크기 */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 패딩 크기 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
  
  /** 자식 요소 */
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  clickable = false,
  hoverable = true,
  shadow = 'md',
  padding = 'md',
  onClick,
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    styles.card,
    styles[variant],
    styles[size],
    styles[`shadow-${shadow}`],
    styles[`padding-${padding}`],
    clickable && styles.clickable,
    hoverable && styles.hoverable,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const CardComponent = clickable ? 'button' : 'div';

  return (
    <CardComponent
      className={classNames}
      onClick={handleClick}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
