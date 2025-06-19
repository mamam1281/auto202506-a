'use client';

import React, { createContext, useContext, forwardRef } from 'react';
import { cn } from './utils';
import { Toggle } from './Toggle';
import styles from './ToggleGroup.module.css';

interface ToggleGroupContextType {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

const ToggleGroupContext = createContext<ToggleGroupContextType | undefined>(undefined);

const useToggleGroup = () => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('useToggleGroup must be used within ToggleGroup');
  }
  return context;
};

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({
    className,
    type,
    value: controlledValue,
    defaultValue = type === 'single' ? '' : [],
    onValueChange,
    size = 'md',
    variant = 'default',
    orientation = 'horizontal',
    children,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      controlledValue ?? defaultValue
    );

    const value = controlledValue ?? internalValue;

    const handleValueChange = (newValue: string | string[]) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: ToggleGroupContextType = {
      type,
      value,
      onValueChange: handleValueChange,
      size,
      variant,
    };

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            styles.toggleGroup,
            styles[orientation],
            className
          )}
          role={type === 'single' ? 'radiogroup' : 'group'}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = 'ToggleGroup';

interface ToggleGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const { type, value, onValueChange, size, variant } = useToggleGroup();

    const isPressed = type === 'single'
      ? value === itemValue
      : Array.isArray(value) && value.includes(itemValue);

    const handleToggle = () => {
      if (type === 'single') {
        onValueChange(isPressed ? '' : itemValue);
      } else {
        const currentValue = Array.isArray(value) ? value : [];
        if (isPressed) {
          onValueChange(currentValue.filter(v => v !== itemValue));
        } else {
          onValueChange([...currentValue, itemValue]);
        }
      }
    };

    return (
      <Toggle
        ref={ref}
        className={cn(styles.toggleGroupItem, className)}
        pressed={isPressed}
        onPressedChange={handleToggle}
        size={size}
        variant={variant}
        role={type === 'single' ? 'radio' : 'checkbox'}
        aria-checked={isPressed}
        {...props}
      >
        {children}
      </Toggle>
    );
  }
);
ToggleGroupItem.displayName = 'ToggleGroupItem';
