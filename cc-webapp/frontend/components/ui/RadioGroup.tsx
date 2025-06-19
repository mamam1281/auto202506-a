import React, { useState } from 'react';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** 라디오 옵션들 */
  options: RadioOption[];
  
  /** 선택된 값 */
  value?: string;
  
  /** 그룹 이름 */
  name: string;
  
  /** 변경 핸들러 */
  onChange?: (value: string) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  name,
  onChange,
  className = ''
}) => {
  const [selectedValue, setSelectedValue] = useState(value || '');

  const handleChange = (optionValue: string) => {
    setSelectedValue(optionValue);
    if (onChange) {
      onChange(optionValue);
    }
  };

  const groupClassNames = [styles.group, className].filter(Boolean).join(' ');

  return (
    <div className={groupClassNames} role="radiogroup">
      {options.map((option) => (
        <label
          key={option.value}
          className={`${styles.option} ${option.disabled ? styles.disabled : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            disabled={option.disabled}
            onChange={() => handleChange(option.value)}
            className={styles.input}
          />
          <div className={styles.indicator}>
            {selectedValue === option.value && (
              <div className={styles.dot} />
            )}
          </div>
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
