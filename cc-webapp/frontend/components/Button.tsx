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
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`; // Assumes btn-neon, btn-glass, btn-animated are defined or will be
  const sizeClass = iconOnly ? `btn-icon btn-icon-${size}` : `btn-${size}`;
  const roundedClass = rounded ? 'rounded-full' : ''; // Assuming 'rounded-full' is the desired class for "rounded" icon buttons

  const conditionalClasses = [];
  if (Icon && iconPosition === 'right' && !iconOnly) {
    conditionalClasses.push('flex-row-reverse');
  }

  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    roundedClass,
    ...conditionalClasses,
    className,
  ].filter(Boolean).join(' ');

  // Reflects globals.css icon pixel values:
  // --icon-sm: 16px; --icon-md: 20px; --icon-lg: 24px; --icon-xl: 36px;
  // Button 'size' prop is 'md' | 'lg'. We'll map these.
  // If a more direct mapping or different button sizes (sm, xl) are needed for icons,
  // ButtonProps['size'] might need adjustment or a new prop for iconSize.
  const iconSizeMap = {
    md: 20, // Maps to --icon-md
    lg: 24, // Maps to --icon-lg
  };
  // Fallback to md if size is not md or lg (though TS should prevent this)
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
