import React from 'react';
import { motion } from 'framer-motion';

export interface RadioButtonProps {
  id?: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  dotClassName?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  dotClassName = '',
}) => {
  const generatedId = id || `radio-${name}-${value}`;

  const handleClick = () => {
    if (!disabled) {
      onChange(value);
    }
  };
  return (
    <div className={`flex items-center gap-2 sm:gap-[var(--spacing-2)] py-1 sm:py-2 ${className}`}>
      <motion.div
        className={`
          relative flex-shrink-0 custom-radio
          w-3 h-3 sm:w-[12px] sm:h-[12px]
          rounded-full border border-opacity-60
          flex items-center justify-center cursor-pointer
          backdrop-blur-sm
          transition-all duration-[var(--transition-normal)]
          ${checked 
            ? 'bg-gradient-to-br from-[var(--color-purple-primary)] to-[var(--color-purple-secondary)] border-[var(--color-purple-primary)] shadow-neon' 
            : 'bg-[var(--card)]/80 border-[var(--border)]/60'
          }
          hover:border-[var(--color-purple-muted)]/80
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${dotClassName}
        `}
        whileTap={disabled ? {} : { scaleX: 1.1, scaleY: 0.9 }}
        animate={checked ? { scale: [0.8, 1.2, 1] } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={handleClick}
        tabIndex={disabled ? -1 : 0}
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
            e.preventDefault();
            onChange(value);
          }
        }}
      >
        <input
          type="radio"
          id={generatedId}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
        />
        
        <motion.div
          initial={false}
          animate={checked 
            ? { scale: [0.5, 1.1, 1], opacity: 1 } 
            : { scale: 0, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--foreground)]"
        />
        
        {/* Neon Glow effect on checked state */}
        {checked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ 
              boxShadow: '0 0 8px rgba(91, 48, 246, 0.5), inset 0 0 4px rgba(91, 48, 246, 0.3)' 
            }}
          />
        )}
      </motion.div>
        {label && (
        <label 
          htmlFor={generatedId} 
          className={`
            text-[var(--foreground)] text-[10px] sm:text-[12px]
            font-[var(--font-weight-normal)] cursor-pointer select-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={disabled ? undefined : handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;
