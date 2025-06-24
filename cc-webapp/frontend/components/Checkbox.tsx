import React from 'react';
import { motion } from 'framer-motion';

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

// SVG Check Icon Component for better visual consistency
const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 4.5L6 12L2.5 8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
    <div 
      className={`
        inline-flex items-center gap-3 flex-nowrap min-w-0 w-full
        ${className}
      `}
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
        className={`
          relative flex-shrink-0 cursor-pointer
          w-5 h-5
          border-2 border-solid rounded-md
          flex items-center justify-center
          transition-all duration-200 ease-in-out
          ${checked 
            ? 'bg-purple-600 border-purple-600 shadow-purple-500/25 shadow-md' 
            : 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-lg active:scale-95'
          }
          ${boxClassName}
        `}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
      >
        {checked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ 
              duration: 0.15,
              ease: "easeOut"
            }}
            className="text-white"
          >
            <CheckIcon className="w-3 h-3" />
          </motion.div>
        )}
      </motion.div>
      
      {label && (
        <label 
          htmlFor={generatedId} 
          className={`
            flex-1 min-w-0
            text-white text-sm font-normal 
            select-none cursor-pointer 
            leading-normal whitespace-nowrap overflow-hidden text-ellipsis
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-200'}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;