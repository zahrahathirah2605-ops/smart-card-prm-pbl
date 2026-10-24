import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 15,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalPages <= 1) {
    return (
      <div className="prm-pagination-container">
        <div className="prm-pagination-info">
          Menampilkan <strong>{totalItems > 0 ? 1 : 0}</strong> - <strong>{totalItems}</strong> dari <strong>{totalItems}</strong> data
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let leftBound = Math.max(2, currentPage - 1);
      let rightBound = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        rightBound = 4;
      }
      if (currentPage >= totalPages - 2) {
        leftBound = totalPages - 3;
      }

      if (leftBound > 2) {
        pages.push('...');
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="prm-pagination-container">
      <div className="prm-pagination-info">
        Menampilkan <strong>{startItem}</strong> - <strong>{endItem}</strong> dari <strong>{totalItems}</strong> data (maks. {pageSize} item/halaman)
      </div>

      <div className="prm-pagination-controls">
        <button
          type="button"
          className="prm-page-nav-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
          title="Sebelumnya"
        >
          ‹ Sebelumnya
        </button>

        <div className="prm-page-numbers">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="prm-page-ellipsis">
                  •••
                </span>
              );
            }
            return (
              <button
                key={`page-${page}`}
                type="button"
                className={`prm-page-num-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="prm-page-nav-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
          title="Berikutnya"
        >
          Berikutnya ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
