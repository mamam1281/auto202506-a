import React, { useState, useRef, useEffect } from 'react';
import styles from './DropdownMenu.module.css';

export interface DropdownMenuItem {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
}

export interface DropdownMenuProps {
  /** 드롭다운 트리거 요소 */
  trigger: React.ReactNode;
  
  /** 메뉴 아이템들 */
  items: DropdownMenuItem[];
  
  /** 아이템 선택 핸들러 */
  onSelect?: (item: DropdownMenuItem) => void;
  
  /** 드롭다운 위치 */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  onSelect,
  placement = 'bottom-start',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled || item.separator) return;
    
    onSelect?.(item);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef.current &&
      triggerRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`${styles.dropdownMenu} ${className}`}>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onClick={handleTriggerClick}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`${styles.menu} ${styles[placement]}`}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return <div key={`separator-${index}`} className={styles.separator} />;
            }

            return (
              <div
                key={item.id}
                className={`${styles.menuItem} ${
                  item.disabled ? styles.disabled : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <div className={styles.itemIcon}>{item.icon}</div>
                )}
                <span className={styles.itemLabel}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
