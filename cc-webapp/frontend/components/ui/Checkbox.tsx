import React from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  /** 체크박스 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 체크 상태 */
  checked?: boolean;
  
  /** 라벨 */
  label?: string;
  
  /** 비활성 상태 */
  disabled?: boolean;
  
  /** 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  size = 'md',
  checked = false,
  label,
  disabled = false,
  onChange,
  className = ''
}) => {
  const containerClassNames = [
    styles.container,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const checkboxClassNames = [
    styles.checkbox,
    styles[size],
    checked && styles.checked,
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <label className={containerClassNames}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={styles.input}
      />
      <div className={checkboxClassNames}>
        {checked && <span className={styles.checkmark}>✓</span>}
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
