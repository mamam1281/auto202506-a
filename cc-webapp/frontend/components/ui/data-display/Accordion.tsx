import React, { useState } from 'react';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  /** 아코디언 항목들 */
  items: AccordionItem[];
  
  /** 다중 선택 허용 */
  multiple?: boolean;
  
  /** 기본 열린 항목들 */
  defaultValue?: string[];
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  defaultValue = [],
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggleItem = (id: string) => {
    if (multiple) {
      setOpenItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };

  const accordionClassNames = [styles.accordion, className].filter(Boolean).join(' ');

  return (
    <div className={accordionClassNames}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id} className={styles.item}>
            <button
              className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              <span>{item.title}</span>
              <span className={styles.icon}>▼</span>
            </button>
            {isOpen && (
              <div className={styles.content}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
