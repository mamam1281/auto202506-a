import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'info' | 'outline' | 'text' | 'neon' | 'glass' | 'animated';
  size?: 'md' | 'lg';
  iconOnly?: boolean;
  rounded?: boolean;
  loading?: boolean;
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
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = iconOnly ? `btn-icon btn-icon-${size}` : `btn-${size}`;
  const roundedClass = rounded ? 'btn-icon-rounded' : '';
  const loadingClass = loading ? 'btn-loading' : '';

  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    roundedClass,
    loadingClass,
    className,
  ].filter(Boolean).join(' ');

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  }[size];

  const renderContent = () => {
    if (loading) {
      return null;
    }
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
      disabled={disabled || loading}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
