import React from 'react';
import styles from './NavigationMenu.module.css';

export interface NavigationMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  children?: NavigationMenuItem[];
}

export interface NavigationMenuProps {
  /** 네비게이션 아이템들 */
  items: NavigationMenuItem[];
  
  /** 클릭 핸들러 */
  onItemClick?: (item: NavigationMenuItem) => void;
  
  /** 수직/수평 방향 */
  orientation?: 'horizontal' | 'vertical';
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items,
  onItemClick,
  orientation = 'horizontal',
  className = ''
}) => {
  const handleItemClick = (item: NavigationMenuItem) => {
    if (item.disabled) return;
    onItemClick?.(item);
  };

  const renderItem = (item: NavigationMenuItem) => (
    <li key={item.id} className={styles.navItem}>
      <a
        href={item.href}
        className={`${styles.navLink} ${
          item.active ? styles.active : ''
        } ${item.disabled ? styles.disabled : ''}`}
        onClick={(e) => {
          if (!item.href) e.preventDefault();
          handleItemClick(item);
        }}
      >
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={styles.label}>{item.label}</span>
      </a>
      
      {item.children && (
        <ul className={styles.submenu}>
          {item.children.map(renderItem)}
        </ul>
      )}
    </li>
  );

  return (
    <nav className={`${styles.navigationMenu} ${styles[orientation]} ${className}`}>
      <ul className={styles.navList}>
        {items.map(renderItem)}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
