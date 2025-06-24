import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'info' | 'outline' | 'text' | 'neon' | 'glass' | 'animated';
  size?: 'md' | 'lg';
  iconOnly?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
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
}) => {  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = iconOnly ? `btn-icon btn-icon-${size}` : `btn-${size}`;
  const roundedClass = rounded ? 'btn-icon-rounded' : '';
  const iconRightClass = Icon && iconPosition === 'right' && !iconOnly ? 'btn-icon-right' : '';

  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    roundedClass,
    iconRightClass,
    className,
  ].filter(Boolean).join(' ');

  const iconSizeMap = {
    sm: 16,
    md: 24,
    lg: 28,
    xl: 32,
  };
  const iconSize = iconSizeMap[size] || iconSizeMap.md;

  const renderContent = () => {
    if (iconOnly) {
      return Icon ? <Icon size={iconSize} /> : null;
    }
    if (Icon) {
      return (
        <>
          {iconPosition === 'left' && <Icon size={iconSize} />}
          {children}
          {iconPosition === 'right' && <Icon size={iconSize} />}
        </>
      );
    }
    return children;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
