import React, { useState, useRef, useEffect } from 'react';
import styles from './Command.module.css';

export interface CommandItem {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandProps {
  /** 명령어 아이템들 */
  items: CommandItem[];
  
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  
  /** 선택 핸들러 */
  onSelect?: (item: CommandItem) => void;
  
  /** 검색 텍스트 변경 핸들러 */
  onSearchChange?: (value: string) => void;
  
  /** 열림/닫힘 상태 */
  open?: boolean;
  
  /** 열림/닫힘 상태 변경 핸들러 */
  onOpenChange?: (open: boolean) => void;
  
  /** 최대 표시 아이템 수 */
  maxItems?: number;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Command: React.FC<CommandProps> = ({
  items,
  placeholder = '명령어를 입력하세요...',
  onSelect,
  onSearchChange,
  open = false,
  onOpenChange,
  maxItems = 10,
  className = ''
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredItems = items
    .filter(item => 
      !item.disabled && 
      (item.label.toLowerCase().includes(searchValue.toLowerCase()) ||
       item.description?.toLowerCase().includes(searchValue.toLowerCase()))
    )
    .slice(0, maxItems);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSelectedIndex(0);
    onSearchChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  const handleSelect = (item: CommandItem) => {
    onSelect?.(item);
    setSearchValue('');
    setSelectedIndex(0);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    inputRef.current?.blur();
  };

  const handleOpen = () => {
    setIsOpen(true);
    onOpenChange?.(true);
    inputRef.current?.focus();
  };

  const handleItemClick = (item: CommandItem, index: number) => {
    setSelectedIndex(index);
    handleSelect(item);
  };

  return (
    <div className={`${styles.command} ${className}`}>
      <div className={styles.commandInput}>
        <div className={styles.searchIcon}>🔍</div>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleOpen}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
        />
        <kbd className={styles.shortcut}>⌘K</kbd>
      </div>

      {isOpen && (
        <div className={styles.commandList}>
          {filteredItems.length > 0 ? (
            <ul ref={listRef} className={styles.list}>
              {filteredItems.map((item, index) => (
                <li
                  key={item.id}
                  className={`${styles.listItem} ${
                    index === selectedIndex ? styles.selected : ''
                  }`}
                  onClick={() => handleItemClick(item, index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.itemContent}>
                    {item.icon && (
                      <div className={styles.itemIcon}>{item.icon}</div>
                    )}
                    <div className={styles.itemText}>
                      <div className={styles.itemLabel}>{item.label}</div>
                      {item.description && (
                        <div className={styles.itemDescription}>
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.shortcut && (
                      <kbd className={styles.itemShortcut}>{item.shortcut}</kbd>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <div className={styles.emptyText}>명령어를 찾을 수 없습니다</div>
              <div className={styles.emptyDescription}>
                다른 키워드로 검색해보세요
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Command;
