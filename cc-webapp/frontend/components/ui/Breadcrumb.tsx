import React from 'react';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** 브레드크럼 항목들 */
  items: BreadcrumbItem[];
  
  /** 구분자 */
  separator?: string;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = ''
}) => {
  const breadcrumbClassNames = [styles.breadcrumb, className].filter(Boolean).join(' ');

  return (
    <nav className={breadcrumbClassNames} aria-label="breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {index < items.length - 1 ? (
              <>
                {item.href ? (
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                ) : item.onClick ? (
                  <button onClick={item.onClick} className={styles.button}>
                    {item.label}
                  </button>
                ) : (
                  <span className={styles.text}>{item.label}</span>
                )}
                <span className={styles.separator}>{separator}</span>
              </>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
