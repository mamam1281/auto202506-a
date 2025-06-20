import React, { useState } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  /** 탭 항목들 */
  items: TabItem[];
  
  /** 기본 선택된 탭 */
  defaultValue?: string;
  
  /** 탭 변경 핸들러 */
  onValueChange?: (value: string) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  onValueChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const activeItem = items.find(item => item.value === activeTab);

  const tabsClassNames = [
    styles.tabs,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={tabsClassNames}>
      <div className={styles.tabList}>
        {items.map((item) => (
          <button
            key={item.value}
            className={`${styles.tab} ${activeTab === item.value ? styles.active : ''}`}
            onClick={() => handleTabChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      <div className={styles.content}>
        {activeItem?.content}
      </div>
    </div>
  );
};

export default Tabs;
