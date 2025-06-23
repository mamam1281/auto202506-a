import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  boxClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  boxClassName = '',
}) => {
  const generatedId = id || `checkbox-${name || Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center gap-[var(--spacing-2)] ${className}`}>      <motion.div
        className={`
          relative flex-shrink-0
          w-3 h-3
          rounded-[var(--radius-sm)] border
          flex items-center justify-center cursor-pointer
          transition-all duration-[var(--transition-normal)]
          ${checked 
            ? 'bg-gradient-to-br from-purple-400/20 to-blue-500/20 border-purple-400/40 backdrop-blur-sm' 
            : 'bg-white/5 border-white/10 backdrop-blur-sm'
          }
          hover:bg-white/10 hover:border-white/20
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${boxClassName}
        `}
        style={{
          boxShadow: checked 
            ? '0 2px 8px rgba(168, 85, 247, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1)' 
            : '0 1px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.05)'
        }}
        whileTap={disabled ? {} : { scaleX: 1.1, scaleY: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={() => !disabled && onChange(!checked)}
      >
        <input
          type="checkbox"
          id={generatedId}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          initial={false}
          animate={checked ? { scale: [0.8, 1.2, 1], opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute"
        >
          {checked && <Check size={10} className="text-purple-200" />}
        </motion.div>        {checked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-[var(--radius-sm)]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))',
              boxShadow: '0 0 6px rgba(168, 85, 247, 0.3), inset 0 0 3px rgba(255, 255, 255, 0.1)' 
            }}
          />
        )}
      </motion.div>      {label && (
        <label 
          htmlFor={generatedId} 
          className={`
            text-[var(--foreground)] text-[10px] sm:text-[12px]
            font-[var(--font-weight-normal)] cursor-pointer
            leading-tight
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;