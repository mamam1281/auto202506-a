import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  /** 아바타 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** 이미지 소스 */
  src?: string;
  
  /** 대체 텍스트 */
  alt?: string;
  
  /** 이름 (이니셜 표시용) */
  name?: string;
  
  /** 온라인 상태 */
  online?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  src,
  alt,
  name,
  online,
  className = ''
}) => {
  const avatarClassNames = [
    styles.avatar,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={avatarClassNames}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className={styles.image} />
      ) : name ? (
        <span className={styles.initials}>{getInitials(name)}</span>
      ) : (
        <span className={styles.placeholder}>👤</span>
      )}
      {online && <div className={styles.onlineIndicator} />}
    </div>
  );
};

export default Avatar;
