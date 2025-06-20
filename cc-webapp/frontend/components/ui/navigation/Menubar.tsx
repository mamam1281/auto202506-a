import React, { useState } from 'react';
import styles from './Menubar.module.css';

export interface MenubarItem {
  id: string;
  label: string;
  items?: MenubarItem[];
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

export interface MenubarProps {
  /** 메뉴 아이템들 */
  items: MenubarItem[];
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Menubar: React.FC<MenubarProps> = ({
  items,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleItemClick = (item: MenubarItem, index: number) => {
    if (item.disabled) return;
    
    if (item.items) {
      setActiveIndex(activeIndex === index ? null : index);
    } else {
      item.onClick?.();
      setActiveIndex(null);
    }
  };

  const handleSubmenuClick = (item: MenubarItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setActiveIndex(null);
    }
  };

  return (
    <div className={`${styles.menubar} ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className={styles.menuItem}>
          <button
            className={`${styles.menuButton} ${
              activeIndex === index ? styles.active : ''
            } ${item.disabled ? styles.disabled : ''}`}
            onClick={() => handleItemClick(item, index)}
            disabled={item.disabled}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
          </button>

          {item.items && activeIndex === index && (
            <div className={styles.submenu}>
              {item.items.map((subItem, subIndex) => {
                if (subItem.separator) {
                  return <div key={`separator-${subIndex}`} className={styles.separator} />;
                }

                return (
                  <button
                    key={subItem.id}
                    className={`${styles.submenuItem} ${
                      subItem.disabled ? styles.disabled : ''
                    }`}
                    onClick={() => handleSubmenuClick(subItem)}
                    disabled={subItem.disabled}
                  >
                    {subItem.icon && (
                      <span className={styles.submenuIcon}>{subItem.icon}</span>
                    )}
                    <span className={styles.submenuLabel}>{subItem.label}</span>
                    {subItem.shortcut && (
                      <kbd className={styles.shortcut}>{subItem.shortcut}</kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menubar;
