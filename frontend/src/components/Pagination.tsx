import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 10) {
      // Show all if 10 or fewer pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Show left ellipsis if needed
      if (currentPage > 4) pageNumbers.push('...');

      // Show middle pages
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Show right ellipsis if needed
      if (currentPage < totalPages - 3) pageNumbers.push('...');

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}>First</button>
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>Prev</button>

      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} style={{ margin: '0 4px' }}>...</span>
        )
      )}

      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</button>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>Last</button>
    </div>
  );
};

export default Pagination;
