import React from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps {
  /** 값 */
  value?: string;
  
  /** 플레이스홀더 */
  placeholder?: string;
  
  /** 행 수 */
  rows?: number;
  
  /** 크기 조절 가능 여부 */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  
  /** 비활성 상태 */
  disabled?: boolean;
  
  /** 변경 핸들러 */
  onChange?: (value: string) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  placeholder,
  rows = 4,
  resize = 'vertical',
  disabled = false,
  onChange,
  className = ''
}) => {
  const textareaClassNames = [
    styles.textarea,
    styles[resize],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onChange={handleChange}
      className={textareaClassNames}
    />
  );
};

export default Textarea;
