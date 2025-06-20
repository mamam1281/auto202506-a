import React from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  /** 체크 상태 */
  checked?: boolean;
  
  /** 비활성 상태 */
  disabled?: boolean;
  
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  
  /** 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  disabled = false,
  size = 'md',
  onChange,
  className = ''
}) => {
  const switchClassNames = [
    styles.switch,
    styles[size],
    checked && styles.checked,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={switchClassNames}
    >
      <span className={styles.thumb} />
    </button>
  );
};

export default Switch;
