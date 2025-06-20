import React, { useState, useRef, useEffect } from 'react';
import styles from './ContextMenu.module.css';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
  children?: ContextMenuItem[];
}

export interface ContextMenuProps {
  /** 컨텍스트 메뉴 아이템들 */
  items: ContextMenuItem[];
  
  /** 메뉴 트리거 요소 */
  children: React.ReactNode;
  
  /** 아이템 선택 핸들러 */
  onSelect?: (item: ContextMenuItem) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  children,
  onSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [submenuIndex, setSubmenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX;
    const y = e.clientY;

    // 화면 경계 확인
    const menuWidth = 200;
    const menuHeight = items.length * 40;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const adjustedX = x + menuWidth > viewportWidth ? x - menuWidth : x;
    const adjustedY = y + menuHeight > viewportHeight ? y - menuHeight : y;

    setPosition({ x: adjustedX, y: adjustedY });
    setIsOpen(true);
  };

  const handleItemClick = (item: ContextMenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (item.disabled || item.separator) return;
    
    if (item.children) {
      // 서브메뉴가 있는 경우
      return;
    }

    onSelect?.(item);
    setIsOpen(false);
    setSubmenuIndex(null);
  };

  const handleItemHover = (index: number, item: ContextMenuItem) => {
    if (item.children) {
      setSubmenuIndex(index);
    } else {
      setSubmenuIndex(null);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSubmenuIndex(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('contextmenu', handleClickOutside);
      };
    }
  }, [isOpen]);

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.separator) {
      return <div key={`separator-${index}`} className={styles.separator} />;
    }

    return (
      <div
        key={item.id}
        className={`${styles.menuItem} ${
          item.disabled ? styles.disabled : ''
        } ${item.danger ? styles.danger : ''}`}
        onClick={(e) => handleItemClick(item, e)}
        onMouseEnter={() => handleItemHover(index, item)}
      >
        <div className={styles.itemContent}>
          {item.icon && (
            <div className={styles.itemIcon}>{item.icon}</div>
          )}
          <span className={styles.itemLabel}>{item.label}</span>
          {item.shortcut && (
            <kbd className={styles.itemShortcut}>{item.shortcut}</kbd>
          )}
          {item.children && (
            <div className={styles.submenuArrow}>›</div>
          )}
        </div>
        
        {item.children && submenuIndex === index && (
          <div className={styles.submenu}>
            {item.children.map((subItem, subIndex) => 
              renderMenuItem(subItem, subIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.contextMenuTrigger} ${className}`}>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className={styles.triggerContent}
      >
        {children}
      </div>

      {isOpen && (
        <>
          <div
            ref={menuRef}
            className={styles.contextMenu}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {items.map((item, index) => renderMenuItem(item, index))}
          </div>
          
          <div className={styles.overlay} />
        </>
      )}
    </div>
  );
};

export default ContextMenu;
