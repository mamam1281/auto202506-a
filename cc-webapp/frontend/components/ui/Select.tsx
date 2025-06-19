import React, { useState } from 'react';
import styles from './Select.module.css';

export interface SelectProps {
  /** 선택 옵션들 */
  options: Array<{ value: string; label: string }>;
  
  /** 선택된 값 */
  value?: string;
  
  /** 플레이스홀더 */
  placeholder?: string;
  
  /** 비활성 상태 */
  disabled?: boolean;
  
  /** 변경 핸들러 */
  onChange?: (value: string) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = '선택하세요',
  disabled = false,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const selectClassNames = [
    styles.select,
    isOpen && styles.open,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={selectClassNames}>
      <button
        className={styles.trigger}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span className={styles.arrow}>▼</span>
      </button>
      
      {isOpen && (
        <div className={styles.options}>
          {options.map((option) => (
            <button
              key={option.value}
              className={styles.option}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
