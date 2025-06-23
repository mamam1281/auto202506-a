import React, { useState, useRef } from 'react';
import { LucideIcon, Eye, EyeOff, Search, User, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion';

export type InputVariant = 'default' | 'search' | 'email' | 'password' | 'text' | 'gradient';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'focused' | 'error' | 'disabled' | 'success';

export interface InputProps {
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  label?: string;
  error?: string;
  success?: string;
  errorMessage?: string; // Storybook 호환용
  successMessage?: string; // Storybook 호환용
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  type?: "text" | "password" | "email" | "search" | "gradient";
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const sizeConfig = {
  sm: {
    height: 'h-[var(--input-height-sm)]',
    padding: 'px-[var(--spacing-2)] py-[var(--spacing-1)]',
    font: 'text-[var(--font-size-caption)]',
    icon: 14, // 기존 16에서 14로 축소
    iconLeft: 'left-[var(--spacing-3)]', // 더 안쪽
    iconRight: 'right-[var(--spacing-3)]',
    paddingWithIcon: {
      left: 'pl-[var(--spacing-6)]',
      right: 'pr-[var(--spacing-6)]',
    },
    labelGap: 'mb-[var(--spacing-1)]',
  },
  md: {
    height: 'h-[var(--input-height-md)]',
    padding: 'px-[var(--spacing-3)] py-[var(--spacing-2)]',
    font: 'text-[var(--font-size-body)]',
    icon: 18, // 기존 20에서 18로 축소
    iconLeft: 'left-[var(--spacing-4)]',
    iconRight: 'right-[var(--spacing-4)]',
    paddingWithIcon: {
      left: 'pl-[var(--spacing-8)]',
      right: 'pr-[var(--spacing-8)]',
    },
    labelGap: 'mb-[var(--spacing-2)]',
  },
  lg: {
    height: 'h-[var(--input-height-lg)]',
    padding: 'px-[var(--spacing-4)] py-[var(--spacing-2)]',
    font: 'text-[var(--font-size-h5)]',
    icon: 22, // 기존 24에서 22로 축소
    iconLeft: 'left-[var(--spacing-5)]',
    iconRight: 'right-[var(--spacing-5)]',
    paddingWithIcon: {
      left: 'pl-[var(--spacing-10)]',
      right: 'pr-[var(--spacing-10)]',
    },
    labelGap: 'mb-[var(--spacing-2)]',
  },
};

export const Input = ({
  variant = 'default',
  size = 'md',
  state: propState = 'default',
  label,
  error,
  success,
  errorMessage,
  successMessage,
  disabled = false,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  fullWidth = false,
  className = '',
  containerClassName = '',
  type = 'text',
  id,
  value,
  defaultValue,
  onChange,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? defaultValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const currentSize = sizeConfig[size];

  // Password toggle icon size/color 변수 선언 (스코프 에러 fix)
  const passwordToggleIconSize = currentSize.icon; // 아이콘 크기: 14~22px
  const passwordToggleIconColor = '#bbb'; // 또는 'var(--color-neutral-medium)'

  React.useEffect(() => {
    if (value !== undefined) setInputValue(value);
  }, [value]);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const currentState: InputState = disabled
    ? 'disabled'
    : error
    ? 'error'
    : success
    ? 'success'
    : propState;
  // Variant별 스타일 클래스
  const getVariantStyles = () => {
    const baseStyles = `
      w-full input-base
      ${currentSize.height} ${currentSize.padding} ${currentSize.font}
      transition-[border-color,box-shadow,background-color] duration-[var(--transition-normal)] ease-out
      placeholder:text-[var(--muted-foreground)] placeholder:transition-opacity placeholder:duration-[var(--transition-normal)]
      text-[var(--foreground)]
      touch-target
      rounded-[var(--radius-md)]
      shadow-inner-sm
    `;

    const stateStyles = {
      default: `border-[var(--border)]`,
      focused: `
        border-[var(--ring)]
        shadow-focused-glow
      `,
      error: `border-[var(--destructive)] bg-[var(--destructive)]/10 shadow-error-glow`,
      success: `border-[var(--color-success)] bg-[var(--color-success)]/10 shadow-success-glow`,
      disabled: `border-[var(--border)]/50 bg-[var(--input)]/50 text-[var(--muted-foreground)] cursor-not-allowed`,
    };

    switch (variant) {
      case 'search':
      case 'default':
      case 'text':
        return `
          ${baseStyles}
          bg-[var(--input)] border-2
          ${stateStyles[currentState]}
        `;
      case 'gradient':
      case 'email':
      case 'password':
        return `
          ${baseStyles.replace('shadow-inner-sm', '')}
          bg-transparent border-0 border-b-2
          ${currentState === 'focused' ? 'border-b-transparent' : `border-b-[var(--border)]`}
          ${currentState === 'error' ? `border-b-[var(--destructive)]` : ''}
          ${currentState === 'success' ? `border-b-[var(--color-success)]` : ''}
          ${currentState === 'disabled' ? `border-b-[var(--border)]/50 text-[var(--muted-foreground)]` : ''}
        `;
      default:
        return `
          ${baseStyles}
          bg-[var(--input)] border-2
          ${stateStyles[currentState]}
        `;
    }
  };

  // 기본 아이콘
  const getDefaultIcon = () => {
    // getDefaultIcon 내 iconColorClass 개선
    const iconColorClass = `text-[var(--color-neutral-medium)] ${isFocused || inputValue ? 'group-focus-within:text-[var(--color-text-secondary)]' : ''}`;
    switch (variant) {
      case 'search':
        return <Search size={currentSize.icon} className={iconColorClass} />;
      case 'email':
        return <Mail size={currentSize.icon} className={iconColorClass} />;
      case 'password':
        return <Lock size={currentSize.icon} className={iconColorClass} />;
      default:
        return null;
    }
  };

  // 우측 아이콘 (비밀번호 토글)
  const getRightIcon = () => {
    // getRightIcon 내 Eye/EyeOff 버튼 크기/정렬 개선
    if (isPassword && showPasswordToggle) {
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[var(--color-neutral-medium)] hover:text-[var(--color-text-secondary)] transition-colors duration-[var(--transition-normal)] touch-target"
          tabIndex={-1}
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            width: currentSize.icon + 8,
            height: currentSize.icon + 8,
            background: 'none',
            border: 'none',
          }}
        >
          {showPassword ? (
            <EyeOff size={currentSize.icon} />
          ) : (
            <Eye size={currentSize.icon} />
          )}
        </button>
      );
    }
    return rightIcon;
  };

  // 패딩 계산
  const getInputPadding = () => {
    let paddingClasses = currentSize.padding;
    const hasLeftIcon = leftIcon || getDefaultIcon();
    const hasRightIcon = getRightIcon();
    if (hasLeftIcon) {
      paddingClasses = paddingClasses.replace(/px-\[\S+\]/, currentSize.paddingWithIcon.left);
    }
    if (hasRightIcon) {
      if (!paddingClasses.includes('pr-')) {
        paddingClasses = `${paddingClasses} ${currentSize.paddingWithIcon.right}`;
      } else {
        paddingClasses = paddingClasses.replace(/pr-\[\S+\]/, currentSize.paddingWithIcon.right);
      }
    }
    return paddingClasses;
  };

  // 그라데이션 밑줄 애니메이션
  const renderGradientUnderline = () => {
    if (!['email', 'password', 'gradient'].includes(variant)) return null;
    return (
      <motion.div
        layout
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isFocused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute left-0 bottom-0 w-full h-0.5 origin-left"
        style={{ background: 'var(--gradient-purple-primary)' }}
      />
    );
  };

  // 라벨 애니메이션
  const renderLabel = () =>
    label ? (
      <motion.label
        htmlFor={id}
        initial={{ color: 'var(--muted-foreground)' }}
        animate={{ color: isFocused ? 'var(--ring)' : 'var(--muted-foreground)' }}
        transition={{ duration: 0.2 }}
        className="block mb-2 text-body select-none"
      >
        {label}
      </motion.label>
    ) : null;

  // 메시지 애니메이션
  const renderMessage = () => {
    if (error)
      return (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-1 text-error text-caption">
          {error}
        </motion.p>
      );
    if (success)
      return (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-1 text-success text-caption">
          {success}
        </motion.p>
      );
    if (variant === 'password')
      return (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-1 text-caption text-secondary cursor-pointer select-none">
          Forgot Password?
        </motion.p>
      );
    return null;
  };

  return (
    <div className={`
      relative
      ${fullWidth ? 'w-full' : 'w-80'}
      ${containerClassName}
      group
    `}>
      {renderLabel()}
      <div className="relative flex items-center">
        {(leftIcon || getDefaultIcon()) && (
          <span className={`absolute ${currentSize.iconLeft} top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center`}>
            {leftIcon || getDefaultIcon()}
          </span>
        )}
        <motion.input
          ref={inputRef}
          id={id}
          type={inputType}
          className={`
            ${getVariantStyles()} ${getInputPadding()} ${currentSize.height} ${currentSize.font}
          `}
          disabled={disabled}
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={e => {
            setInputValue(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />
        {type === 'password' && (
          <span
            className="input-password-toggle"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: passwordToggleIconSize,
              height: passwordToggleIconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: passwordToggleIconColor,
              fontSize: passwordToggleIconSize,
              cursor: 'pointer',
              zIndex: 2,
            }}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={passwordToggleIconSize} color={passwordToggleIconColor} /> : <Eye size={passwordToggleIconSize} color={passwordToggleIconColor} />}
          </span>
        )}
        {/* Gradient Underline for gradient variants (Framer Motion AnimatePresence 사용) */}
        {(variant === 'gradient' || variant === 'email' || variant === 'password') && (
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[var(--color-purple-primary)] via-[var(--color-purple-secondary)] to-[var(--color-purple-tertiary)]"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        )}
      </div>
      {renderMessage()}
    </div>
  );
};

Input.displayName = 'Input';
