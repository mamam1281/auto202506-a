import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'info' | 'outline' | 'text' | 'neon' | 'glass' | 'animated' | 'kakao-yellow' | 'kakao-blue' | 'kakao-gradient' | 'kakao-white';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  ripple?: boolean; // 모든 버튼에 리플 효과 적용 가능
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  rounded = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  onClick,
  type = 'button',
  ripple = false,
}) => {
  const [coords, setCoords] = React.useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = React.useState(false);
  
  // 리플 효과 처리 함수
  React.useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 600);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  React.useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);
  
  // 클릭 이벤트 핸들러
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    if (onClick) onClick(e);
  };
  
  // 카카오 스타일 버튼인지 확인
  const isKakaoStyle = variant.startsWith('kakao-');
  
  // 기본 클래스 및 변형 클래스 설정
  const baseClasses = isKakaoStyle ? 'btn-kakao' : 'btn';
  const variantClass = `btn-${variant}`;
    // 크기 클래스 설정
  let sizeClass = '';
  if (isKakaoStyle) {
    sizeClass = size === 'lg' ? 'btn-kakao-lg' : size === 'sm' ? 'btn-kakao-sm' : size === 'xs' ? 'btn-kakao-xs' : '';
  } else {
    sizeClass = iconOnly ? `btn-icon btn-icon-${size}` : `btn-${size}`;
  }
  
  const roundedClass = rounded ? 'rounded-full' : '';
  const rippleClass = ripple ? 'btn-ripple' : ''; // 모든 버튼에 리플 효과 적용 가능하도록 변경
  const disabledClass = disabled && isKakaoStyle ? 'btn-kakao-disabled' : '';

  const conditionalClasses: string[] = [];
  if (Icon && iconPosition === 'right' && !iconOnly) {
    conditionalClasses.push('flex-row-reverse');
  }  // Reflects globals.css icon pixel values:
  // --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px; --icon-xl: 36px;
  // Button 'size' prop is 'xs' | 'sm' | 'md' | 'lg'. We'll map these.
  const iconSizeMap = {
    xs: 14, // Maps to --icon-xs (extra small)
    sm: 16, // Maps to --icon-sm
    md: 20, // Maps to --icon-md
    lg: 24, // Maps to --icon-lg
  };
  // Fallback to md if size is not in the map
  const currentIconSize = iconSizeMap[size] || iconSizeMap.md;

  const renderContent = () => {
    if (iconOnly) {
      return Icon ? <Icon size={currentIconSize} /> : null;
    }
    if (Icon) {
      // For non-iconOnly buttons, ensure there's children or it might look odd
      return (
        <>
          {iconPosition === 'left' && <Icon size={currentIconSize} className={children ? "mr-2" : ""} />}
          {children}
          {iconPosition === 'right' && <Icon size={currentIconSize} className={children ? "ml-2" : ""} />}
        </>
      );
    }
    return children;
  };
  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    roundedClass,
    rippleClass,
    disabledClass,
    ...conditionalClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
    >
      {renderContent()}
      {ripple && isRippling && (
        <span
          className="ripple"
          style={{
            left: coords.x,
            top: coords.y
          }}
        />
      )}
    </button>
  );
};

export default Button;
