import React from 'react';
import styles from './Form.module.css';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className = ''
}) => {
  const fieldClassNames = [styles.field, className].filter(Boolean).join(' ');

  return (
    <div className={fieldClassNames}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = ''
}) => {
  const formClassNames = [styles.form, className].filter(Boolean).join(' ');

  return (
    <form className={formClassNames} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
