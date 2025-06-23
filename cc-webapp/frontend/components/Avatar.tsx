import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: AvatarSize;
  className?: string;
  isActive?: boolean;
  isLoading?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User Avatar',
  fallback,
  size = 'md',
  className = '',
  isActive = false,
  isLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  // 크기 클래스 결정
  const sizeClass = (() => {
    switch (size) {
      case 'sm': return 'w-10 h-10 text-[var(--font-size-body)]'; // 40px
      case 'md': return 'w-12 h-12 text-[var(--font-size-h5)]'; // 48px
      case 'lg': return 'w-16 h-16 text-[var(--font-size-h4)]'; // 64px
      case 'xl': return 'w-20 h-20 text-[var(--font-size-h3)]'; // 80px
      default: return 'w-12 h-12 text-[var(--font-size-h5)]';
    }
  })();

  // LucideIcon 크기 매핑
  const iconSizeMapping = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  // 대체 콘텐츠 결정
  const renderFallback = () => {
    if (fallback) return fallback;
    if (alt && alt !== 'User Avatar') {
      // 이니셜 표시
      const initials = alt.split(' ').map(word => word.charAt(0)).join('').slice(0, 2);
      return <span className="uppercase font-[var(--font-weight-semibold)]">{initials}</span>;
    }
    return <User size={iconSizeMapping[size]} className="text-[var(--color-text-secondary)]" />;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <motion.div
      className={`
        relative flex-shrink-0 rounded-full overflow-hidden
        flex items-center justify-center
        bg-[var(--color-primary-charcoal)] text-[var(--color-text-secondary)]
        border border-[var(--border)]
        ${sizeClass} ${className}
        ${isActive ? 'avatar-active-glow' : ''}
        ${(isLoading || imageLoading) ? 'avatar-shimmer-loading' : ''}
      `}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: '0 0 15px rgba(91, 48, 246, 0.5)' 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      role="img"
      aria-label={alt}
    >
      {src && !imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary-charcoal)]">
              <div className="avatar-shimmer-loading w-full h-full" />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-purple-primary)] to-[var(--color-purple-secondary)]">
          {renderFallback()}
        </div>
      )}
      
      {/* 활성 상태 표시 점 */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--color-success)] border-2 border-[var(--background)] rounded-full"
        />
      )}
    </motion.div>
  );
};

export default Avatar;
