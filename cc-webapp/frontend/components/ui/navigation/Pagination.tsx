import React from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** 현재 페이지 */
  currentPage: number;
  
  /** 전체 페이지 수 */
  totalPages: number;
  
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
  
  /** 표시할 페이지 버튼 수 */
  siblingCount?: number;
  
  /** 이전/다음 버튼 표시 */
  showPrevNext?: boolean;
  
  /** 첫/마지막 버튼 표시 */
  showFirstLast?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showPrevNext = true,
  showFirstLast = true,
  className = ''
}) => {
  const generatePageNumbers = () => {
    const delta = siblingCount;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`${styles.pagination} ${className}`} aria-label="페이지네이션">
      {showFirstLast && (
        <button
          className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          aria-label="첫 페이지"
        >
          ⟪
        </button>
      )}

      {showPrevNext && (
        <button
          className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          ⟨
        </button>
      )}

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.active : ''
          } ${page === '...' ? styles.dots : ''}`}
          onClick={() => handlePageClick(page)}
          disabled={page === '...'}
          aria-label={page === '...' ? undefined : `페이지 ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {showPrevNext && (
        <button
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
        >
          ⟩
        </button>
      )}

      {showFirstLast && (
        <button
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="마지막 페이지"
        >
          ⟫
        </button>
      )}
    </nav>
  );
};

export default Pagination;
